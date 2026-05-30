import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const treatmentsPath = resolve(root, 'src/lib/toothlight/visual-treatments.ts')
const contractPath = resolve(root, 'src/lib/toothlight/product-render-mode.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const enhanceClientPath = resolve(root, 'src/lib/toothfairy/enhance-client.ts')
const enhanceRoutePath = resolve(root, 'src/app/api/toothfairy/enhance/route.ts')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const treatments = existsSync(treatmentsPath) ? readFileSync(treatmentsPath, 'utf8') : ''
const contract = existsSync(contractPath) ? readFileSync(contractPath, 'utf8') : ''
const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''
const enhanceClient = existsSync(enhanceClientPath) ? readFileSync(enhanceClientPath, 'utf8') : ''
const enhanceRoute = existsSync(enhanceRoutePath) ? readFileSync(enhanceRoutePath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''

for (const field of [
  'objectForm',
  'compositionDirective',
  'drawingIntegration',
  'storyMotifs',
  'fairyCarryCue',
]) {
  assert(treatments.includes(field), `Light Styles must define ${field}`)
  assert(contract.includes(field), `product prompt contract must accept ${field}`)
}

for (const phrase of [
  'round gold locket pendant',
  'frosted moon-window nightlight',
  'storybook page charm',
  'transparent tooth-shaped acrylic charm',
  'stitched pillow badge',
  'folded family lantern',
]) {
  assert(treatments.includes(phrase), `Light Style object forms must include ${phrase}`)
}

for (const phrase of [
  'Tanda',
  'Kkachi',
  'Daga',
  'mouse tracks',
  'magpie feather',
  'note ribbon',
]) {
  assert(treatments.includes(phrase), `Light Style story motifs must include ${phrase}`)
}

assert(/selected Light Style must produce a different physical silhouette/i.test(contract), 'prompt must force distinct physical silhouettes')
assert(/Do not reuse the round locket/i.test(contract), 'prompt must prevent every render from becoming a locket')
assert(/child drawing layer as structural information/i.test(contract), 'prompt must make drawings structural, not decorative')
assert(/productStyleId\?:\s*string/.test(enhanceClient), 'enhance client must send Toothlight product style id')
assert(/productCreativePass\?:\s*number/.test(enhanceClient), 'enhance client must send the creative pass count')
assert(/productStyleId:\s*treatment\.id/.test(makeClient), 'Make must send selected Toothlight style id to the server')
assert(/productCreativePass:\s*draft\.aiRenderOptions\.length \+ 1/.test(makeClient), 'Make must send creative pass count')
assert(/getLightStyle/.test(enhanceRoute), 'enhance route must validate selected Toothlight style server-side')
assert(/productStyleId/.test(enhanceRoute), 'enhance route must read productStyleId')
assert(/productCreativePass/.test(enhanceRoute), 'enhance route must read productCreativePass')
assert(/objectForm:\s*productStyle\.objectForm/.test(enhanceRoute), 'server product prompt must use selected style object form')
assert(/drawingIntegration:\s*productStyle\.drawingIntegration/.test(enhanceRoute), 'server product prompt must use drawing integration')
assert(/storyMotifs:\s*productStyle\.storyMotifs/.test(enhanceRoute), 'server product prompt must use story motifs')
assert(/objectForm/.test(carousel), 'Light Style picker must show object form')
assert(/fairyCarryCue/.test(makeClient), 'Make UI must show how the object joins the story world')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-object-diversity: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-object-diversity')
