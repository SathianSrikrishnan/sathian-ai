import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const familyPagePath = resolve(root, 'src/app/toothlight/t/[id]/family/page.tsx')
const familyInviteClientPath = resolve(root, 'src/components/toothlight/v4/FamilyInviteClient.tsx')
const formPath = resolve(root, 'src/components/toothlight/v4/FamilyContributionForm.tsx')
const orbitPath = resolve(root, 'src/components/toothlight/v4/FamilyNodeOrbit.tsx')
const routePath = resolve(root, 'src/app/api/toothlight/[id]/family-contribution/route.ts')
const helperPath = resolve(root, 'src/lib/toothlight/server/family-contributions.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const [path, label] of [
  [familyPagePath, 'family page'],
  [familyInviteClientPath, 'FamilyInviteClient'],
  [formPath, 'FamilyContributionForm'],
  [orbitPath, 'FamilyNodeOrbit'],
  [routePath, 'family contribution API'],
  [helperPath, 'family contribution helper'],
]) {
  assert(existsSync(path), `${label} must exist`)
}

const familyPage = existsSync(familyPagePath) ? readFileSync(familyPagePath, 'utf8') : ''
const familyInviteClient = existsSync(familyInviteClientPath) ? readFileSync(familyInviteClientPath, 'utf8') : ''
const familyForm = existsSync(formPath) ? readFileSync(formPath, 'utf8') : ''
const demoImageSrc = '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg'

const source = [familyPagePath, familyInviteClientPath, formPath, orbitPath, routePath, helperPath]
  .filter(existsSync)
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n')

assert(/Invite family/.test(source), 'family page must read as an invite step')
assert(/FamilyInviteClient/.test(familyPage), 'family route must delegate to the client invite surface')
assert(/readLocalToothlight/.test(familyInviteClient), 'family invite must read the saved Toothlight from local preview storage')
assert(/readLocalFamilyContributions/.test(familyInviteClient), 'family invite must show existing family nodes from local preview storage')
assert(/\/api\/toothlight\/\$\{toothlightId\}/.test(familyInviteClient), 'family invite must hydrate from the persisted Toothlight API when available')
assert(familyInviteClient.includes(demoImageSrc), 'family demo fallback must render a real Toothlight image')
assert(/toothlightId === 'demo-toothlight'/.test(familyInviteClient), 'family invite must recognize the demo Toothlight fallback')
assert(/renderedImageSrc:\s*demoToothlightImageSrc/.test(familyInviteClient), 'family demo fallback must fill renderedImageSrc')
assert(/showMemoryCard[\s\S]*toothlightId === 'demo-toothlight'/.test(familyInviteClient), 'family demo route must show the Toothlight card before local storage hydrates')
assert(!/Kai's Toothlight/.test(familyPage + familyInviteClient), 'family invite must not hard-code the demo Toothlight')
assert(!/First tooth\. Big smile\./.test(familyPage + familyInviteClient), 'family invite must not hard-code the demo caption')
assert(!/FamilyNodeOrbit/.test(familyForm), 'family form must not show a second decorative orbit image beside the real Toothlight')
assert(/Family note \+ gift/.test(source), 'family flow must combine note and gift as one family action')
assert(/Note first\. Gift optional\./.test(source), 'family flow must frame note as the default path')
assert(/VoiceAssistField/.test(familyForm), 'family family-note field must support mic capture')
assert(/voicePrompt="Tap mic\. Talk\. Add note\."/.test(familyForm), 'family voice prompt must be short and action-oriented')
assert(!/<textarea[\s>]/.test(familyForm), 'family form must not fall back to a standalone typed textarea')
assert(/Add optional gift/.test(source), 'family flow must keep gift as an optional checkbox')
assert(/Add family note/.test(source), 'family primary CTA must add the family contribution')
assert(/Add note \+ gift/.test(source), 'family primary CTA must switch when a gift is included')
assert(/View saved Toothlight/.test(source), 'family completion must offer a return to the saved Toothlight')
assert(!/Gift linked|Family gift linked/.test(source), 'family flow must avoid fund-style linked language')
assert(/note-only|noteOnly|note only/i.test(source), 'family flow must include note-only path')
assert(/provider-demo-safe|demo-safe|payment_status.*demo/i.test(source), 'gift path must be provider-demo-safe')
assert(!/server-deposit|onramp|MoonPay|Crossmint/i.test(source), 'family flow must not call paused real payment endpoints')
assert(/family_note/.test(source) && /family_gift/.test(source), 'family note and gift node kinds must exist')
assert(/noteColor|giftColor|data-kind=.family_note.|data-kind=.family_gift./s.test(source), 'family note and gift nodes must use different related colors')
assert(!/wallet|crypto|blockchain/i.test(source), 'family primary copy must not require crypto knowledge')
assert(/family_contribution_completed/.test(source), 'family flow must log family_contribution_completed for funnel reporting')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-family: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-family')
