import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const runbookPath = resolve(root, 'docs/toothlight/v4/13-signed-in-browser-mobile-runbook.md')
const planPath = resolve(root, 'docs/toothlight/v4/09-first-50-visitor-test-plan.md')
const receiptPath = resolve(root, 'docs/toothlight/v4/12-signed-in-validation-receipt.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(runbookPath), 'signed-in browser/mobile runbook must exist')

const runbook = existsSync(runbookPath) ? readFileSync(runbookPath, 'utf8') : ''
const plan = existsSync(planPath) ? readFileSync(planPath, 'utf8') : ''
const receipt = existsSync(receiptPath) ? readFileSync(receiptPath, 'utf8') : ''

for (const text of [
  'Toothlight Signed-In Browser and Mobile Runbook',
  'ready for Sathian validation; first-50 invite still on hold',
  'Do This Now',
  'use the HTTPS protected preview first',
  'Expected final screen',
  'If Vercel protection appears',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.104:3000/toothlight/make',
  'https://toothlight-preview.sathian.ai/toothlight/make',
  'protected-preview share link from the chat',
  'dpl_8m18RYSwVFocWS8mBRXUCm9Ao3px',
  'a4a50bd6775ac705b7551cfa6611e56b4fd85c41',
  'Documentation checkpoint: latest pushed branch head',
  'tests/toothlight-v4-signed-in-runbook.test.mjs',
  'Pass 1: Local Phone Sanity',
  '`local-*` Toothlight ids are acceptable only for same-Wi-Fi local testing',
  'Pass 2: Signed-In Browser Preview',
  'Pass 3: Real Phone Protected Preview',
  'fast speech-to-text when available',
  'server-backed Toothlight id, not a `local-*` id',
  'saved Toothlight image carries into family and reveal',
  'Evidence To Record',
  'saved Toothlight URL',
  'parent note URL',
  'family invite URL',
  'reveal preview URL',
  'mic path: fast speech, Record fallback, typed fallback, or blocked',
  'save path: server-backed id, Google sign-in resume, local fallback, or failed',
  'image continuity: same Toothlight image in saved, family, and reveal pages',
  'Stop Rules',
  'wallet, MoonPay, Coinbase, or on-ramp',
  'Decision Rule',
]) {
  assert(runbook.includes(text), `runbook must include ${text}`)
}

assert(/13-signed-in-browser-mobile-runbook\.md/.test(plan), 'first-50 plan must link the runbook')
assert(/13-signed-in-browser-mobile-runbook\.md/.test(receipt), 'signed-in receipt must link the runbook')
assert(/first-50 gate can move from hold to ready/.test(runbook), 'runbook must state the go/no-go decision rule')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-signed-in-runbook: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-signed-in-runbook')
