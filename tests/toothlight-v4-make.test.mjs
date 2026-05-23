import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/toothlight/make/page.tsx')
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const previewPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const page = readFileSync(pagePath, 'utf8')
const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''

assert(page.includes('ToothlightMakeClient'), '/toothlight/make must use the V4 client component')
assert(existsSync(clientPath), 'ToothlightMakeClient must exist')
assert(existsSync(carouselPath), 'LightStyleCarousel must exist')
assert(existsSync(previewPath), 'ToothlightPreview must exist')
assert(
  /DrawingCanvasV2/.test(client),
  'creation shell must import or wrap DrawingCanvasV2',
)
assert(client.includes('LightStyleCarousel'), 'creation shell must use LightStyleCarousel')
assert(client.includes('ToothlightPreview'), 'creation shell must use ToothlightPreview')
assert(
  client.includes('TOOTHLIGHT_DRAFT_STORAGE_KEY') || client.includes('toothlight:v4:draft'),
  'creation shell must store V4 draft under a Toothlight-specific localStorage key',
)
assert(
  /Save this Toothlight/.test(client),
  'primary save CTA must say Save this Toothlight',
)
assert(
  !/Continue with Google/.test(client.split('Save this Toothlight')[0] ?? ''),
  'creation must happen before Google/account language appears',
)
assert(/Add photo or drawing/.test(client), 'photo/drawing must be the first creation step')
assert(!/Create the glow first/.test(client), 'make flow must no longer start with the old glow-first headline')
assert(/Choose a Light Style/.test(client), 'UI must rename glow filters to Light Styles')
assert(/treatmentId/.test(client), 'draft must store selected treatmentId')
assert(/renderedImageSrc/.test(client), 'draft must include the rendered Toothlight preview image')
assert(/captureToothlightPreviewImage/.test(client), 'save flow must capture the visual preview before saving')
assert(/sourceImageSrc/.test(client), 'draft must preserve the original/source image')
assert(/MAX_SOURCE_IMAGE_SIDE/.test(client), 'uploaded images must be resized before save')
assert(/toDataURL\('image\/jpeg'/.test(client), 'source and rendered images must be compressed before save')
assert(/readSaveResponse/.test(client), 'save flow must handle non-JSON platform errors cleanly')
assert(/logToothlightClientEvent/.test(client), 'make flow must log funnel events')
assert(/make_step_viewed|source_added|treatment_selected|story_completed|save_clicked/i.test(client), 'make flow must log creation funnel milestones')
assert(/LIGHT_STYLE_TREATMENTS|getRecommendedLightStyle/.test(carousel), 'LightStyleCarousel must use deterministic Light Style catalog')

const saveFetchBody = client.match(/fetch\('\/api\/toothlight\/save'[\s\S]*?body: JSON\.stringify\(\{([\s\S]*?)\}\),\n\s*\}\)/)?.[1] ?? ''
assert(saveFetchBody.includes('sourceImageSrc'), 'save request must include the compressed source image')
assert(saveFetchBody.includes('renderedImageSrc'), 'save request must include the compressed rendered image')
assert(!/\bimageSrc:/.test(saveFetchBody), 'save request must not duplicate the rendered image as imageSrc')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-make: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-make')
