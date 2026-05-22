import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const routePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const servicePath = resolve(root, 'src/lib/toothlight/server/save-toothlight.ts')
const eventsPath = resolve(root, 'src/lib/toothlight/server/product-events.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(routePath), '/api/toothlight/save route must exist')
assert(existsSync(servicePath), 'save-toothlight server helper must exist')
assert(existsSync(eventsPath), 'product-events server helper must exist')

const route = existsSync(routePath) ? readFileSync(routePath, 'utf8') : ''
const service = existsSync(servicePath) ? readFileSync(servicePath, 'utf8') : ''
const makeClient = readFileSync(makeClientPath, 'utf8')

assert(/NEXT_PUBLIC_TEST_MODE/.test(route), 'save route must support deterministic test mode')
assert(/getUser|auth\.getUser/.test(route), 'save route must require auth outside test mode')
assert(/demo-toothlight|test-toothlight/.test(route + service), 'test mode must return deterministic demo data')
assert(!/futureNoteBody|note_body|fullFutureNote/i.test(service), 'save metadata must not store future note body')
assert(/SaveToothlightAdapter|adapter/i.test(service), 'save helper must expose an adapter boundary')
assert(!/mintToothCNFT|uploadMetadata|escrow/.test(makeClient), 'UI must not import cNFT/escrow helpers directly')
assert(/logToothlightProductEvent/.test(route + service), 'save flow must log product events through helper')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-save-api: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-save-api')
