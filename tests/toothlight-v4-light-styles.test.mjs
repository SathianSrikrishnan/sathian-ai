import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const treatmentPath = resolve(root, 'src/lib/toothlight/visual-treatments.ts')
const previewPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.tsx')
const previewCssPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.module.css')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const carouselCssPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.module.css')
const magicStudioPath = resolve(root, 'src/lib/toothfairy/magic-studio.ts')
const aiEnhancePath = resolve(root, 'src/lib/toothfairy/ai-enhance.ts')
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
const magicStudio = existsSync(magicStudioPath) ? readFileSync(magicStudioPath, 'utf8') : ''
const aiEnhance = existsSync(aiEnhancePath) ? readFileSync(aiEnhancePath, 'utf8') : ''

for (const label of [
  'Golden Locket',
  'Moon Window',
  'Storybook Velvet',
  'Rainbow Room',
  'Pillow Spark',
  'Family Lantern',
]) {
  assert(catalog.includes(label), `catalog must include ${label}`)
}

for (const oldLabel of ['Keepsake Glow', 'Lucky Penny', 'Confetti Light']) {
  assert(!catalog.includes(`label: '${oldLabel}'`), `catalog must move beyond old ${oldLabel} label`)
}

for (const token of [
  'LIGHT_STYLE_TREATMENTS',
  'getLightStyle',
  'getRecommendedLightStyle',
  'cssClass',
  'effectClass',
  'accent',
  'secondaryAccent',
  'aiStyleId',
  'visualPromise',
  'preservationRule',
  'texture',
  'photoEffect',
  'drawingEffect',
  'aiTransformationBrief',
  'renderIntensity',
  'storySymbol',
  'keeperImageSrc',
  'keeperImageAlt',
  'keeperImageFocus',
  'cssFilter',
  'canvasFilter',
  'brushAccent',
  'brushSecondaryAccent',
]) {
  assert(catalog.includes(token), `catalog must include ${token}`)
}

assert(/treatmentId/.test(preview), 'ToothlightPreview must accept a selected treatmentId')
assert(/getLightStyle/.test(preview), 'ToothlightPreview must resolve selected style metadata')
assert(/data-treatment/.test(preview), 'ToothlightPreview must expose selected style for rendering/tests')
assert(/data-effect/.test(preview), 'ToothlightPreview must expose the selected effect recipe')
assert(/sourceImageSrc/.test(preview), 'ToothlightPreview must render the original/source image')
assert(/aiImageSrc/.test(preview), 'ToothlightPreview must support an optional AI-rendered final image')
assert(/renderTargetRef/.test(preview), 'ToothlightPreview must expose a render target ref for export')
assert(/beforeAfter|originalChip|aiFinal/i.test(preview + previewCss), 'preview must explain source-preserving before/after state')
assert(/mix-blend-mode|filter:|backdrop-filter|radial-gradient/i.test(previewCss), 'preview CSS must apply meaningful visual treatment effects')
assert(/textureLayer|lightBloom|memoryFrame|symbolLayer/i.test(previewCss), 'preview CSS must include texture, bloom, frame, and story-symbol treatment layers')
assert(/photoEffectLayer|materialLayer|drawingInterpretation/i.test(preview + previewCss), 'preview must have explicit photo, material, and drawing-interpretation treatment layers')
assert(/style=\{\{[\s\S]*filter:\s*treatment\.cssFilter/.test(preview), 'preview must apply per-style photo filters, not one generic image filter')
assert(/data-symbol/.test(preview), 'preview must expose story-symbol metadata for branded overlays')
assert(/aiFinal[\s\S]*symbolLayer[\s\S]*(display:\s*none|opacity:\s*0)/i.test(previewCss), 'AI final must not add giant decorative symbols on top of the rendered image')
assert(/prefers-reduced-motion/.test(previewCss), 'preview CSS must include reduced-motion handling')
assert(/LIGHT_STYLE_TREATMENTS/.test(carousel), 'LightStyleCarousel must use the shared treatment catalog')
assert(/aria-pressed/.test(carousel), 'LightStyleCarousel must expose selected state accessibly')
assert(/data-treatment/.test(carousel), 'LightStyleCarousel buttons must expose treatment ids')
assert(/visualPromise/.test(carousel), 'LightStyleCarousel must keep the visual promise in accessible labels')
assert(/keeperPortrait/.test(carousel + carouselCss), 'LightStyleCarousel must render real keeper portrait chips')
assert(/src=\{treatment\.keeperImageSrc\}/.test(carousel), 'LightStyleCarousel must use keeper images from the catalog')
assert(/styleName/.test(carousel + carouselCss), 'LightStyleCarousel must show one visible style label')
assert(/keeperName/.test(carousel + carouselCss), 'LightStyleCarousel must show one visible keeper label')
assert(/aria-label=\{`\$\{treatment\.label\}/.test(carousel), 'LightStyleCarousel must keep rich style names in accessible labels')
assert(!/styleStoryPanel|Open \$\{selectedTreatment\.keeperName\} story|<p|visualPromise\}<\/span>/.test(carousel), 'LightStyleCarousel must remove text-heavy lore panels and paragraphs')
assert(/grid-auto-flow|overflow-x|scroll-snap/i.test(carouselCss), 'carousel CSS must be mobile-first horizontal selection')

const keeperImageSrcs = [...catalog.matchAll(/keeperImageSrc:\s*'([^']+)'/g)].map((match) => match[1])
assert(keeperImageSrcs.length >= 6, 'each Light Style must have a keeper image source')
for (const imageSrc of keeperImageSrcs) {
  assert(existsSync(resolve(root, `public${imageSrc}`)), `keeper image must exist: ${imageSrc}`)
}
assert(/source photo|real photo/i.test(magicStudio), 'AI render prompt must preserve source photo language')
assert(/face identity|camera angle|child marks/i.test(magicStudio), 'AI render prompt must preserve identity, camera angle, and child marks')
assert(/reinterpret child marks|restyle child marks|restyle handwriting/i.test(magicStudio), 'AI prompt must ask the model to restyle child marks instead of freezing them')
assert(/treatment-specific transformation contract|photo effect|drawing effect|transformation brief/i.test(magicStudio), 'AI prompt must include a treatment-specific transformation contract')
assert(/not pixel-perfect|not pasted back|not keep.*pixel/i.test(magicStudio), 'AI prompt must explicitly avoid pixel-exact line preservation')
assert(/whole picture changes|global image edit|transform the whole image/i.test(magicStudio), 'AI prompt must request a meaningful whole-image edit')
assert(!/Keep every existing child or parent drawing mark exactly/i.test(magicStudio), 'AI prompt must not preserve drawing marks exactly')
assert(!/transform the drawing into a 3D cartoon/i.test(magicStudio), 'AI render styles must not ask to replace the memory with generic cartoon output')
assert(/reinterpret child marks|restyle handwriting|restyle child marks/i.test(aiEnhance), 'AI fallback prompt must restyle drawing marks too')
assert(/global image edit|whole picture changes|whole image/i.test(aiEnhance), 'AI fallback prompt must ask for whole-image transformation')
assert(!/Keep every existing child or parent drawing mark exactly/i.test(aiEnhance), 'AI fallback prompt must not preserve drawing marks exactly')
assert(/guidance_scale:\s*(6|7|8)/.test(aiEnhance), 'AI render should use stronger guidance for visible style transformation')
assert(/MAGIC_LAYERED_MODEL/.test(magicStudio), 'Magic Studio must define a dedicated layer-aware model')
assert(/fal-ai\/flux-pro\/kontext\/multi/.test(magicStudio + aiEnhance), 'layer-aware AI render must use the multi-image Kontext endpoint')
assert(/layerMode/.test(magicStudio + aiEnhance), 'AI prompt/build path must know when it is rendering with separate layers')
assert(/transparent child drawing layer/i.test(magicStudio), 'layer-aware prompt must name the transparent child drawing layer')
assert(/flattened composition/i.test(magicStudio), 'layer-aware prompt must use the flattened composition as placement reference')
assert(/image_urls/.test(aiEnhance), 'layer-aware render must send multiple input images')
assert(/image 1 is the flattened composition/i.test(magicStudio), 'layer-aware prompt must make the drawing-on-photo composition the primary image')
assert(/image 2 is the real source photo/i.test(magicStudio), 'layer-aware prompt must use the source photo as identity reference')
assert(/image 3 is a transparent child drawing layer/i.test(magicStudio), 'layer-aware prompt must use the drawing layer as the mark reference')
assert(
  /image_urls:\s*\[\s*compositionImageForLayer,\s*sourceImageForLayer,\s*drawingLayerForLayer\s*\]/.test(aiEnhance),
  'layer-aware render must send composition first, source photo second, and drawing layer third',
)
assert(/sourceImageDataUrl/.test(aiEnhance), 'AI enhance server must accept the real source photo layer')
assert(/drawingLayerDataUrl/.test(aiEnhance), 'AI enhance server must accept the transparent drawing layer')
assert(/compositionImageDataUrl/.test(aiEnhance), 'AI enhance server must accept the flattened composition layer')
assert(/image_url:\s*req\.imageDataUrl/.test(aiEnhance), 'single-image fallback must still use image_url for photo-only or drawing-only input')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-light-styles: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-light-styles')
