import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const contractPath = resolve(root, 'src/lib/toothlight/product-render-mode.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const renderLabPath = resolve(root, 'src/lib/toothlight/render-lab.ts')
const enhanceClientPath = resolve(root, 'src/lib/toothfairy/enhance-client.ts')
const enhanceRoutePath = resolve(root, 'src/app/api/toothfairy/enhance/route.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const contract = existsSync(contractPath) ? readFileSync(contractPath, 'utf8') : ''
const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''
const renderLab = existsSync(renderLabPath) ? readFileSync(renderLabPath, 'utf8') : ''
const enhanceClient = existsSync(enhanceClientPath) ? readFileSync(enhanceClientPath, 'utf8') : ''
const enhanceRoute = existsSync(enhanceRoutePath) ? readFileSync(enhanceRoutePath, 'utf8') : ''

assert(existsSync(contractPath), 'shared Toothlight product render contract must exist')
assert(/TOOTHLIGHT_PRODUCT_RENDER_MODE_ID\s*=\s*['"]story-artifact['"]/.test(contract), 'product render mode must default to Story Artifact')
assert(/TOOTHLIGHT_TRUST_CONTROL_RENDER_MODE_ID\s*=\s*['"]memory-polish['"]/.test(contract), 'Memory Polish must remain the trust control')
assert(/3D Toothlight Charm/.test(contract), 'product render contract must expose the parent-facing 3D Toothlight Charm label')
assert(/Make it a Toothlight/.test(contract), 'product render contract must expose the child-facing action label')
assert(/original photo and drawing stay saved/i.test(contract), 'product render contract must promise original preservation')
assert(/Preserve child identity/i.test(contract), 'product render guardrails must preserve child identity')
assert(/tooth moment/i.test(contract), 'product render guardrails must preserve the tooth moment')
assert(/physical keepsake object/i.test(contract), 'product render must ask for a physical keepsake object')
assert(/embedded inside the Toothlight/i.test(contract), 'product render must keep the real memory embedded in the object')
assert(/Interpret the child drawing/i.test(contract), 'product render guardrails must interpret the drawing layer')
assert(/pasting it unchanged/i.test(contract), 'product render guardrails must reject raw overlay behavior')
assert(/Transform the whole image/i.test(contract), 'product render guardrails must require whole-image transformation')
assert(/Reject stickers, generic filters/i.test(contract), 'product render guardrails must reject generic filter/sticker output')
assert(/face replacement/i.test(contract), 'product render guardrails must reject face replacement')
assert(
  /promptGuardrails:\s*\[/.test(contract) && /promptGuardrails\.join\(['"]\s['"]\)/.test(makeClient + renderLab),
  'product render guardrails must be reusable by Make or lab prompts',
)
assert(/buildToothlightProductPrompt/.test(contract), 'contract must expose a server-safe product prompt builder')
assert(/productRenderModeId\?:\s*string/.test(enhanceClient), 'enhance client request must carry a validated product render mode id')
assert(/productRenderModeId:\s*toothlightProductRenderContract\.modeId/.test(makeClient), 'Make must send the approved product render mode id')
assert(/TOOTHLIGHT_PRODUCT_RENDER_MODE_ID/.test(enhanceRoute), 'enhance route must validate product render mode server-side')
assert(/buildToothlightProductPrompt/.test(enhanceRoute), 'enhance route must build the product prompt server-side')
assert(/productPromptOverride\s*\?\?/.test(enhanceRoute), 'server product prompt must take precedence over client preview prompt text')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-product-render-mode: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-product-render-mode')
