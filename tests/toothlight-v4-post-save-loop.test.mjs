import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const savedClientPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const savedCssPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.module.css')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const familyPagePath = resolve(root, 'src/app/toothlight/t/[id]/family/page.tsx')
const familyInviteClientPath = resolve(root, 'src/components/toothlight/v4/FamilyInviteClient.tsx')
const familyFormPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.tsx')
const familyCssPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const savedClient = existsSync(savedClientPath) ? readFileSync(savedClientPath, 'utf8') : ''
const savedCss = existsSync(savedCssPath) ? readFileSync(savedCssPath, 'utf8') : ''
const notePanel = existsSync(notePanelPath) ? readFileSync(notePanelPath, 'utf8') : ''
const familyPage = existsSync(familyPagePath) ? readFileSync(familyPagePath, 'utf8') : ''
const familyInviteClient = existsSync(familyInviteClientPath) ? readFileSync(familyInviteClientPath, 'utf8') : ''
const familyForm = existsSync(familyFormPath) ? readFileSync(familyFormPath, 'utf8') : ''
const familyCss = existsSync(familyCssPath) ? readFileSync(familyCssPath, 'utf8') : ''

assert(/Toothlight time capsule/.test(savedClient), 'saved page must frame the object as a Toothlight time capsule')
for (const label of ['Memory saved', 'Future note', 'Family note + gift']) {
  assert(savedClient.includes(label), `saved page must show ${label} in the capsule checklist`)
}
assert(!savedClient.includes('Smile Fund optional'), 'saved page must not treat Smile Fund as a separate post-save step')
assert(!/smileFundStatus:\s*'active'/.test(savedClient), 'saved page must not force Smile Fund active before a family gift exists')
assert(/privateNoteStatus/.test(savedClient), 'saved page must compute private note status separately from public card state')
assert(/nextStepPanel/.test(savedClient + savedCss), 'saved page must include a clear next-step panel')
assert(/capsuleChecklist/.test(savedClient + savedCss), 'saved page must style the capsule checklist')
assert(/Invite family/.test(savedClient), 'saved page must make family invitation the post-seal next action')
assert(/note and optional gift/.test(savedClient), 'saved page must explain that family invite includes the optional gift path')
assert(!/audit page/i.test(savedClient), 'saved page copy must not describe the customer-facing object as an audit page')

assert(/Next: invite family/.test(notePanel), 'sealed note confirmation must point to the family invite next')
assert(/Family can add a note for later/.test(notePanel), 'sealed note confirmation must explain the family note path')
assert(/View saved Toothlight/.test(notePanel), 'sealed note confirmation must link back to the saved Toothlight')
assert(!/Small note starter/.test(notePanel), 'future note handoff must not ask for two parent notes')

assert(/Invite family/.test(familyPage + familyInviteClient + familyForm), 'family flow must read as an optional family invite step')
assert(/readLocalToothlight/.test(familyInviteClient), 'family invite must carry forward the saved Toothlight visual')
assert(!/Kai's Toothlight/.test(familyPage + familyInviteClient), 'family invite must not show the demo Toothlight after a real save')
assert(!/FamilyNodeOrbit/.test(familyForm), 'family form must not show a second unrelated visual')
assert(/Add a family note/.test(familyInviteClient + familyForm), 'family form must distinguish the family note from the parent note')
assert(/Gift optional/.test(familyPage + familyInviteClient + familyForm), 'family flow must frame the gift as optional')
assert(/useState\(false\)/.test(familyForm), 'family gift checkbox must default off')
assert(/Add family note/.test(familyForm), 'family primary CTA must submit the family note path')
assert(/View saved Toothlight/.test(familyForm), 'family completion must offer a return to the saved Toothlight')
assert(/familyNoteDefault/.test(familyCss), 'family form must style the note-first default state')
assert(!/connect wallet|wallet-first|crypto-first/i.test(familyPage + familyForm), 'family flow must avoid wallet-first language')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-post-save-loop: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-post-save-loop')
