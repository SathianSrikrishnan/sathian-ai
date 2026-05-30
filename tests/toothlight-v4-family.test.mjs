import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const familyPagePath = resolve(root, 'src/app/toothlight/t/[id]/family/page.tsx')
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
  [formPath, 'FamilyContributionForm'],
  [orbitPath, 'FamilyNodeOrbit'],
  [routePath, 'family contribution API'],
  [helperPath, 'family contribution helper'],
]) {
  assert(existsSync(path), `${label} must exist`)
}

const source = [familyPagePath, formPath, orbitPath, routePath, helperPath]
  .filter(existsSync)
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n')

assert(/Invite family/.test(source), 'family page must read as an invite step')
assert(/Family note for later/.test(source), 'family flow must label the optional family note clearly')
assert(/Add family note/.test(source), 'family primary CTA must submit the family note path')
assert(/View saved Toothlight/.test(source), 'family completion must offer a return to the saved Toothlight')
assert(/Gift optional/.test(source), 'family flow must frame gift as optional')
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
