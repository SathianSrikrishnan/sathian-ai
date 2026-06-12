import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightCreationFlowClient.tsx')
const savedPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/ToothlightCreationFlowClient.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(clientPath), 'creation flow client must exist')
assert(existsSync(savedPath), 'saved Toothlight client must exist')

const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const saved = existsSync(savedPath) ? readFileSync(savedPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''

assert(client.includes('No cost to create and preserve your Toothlight.'), 'parent gate must say creation/preservation has no cost')
assert(client.includes('Solana minting and wallet gifts are available in the live network path'), 'parent gate must keep Solana as the advanced ownership path')
for (const authOption of ['Sign in with Google', 'Advanced Solana path', 'Advanced wallet and mint path']) {
  assert(client.includes(authOption), `parent gate must show ${authOption}`)
}
assert(!client.includes('Apple'), 'parent gate must not show Apple yet')
assert(!client.includes('Facebook'), 'parent gate must not show Facebook yet')
assert(!client.includes('Connect Solana wallet'), 'parent gate must not make wallet connection the default parent option')
assert(!client.includes('WalletConnect'), 'parent gate must not expose WalletConnect before the advanced app')
assert(!client.includes('media={<ParentBadge />'), 'parent gate must not use the old random parent badge card')
assert(!client.includes('function ParentBadge'), 'old parent badge component should be removed')
assert(!client.includes('footer={<FooterNav activeStep={step} />}'), 'start screen must not show Create/Preview/Saved footer nav')
assert(!client.includes('function FooterNav'), 'Create/Preview/Saved footer nav should be removed from the creation flow')
assert(!client.includes('<span className={styles.eyebrow}>{eyebrow}</span>'), 'flow screens must not render repeated gold eyebrow labels')
assert(client.includes('hideActions'), 'parent gate must be able to hide the bottom Back/Continue action bar')
assert(/aria-label="Parent sign-in options"[\s\S]*Save with a parent/.test(client), 'parent gate must carry its title inside the auth panel')
assert(/title=""[\s\S]*hideCopy[\s\S]*hideActions/.test(client), 'parent gate must hide the bottom Back/Continue action bar')

const drawingGlowOptionsBlock = client.match(/const DRAWING_GLOW_OPTIONS[\s\S]*?\n]\n\nconst TOOTHLIGHT_GLOW_OPTIONS/)?.[0] ?? ''
assert(/soft_glow[\s\S]*storybook_magic/.test(drawingGlowOptionsBlock), 'drawing flow must keep only soft glow and storybook magic')
assert(!/id:\s*'original'/.test(drawingGlowOptionsBlock), 'drawing glow options must not include keep original')
assert(client.includes("draft.sourceMode === 'start_with_photo'"), 'photo source must be treated separately')
assert(client.includes('Create Toothlight using this photo'), 'photo flow must keep the photo without filter choices')
assert(client.includes("enhancementStyle: 'original'"), 'photo flow must preserve the original image as the Toothlight')

assert(!client.includes('What Kai said'), 'preview must not duplicate the child story as a separate Kai section')
assert(!client.includes('Toothlight story'), 'preview must not show a second generated story field')
assert(client.includes('<span>Story</span>'), 'preview should keep one editable story field')

assert(client.includes('Write the message your child can receive around their 10th birthday'), 'parent note must explain the age-10 future-note purpose')
assert(client.includes('What do you want to say then?'), 'parent note must ask the parent what to say in the future')
assert(client.includes('eyebrow="For later"'), 'parent note should avoid the abrupt Parent turn eyebrow')
assert(client.includes('Time-lock for age'), 'unlock selector label should frame the time-lock')

assert(client.includes('title="Seal it"'), 'seal step should use a shorter title')
assert(client.includes('Seal only'), 'seal choice copy should be shorter')
assert(client.includes('Gift later'), 'gift choice should keep money optional and future-facing')
assert(!client.includes('Seal the Toothlight"'), 'seal step should not keep the long title')

assert(!saved.includes('Toothlight time capsule.'), 'saved page should avoid the oversized time-capsule headline')
assert(!saved.includes('Family note + gift'), 'saved page should shorten the family step label')
assert(saved.includes('Saved Toothlight'), 'saved page should use a shorter saved title')
assert(saved.includes('Invite family when ready.'), 'saved page should keep a simple next action')

assert(/authPanel/.test(css), 'parent auth panel styles must exist')
assert(/previewOnlyStory/.test(css), 'single-story preview styles must exist')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-polish-pass: ${failures.length} issue(s)`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('PASS toothlight-v4-polish-pass')
