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
  'preview-deployed; external browser pass pending',
  'codex/toothlight-v4-creation-ux',
  'https://github.com/SathianSrikrishnan/sathian-ai/pull/7',
  '8ad3beb2c9f964060c299f3133dea85019b633c9',
  '6b6601bf41fda67fc7a13716390ee7f4c98f3d30',
  'beceb341d5ef415cfedbbbaf551e2c7c9f17ab9f',
  '02362827ad7e20cac67c2012a49738ea6f1a99b0',
  'bfb78d1c61ab0b2371d4510400334eda360c1f40',
  '690c4426eff796f861ad487d06f470bb80345647',
  '418a7fe4d9670caa1f20de237e75b3f4f4f7a586',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.104:3000/toothlight/make',
  'https://sathian-ohhj6x5i9-sathiansrikrishnans-projects.vercel.app',
  'dpl_2Ukbu414HdviqRR5oFX1GTuLTpYE',
  'https://toothlight-preview.sathian.ai',
  'shareable-link protection bypass',
  'bypass token is intentionally not committed',
  '/toothlight/t/[id]/note?handoff=1',
  'Mobile Chrome',
  'Mobile Safari',
  'family contribution',
  'TypeScript compile check passed',
  'visual simplification',
  'Full production build passed',
  'Clean Vercel preview build passed',
  'vercel curl /toothlight/make',
  'EPERM',
  'elevated build completed successfully',
  'merge state is `CLEAN`',
  'token_expired',
  'ERR_INTERNET_DISCONNECTED',
  'normal browser/mobile pass',
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
