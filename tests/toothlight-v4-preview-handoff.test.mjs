import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const docPath = resolve(root, 'docs/toothlight/v4/10-preview-handoff-status.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(docPath), 'preview handoff status doc must exist')

const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : ''

for (const text of [
  'Preview Handoff Status',
  'codex/toothlight-v4-creation-ux',
  'https://github.com/SathianSrikrishnan/sathian-ai/pull/7',
  '690c4426eff796f861ad487d06f470bb80345647',
  '418a7fe4d9670caa1f20de237e75b3f4f4f7a586',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.102:3000/toothlight/make',
  '/toothlight/t/[id]/note?handoff=1',
  'Mobile Chrome',
  'Mobile Safari',
  'family contribution',
  '401 Unauthorized',
  'merge state is `CLEAN`',
  'Vercel connector returned `403 Forbidden`',
  'token_expired',
  'Vercel is re-authenticated',
  'TFN_ADMIN_SECRET',
  'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
  'OPENAI_API_KEY',
  'Do not invite the full first-50 group',
]) {
  assert(doc.includes(text), `preview handoff doc must include ${text}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-preview-handoff: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-preview-handoff')
