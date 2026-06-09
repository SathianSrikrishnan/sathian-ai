import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const repositoryPath = resolve(root, 'src/lib/toothlight/server/toothlight-repository.ts')
const readRoutePath = resolve(root, 'src/app/api/toothlight/[id]/route.ts')
const saveRoutePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const noteRoutePath = resolve(root, 'src/app/api/toothlight/[id]/future-note/route.ts')
const familyRoutePath = resolve(root, 'src/app/api/toothlight/[id]/family-contribution/route.ts')
const savedClientPath = resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(repositoryPath), 'Supabase Toothlight repository must exist')
assert(existsSync(readRoutePath), 'GET /api/toothlight/[id] route must exist')

const repository = existsSync(repositoryPath) ? readFileSync(repositoryPath, 'utf8') : ''
const readRoute = existsSync(readRoutePath) ? readFileSync(readRoutePath, 'utf8') : ''
const saveRoute = readFileSync(saveRoutePath, 'utf8')
const noteRoute = readFileSync(noteRoutePath, 'utf8')
const familyRoute = readFileSync(familyRoutePath, 'utf8')
const savedClient = readFileSync(savedClientPath, 'utf8')
const demoImageSrc = '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg'

for (const exportName of [
  'createSupabaseToothlightRepository',
  'savePersistedToothlight',
  'getPersistedToothlight',
  'savePersistedFutureNote',
  'savePersistedFamilyContribution',
]) {
  assert(repository.includes(exportName), `repository must export ${exportName}`)
}

for (const tableName of [
  'tfn_toothlights',
  'tfn_future_notes',
  'tfn_family_contributions',
]) {
  assert(repository.includes(tableName), `repository must use ${tableName}`)
}

assert(saveRoute.includes('savePersistedToothlight'), 'save route must persist Toothlights outside test mode')
assert(saveRoute.includes('uploadToothlightImage'), 'save route must upload Toothlight media before database persistence')
assert(!/adapter_unavailable/.test(saveRoute), 'save route should not return adapter_unavailable for V4 persistence')
assert(noteRoute.includes('savePersistedFutureNote'), 'future note route must persist note status/body outside test mode')
assert(!/Real future note storage is not enabled yet/.test(noteRoute), 'future note route should not return storage-not-enabled 501 after persistence')
assert(familyRoute.includes('savePersistedFamilyContribution'), 'family route must persist contribution intents outside test mode')
assert(readRoute.includes('getPersistedToothlight'), 'read route must use persisted Toothlight helper')
assert(/statusOnly|noContent|futureNoteStatus/.test(readRoute), 'read route must expose status-only note data')
assert(!/note_body_encrypted|sealedText|noteText/.test(readRoute), 'read route must not expose private note content')
assert(/params\.id === 'demo-toothlight'/.test(readRoute), 'read route must serve the demo Toothlight without querying Supabase')
assert(readRoute.includes(demoImageSrc), 'demo read route must return a real first-party Toothlight image')
assert(/imageSrc:\s*DEMO_TOOTHLIGHT_IMAGE_SRC/.test(readRoute), 'demo read route must fill imageSrc')
assert(/sourceImageSrc:\s*DEMO_TOOTHLIGHT_IMAGE_SRC/.test(readRoute), 'demo read route must fill sourceImageSrc')
assert(/renderedImageSrc:\s*DEMO_TOOTHLIGHT_IMAGE_SRC/.test(readRoute), 'demo read route must fill renderedImageSrc')
assert(/isValidToothlightId/.test(readRoute), 'read route must reject malformed ids before querying Supabase')
assert(/fetch\(`\/api\/toothlight\/\$\{toothlightId\}`/.test(savedClient), 'saved client must fetch persisted state')
assert(savedClient.includes('applyPersistedToothlight'), 'saved client must merge persisted state into UI')
assert(savedClient.includes(demoImageSrc), 'saved page fallback must render a real Toothlight image')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-persistence: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-persistence')
