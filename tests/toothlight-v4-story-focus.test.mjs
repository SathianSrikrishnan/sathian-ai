import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const makeStylesPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.module.css')
const enhanceClientPath = resolve(root, 'src/lib/toothfairy/enhance-client.ts')
const enhanceRoutePath = resolve(root, 'src/app/api/toothfairy/enhance/route.ts')
const contractPath = resolve(root, 'src/lib/toothlight/product-render-mode.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''
const makeStyles = existsSync(makeStylesPath) ? readFileSync(makeStylesPath, 'utf8') : ''
const enhanceClient = existsSync(enhanceClientPath) ? readFileSync(enhanceClientPath, 'utf8') : ''
const enhanceRoute = existsSync(enhanceRoutePath) ? readFileSync(enhanceRoutePath, 'utf8') : ''
const contract = existsSync(contractPath) ? readFileSync(contractPath, 'utf8') : ''

assert(/type StoryFocusId/.test(makeClient), 'Make draft must define a story-focus mode')
assert(/storyFocus:\s*StoryFocusId/.test(makeClient), 'Make draft must store story focus')
assert(/storyFocus:\s*['"]keeper['"]/.test(makeClient), 'Story focus must default to the story-world interpretation')
assert(/Story focus/.test(makeClient), 'Make UI must expose a compact story-focus control')
for (const label of ['Memory', 'Drawing', 'Story']) {
  assert(makeClient.includes(label), `Story focus control must include ${label}`)
}
assert(/storyFocusControl/.test(makeStyles), 'Make styles must include the story focus segmented control')
assert(/productStoryFocus\?:/.test(enhanceClient), 'Enhance client must send the selected story focus')
assert(/productStoryFocus:\s*draft\.storyFocus/.test(makeClient), 'Make must pass story focus to the AI endpoint')
assert(/productStoryFocus/.test(enhanceRoute), 'Enhance route must read productStoryFocus')
assert(/storyFocus:\s*resolvedProductStoryFocus/.test(enhanceRoute), 'Enhance route must pass story focus to the server prompt')
assert(/storyFocus\?:/.test(contract), 'Product prompt input must accept story focus')
assert(/eyeglasses/i.test(contract), 'Product prompt must explicitly address fake-glasses child drawings')
assert(/literal accessor/i.test(contract), 'Product prompt must prevent child marks from becoming literal accessories')
assert(/createAiRenderReferences/.test(makeClient), 'Make must build AI render references before calling the provider')
assert(/composeStoryMapImage/.test(makeClient), 'Make must compose an abstract story map for story-focused renders')
assert(/abstractDrawingLayerForStory/.test(makeClient), 'Make must abstract the transparent drawing layer for story-focused renders')
assert(/drawingLayerDataUrl:\s*aiReferences\.drawingLayerDataUrl/.test(makeClient), 'AI render must send the prepared drawing reference, not always the raw layer')
assert(/compositionImageDataUrl:\s*aiReferences\.compositionImageDataUrl/.test(makeClient), 'AI render must send the prepared composition reference')
assert(/drawingLayerImageSrc:\s*aiReferences\.finalDrawingLayerDataUrl/.test(makeClient), 'AI final post-processing must use the abstracted story drawing layer')
assert(/Story target/.test(makeClient), 'AI render box must use concise story target copy')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-story-focus: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-story-focus')
