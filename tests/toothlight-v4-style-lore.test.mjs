import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const treatmentsPath = resolve(root, 'src/lib/toothlight/visual-treatments.ts')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const carouselCssPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const treatments = existsSync(treatmentsPath) ? readFileSync(treatmentsPath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''
const carouselCss = existsSync(carouselCssPath) ? readFileSync(carouselCssPath, 'utf8') : ''

for (const field of ['keeperName', 'keeperObject', 'keeperCue', 'storyHref', 'keeperImageSrc', 'keeperImageAlt']) {
  assert(treatments.includes(field), `Light Style catalog must include ${field}`)
}

for (const keeper of ['Tanda', 'Kkachi', 'Anna Bogle', 'Ratoncito Perez', 'Waraba', 'Daga']) {
  assert(treatments.includes(`keeperName: '${keeper}'`), `six styles must map to ${keeper}`)
}

for (const object of [
  'Corn drawing Toothlight',
  'Feather-song line',
  'Clover-gold proof',
  'Stamped receipt',
  'Threshold stone',
  'Moon-calendar pawprints',
]) {
  assert(treatments.includes(object), `style lore must include ${object}`)
}

for (const path of [
  '/toothfairy/story/tanda',
  '/toothfairy/story/korea',
  '/toothfairy/story/anna-bogle',
  '/toothfairy/story/ratoncito-perez',
  '/toothfairy/story/waraba-edge-light',
  '/toothfairy/story/daga-one-year-wish',
]) {
  assert(treatments.includes(path), `style lore must link to ${path}`)
}

assert(/keeperName/.test(carousel), 'Light Style picker must keep keeper names in accessible image labels')
assert(/keeperObject/.test(carousel), 'Light Style picker must keep story objects in accessible image labels')
assert(/keeperCue|storySymbol/.test(carousel), 'Light Style picker must keep keeper cues as visual symbol metadata')
assert(/keeperPortrait|data-keeper|data-symbol/.test(carouselCss + carousel), 'style picker CSS must support keeper portrait chips')
assert(/src=\{treatment\.keeperImageSrc\}/.test(carousel), 'style picker must use real keeper images instead of abstract marker dots')
assert(/styleName/.test(carousel) && /keeperName/.test(carousel), 'style picker must show short visible labels so families know what they are choosing')
assert(!/styleStoryPanel|Open \$\{selectedTreatment\.keeperName\} story|<span className=\{styles\.keeperBadge\}>|keeperMark/.test(carousel), 'style picker must not show lore as text-heavy labels or abstract medallion dots')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-style-lore: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-style-lore')
