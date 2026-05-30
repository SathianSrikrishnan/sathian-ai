import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const routePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const servicePath = resolve(root, 'src/lib/toothlight/server/save-toothlight.ts')
const repositoryPath = resolve(root, 'src/lib/toothlight/server/toothlight-repository.ts')
const eventsPath = resolve(root, 'src/lib/toothlight/server/product-events.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const migrationPath = resolve(root, 'supabase/migrations/20260521_tfn_toothlight_v4.sql')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(routePath), '/api/toothlight/save route must exist')
assert(existsSync(servicePath), 'save-toothlight server helper must exist')
assert(existsSync(repositoryPath), 'toothlight repository must exist')
assert(existsSync(eventsPath), 'product-events server helper must exist')

const route = existsSync(routePath) ? readFileSync(routePath, 'utf8') : ''
const service = existsSync(servicePath) ? readFileSync(servicePath, 'utf8') : ''
const repository = existsSync(repositoryPath) ? readFileSync(repositoryPath, 'utf8') : ''
const migration = existsSync(migrationPath) ? readFileSync(migrationPath, 'utf8') : ''
const makeClient = readFileSync(makeClientPath, 'utf8')

assert(/NEXT_PUBLIC_TEST_MODE/.test(route), 'save route must support deterministic test mode')
assert(/getUser|auth\.getUser/.test(route), 'save route must require auth outside test mode')
assert(/demo-toothlight|test-toothlight/.test(route + service), 'test mode must return deterministic demo data')
assert(!/futureNoteBody|note_body|fullFutureNote/i.test(service), 'save metadata must not store future note body')
assert(/SaveToothlightAdapter|adapter/i.test(service), 'save helper must expose an adapter boundary')
assert(!/mintToothCNFT|uploadMetadata|escrow/.test(makeClient), 'UI must not import cNFT/escrow helpers directly')
assert(/logToothlightProductEvent/.test(route + service), 'save flow must log product events through helper')
assert(/save_attempted/.test(route + makeClient), 'save flow must log save_attempted')
assert(/save_completed/.test(route + makeClient), 'save flow must log save_completed')
assert(/artworkImageSrc/.test(route + service + repository), 'save path must carry the flattened photo-plus-drawing composition')
assert(/drawingLayerImageSrc/.test(route + service + repository), 'save path must carry the transparent child drawing layer')
assert(/pathPrefix:\s*['"]drawing-layer['"]/.test(route), 'save route must upload the transparent drawing layer separately')
assert(/drawing_layer_image_uri/.test(repository), 'repository must persist the drawing layer image URI')
assert(/artwork_image_uri/.test(repository), 'repository must persist the flattened artwork image URI')
assert(/layer_manifest/.test(repository), 'repository must persist a layer manifest for future layer-aware re-rendering')
for (const column of [
  'source_image_uri',
  'rendered_image_uri',
  'artwork_image_uri',
  'drawing_layer_image_uri',
  'treatment_id',
  'treatment_version',
  'layer_manifest',
]) {
  assert(migration.includes(column), `migration must include ${column}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-save-api: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-save-api')
