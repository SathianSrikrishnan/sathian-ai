import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightCreationFlowClient.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/ToothlightCreationFlowClient.module.css')
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const authPath = resolve(root, 'src/lib/toothlight/client/toothlight-auth.ts')
const makePagePath = resolve(root, 'src/app/toothlight/make/page.tsx')
const routeSteps = [
  'start',
  'add-school-drawing',
  'create-source',
  'draw',
  'add-photo',
  'parent-check',
  'glow',
  'story',
  'preview',
  'parent-note',
  'seal',
  'saved',
]
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(clientPath), 'Stitch Toothlight creation flow client must exist')
assert(existsSync(cssPath), 'Stitch Toothlight creation flow styles must exist')

for (const step of routeSteps) {
  const pagePath = resolve(root, `src/app/toothlight/${step}/page.tsx`)
  assert(existsSync(pagePath), `/toothlight/${step} route must exist`)
  if (existsSync(pagePath)) {
    const page = readFileSync(pagePath, 'utf8')
    assert(page.includes('ToothlightCreationFlowClient'), `/toothlight/${step} must render the shared flow client`)
    assert(page.includes(`step="${step}"`), `/toothlight/${step} must pass its route step`)
  }
}

const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''
const localState = existsSync(localStatePath) ? readFileSync(localStatePath, 'utf8') : ''
const auth = existsSync(authPath) ? readFileSync(authPath, 'utf8') : ''
const makePage = existsSync(makePagePath) ? readFileSync(makePagePath, 'utf8') : ''

assert(makePage.includes("redirect('/toothlight/start')"), '/toothlight/make must redirect into the new start flow')
assert(/sourceMode:\s*'school_drawing'\s*\|\s*'draw_on_screen'\s*\|\s*'start_with_photo'\s*\|\s*null/.test(client), 'draft state must model the three Toothlight source paths')
assert(/originalImageUrl:\s*string\s*\|\s*null/.test(client), 'draft state must preserve the original image separately')
assert(/enhancedImageUrl:\s*string\s*\|\s*null/.test(client), 'draft state must store the enhanced Toothlight image separately')
assert(/parentAuthStatus:\s*'anonymous'\s*\|\s*'signed_in'/.test(client), 'draft state must model parent auth status')
assert(/giftSelected:\s*boolean/.test(client) && /giftAmountUsd:\s*number\s*\|\s*null/.test(client), 'draft state must include optional gift fields')
assert(/school_drawing/.test(client) && /draw_on_screen/.test(client) && /start_with_photo/.test(client), 'flow must implement all three source modes')
assert(/DrawingCanvasV2/.test(client), 'draw-on-screen path must use the proven drawing canvas')
assert(/buildToothlightParentAuthUrl/.test(client), 'parent check must route through Google auth helper')
assert(/Sign in with Google/.test(client), 'parent gate must show Google sign-in after the first visual exists')
assert(/No cost to create and preserve your Toothlight\./.test(client), 'parent gate must include no-cost creation and preservation copy')
assert(/Solana minting and wallet gifts are available in the live network path/.test(client), 'parent gate must keep Solana ownership as an advanced path')
assert(/returnTo=\/toothlight\/seal/.test(client), 'anonymous seal entry must return to seal after parent check')
assert(/if \(!hasOriginalImage\)[\s\S]*router\.replace\('\/toothlight\/start'\)/.test(client), 'guard must send users without a first visual back to start')
assert(/if \(!isParentSignedIn && \(\s*step === 'glow' \|\| step === 'seal'\s*\)\)[\s\S]*router\.replace/.test(client), 'glow and seal routes must be guarded by parent auth state')
for (const text of [
  'Start a Toothlight',
  'Turn a tooth photo, drawing, or child story into a future asset they can grow into.',
  'Tap to frame drawing',
  'Create from scratch',
  'Draw your Toothlight',
  'Add a photo',
  'Save with a parent',
  'Create a Toothlight',
  'Tell the story',
  'Future note',
  'Seal it',
  'Saved',
  'Soft glow',
  'Storybook magic',
  'Story',
  'Seal only',
  'Gift later',
  'Parent-controlled. Solana-backed ownership layer.',
]) {
  assert(client.includes(text), `flow client must include "${text}"`)
}
assert(client.indexOf('Parent-controlled. Solana-backed ownership layer.') > client.indexOf('Seal it'), 'Solana trust line must only appear in the parent-facing seal/saved layer')
assert(/VoiceAssistField/.test(client), 'story step must support voice dictation')
assert(/createStorySummary/.test(client), 'preview must show a cleaned-up story summary')
assert(/sourceImageSrc:\s*draft\.originalImageUrl/.test(client), 'save payload must send the original image as sourceImageSrc')
assert(/renderedImageSrc:\s*finalImageUrl/.test(client), 'save payload must save the final Toothlight image file')
assert(/aiRenderedImageSrc:\s*draft\.enhancedImageUrl/.test(client), 'save payload must carry enhanced image separately when present')
assert(/saveLocalToothlight/.test(client), 'local preview must still save an end-to-end Toothlight')
assert(/NEXT_PUBLIC_TEST_MODE/.test(auth), 'local production previews must support explicit test-mode parent auth bypass')
assert(/originalImageUrl/.test(localState), 'draft media storage must persist originalImageUrl through Google sign-in')
assert(/enhancedImageUrl/.test(localState), 'draft media storage must persist enhancedImageUrl through Google sign-in')
assert(/bottomBar/.test(css), 'mobile flow must use a bottom action bar')
assert(/grid-template-columns:\s*repeat\(2/.test(css), 'drawing glow choices must present two visible choices')
assert(!/connect wallet/i.test(client), 'child flow must avoid connect-wallet language')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-stitch-flow: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-stitch-flow')
