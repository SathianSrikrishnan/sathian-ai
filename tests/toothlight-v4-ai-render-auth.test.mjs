import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const enhanceRoutePath = resolve(root, 'src/app/api/toothfairy/enhance/route.ts')
const saveRoutePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(enhanceRoutePath), 'AI enhance route must exist')

const enhanceRoute = existsSync(enhanceRoutePath) ? readFileSync(enhanceRoutePath, 'utf8') : ''
const saveRoute = existsSync(saveRoutePath) ? readFileSync(saveRoutePath, 'utf8') : ''
const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''

assert(
  /TOOTHLIGHT_PREVIEW_AI_RENDER_BYPASS/.test(enhanceRoute),
  'AI render must support an explicit preview-only auth bypass flag',
)
assert(
  /isPreviewAiRenderBypassAllowed/.test(enhanceRoute),
  'AI render route must isolate preview bypass origin logic in one helper',
)
assert(
  /toothlight-preview\.sathian\.ai/.test(enhanceRoute),
  'preview bypass must allow the stable Toothlight preview domain',
)
assert(
  /localhost|127\.0\.0\.1/.test(enhanceRoute),
  'preview bypass must allow local development origins',
)
assert(
  /preview-ai-render/.test(enhanceRoute),
  'bypassed preview renders must use an explicit synthetic user id for logging',
)
assert(
  /auth_required/.test(enhanceRoute) && /if \(!user && !previewAiRenderBypass\)/.test(enhanceRoute),
  'AI render must still require auth unless the preview bypass is explicitly active',
)
assert(
  !/TOOTHLIGHT_PREVIEW_AI_RENDER_BYPASS/.test(saveRoute),
  'save must not inherit the AI render preview auth bypass',
)
assert(
  /Parent sign-in unlocks the AI final before any generation cost starts/.test(makeClient),
  'production copy must still explain the normal auth gate for paid AI render',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-ai-render-auth: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-ai-render-auth')
