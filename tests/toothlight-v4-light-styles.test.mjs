import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const treatmentPath = resolve(root, 'src/lib/toothlight/visual-treatments.ts')
const previewPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.tsx')
const previewCssPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.module.css')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const carouselCssPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const path of [treatmentPath, previewPath, previewCssPath, carouselPath, carouselCssPath]) {
  assert(existsSync(path), `${path.replace(root, '.')} must exist`)
}

const catalog = existsSync(treatmentPath) ? readFileSync(treatmentPath, 'utf8') : ''
const preview = existsSync(previewPath) ? readFileSync(previewPath, 'utf8') : ''
const previewCss = existsSync(previewCssPath) ? readFileSync(previewCssPath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''
const carouselCss = existsSync(carouselCssPath) ? readFileSync(carouselCssPath, 'utf8') : ''

for (const label of ['Keepsake Glow', 'Nightlight', 'Storybook Ink', 'Lucky Penny', 'Confetti Light']) {
  assert(catalog.includes(label), `catalog must include ${label}`)
}

for (const token of [
  'LIGHT_STYLE_TREATMENTS',
  'getLightStyle',
  'getRecommendedLightStyle',
  'cssClass',
  'accent',
  'secondaryAccent',
]) {
  assert(catalog.includes(token), `catalog must include ${token}`)
}

assert(/treatmentId/.test(preview), 'ToothlightPreview must accept a selected treatmentId')
assert(/getLightStyle/.test(preview), 'ToothlightPreview must resolve selected style metadata')
assert(/data-treatment/.test(preview), 'ToothlightPreview must expose selected style for rendering/tests')
assert(/sourceImageSrc/.test(preview), 'ToothlightPreview must render the original/source image')
assert(/renderTargetRef/.test(preview), 'ToothlightPreview must expose a render target ref for export')
assert(/mix-blend-mode|filter:|backdrop-filter|radial-gradient/i.test(previewCss), 'preview CSS must apply meaningful visual treatment effects')
assert(/prefers-reduced-motion/.test(previewCss), 'preview CSS must include reduced-motion handling')
assert(/LIGHT_STYLE_TREATMENTS/.test(carousel), 'LightStyleCarousel must use the shared treatment catalog')
assert(/aria-pressed/.test(carousel), 'LightStyleCarousel must expose selected state accessibly')
assert(/data-treatment/.test(carousel), 'LightStyleCarousel buttons must expose treatment ids')
assert(/grid-auto-flow|overflow-x|scroll-snap/i.test(carouselCss), 'carousel CSS must be mobile-first horizontal selection')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-light-styles: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-light-styles')
