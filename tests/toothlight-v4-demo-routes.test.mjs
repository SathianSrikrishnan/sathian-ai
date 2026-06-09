import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const noteRoutePath = resolve(root, 'src/app/api/toothlight/[id]/future-note/route.ts')
const familyRoutePath = resolve(root, 'src/app/api/toothlight/[id]/family-contribution/route.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const noteRoute = readFileSync(noteRoutePath, 'utf8')
const familyRoute = readFileSync(familyRoutePath, 'utf8')

assert(/isDemoToothlight/.test(noteRoute), 'future note route must identify demo Toothlight requests')
assert(/isDemoToothlight/.test(familyRoute), 'family contribution route must identify demo Toothlight requests')
assert(
  /isDemoToothlight\(params\.id\)[\s\S]*future_note_saved_demo/.test(noteRoute),
  'future note demo id must save through the demo path outside test mode',
)
assert(
  /isDemoToothlight\(params\.id\)[\s\S]*demoFamilyContribution/.test(familyRoute),
  'family demo id must save through the demo path outside test mode',
)
assert(
  !/params\.id === 'demo-toothlight'/.test(noteRoute + familyRoute),
  'demo route checks should use a shared isDemoToothlight helper',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-demo-routes: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-demo-routes')
