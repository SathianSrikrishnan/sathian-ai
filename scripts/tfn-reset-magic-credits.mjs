#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")

function usage() {
  console.log(`
TFN Magic Studio credit reset

Dry-run by default. Use --apply only after reviewing the output.

Usage:
  node --env-file=.env.local scripts/tfn-reset-magic-credits.mjs --email parent@example.com
  node --env-file=.env.local scripts/tfn-reset-magic-credits.mjs --emails .codex-temp/tfn-credit-reset-emails.txt --credits 3

Options:
  --email <email>          Email to reset. May be repeated.
  --emails <file>          Text file with one email per line.
  --credits <number>       Credits to set. Default: 3.
  --clear-generations      Delete tfn_magic_generations for matched users. Test accounts only.
  --apply                  Actually write changes.
  --help                   Show this help.
`)
}

function parseArgs(argv) {
  const args = {
    emails: [],
    emailFiles: [],
    credits: 3,
    clearGenerations: false,
    apply: false,
    help: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") args.help = true
    else if (arg === "--email") args.emails.push(argv[++i])
    else if (arg === "--emails") args.emailFiles.push(argv[++i])
    else if (arg === "--credits") args.credits = Number(argv[++i])
    else if (arg === "--clear-generations") args.clearGenerations = true
    else if (arg === "--apply") args.apply = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (!Number.isInteger(args.credits) || args.credits < 0 || args.credits > 100) {
    throw new Error("--credits must be an integer from 0 to 100")
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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function readEmailFiles(files) {
  const emails = []
  for (const file of files) {
    const resolved = path.resolve(repoRoot, file)
    const raw = fs.readFileSync(resolved, "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const email = normalizeEmail(line.replace(/#.*/, ""))
      if (email) emails.push(email)
    }
  }
  return emails
}

async function fetchTableAll(supabase, table) {
  const pageSize = 1000
  let from = 0
  const rows = []

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1)

    if (error) {
      if (error.code === "42P01" || error.code === "PGRST205") return []
      throw error
    }

    rows.push(...(data || []))
    if (!data || data.length < pageSize) return rows
    from += pageSize
  }
}

function isMissingTableError(error) {
  return error?.code === "42P01" || error?.code === "PGRST205"
}

async function listAuthUsers(supabase) {
  const users = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })
    if (error) throw error
    users.push(...(data?.users || []))
    if (!data?.users || data.users.length < perPage) return users
    page += 1
  }
}

function nextCreditState(credits) {
  return {
    lifetime_credits: credits,
    remaining_credits: credits,
    reserved_credits: 0,
    used_credits: 0,
    updated_at: new Date().toISOString(),
  }
}

function nextMetadataState(credits) {
  return {
    lifetimeCredits: credits,
    remainingCredits: credits,
    reservedCredits: 0,
    usedCredits: 0,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  loadEnvFile(path.join(repoRoot, ".env.local"))

  const emails = [
    ...args.emails.map(normalizeEmail),
    ...readEmailFiles(args.emailFiles),
  ].filter(Boolean)
  const uniqueEmails = [...new Set(emails)]

  if (!uniqueEmails.length) {
    throw new Error("Provide at least one --email or --emails file")
  }

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const [creditRows, generationRows, authUsers] = await Promise.all([
    fetchTableAll(supabase, "tfn_magic_credits"),
    fetchTableAll(supabase, "tfn_magic_generations"),
    listAuthUsers(supabase),
  ])

  const usersByEmail = new Map(
    authUsers
      .filter((user) => user.email)
      .map((user) => [normalizeEmail(user.email), user])
  )
  const creditRowsByEmail = new Map(
    creditRows
      .filter((row) => row.user_email)
      .map((row) => [normalizeEmail(row.user_email), row])
  )
  const creditRowsByUser = new Map(creditRows.map((row) => [row.user_id, row]))
  const generationCountByUser = new Map()
  for (const row of generationRows) {
    generationCountByUser.set(row.user_id, (generationCountByUser.get(row.user_id) || 0) + 1)
  }

  const matched = []
  const unmatched = []

  for (const email of uniqueEmails) {
    const authUser = usersByEmail.get(email) || null
    const creditRow =
      creditRowsByEmail.get(email) ||
      (authUser ? creditRowsByUser.get(authUser.id) : null) ||
      null
    const userId = authUser?.id || creditRow?.user_id || null

    if (!userId) {
      unmatched.push(email)
      continue
    }

    matched.push({
      email,
      userId,
      authUser,
      creditRow,
      metadataCredits: authUser?.app_metadata?.tfn_magic_credits || null,
      generationCount: generationCountByUser.get(userId) || 0,
    })
  }

  console.log(args.apply ? "Mode: APPLY" : "Mode: DRY RUN")
  console.log(`Target credits: ${args.credits}`)
  console.log("")

  for (const item of matched) {
    console.log(`Email: ${item.email}`)
    console.log(`  User: ${item.userId}`)
    console.log(
      `  DB credits: ${item.creditRow ? JSON.stringify({
        lifetime: item.creditRow.lifetime_credits,
        remaining: item.creditRow.remaining_credits,
        reserved: item.creditRow.reserved_credits,
        used: item.creditRow.used_credits,
      }) : "none"}`
    )
    console.log(
      `  Metadata credits: ${item.metadataCredits ? JSON.stringify(item.metadataCredits) : "none"}`
    )
    console.log(
      `  Next: ${JSON.stringify({
        lifetime: args.credits,
        remaining: args.credits,
        reserved: 0,
        used: 0,
      })}`
    )
    if (args.clearGenerations) {
      console.log(`  Generation rows to delete: ${item.generationCount}`)
    }
    console.log("")
  }

  if (unmatched.length) {
    console.log("Unmatched emails:")
    for (const email of unmatched) console.log(`  - ${email}`)
    console.log("")
  }

  if (!args.apply) {
    console.log("Dry run only. Re-run with --apply to write these resets.")
    return
  }

  for (const item of matched) {
    const upsertPayload = {
      user_id: item.userId,
      user_email: item.email,
      ...nextCreditState(args.credits),
    }
    const { error: upsertError } = await supabase
      .from("tfn_magic_credits")
      .upsert(upsertPayload, { onConflict: "user_id" })
    if (upsertError) {
      if (isMissingTableError(upsertError)) {
        console.warn("Skipping tfn_magic_credits upsert because the table is not present.")
      } else {
        throw upsertError
      }
    }

    if (item.authUser) {
      const currentMetadata = item.authUser.app_metadata || {}
      const { error: metadataError } = await supabase.auth.admin.updateUserById(
        item.userId,
        {
          app_metadata: {
            ...currentMetadata,
            tfn_magic_credits: nextMetadataState(args.credits),
          },
        }
      )
      if (metadataError) throw metadataError
    }

    if (args.clearGenerations) {
      const { error: deleteError } = await supabase
        .from("tfn_magic_generations")
        .delete()
        .eq("user_id", item.userId)
      if (deleteError) {
        if (isMissingTableError(deleteError)) {
          console.warn("Skipping tfn_magic_generations cleanup because the table is not present.")
        } else {
          throw deleteError
        }
      }
    }
  }

  console.log(`Reset ${matched.length} credit account(s).`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
