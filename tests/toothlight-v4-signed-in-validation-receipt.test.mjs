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
  'Status: pending signed-in browser/mobile pass',
  'Preview alias: `https://toothlight-preview.sathian.ai`',
  'Protected make route: `https://toothlight-preview.sathian.ai/toothlight/make`',
  'Current clean preview deployment: `https://sathian-5op825thb-sathiansrikrishnans-projects.vercel.app`',
  'Current deployment id: `dpl_djSqxwotyhttyxq6yekc1zPs59Me`',
  'Current checkpoint commit: `0238aa12e86a8fa1ac638a577b8bf2e0b9a17183`',
  'https://github.com/SathianSrikrishnan/sathian-ai/pull/7',
  'Required Pass Path',
  'Browser Pass',
  'Phone Pass',
  'Acceptance Checks',
  'Issues Found',
  'Decision',
  'First-50 invite decision: hold',
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
]) {
  assert(receipt.includes(step), `receipt must include pass step: ${step}`)
}

for (const evidenceField of [
  'Saved Toothlight URL:',
  'Parent note URL:',
  'Family invite URL:',
  'Reveal preview URL:',
  'Screenshot or recording:',
  'Result: pending',
]) {
  assert(receipt.includes(evidenceField), `receipt must include evidence field: ${evidenceField}`)
}

assert(/No wallet, MoonPay, Coinbase, or on-ramp step was required/.test(receipt), 'receipt must keep provider/on-ramp work outside the first-50 gate')
assert(/pending[\s\S]*signed-in browser\/mobile validation evidence pending/.test(receipt), 'receipt must remain pending until real signed-in evidence is recorded')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-signed-in-validation-receipt: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-signed-in-validation-receipt')
