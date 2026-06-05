import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const makeStylesPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.module.css')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const carouselStylesPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''
const makeStyles = existsSync(makeStylesPath) ? readFileSync(makeStylesPath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''
const carouselStyles = existsSync(carouselStylesPath) ? readFileSync(carouselStylesPath, 'utf8') : ''

assert(/MAKE_FLOW_STEPS/.test(makeClient), 'Make page must define a simple reusable flow model')
assert(/Toothlight creation progress/.test(makeClient), 'Make page must expose an accessible progress rail')
for (const label of ['Memory', 'Style', 'Story', 'Seal']) {
  assert(makeClient.includes(label), `Make progress rail must include ${label}`)
}
assert(/nextAction/.test(makeClient), 'Make page must compute the next action instead of relying on scattered copy')
assert(/flowRail/.test(makeClient + makeStyles), 'Make page must render and style the progress rail')
assert(/flowStep/.test(makeClient + makeStyles), 'Make progress rail must style individual steps')
assert(/nextActionCard/.test(makeClient + makeStyles), 'Make page must show the current next action')

assert(/selectedTreatment/.test(carousel), 'Style picker must expose selected style details')
assert(/keeperPortrait/.test(carousel + carouselStyles), 'Style picker must move lore into real keeper image chips')
assert(/objectImage/.test(carousel + carouselStyles), 'Style picker must use product object images as the main tile visual')
assert(/styleName/.test(carousel + carouselStyles), 'Style picker must keep one visible style label per image tile')
assert(/keeperName/.test(carousel + carouselStyles), 'Style picker must keep one visible keeper label per image tile')
assert(/storyHref/.test(carousel), 'Style picker must retain story source metadata for accessible labels')
assert(!/styleStoryPanel/.test(carousel + carouselStyles), 'Style picker must remove the selected-style text panel')
assert(!/min-height:\s*10\.6rem/.test(carouselStyles), 'Style options should no longer be tall lore cards')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-ux-simplification: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-ux-simplification')
