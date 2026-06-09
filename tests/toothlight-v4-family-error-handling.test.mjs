import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const routePath = resolve(root, 'src/app/api/toothlight/[id]/family-contribution/route.ts')
const formPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const route = readFileSync(routePath, 'utf8')
const form = readFileSync(formPath, 'utf8')

assert(/try\s*{[\s\S]*savePersistedFamilyContribution/.test(route), 'family route must catch persistence errors')
assert(/familyContributionErrorMessage/.test(route), 'family route must map persistence errors to safe JSON messages')
assert(/NextResponse\.json\(\s*{[\s\S]*success:\s*false[\s\S]*error:/.test(route), 'family route must return JSON on save errors')
assert(/TOOTHLIGHT_NOTE_ENCRYPTION_KEY/.test(route), 'family route must expose a setup-safe encryption-key error')
assert(/readJsonResponse/.test(form), 'family client must parse empty or non-JSON responses safely')
assert(!/const result = await response\.json\(\)/.test(form), 'family client must not blindly parse response JSON')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-family-error-handling: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-family-error-handling')
