import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const planPath = resolve(root, 'docs/toothlight/v4/09-first-50-visitor-test-plan.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(planPath), 'first-50 visitor test plan must exist')

const plan = existsSync(planPath) ? readFileSync(planPath, 'utf8') : ''

for (const text of [
  'First 50 Visitor Test Plan',
  'Not production',
  'Test routes',
  '/toothlight',
  '/toothlight/make',
  '/toothlight/t/[id]',
  '/toothlight/t/[id]/note?handoff=1',
  '/toothlight/t/[id]/family',
  'Mobile checklist',
  'Choose photo',
  'Camera',
  'finger drawing',
  'AI preview',
  'Save this Toothlight',
  'Seal the note',
  'Family note + gift',
  'Mic',
  'Bug report',
  'Known limits',
  'Verification commands',
]) {
  assert(plan.includes(text), `first-50 plan must include ${text}`)
}

assert(/http:\/\/localhost:3000\/toothlight/.test(plan), 'plan must include the local browser Toothlight link')
assert(/http:\/\/<LAN-IP>:3000\/toothlight/.test(plan), 'plan must include a LAN phone Toothlight link template')
assert(/OPENAI_API_KEY/.test(plan), 'plan must call out voice transcription key requirement')
assert(/TOOTHLIGHT_NOTE_ENCRYPTION_KEY/.test(plan), 'plan must call out note encryption key requirement')
assert(/MoonPay|Coinbase|on-ramp/i.test(plan), 'plan must mark on-ramp/provider funding as deferred')
assert(/npm run build/.test(plan), 'plan must include build verification')
assert(/toothlight-v4-\*\.test\.mjs/.test(plan), 'plan must include the Toothlight V4 source test command')
assert(/npx playwright test tests\/toothlight-v4-proof\.spec\.ts/.test(plan), 'plan must include the proof Playwright test command')
assert(/Do not merge/i.test(plan), 'plan must warn not to merge before mobile testing passes')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-first-50-plan: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-first-50-plan')
