import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const docPath = resolve(root, 'docs/toothlight/v4/11-first-50-readiness-audit.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(docPath), 'first-50 readiness audit doc must exist')

const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : ''

for (const text of [
  'First 50 Readiness Audit',
  'local-ready and build-verified; external preview blocked by Vercel access',
  'not ready to send to the full first-50 visitor group',
  'http://localhost:3000/toothlight',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.102:3000/toothlight/make',
  'public/toothlight/style-objects/product-renders/v4/',
  'Simplified make UI',
  'talk/type memory field',
  'Make it a Toothlight',
  'Mobile Chrome',
  'Mobile Safari',
  'npx.cmd tsc --noEmit --pretty false --incremental false',
  'Production build',
  'npm.cmd run build',
  'passed after the generated `.next` cache was rebuilt with write access',
  '401 Unauthorized',
  'token_expired',
  'MoonPay',
  'Coinbase',
  'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
  'OPENAI_API_KEY',
  'TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true',
  'Re-authenticate Vercel',
]) {
  assert(doc.includes(text), `readiness audit must include ${text}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-readiness-audit: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-readiness-audit')
