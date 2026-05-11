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
TFN off-chain test data cleanup

Dry-run by default. This script never touches Solana accounts.

Usage:
  node --env-file=.env.local scripts/tfn-clean-test-data.mjs --email parent@example.com
  node --env-file=.env.local scripts/tfn-clean-test-data.mjs --slugs .codex-temp/tfn-cleanup-slugs.txt --actions docs/reports/tfn-cleanup-2026-05-11.actions.json

Options:
  --email <email>          Parent email to clean. May be repeated.
  --emails <file>          Text file with one email per line.
  --slug <slug>            Child slug to clean. May be repeated.
  --slugs <file>           Text file with one child slug per line.
  --profile <pda>          Child profile PDA to clean. May be repeated.
  --milestone <pda>        Milestone PDA story row to clean. May be repeated.
  --actions <file>         Report actions JSON to use for db-only candidates.
  --include-photos         Include tfn-photos objects under selected user IDs.
  --apply                  Actually delete selected off-chain rows.
  --help                   Show this help.
`)
}

function parseArgs(argv) {
  const args = {
    emails: [],
    emailFiles: [],
    slugs: [],
    slugFiles: [],
    profiles: [],
    milestones: [],
    actionFiles: [],
    includePhotos: false,
    apply: false,
    help: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") args.help = true
    else if (arg === "--email") args.emails.push(argv[++i])
    else if (arg === "--emails") args.emailFiles.push(argv[++i])
    else if (arg === "--slug") args.slugs.push(argv[++i])
    else if (arg === "--slugs") args.slugFiles.push(argv[++i])
    else if (arg === "--profile") args.profiles.push(argv[++i])
    else if (arg === "--milestone") args.milestones.push(argv[++i])
    else if (arg === "--actions") args.actionFiles.push(argv[++i])
    else if (arg === "--include-photos") args.includePhotos = true
    else if (arg === "--apply") args.apply = true
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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function normalizeText(value) {
  return String(value || "").trim()
}

function readListFiles(files, normalizer) {
  const values = []
  for (const file of files) {
    const resolved = path.resolve(repoRoot, file)
    const raw = fs.readFileSync(resolved, "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const value = normalizer(line.replace(/#.*/, ""))
      if (value) values.push(value)
    }
  }
  return values
}

function readActions(files) {
  const actions = {
    childSlugs: [],
    childProfilePdas: [],
    milestonePdas: [],
  }

  for (const file of files) {
    const resolved = path.resolve(repoRoot, file)
    const parsed = JSON.parse(fs.readFileSync(resolved, "utf8"))
    const deletes = parsed.supabaseDeletes || []
    for (const action of deletes) {
      if (action.childSlug) actions.childSlugs.push(action.childSlug)
      if (action.childProfilePda) actions.childProfilePdas.push(action.childProfilePda)
      if (action.milestonePda) actions.milestonePdas.push(action.milestonePda)
    }
  }

  return actions
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

async function safeSelectIn(supabase, table, column, values) {
  const unique = [...new Set(values.filter(Boolean))]
  if (!unique.length) return []
  const { data, error } = await supabase.from(table).select("*").in(column, unique)
  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") return []
    throw error
  }
  return data || []
}

async function listPhotosForUsers(supabase, userIds) {
  const paths = []
  for (const userId of userIds) {
    const { data, error } = await supabase.storage
      .from("tfn-photos")
      .list(userId, { limit: 1000, sortBy: { column: "name", order: "asc" } })
    if (error) continue
    for (const item of data || []) {
      if (item.id || item.metadata) paths.push(`${userId}/${item.name}`)
    }
  }
  return paths
}

function compactRows(rows, fields) {
  return rows.map((row) => {
    const out = {}
    for (const field of fields) out[field] = row[field]
    return out
  })
}

async function deleteIn(supabase, table, column, values) {
  const unique = [...new Set(values.filter(Boolean))]
  if (!unique.length) return 0
  const { error, count } = await supabase
    .from(table)
    .delete({ count: "exact" })
    .in(column, unique)
  if (error) throw error
  return count || 0
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  loadEnvFile(path.join(repoRoot, ".env.local"))

  const actionSelectors = readActions(args.actionFiles)
  const emails = [
    ...args.emails.map(normalizeEmail),
    ...readListFiles(args.emailFiles, normalizeEmail),
  ].filter(Boolean)
  const slugs = [
    ...args.slugs.map(normalizeText),
    ...readListFiles(args.slugFiles, normalizeText),
    ...actionSelectors.childSlugs,
  ].filter(Boolean)
  const profiles = [
    ...args.profiles.map(normalizeText),
    ...actionSelectors.childProfilePdas,
  ].filter(Boolean)
  const milestones = [
    ...args.milestones.map(normalizeText),
    ...actionSelectors.milestonePdas,
  ].filter(Boolean)

  if (!emails.length && !slugs.length && !profiles.length && !milestones.length) {
    throw new Error("Provide at least one email, slug, profile, milestone, or actions file")
  }

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const authUsers = await listAuthUsers(supabase)
  const usersByEmail = new Map(
    authUsers
      .filter((user) => user.email)
      .map((user) => [normalizeEmail(user.email), user])
  )
  const selectedUsers = emails.map((email) => usersByEmail.get(email)).filter(Boolean)
  const userIds = selectedUsers.map((user) => user.id)
  const unmatchedEmails = emails.filter((email) => !usersByEmail.has(email))

  const childRowsByUser = await safeSelectIn(supabase, "tfn_children", "user_id", userIds)
  const childRowsBySlug = await safeSelectIn(supabase, "tfn_children", "child_slug", slugs)
  const childRowsByProfile = await safeSelectIn(
    supabase,
    "tfn_children",
    "child_profile_pda",
    profiles
  )
  const childRowsById = new Map()
  for (const row of [...childRowsByUser, ...childRowsBySlug, ...childRowsByProfile]) {
    childRowsById.set(row.id, row)
  }
  const childRows = [...childRowsById.values()]

  const selectedProfiles = [
    ...profiles,
    ...childRows.map((row) => row.child_profile_pda),
  ].filter(Boolean)
  const selectedMilestones = [...milestones]

  const storyRowsByUser = await safeSelectIn(supabase, "tfn_tooth_stories", "user_id", userIds)
  const storyRowsByProfile = await safeSelectIn(
    supabase,
    "tfn_tooth_stories",
    "child_profile_pda",
    selectedProfiles
  )
  const storyRowsByMilestone = await safeSelectIn(
    supabase,
    "tfn_tooth_stories",
    "milestone_pda",
    selectedMilestones
  )
  const storyRowsByPda = new Map()
  for (const row of [...storyRowsByUser, ...storyRowsByProfile, ...storyRowsByMilestone]) {
    storyRowsByPda.set(row.milestone_pda, row)
  }
  const storyRows = [...storyRowsByPda.values()]

  const childNames = childRows.map((row) => row.child_name).filter(Boolean)
  const toothStateRows = await safeSelectIn(supabase, "tooth_states", "child_name", childNames)
  const photoPaths = args.includePhotos ? await listPhotosForUsers(supabase, userIds) : []

  console.log(args.apply ? "Mode: APPLY" : "Mode: DRY RUN")
  console.log("")
  console.log(`Matched users: ${selectedUsers.length}`)
  if (unmatchedEmails.length) {
    console.log(`Unmatched emails: ${unmatchedEmails.join(", ")}`)
  }
  console.log(`tfn_children rows selected: ${childRows.length}`)
  console.log(`tfn_tooth_stories rows selected: ${storyRows.length}`)
  console.log(`tooth_states rows selected: ${toothStateRows.length}`)
  console.log(`photo objects selected: ${photoPaths.length}`)
  console.log("")

  console.log("Children:")
  console.log(
    JSON.stringify(
      compactRows(childRows, [
        "id",
        "user_email",
        "child_name",
        "child_slug",
        "child_profile_pda",
        "created_at",
      ]),
      null,
      2
    )
  )
  console.log("")

  console.log("Stories:")
  console.log(
    JSON.stringify(
      compactRows(storyRows, [
        "milestone_pda",
        "child_profile_pda",
        "user_id",
        "tradition_slug",
        "created_at",
      ]),
      null,
      2
    )
  )
  console.log("")

  if (photoPaths.length) {
    console.log("Photo objects:")
    for (const photoPath of photoPaths) console.log(`  - ${photoPath}`)
    console.log("")
  }

  if (!args.apply) {
    console.log("Dry run only. Re-run with --apply to delete these off-chain rows.")
    return
  }

  const storyMilestones = storyRows.map((row) => row.milestone_pda)
  const childIds = childRows.map((row) => row.id)

  const deletedStories = await deleteIn(
    supabase,
    "tfn_tooth_stories",
    "milestone_pda",
    storyMilestones
  )
  const deletedToothStates = await deleteIn(
    supabase,
    "tooth_states",
    "child_name",
    childNames
  )
  const deletedChildren = await deleteIn(supabase, "tfn_children", "id", childIds)

  let deletedPhotos = 0
  if (photoPaths.length) {
    const { data, error } = await supabase.storage.from("tfn-photos").remove(photoPaths)
    if (error) throw error
    deletedPhotos = data?.length || 0
  }

  console.log("Deleted:")
  console.log(`  tfn_tooth_stories: ${deletedStories}`)
  console.log(`  tooth_states: ${deletedToothStates}`)
  console.log(`  tfn_children: ${deletedChildren}`)
  console.log(`  tfn-photos objects: ${deletedPhotos}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
