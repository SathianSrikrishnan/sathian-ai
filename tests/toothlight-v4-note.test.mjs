import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const savedPagePath = resolve(root, 'src/app/toothlight/t/[id]/page.tsx')
const notePagePath = resolve(root, 'src/app/toothlight/t/[id]/note/page.tsx')
const panelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const routePath = resolve(root, 'src/app/api/toothlight/[id]/future-note/route.ts')
const helperPath = resolve(root, 'src/lib/toothlight/server/future-notes.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const [path, label] of [
  [savedPagePath, 'saved Toothlight page'],
  [notePagePath, 'future note page'],
  [panelPath, 'FutureNotePanel'],
  [routePath, 'future note API route'],
  [helperPath, 'future-notes helper'],
]) {
  assert(existsSync(path), `${label} must exist`)
}

const savedPage = existsSync(savedPagePath) ? readFileSync(savedPagePath, 'utf8') : ''
const notePage = existsSync(notePagePath) ? readFileSync(notePagePath, 'utf8') : ''
const panel = existsSync(panelPath) ? readFileSync(panelPath, 'utf8') : ''
const route = existsSync(routePath) ? readFileSync(routePath, 'utf8') : ''

assert(/Note Started/.test(savedPage + panel), 'saved/note UI must show Note Started')
assert(/Sealed for later/.test(savedPage + panel), 'saved/note UI must show Sealed for later')
assert(/note for later/i.test(notePage + panel), 'UI copy must use note for later')
assert(!/future letter|write a letter/i.test(notePage + panel), 'UI must not lead with formal letter-first language')
assert(/statusOnly|publicStatus|without content|noContent/i.test(route), 'note API must expose status without content publicly')
assert(!/GET[\s\S]{0,700}noteBody|GET[\s\S]{0,700}fullNote/i.test(route), 'public GET must not expose private note body')
assert(/NEXT_PUBLIC_TEST_MODE/.test(route), 'note API must support test mode')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-note: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-note')
