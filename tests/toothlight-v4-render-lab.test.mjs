import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/toothlight/render-lab/page.tsx')
const componentPath = resolve(root, 'src/components/toothlight/v4/ToothlightRenderLab.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/ToothlightRenderLab.module.css')
const dataPath = resolve(root, 'src/lib/toothlight/render-lab.ts')
const docPath = resolve(root, 'docs/toothlight/v4/07-render-lab-workstream.md')
const enhanceRoutePath = resolve(root, 'src/app/api/toothfairy/enhance/route.ts')
const enhanceLibPath = resolve(root, 'src/lib/toothfairy/ai-enhance.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const page = existsSync(pagePath) ? readFileSync(pagePath, 'utf8') : ''
const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''
const data = existsSync(dataPath) ? readFileSync(dataPath, 'utf8') : ''
const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : ''
const enhanceRoute = existsSync(enhanceRoutePath) ? readFileSync(enhanceRoutePath, 'utf8') : ''
const enhanceLib = existsSync(enhanceLibPath) ? readFileSync(enhanceLibPath, 'utf8') : ''

assert(existsSync(pagePath), '/toothlight/render-lab route must exist')
assert(existsSync(componentPath), 'ToothlightRenderLab component must exist')
assert(existsSync(cssPath), 'ToothlightRenderLab CSS module must exist')
assert(existsSync(dataPath), 'render lab mode data must exist')
assert(existsSync(docPath), 'render lab workstream doc must exist')
assert(page.includes('ToothlightRenderLab'), 'route must render the lab component')
assert(page.includes('metadata'), 'route must define metadata')

for (const mode of ['memory-polish', 'story-artifact', 'future-glow', 'smile-wish']) {
  assert(data.includes(mode), `render mode ${mode} must be defined`)
  assert(component.includes(mode) || component.includes('renderLabModes'), `component must expose ${mode}`)
  assert(css.includes(mode), `CSS must include material treatment for ${mode}`)
}

for (const label of ['Memory Polish', 'Story Artifact', 'Future Glow', 'Smile Wish']) {
  assert(data.includes(label), `render mode label "${label}" must be present`)
}

assert(/preserve child identity/i.test(data), 'mode data must include child identity preservation language')
assert(/original memory/i.test(data), 'mode data must include original-memory preservation language')
assert(/not .*future face prediction/i.test(data), 'Future Glow must reject future-face prediction claims')
assert(/not .*dental prediction/i.test(data), 'Smile Wish must reject dental prediction claims')
assert(/drawing.*interpreted/i.test(data), 'mode prompts must require drawings to be interpreted, not pasted')
assert(/generic filters|stickers|simple overlays/i.test(data), 'mode prompts must reject generic filters, stickers, or simple overlays')

for (const requiredUi of [
  'sourcePhoto',
  'drawingLayer',
  'promptPanel',
  'finalImage',
  'modeSelector',
  'renderLabModes.map',
  'handleLocalSourceUpload',
  'handleLocalDrawingUpload',
  'referenceBoard',
  'approvalRound',
  'roadmapSection',
  'promptDetails',
  'usagePanel',
  'stageRenderRound',
  'isReadyToStage',
  'drawingCanvasRef',
  'handleDrawingPointerDown',
  'handleDrawingPointerMove',
  'handleDrawingPointerUp',
  'clearCanvasDrawing',
  'publishCanvasDrawing',
  'renderSelectedMode',
  'callEnhance',
  'createCompositionDataUrl',
  'renderedImages',
  'renderStatus',
]) {
  assert(component.includes(requiredUi), `render lab component must include ${requiredUi}`)
}

assert(/Source photo/.test(component), 'lab must label the source photo panel')
assert(/Drawing layer/.test(component), 'lab must label the drawing layer panel')
assert(/Render prompt/.test(component), 'lab must label the prompt panel')
assert(/Final image/.test(component), 'lab must label the final image panel')
assert(/side-by-side/i.test(component), 'lab copy must state the side-by-side comparison purpose')
assert(/renderLabSourceCandidates/.test(component), 'lab must expose controlled source candidates')
assert(/setActiveSourceId/.test(component), 'lab must let the reviewer change source candidates')
assert(/Local plain JPG/.test(component), 'lab must let the reviewer load a local plain source JPG')
assert(/Local drawing layer/.test(component), 'lab must let the reviewer load a local drawing layer')
assert(/plainSource/.test(data), 'source candidates must mark whether the source is plain')
assert(!data.includes('/v3/memories/wiggly-two-weeks.png'), 'Input 1 must not use a pre-annotated memory image')
assert(/temporary stand-in/i.test(data), 'lab must clearly label non-real-photo source placeholders')
assert(/recommendedDecisionPath/.test(data), 'lab must include an explicit recommendation path')
assert(/Approve|Reject|Need real photo/i.test(data), 'recommendations must support approval decisions')
assert(/renderModeOutputGrid/.test(component), 'lab must show all four output options together')
assert(/Current recommendation/.test(component), 'lab must show a recommendation panel')
assert(/Current CSS mock: rejected/.test(component), 'lab must mark the old CSS mock as rejected')
assert(/Generate real round/.test(component), 'lab must include a real generation round decision area')
assert(/aria-pressed/.test(component), 'mode selector must be accessible')
assert(/data-mode/.test(component), 'final render must expose active mode to CSS')
assert(/transformSignature/.test(component), 'component must show the transformation signature for review')
assert(/s24ReferenceFamilies/.test(data), 'mode data must include Samsung S24 reference families')
assert(/renderRoundPlan/.test(data), 'mode data must include the controlled render-round plan')
assert(/renderLabRoadmap/.test(data), 'mode data must include a one-hour roadmap')
assert(/samplePhotoAsks/.test(data), 'mode data must include requested source photo slots')
assert(/whole scene\/object reconstruction/i.test(data), 'S24 takeaways must require whole scene/object reconstruction')
assert(/no overlay pass/i.test(data), 'S24 takeaways must reject overlay-only outputs')
assert(/0-10 min/.test(data), 'roadmap must make the first ten minutes actionable')
assert(/45-60 min/.test(data), 'roadmap must end with a decision window')
assert(/Story Artifact/.test(data), 'roadmap must point to Story Artifact as the first serious test')

for (const label of [
  '3D Toothlight Charm',
  'Pop Keepsake',
  'Soft Storybook',
  'Time Capsule Glow',
]) {
  assert(data.includes(label), `S24-inspired target "${label}" must be present`)
}

assert(/grid-template-columns/.test(css), 'lab CSS must use an explicit comparison grid')
assert(/@media \(max-width: 860px\)/.test(css), 'lab CSS must include mobile layout handling')
assert(/aspect-ratio/.test(css), 'fixed image panels must use stable aspect ratios')
assert(/mix-blend-mode/.test(css), 'final image treatments must materially affect the whole image')
assert(/\.interpretedMarks/.test(css), 'final image must restyle drawing marks in the render')
assert(/\.referenceBoard/.test(css), 'lab CSS must style the S24 reference board')
assert(/\.approvalRound/.test(css), 'lab CSS must style the approval round')
assert(/\.roadmapSection/.test(css), 'lab CSS must style the one-hour roadmap')
assert(/\.primaryDecision/.test(css), 'lab CSS must style the primary recommendation')
assert(/\.promptDetails/.test(css), 'lab CSS must style collapsed prompt details')
assert(/\.drawPad/.test(css), 'lab CSS must style the live drawing pad')
assert(/\.drawCanvas/.test(css), 'lab CSS must style the live drawing canvas')
assert(/\.renderButton/.test(css), 'lab CSS must style the real render button')
assert(/\.renderResultImage/.test(css), 'lab CSS must style returned provider images')
assert(/\.uploadControl/.test(css), 'lab CSS must style local upload controls')
assert(!/letter-spacing:\s*-\d/.test(css), 'lab CSS must not use negative letter spacing')

assert(/promptOverride/.test(enhanceRoute), 'enhance route must accept promptOverride for preview lab renders')
assert(/previewAiRenderBypass/.test(enhanceRoute), 'prompt override must be tied to preview bypass safety')
assert(/promptOverride/.test(enhanceLib), 'enhance library must support promptOverride')

assert(/Next hour roadmap/.test(component), 'lab must tell the reviewer what to do in the next hour')
assert(/Your job/.test(component), 'lab must distinguish the reviewer job')
assert(/My job/.test(component), 'lab must distinguish the Codex job')
assert(/Start here/.test(component), 'lab must mark the starting recommendation')
assert(/You do not run prompts manually/.test(component), 'lab must explicitly say the reviewer does not run prompts manually')
assert(/Stage render round/.test(component), 'lab must include a concrete staging button')
assert(/Ready for Codex\/provider generation/.test(component), 'lab must describe the handoff after staging')
assert(/Waiting for real render/.test(component), 'output cards must read as queued render slots')
assert(/No final image yet/.test(component), 'output cards must not masquerade as generated finals')
assert(/Draw directly here/.test(component), 'lab must support drawing directly on the page')
assert(/Use this drawing/.test(component), 'lab must let the reviewer capture the live drawing as Input 2')
assert(/Clear drawing/.test(component), 'lab must let the reviewer clear the live drawing')
assert(/Live drawing layer/.test(component), 'captured drawing must be named as a live drawing layer')
assert(/Render selected mode/.test(component), 'lab must include an actual selected-mode render button')
assert(/Rendering/.test(component), 'lab must show a rendering state')
assert(/enhancedImageUrl/.test(component), 'lab must display the provider returned image')
assert(/promptOverride/.test(component), 'lab must send the selected lab prompt to the render endpoint')
assert(!/className=\{styles\.modeGallery\}/.test(component), 'lab must not keep a duplicate bottom gallery')

for (const docPhrase of [
  'Research takeaways',
  'Mode design',
  'Evaluation checklist',
  'C2PA',
  'not a prediction',
]) {
  assert(doc.includes(docPhrase), `workstream doc must include ${docPhrase}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-render-lab: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-render-lab')
