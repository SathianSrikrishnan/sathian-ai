import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const savedClientPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const notePagePath = resolve(root, 'src/app/toothlight/t/[id]/note/page.tsx')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const notePanelCssPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''
const savedClient = existsSync(savedClientPath) ? readFileSync(savedClientPath, 'utf8') : ''
const notePage = existsSync(notePagePath) ? readFileSync(notePagePath, 'utf8') : ''
const notePanel = existsSync(notePanelPath) ? readFileSync(notePanelPath, 'utf8') : ''
const notePanelCss = existsSync(notePanelCssPath) ? readFileSync(notePanelCssPath, 'utf8') : ''

assert(/buildToothlightNoteUrl/.test(makeClient), 'save flow must build a note handoff URL')
assert(/\/note\?handoff=1/.test(makeClient), 'save flow must hand off directly to the parent note moment')
assert(/Seal the parent note next/.test(makeClient), 'save message must frame the next step as sealing the note')
assert(/handoff/.test(notePage), 'note page must accept handoff state from save flow')
assert(/Seal the note/.test(notePage + notePanel), 'note flow must lead with sealing the parent note')
assert(/Say or type the private note/.test(notePage), 'note page must explain the parent action in one short line')
assert(/Tap mic\. Talk\. Seal\./.test(notePanel), 'future note panel must support the voice-first note action')
assert(/readLocalFutureNote/.test(notePanel), 'future note panel must restore the saved note status in local preview')
assert(/futureNoteStatus/.test(notePanel), 'future note panel must hydrate sealed status from the saved Toothlight API')
assert(/sealedMoment/.test(notePanel + notePanelCss), 'future note panel must show a sealed confirmation moment')
assert(/View saved Toothlight/.test(notePanel), 'sealed note confirmation must link back to the saved Toothlight page')
assert(/Invite family/.test(notePanel), 'sealed note confirmation must keep family contribution as the next optional step')
assert(/Next: invite family\./.test(notePanel), 'sealed confirmation must use the simplified family next action')
assert(/canSealNote/.test(notePanel), 'seal button must require a private note body before sealing')
assert(/disabled=\{!canSealNote\}/.test(notePanel), 'seal button must be disabled until the private note is ready')
assert(/noteCtaLabel/.test(savedClient), 'saved page must adapt the note CTA after sealing')
assert(/Seal note/.test(savedClient), 'saved page must show the sealed note as the core next step')
assert(/Review note/.test(savedClient), 'saved page must expose sealed status after sealing')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-sealed-handoff: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-sealed-handoff')
