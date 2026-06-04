import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/toothlight/make/page.tsx')
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const editorPath = resolve(root, 'src/components/toothlight/v4/ToothlightMemoryEditor.tsx')
const drawingCanvasPath = resolve(root, 'src/components/toothfairy/app/drawing-canvas-v2.tsx')
const carouselPath = resolve(root, 'src/components/toothlight/v4/LightStyleCarousel.tsx')
const previewPath = resolve(root, 'src/components/toothlight/v4/ToothlightPreview.tsx')
const productRenderContractPath = resolve(root, 'src/lib/toothlight/product-render-mode.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const page = readFileSync(pagePath, 'utf8')
const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const editor = existsSync(editorPath) ? readFileSync(editorPath, 'utf8') : ''
const drawingCanvas = existsSync(drawingCanvasPath) ? readFileSync(drawingCanvasPath, 'utf8') : ''
const carousel = existsSync(carouselPath) ? readFileSync(carouselPath, 'utf8') : ''
const productRenderContract = existsSync(productRenderContractPath)
  ? readFileSync(productRenderContractPath, 'utf8')
  : ''
const makeProductSurface = `${client}\n${productRenderContract}`

assert(page.includes('ToothlightMakeClient'), '/toothlight/make must use the V4 client component')
assert(existsSync(clientPath), 'ToothlightMakeClient must exist')
assert(existsSync(editorPath), 'ToothlightMemoryEditor must exist')
assert(existsSync(carouselPath), 'LightStyleCarousel must exist')
assert(existsSync(previewPath), 'ToothlightPreview must exist')
assert(
  /ToothlightMemoryEditor/.test(client),
  'creation shell must use the ToothlightMemoryEditor as the primary media step',
)
assert(
  /DrawingCanvasV2/.test(editor),
  'ToothlightMemoryEditor must wrap the proven live DrawingCanvasV2 interaction',
)
assert(client.includes('LightStyleCarousel'), 'creation shell must use LightStyleCarousel')
assert(client.includes('ToothlightPreview'), 'creation shell must use ToothlightPreview')
assert(
  client.includes('TOOTHLIGHT_DRAFT_STORAGE_KEY') || client.includes('toothlight:v4:draft'),
  'creation shell must store V4 draft under a Toothlight-specific localStorage key',
)
assert(
  /if \(!draftRestored\) return\s*void saveToothlightDraftToBrowser\(draft\)[\s\S]*\}, \[draft, draftRestored\]\)/.test(client),
  'creation shell must not overwrite a stored draft before restoration finishes',
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
assert(!/Draw instead/.test(client), 'drawing must not be treated as a fallback after photo upload')
assert(!/<p className=\{styles\.eyebrow\}>Make the memory<\/p>/i.test(editor), 'memory editor must remove the redundant MAKE THE MEMORY eyebrow')
assert(!/<h1>Add the tooth\.<\/h1>/i.test(editor), 'memory editor must remove the redundant Add the tooth headline')
assert(/anything you want to create/.test(editor), 'studio copy must invite child creativity beyond a narrow tooth photo')
assert(/enhance it with an AI filter/.test(editor), 'studio copy must make the AI filter promise visible from the start')
assert(/studioStyleDock/.test(client), 'Light Styles and AI render must live inside the main studio surface')
assert(!/aria-label="Choose a Light Style"/.test(client), 'Light Styles must not be split into a separate phase panel')
assert(!/Creation progress/.test(client), 'make flow must not expose segmented Photo/Style/Story phase controls')
assert(!/CreationStep|activeStep|setActiveStep/.test(client), 'make flow should behave like one studio, not a hidden segmented wizard')
assert(/Draw on the photo|Open the drawing studio/.test(editor), 'editor must invite drawing over the photo')
assert(/Choose photo/.test(editor) && /Camera/.test(editor), 'editor must expose photo library and live camera capture')
assert(/capture=['"]environment['"]/.test(editor), 'editor camera input must support live photo capture')
assert(/initialBackground=\{/.test(editor), 'editor must load the photo as the drawing canvas background')
assert(/strokeCountRef\.current = 0[\s\S]*setHasStrokes\(false\)/.test(drawingCanvas), 'photo backgrounds must not count as child drawing strokes')
assert(/onPhotoFile/.test(editor), 'editor must pass selected photos back to the V4 draft')
assert(/onArtworkReady/.test(editor), 'editor must export the photo-plus-drawing composite')
assert(/selectedTreatment/.test(editor), 'editor must receive selected Light Style metadata for themed brush controls')
assert(!/AI filter studio|Choose a Light Style|AI creates a story object from the memory and drawing|Story target|Story focus/.test(client), 'style and AI render surface must remove visible explanatory copy')
assert(/toothlightProductRenderContract/.test(client), 'make flow must use the shared product render contract')
assert(/3D Toothlight Charm/.test(makeProductSurface), 'make flow must expose the approved 3D Toothlight Charm render path')
assert(/original photo and drawing stay saved/i.test(makeProductSurface), 'make flow must tell parents the original photo and drawing stay saved')
assert(/Make it a Toothlight/.test(makeProductSurface), 'make flow must expose a child-friendly AI action label')
assert(/Preview AI final/.test(client), 'make flow must expose one simple AI preview action')
assert(/callEnhance/.test(client), 'make flow must call the AI render client for optional final output')
assert(/promptOverride/.test(client), 'make flow must send the approved product prompt contract to the AI render endpoint')
assert(/buildToothlightProductPrompt/.test(client), 'make flow must include product guardrails through the shared AI render prompt builder')
assert(/childLabel/.test(client) && /productRenderModeId/.test(client), 'make flow must use product contract labels and approved render mode')
assert(/aiRenderState/.test(client), 'make flow must track AI render state')
assert(/aiRenderedImageSrc/.test(client), 'draft must keep AI-rendered final image separately from the source')
assert(/photoImageSrc/.test(client), 'draft must preserve the original photo separately')
assert(/artworkImageSrc/.test(client), 'draft must keep the photo-plus-drawing composite separately')
assert(/drawingLayerImageSrc/.test(client), 'draft must keep the transparent child drawing layer separately')
assert(/drawingLayerDataUrl/.test(drawingCanvas), 'drawing canvas must export a transparent drawing layer')
assert(/layerCanvasRef/.test(drawingCanvas), 'drawing canvas must draw child marks on a separate layer canvas')
assert(/onArtworkReady\(dataUrl,\s*layers/.test(editor), 'memory editor must forward layered artwork exports')
assert(/getCreationImageSrc/.test(client), 'make flow must render and enhance the current creative composite')
assert(/treatmentId/.test(client), 'draft must store selected treatmentId')
assert(/renderedImageSrc/.test(client), 'draft must include the rendered Toothlight preview image')
assert(/captureToothlightPreviewImage/.test(client), 'save flow must capture the visual preview before saving')
assert(/sourceImageSrc/.test(client), 'draft must preserve the original/source image')
assert(/MAX_SOURCE_IMAGE_SIDE/.test(client), 'uploaded images must be resized before save')
assert(/toDataURL\('image\/jpeg'/.test(client), 'source and rendered images must be compressed before save')
assert(/readSaveResponse/.test(client), 'save flow must handle non-JSON platform errors cleanly')
assert(/logToothlightClientEvent/.test(client), 'make flow must log funnel events')
for (const eventName of [
  'photo_added',
  'style_previewed',
  'ai_render_started',
  'ai_render_completed',
  'save_attempted',
  'auth_started',
  'save_completed',
]) {
  assert(client.includes(eventName), `make flow must log ${eventName}`)
}
assert(/reason:\s*['"]ai_render['"]/.test(client), 'AI render auth gate must log auth_started with reason ai_render')
assert(/sourceImageDataUrl:\s*draft\.photoImageSrc/.test(client), 'AI render must send the real photo layer when available')
assert(/drawingLayerDataUrl:\s*draft\.drawingLayerImageSrc/.test(client), 'AI render must send the transparent drawing layer when available')
assert(/compositionImageDataUrl:\s*imageForAiRender/.test(client), 'AI render must send the flattened composition as placement reference')
assert(/layerMode:\s*['"]layered['"]/.test(client), 'AI render events must distinguish layered render attempts')
assert(/composeLayerAwareAiFinal/.test(client), 'AI final must post-process with the child drawing layer so marks cannot disappear')
assert(/drawingLayerImageSrc:\s*draft\.drawingLayerImageSrc/.test(client), 'AI final post-processing must receive the transparent drawing layer')
assert(/treatmentId:\s*draft\.treatmentId/.test(client), 'AI final post-processing must use the selected Light Style')
assert(/drawAiFinalPhotoTreatment/.test(client), 'AI final post-processing must add a meaningful whole-photo finish after provider render')
assert(/drawInterpretedDrawingLayer/.test(client), 'AI final post-processing must restyle child marks instead of pasting raw strokes unchanged')
assert(!/context\.globalAlpha\s*=\s*0\.86[\s\S]*context\.drawImage\(drawingLayer/.test(client), 'AI final must not paste the raw drawing layer back at near-full opacity')
assert(/render=1/.test(client), 'AI render auth return path must preserve the intent to render after Google sign-in')
assert(/LIGHT_STYLE_TREATMENTS|getRecommendedLightStyle/.test(carousel), 'LightStyleCarousel must use deterministic Light Style catalog')

const saveFetchBody = client.match(/fetch\('\/api\/toothlight\/save'[\s\S]*?body: JSON\.stringify\(\{([\s\S]*?)\}\),\n\s*\}\)/)?.[1] ?? ''
assert(saveFetchBody.includes('sourceImageSrc'), 'save request must include the compressed source image')
assert(saveFetchBody.includes('renderedImageSrc'), 'save request must include the compressed rendered image')
assert(saveFetchBody.includes('aiRenderedImageSrc'), 'save request must include the optional AI-rendered image field')
assert(saveFetchBody.includes('drawingLayerImageSrc'), 'save request must include the transparent drawing layer field')
assert(!/\bimageSrc:/.test(saveFetchBody), 'save request must not duplicate the rendered image as imageSrc')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-make: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-make')
