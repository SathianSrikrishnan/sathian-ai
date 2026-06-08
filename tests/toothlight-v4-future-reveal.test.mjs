import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const revealPagePath = resolve(root, 'src/app/toothlight/t/[id]/reveal/page.tsx')
const revealClientPath = resolve(root, 'src/components/toothlight/v4/FutureRevealClient.tsx')
const revealCssPath = resolve(root, 'src/components/toothlight/v4/FutureRevealClient.module.css')
const savedClientPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const familyFormPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.tsx')
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const apiRoutePath = resolve(root, 'src/app/api/toothlight/[id]/route.ts')

const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const [path, label] of [
  [revealPagePath, 'future reveal route'],
  [revealClientPath, 'FutureRevealClient'],
  [revealCssPath, 'FutureRevealClient styles'],
]) {
  assert(existsSync(path), `${label} must exist`)
}

const revealPage = existsSync(revealPagePath) ? readFileSync(revealPagePath, 'utf8') : ''
const revealClient = existsSync(revealClientPath) ? readFileSync(revealClientPath, 'utf8') : ''
const savedClient = existsSync(savedClientPath) ? readFileSync(savedClientPath, 'utf8') : ''
const notePanel = existsSync(notePanelPath) ? readFileSync(notePanelPath, 'utf8') : ''
const familyForm = existsSync(familyFormPath) ? readFileSync(familyFormPath, 'utf8') : ''
const localState = existsSync(localStatePath) ? readFileSync(localStatePath, 'utf8') : ''
const apiRoute = existsSync(apiRoutePath) ? readFileSync(apiRoutePath, 'utf8') : ''

assert(/FutureRevealClient/.test(revealPage), 'future reveal route must render the reveal client')
assert(/preview=\{searchParams\?\.preview === '1'\}/.test(revealPage), 'future reveal route must support parent preview mode')
assert(/readLocalToothlight/.test(revealClient), 'future reveal must reuse the saved local Toothlight')
assert(/fetch\(`\/api\/toothlight\/\$\{toothlightId\}`\)/.test(revealClient), 'future reveal must hydrate from the persisted Toothlight API')
assert(/ToothlightCard/.test(revealClient), 'future reveal must show the same Toothlight card')
assert(/Preview reveal/.test(savedClient), 'saved page must link to the reveal preview')
assert(/\/reveal\?preview=1/.test(savedClient + notePanel + familyForm), 'note/family/saved surfaces must expose reveal preview links')
assert(/sealedPreviewText/.test(localState), 'local future note state must keep parent preview text for local audit only')
assert(/notePreviewText/.test(localState), 'local family contribution state must keep family preview text for local audit only')
assert(/sealedPreviewText: sealedText\.trim\(\)/.test(notePanel), 'parent note save must cache local preview text after sealing')
assert(/notePreviewText: result\.noteText \?\? noteText\.trim\(\)/.test(familyForm), 'family note save must cache local preview text after submitting')
assert(/readParentNoteText/.test(revealClient), 'future reveal must resolve parent note text through a dedicated preview helper')
assert(/readFamilyNotes/.test(revealClient), 'future reveal must resolve family notes through a dedicated preview helper')
assert(/const isOpen = preview/.test(revealClient), 'future reveal must not open note text unless preview mode is explicit')
assert(/Closed until age|Opens at age/.test(revealClient), 'future reveal must support locked future state')
assert(/statusOnly: true/.test(apiRoute) && /noContent: true/.test(apiRoute), 'public Toothlight API must remain status-only and no-content')
assert(!/sealedPreviewText/.test(apiRoute), 'public Toothlight API must not expose parent preview text')
assert(!/notePreviewText/.test(apiRoute), 'public Toothlight API must not expose family preview text')
assert(!/readParentNoteText/.test(savedClient), 'public saved page must not render private parent note text')
assert(!/readFamilyNotes/.test(savedClient), 'public saved page must not render family note text')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-future-reveal: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-future-reveal')
