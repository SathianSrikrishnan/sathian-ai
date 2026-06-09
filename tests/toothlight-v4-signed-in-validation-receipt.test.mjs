import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const receiptPath = resolve(root, 'docs/toothlight/v4/12-signed-in-validation-receipt.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(receiptPath), 'signed-in validation receipt must exist')

const receipt = existsSync(receiptPath) ? readFileSync(receiptPath, 'utf8') : ''

for (const text of [
  'Toothlight Signed-In Validation Receipt',
  'Status: ready for first-50 trusted preview test; production/on-ramp still deferred',
  'Preview alias: `https://toothlight-preview.sathian.ai`',
  'Protected make route: `https://toothlight-preview.sathian.ai/toothlight/make`',
  'Current clean preview deployment: `https://sathian-k0ed27oqg-sathiansrikrishnans-projects.vercel.app`',
  'Current deployment id: `dpl_8m18RYSwVFocWS8mBRXUCm9Ao3px`',
  'Current checkpoint commit: `a4a50bd6775ac705b7551cfa6611e56b4fd85c41`',
  'https://github.com/SathianSrikrishnan/sathian-ai/pull/7',
  'Required Pass Path',
  'Browser Pass',
  'Phone Pass',
  'Quick Failure Capture',
  'Acceptance Checks',
  'Issues Found',
  'Current Evidence Audit',
  'Decision',
  'First-50 invite decision: ready for a small trusted group',
  '22724752-7918-4d97-a9b0-df863a7960d9',
  'statusOnly: true',
  'noContent: true',
  'family contribution nodes',
  'Public API/reveal intentionally do not expose private note text bodies',
  'Codex validation added family contribution nodes through the deployed family-contribution API',
  'audio/mp4',
  'm4a',
  'phone-photo save reliability',
  'missing multipart form-data error',
  'full mobile proof',
  'not_found',
  'Mic path:',
  'Save path:',
  'Image continuity:',
  'Last button tapped:',
  'Mic permission state:',
  'Whether typing still works:',
  'pass by user report on 2026-06-09',
  'same-day local-preview saves succeeded',
  'server-backed save, sealed parent-note status, family contribution status, reveal route',
]) {
  assert(receipt.includes(text), `receipt must include ${text}`)
}

for (const step of [
  'Open the protected-preview make link',
  'Add or capture a photo',
  'Draw one mark on the photo',
  'Choose one Light Style',
  'Make an AI Toothlight preview',
  'Save this Toothlight with a signed-in parent account',
  'Land on the parent note handoff',
  'Seal one private parent note',
  'Open the saved Toothlight direct link',
  'Invite family',
  'Add one family note, gift optional',
  'Open `Preview reveal`',
  'Confirm the reveal shows the same Toothlight',
  'sealed parent-note status',
  'family contribution status',
]) {
  assert(receipt.includes(step), `receipt must include pass step: ${step}`)
}

for (const evidenceField of [
  'Saved Toothlight URL:',
  'Parent note URL:',
  'Family invite URL:',
  'Reveal preview URL:',
  'Screenshot or recording:',
  'Result: pass for first trusted preview group',
]) {
  assert(receipt.includes(evidenceField), `receipt must include evidence field: ${evidenceField}`)
}

assert(/No wallet, MoonPay, Coinbase, or on-ramp step was required/.test(receipt), 'receipt must keep provider/on-ramp work outside the first-50 gate')
assert(/Status moves to `ready` for the first trusted preview group/.test(receipt), 'receipt must move the first-50 gate to ready')
assert(/Still deferred: wallet handoff, MoonPay, Coinbase, Smile Fund funding, smart-contract\/mainnet work, production domain promotion, and final brand-art polish/.test(receipt), 'receipt must keep production and funding work deferred')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-signed-in-validation-receipt: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-signed-in-validation-receipt')
