import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const makePath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const savedClientPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const savedPagePath = resolve(root, 'src/app/toothlight/t/[id]/page.tsx')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const familyFormPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.tsx')

const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(localStatePath), 'client local Toothlight state helper must exist')
assert(existsSync(savedClientPath), 'saved Toothlight client component must exist')

const localState = existsSync(localStatePath) ? readFileSync(localStatePath, 'utf8') : ''
const make = readFileSync(makePath, 'utf8')
const savedClient = existsSync(savedClientPath) ? readFileSync(savedClientPath, 'utf8') : ''
const savedPage = readFileSync(savedPagePath, 'utf8')
const notePanel = readFileSync(notePanelPath, 'utf8')
const familyForm = readFileSync(familyFormPath, 'utf8')

for (const token of [
  'toothlight:v4:draft',
  'toothlight:v4:saved:',
  'toothlight:v4:future-note:',
  'toothlight:v4:family:',
  'saveLocalToothlight',
  'readLocalToothlight',
  'saveLocalFutureNote',
  'saveLocalFamilyContribution',
]) {
  assert(localState.includes(token), `local state helper must include ${token}`)
}

assert(make.includes('useRouter'), 'make flow must use router navigation after Save Flight')
assert(make.includes('saveLocalToothlight'), 'make flow must persist saved Toothlight continuity data')
assert(/onComplete=\{\(\) => router\.push/.test(make), 'Save Flight must navigate to saved Toothlight on complete')
assert(savedPage.includes('SavedToothlightClient'), 'saved page must render SavedToothlightClient')
assert(savedClient.includes('readLocalToothlight'), 'saved client must read local Toothlight state')
assert(savedClient.includes('readLocalFutureNote'), 'saved client must read local future note status')
assert(savedClient.includes('readLocalFamilyContributions'), 'saved client must read local family node status')
assert(notePanel.includes('saveLocalFutureNote'), 'future note panel must persist local future note status')
assert(familyForm.includes('saveLocalFamilyContribution'), 'family form must persist local contribution status')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-continuity: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-continuity')
