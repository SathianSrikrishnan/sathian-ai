import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const localState = existsSync(localStatePath) ? readFileSync(localStatePath, 'utf8') : ''
const makeClient = existsSync(makeClientPath) ? readFileSync(makeClientPath, 'utf8') : ''

assert(/saveToothlightDraftToBrowser/.test(localState), 'local state module must export safe draft save helper')
assert(/readToothlightDraftFromBrowser/.test(localState), 'local state module must export async draft read helper')
assert(/indexedDB/.test(localState), 'large Toothlight draft media must be stored in IndexedDB, not localStorage')
assert(/DRAFT_MEDIA_FIELDS/.test(localState), 'draft storage must list image fields that are too large for localStorage')
for (const field of [
  'sourceImageSrc',
  'photoImageSrc',
  'artworkImageSrc',
  'drawingLayerImageSrc',
  'renderedImageSrc',
  'aiRenderedImageSrc',
]) {
  assert(localState.includes(field), `draft media storage must handle ${field}`)
}
assert(/catch[\s\S]*stripDraftMediaForLocalStorage/.test(localState), 'draft save must catch quota failures and fall back to metadata-only localStorage')
assert(/readToothlightDraftFromBrowser/.test(makeClient), 'Make client must restore draft through safe async helper')
assert(/saveToothlightDraftToBrowser/.test(makeClient), 'Make client must persist draft through safe helper')
assert(!/localStorage\.setItem\(TOOTHLIGHT_DRAFT_STORAGE_KEY,\s*JSON\.stringify\(draft\)\)/.test(makeClient), 'Make client must not write full image draft directly to localStorage')
assert(!/localStorage\.setItem\(TOOTHLIGHT_DRAFT_STORAGE_KEY,\s*JSON\.stringify\(saveDraft\)\)/.test(makeClient), 'save flow must not write full image draft directly to localStorage')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-draft-storage: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-draft-storage')
