import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const clientEventsPath = resolve(root, 'src/lib/toothlight/client/product-events.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const localState = existsSync(localStatePath) ? readFileSync(localStatePath, 'utf8') : ''
const clientEvents = existsSync(clientEventsPath) ? readFileSync(clientEventsPath, 'utf8') : ''

assert(/type ToothlightAiRenderOption/.test(client), 'make flow must type AI render options')
assert(/aiRenderOptions:\s*ToothlightAiRenderOption\[\]/.test(client), 'draft must keep AI final options')
assert(/MAX_AI_RENDER_OPTIONS/.test(client), 'AI final options must be capped')
assert(/rememberAiRenderOption/.test(client), 'make flow must append each successful AI final as an option')
assert(/chooseAiRenderOption/.test(client), 'make flow must allow selecting an earlier AI final')
assert(/AI final options/.test(client), 'UI must expose a small AI final options rail')
assert(/Render another AI final/.test(client), 'render CTA must invite another option after one exists')
assert(/aria-label=\{`Use \$\{option\.treatmentLabel\} AI final/.test(client), 'variation buttons must have accessible labels')
assert(/ai_render_option_selected/.test(client), 'selecting a saved option must be logged')
assert(clientEvents.includes('ai_render_option_selected'), 'AI option selection event must be whitelisted')
assert(/aiRenderOptions:\s*\[\]/.test(client), 'new source photo or drawing must clear stale AI options')
assert(/aiRenderOptions/.test(localState), 'draft storage must understand AI render options')
assert(/aiRenderOption:/.test(localState), 'AI option images must be persisted outside localStorage')
assert(/stripDraftAiRenderOptionsForLocalStorage/.test(localState), 'AI option images must be stripped from localStorage')
assert(/readDraftAiRenderOptions/.test(localState), 'AI option images must be restored from IndexedDB')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-ai-variations: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-ai-variations')
