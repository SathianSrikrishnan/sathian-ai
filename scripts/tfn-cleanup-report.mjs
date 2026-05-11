#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import anchor from "@coral-xyz/anchor"
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { createClient } from "@supabase/supabase-js"

const { AnchorProvider, Program } = anchor

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const PROGRAM_ID = "FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC"
const REFUND_GRACE_SECONDS = 7 * 24 * 60 * 60

function usage() {
  console.log(`
TFN cleanup report (read-only)

Usage:
  node --env-file=.env.local scripts/tfn-cleanup-report.mjs --out docs/reports/tfn-cleanup-2026-05-11

Options:
  --out <path>       Output path without extension
  --skip-chain       Skip Solana account reads
  --skip-supabase    Skip Supabase table reads
  --help             Show this help
`)
}

function parseArgs(argv) {
  const args = {
    out: "docs/reports/tfn-cleanup-report",
    skipChain: false,
    skipSupabase: false,
    help: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") args.help = true
    else if (arg === "--out") args.out = argv[++i]
    else if (arg === "--skip-chain") args.skipChain = true
    else if (arg === "--skip-supabase") args.skipSupabase = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  return args
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const raw = fs.readFileSync(filePath, "utf8")
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    let value = rawValue.trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function asString(value) {
  if (value == null) return ""
  if (typeof value === "string") return value
  if (typeof value.toBase58 === "function") return value.toBase58()
  if (typeof value.toString === "function") return value.toString()
  return String(value)
}

function asNumber(value) {
  if (value == null) return 0
  if (typeof value === "number") return value
  if (typeof value.toNumber === "function") return value.toNumber()
  const parsed = Number(value.toString())
  return Number.isFinite(parsed) ? parsed : 0
}

function isoFromSeconds(seconds) {
  if (!seconds) return ""
  return new Date(seconds * 1000).toISOString()
}

function sol(lamports) {
  return Number((asNumber(lamports) / LAMPORTS_PER_SOL).toFixed(9))
}

function csvEscape(value) {
  const text = value == null ? "" : String(value)
  if (!/[",\n\r]/.test(text)) return text
  return `"${text.replace(/"/g, '""')}"`
}

function toCsv(rows, columns) {
  const header = columns.map((column) => csvEscape(column.label)).join(",")
  const body = rows.map((row) =>
    columns.map((column) => csvEscape(row[column.key])).join(",")
  )
  return [header, ...body].join("\n") + "\n"
}

async function fetchTableAll(supabase, table, warnings) {
  const pageSize = 1000
  let from = 0
  const rows = []

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1)

    if (error) {
      warnings.push(`Supabase table ${table}: ${error.message}`)
      return []
    }

    rows.push(...(data || []))
    if (!data || data.length < pageSize) return rows
    from += pageSize
  }
}

async function listAuthUsers(supabase, warnings) {
  const users = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })
    if (error) {
      warnings.push(`Supabase auth users: ${error.message}`)
      return users
    }

    users.push(...(data?.users || []))
    if (!data?.users || data.users.length < perPage) return users
    page += 1
  }
}

async function listStorageObjects(supabase, bucket, warnings) {
  const paths = []

  async function walk(prefix, depth) {
    if (depth > 3) return
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } })

    if (error) {
      warnings.push(`Storage bucket ${bucket}: ${error.message}`)
      return
    }

    for (const item of data || []) {
      const objectPath = prefix ? `${prefix}/${item.name}` : item.name
      if (item.id || item.metadata) {
        paths.push(objectPath)
      } else {
        await walk(objectPath, depth + 1)
      }
    }
  }

  await walk("", 0)
  return paths
}

function getReadOnlyProgram() {
  const rpc =
    process.env.NEXT_PUBLIC_SOLANA_RPC ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  if (!rpc) throw new Error("Missing NEXT_PUBLIC_SOLANA_RPC")

  const idlPath = path.join(repoRoot, "src/lib/toothfairy/escrow-idl.json")
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"))
  const connection = new Connection(rpc, "confirmed")
  const dummyKeypair = Keypair.generate()
  const dummyWallet = {
    publicKey: dummyKeypair.publicKey,
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
  }
  const provider = new AnchorProvider(connection, dummyWallet, {
    commitment: "confirmed",
  })

  return new Program(idl, provider)
}

async function readAccountAll(program, accountName, warnings) {
  const accountClient = program.account[accountName]
  if (!accountClient) {
    warnings.push(`IDL account client not found: ${accountName}`)
    return []
  }
  try {
    return await accountClient.all()
  } catch (error) {
    warnings.push(`Solana account ${accountName}: ${error.message}`)
    return []
  }
}

function depositStatus(row, nowSeconds) {
  if (row.claimed) return "claimed"
  if (row.amountLamports <= 0) return "unfunded"
  if (nowSeconds <= row.createdAtSeconds + REFUND_GRACE_SECONDS) {
    return "refundable"
  }
  if (!row.lockUntilSeconds) return "matured"
  if (nowSeconds >= row.lockUntilSeconds) return "matured"
  return "active"
}

function suggestedDepositAction(status) {
  if (status === "claimed") return "review-rent-close-later"
  if (status === "unfunded") return "hide-dashboard-if-clutter"
  if (status === "refundable") return "original-depositor-may-refund"
  if (status === "matured") return "guardian-may-claim"
  return "leave-time-locked"
}

function normalizeChainData(chain) {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const profiles = chain.childProfiles.map((item) => {
    const a = item.account
    return {
      pubkey: item.publicKey.toBase58(),
      guardian: asString(a.guardian),
      childWallet: asString(a.childWallet),
      childName: a.childName || "",
      milestoneCount: asNumber(a.milestoneCount),
      depositCount: asNumber(a.depositCount),
      totalDepositedLamports: asNumber(a.totalDeposited),
      totalClaimedLamports: asNumber(a.totalClaimed),
      totalDepositedSol: sol(a.totalDeposited),
      totalClaimedSol: sol(a.totalClaimed),
      activeBalanceSol: sol(asNumber(a.totalDeposited) - asNumber(a.totalClaimed)),
      status: asNumber(a.status),
      classification: "ledger-live",
    }
  })

  const milestones = chain.milestones.map((item) => {
    const a = item.account
    return {
      pubkey: item.publicKey.toBase58(),
      childProfile: asString(a.childProfile),
      milestoneIndex: asNumber(a.milestoneIndex),
      metadataUri: a.metadataUri || "",
      totalDepositsLamports: asNumber(a.totalDeposits),
      totalDepositsSol: sol(a.totalDeposits),
      depositCount: asNumber(a.depositCount),
      createdAt: isoFromSeconds(asNumber(a.createdAt)),
      classification: "ledger-live",
    }
  })

  const deposits = chain.deposits.map((item) => {
    const a = item.account
    const amountLamports = asNumber(a.amountLamports)
    const createdAtSeconds = asNumber(a.createdAt)
    const lockUntilSeconds = asNumber(a.lockUntil)
    const claimed = Boolean(a.claimed)
    const row = {
      pubkey: item.publicKey.toBase58(),
      milestone: asString(a.milestone),
      depositor: asString(a.depositor),
      depositorName: a.depositorName || "",
      amountLamports,
      amountSol: sol(amountLamports),
      lockUntilSeconds,
      lockUntil: isoFromSeconds(lockUntilSeconds),
      claimed,
      createdAtSeconds,
      createdAt: isoFromSeconds(createdAtSeconds),
      claimedAt: isoFromSeconds(asNumber(a.claimedAt)),
      depositIndex: asNumber(a.depositIndex),
      classification: "ledger-live",
    }
    const status = depositStatus(row, nowSeconds)
    return {
      ...row,
      status,
      suggestedAction: suggestedDepositAction(status),
      manualReview: !claimed && amountLamports > 0,
    }
  })

  return { profiles, milestones, deposits }
}

function buildChildrenReport(children, chainProfilesByPda, storiesByProfile) {
  return children.map((child) => {
    const childProfilePda = child.child_profile_pda || ""
    const hasChainProfile = childProfilePda
      ? chainProfilesByPda.has(childProfilePda)
      : false
    const classification = hasChainProfile ? "dashboard-live" : "db-only"
    const linkedStories = childProfilePda
      ? storiesByProfile.get(childProfilePda) || []
      : []
    return {
      id: child.id,
      userId: child.user_id,
      userEmail: child.user_email,
      childName: child.child_name,
      childSlug: child.child_slug,
      childProfilePda,
      guardianPubkey: child.guardian_pubkey,
      childWalletPubkey: child.child_wallet_pubkey,
      metadataUri: child.metadata_uri,
      imageUri: child.image_uri,
      smilePhotoUrl: child.smile_photo_url,
      isServerGuardian: child.is_server_guardian,
      createdAt: child.created_at,
      storyRows: linkedStories.length,
      classification,
      suggestedAction: hasChainProfile ? "keep-or-hide-dashboard" : "delete-db-only-if-test",
    }
  })
}

function buildCreditReport(creditRows, generations, authUsers) {
  const generationCountByUser = new Map()
  for (const generation of generations) {
    const userId = generation.user_id
    generationCountByUser.set(userId, (generationCountByUser.get(userId) || 0) + 1)
  }

  const authById = new Map(authUsers.map((user) => [user.id, user]))
  const creditUserIds = new Set(creditRows.map((row) => row.user_id))
  const rows = creditRows.map((row) => {
    const user = authById.get(row.user_id)
    const remaining = Number(row.remaining_credits || 0)
    const reserved = Number(row.reserved_credits || 0)
    const flags = []
    if (remaining <= 0) flags.push("credit-empty")
    if (reserved > 0) flags.push("credit-reserved")
    return {
      userId: row.user_id,
      userEmail: row.user_email || user?.email || "",
      lifetimeCredits: row.lifetime_credits,
      remainingCredits: row.remaining_credits,
      reservedCredits: row.reserved_credits,
      usedCredits: row.used_credits,
      generationCount: generationCountByUser.get(row.user_id) || 0,
      metadataCredits: JSON.stringify(user?.app_metadata?.tfn_magic_credits || null),
      classification: flags.join(";") || "credit-ok",
      suggestedAction: flags.length ? "reset-if-personal-test-account" : "keep",
    }
  })

  for (const user of authUsers) {
    if (!user.app_metadata?.tfn_magic_credits || creditUserIds.has(user.id)) {
      continue
    }
    const metadata = user.app_metadata.tfn_magic_credits
    const remaining = Number(metadata.remainingCredits || 0)
    const reserved = Number(metadata.reservedCredits || 0)
    const flags = []
    if (remaining <= 0) flags.push("credit-empty")
    if (reserved > 0) flags.push("credit-reserved")
    rows.push({
      userId: user.id,
      userEmail: user.email || "",
      lifetimeCredits: metadata.lifetimeCredits,
      remainingCredits: metadata.remainingCredits,
      reservedCredits: metadata.reservedCredits,
      usedCredits: metadata.usedCredits,
      generationCount: generationCountByUser.get(user.id) || 0,
      metadataCredits: JSON.stringify(metadata),
      classification: `metadata-only${flags.length ? `;${flags.join(";")}` : ""}`,
      suggestedAction: "reset-if-personal-test-account",
    })
  }

  return rows.sort((a, b) => String(a.userEmail).localeCompare(String(b.userEmail)))
}

function buildMarkdown(report) {
  const lines = []
  lines.push("# TFN Cleanup Report")
  lines.push("")
  lines.push(`Generated: ${report.generatedAt}`)
  lines.push(`Program: ${PROGRAM_ID}`)
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  for (const [key, value] of Object.entries(report.summary)) {
    lines.push(`- ${key}: ${value}`)
  }
  lines.push("")

  if (report.warnings.length) {
    lines.push("## Warnings")
    lines.push("")
    for (const warning of report.warnings) lines.push(`- ${warning}`)
    lines.push("")
  }

  lines.push("## Manual Chain Review")
  lines.push("")
  const chainReview = report.actions.chainReview
  if (!chainReview.length) {
    lines.push("No unclaimed nonzero deposits found in this report.")
  } else {
    lines.push("| Status | Amount SOL | Name | Deposit | Milestone | Suggested action |")
    lines.push("| --- | ---: | --- | --- | --- | --- |")
    for (const row of chainReview) {
      lines.push(
        `| ${row.status} | ${row.amountSol} | ${row.depositorName || ""} | ${row.depositPda} | ${row.milestonePda} | ${row.suggestedAction} |`
      )
    }
  }
  lines.push("")

  lines.push("## Supabase Cleanup Candidates")
  lines.push("")
  const supabaseDeletes = report.actions.supabaseDeletes
  if (!supabaseDeletes.length) {
    lines.push("No db-only cleanup candidates found.")
  } else {
    lines.push("| Table | Identifier | Reason |")
    lines.push("| --- | --- | --- |")
    for (const action of supabaseDeletes) {
      lines.push(`| ${action.table} | ${action.identifier} | ${action.reason} |`)
    }
  }
  lines.push("")

  lines.push("## Credit Reset Candidates")
  lines.push("")
  const creditResets = report.actions.creditResets
  if (!creditResets.length) {
    lines.push("No empty or reserved credit accounts found.")
  } else {
    lines.push("| Email | Remaining | Reserved | Used | Suggested action |")
    lines.push("| --- | ---: | ---: | ---: | --- |")
    for (const row of creditResets) {
      lines.push(
        `| ${row.userEmail || ""} | ${row.remainingCredits ?? ""} | ${row.reservedCredits ?? ""} | ${row.usedCredits ?? ""} | ${row.suggestedAction} |`
      )
    }
  }
  lines.push("")

  return lines.join("\n")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  loadEnvFile(path.join(repoRoot, ".env.local"))

  const warnings = []
  const generatedAt = new Date().toISOString()
  const outBase = path.resolve(repoRoot, args.out)
  fs.mkdirSync(path.dirname(outBase), { recursive: true })

  let chain = {
    childProfiles: [],
    milestones: [],
    deposits: [],
    treasury: [],
    config: [],
  }

  if (!args.skipChain) {
    const program = getReadOnlyProgram()
    const [childProfiles, milestones, deposits, treasury, config] =
      await Promise.all([
        readAccountAll(program, "childProfile", warnings),
        readAccountAll(program, "milestone", warnings),
        readAccountAll(program, "deposit", warnings),
        readAccountAll(program, "treasury", warnings),
        readAccountAll(program, "config", warnings),
      ])
    chain = { childProfiles, milestones, deposits, treasury, config }
  }

  let supabaseRows = {
    children: [],
    stories: [],
    credits: [],
    generations: [],
    toothStates: [],
    authUsers: [],
    photoObjects: [],
  }

  if (!args.skipSupabase) {
    const supabase = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const [children, stories, credits, generations, toothStates, authUsers, photoObjects] =
      await Promise.all([
        fetchTableAll(supabase, "tfn_children", warnings),
        fetchTableAll(supabase, "tfn_tooth_stories", warnings),
        fetchTableAll(supabase, "tfn_magic_credits", warnings),
        fetchTableAll(supabase, "tfn_magic_generations", warnings),
        fetchTableAll(supabase, "tooth_states", warnings),
        listAuthUsers(supabase, warnings),
        listStorageObjects(supabase, "tfn-photos", warnings),
      ])

    supabaseRows = {
      children,
      stories,
      credits,
      generations,
      toothStates,
      authUsers,
      photoObjects,
    }
  }

  const normalizedChain = normalizeChainData(chain)
  const chainProfilesByPda = new Map(
    normalizedChain.profiles.map((profile) => [profile.pubkey, profile])
  )
  const storiesByProfile = new Map()
  for (const story of supabaseRows.stories) {
    const key = story.child_profile_pda || ""
    if (!key) continue
    if (!storiesByProfile.has(key)) storiesByProfile.set(key, [])
    storiesByProfile.get(key).push(story)
  }

  const childrenReport = buildChildrenReport(
    supabaseRows.children,
    chainProfilesByPda,
    storiesByProfile
  )
  const creditReport = buildCreditReport(
    supabaseRows.credits,
    supabaseRows.generations,
    supabaseRows.authUsers
  )

  const supabaseProfilePdas = new Set(
    supabaseRows.children.map((child) => child.child_profile_pda).filter(Boolean)
  )
  const chainOnlyProfiles = normalizedChain.profiles
    .filter((profile) => !supabaseProfilePdas.has(profile.pubkey))
    .map((profile) => ({ ...profile, classification: "chain-only" }))

  const actions = {
    chainReview: normalizedChain.deposits
      .filter((deposit) => deposit.manualReview)
      .map((deposit) => ({
        type: "manual-chain-review",
        depositPda: deposit.pubkey,
        milestonePda: deposit.milestone,
        depositor: deposit.depositor,
        depositorName: deposit.depositorName,
        amountSol: deposit.amountSol,
        status: deposit.status,
        createdAt: deposit.createdAt,
        lockUntil: deposit.lockUntil,
        suggestedAction: deposit.suggestedAction,
      })),
    supabaseDeletes: childrenReport
      .filter((child) => child.classification === "db-only")
      .map((child) => ({
        table: "tfn_children",
        identifier: child.id || child.childSlug,
        childSlug: child.childSlug,
        userEmail: child.userEmail,
        reason: "Supabase child row does not point at a live on-chain profile",
      })),
    creditResets: creditReport.filter((row) =>
      String(row.classification).includes("credit-empty") ||
      String(row.classification).includes("credit-reserved")
    ),
  }

  const report = {
    generatedAt,
    programId: PROGRAM_ID,
    warnings,
    summary: {
      chainProfiles: normalizedChain.profiles.length,
      chainMilestones: normalizedChain.milestones.length,
      chainDeposits: normalizedChain.deposits.length,
      chainOnlyProfiles: chainOnlyProfiles.length,
      supabaseChildren: childrenReport.length,
      supabaseStories: supabaseRows.stories.length,
      dbOnlyChildren: childrenReport.filter((row) => row.classification === "db-only").length,
      magicCreditAccounts: creditReport.length,
      magicGenerations: supabaseRows.generations.length,
      toothStates: supabaseRows.toothStates.length,
      photoObjects: supabaseRows.photoObjects.length,
      manualChainReview: actions.chainReview.length,
      creditResetCandidates: actions.creditResets.length,
    },
    chain: {
      profiles: normalizedChain.profiles,
      chainOnlyProfiles,
      milestones: normalizedChain.milestones,
      deposits: normalizedChain.deposits,
    },
    supabase: {
      children: childrenReport,
      credits: creditReport,
      photoObjects: supabaseRows.photoObjects,
    },
    actions,
  }

  fs.writeFileSync(`${outBase}.md`, buildMarkdown(report))
  fs.writeFileSync(`${outBase}.actions.json`, `${JSON.stringify(actions, null, 2)}\n`)
  fs.writeFileSync(
    `${outBase}.deposits.csv`,
    toCsv(normalizedChain.deposits, [
      { key: "status", label: "Status" },
      { key: "amountSol", label: "Amount SOL" },
      { key: "depositorName", label: "Depositor Name" },
      { key: "depositor", label: "Depositor Wallet" },
      { key: "pubkey", label: "Deposit PDA" },
      { key: "milestone", label: "Milestone PDA" },
      { key: "createdAt", label: "Created At" },
      { key: "lockUntil", label: "Lock Until" },
      { key: "suggestedAction", label: "Suggested Action" },
    ])
  )
  fs.writeFileSync(
    `${outBase}.children.csv`,
    toCsv(childrenReport, [
      { key: "classification", label: "Classification" },
      { key: "userEmail", label: "User Email" },
      { key: "childName", label: "Child Name" },
      { key: "childSlug", label: "Child Slug" },
      { key: "childProfilePda", label: "Child Profile PDA" },
      { key: "storyRows", label: "Story Rows" },
      { key: "createdAt", label: "Created At" },
      { key: "suggestedAction", label: "Suggested Action" },
    ])
  )
  fs.writeFileSync(
    `${outBase}.credits.csv`,
    toCsv(creditReport, [
      { key: "classification", label: "Classification" },
      { key: "userEmail", label: "User Email" },
      { key: "userId", label: "User ID" },
      { key: "lifetimeCredits", label: "Lifetime" },
      { key: "remainingCredits", label: "Remaining" },
      { key: "reservedCredits", label: "Reserved" },
      { key: "usedCredits", label: "Used" },
      { key: "generationCount", label: "Generations" },
      { key: "suggestedAction", label: "Suggested Action" },
    ])
  )

  console.log(`Report written to ${path.relative(repoRoot, outBase)}.*`)
  console.log(JSON.stringify(report.summary, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
