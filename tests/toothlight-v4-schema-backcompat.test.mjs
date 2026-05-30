import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const repositoryPath = resolve(root, 'src/lib/toothlight/server/toothlight-repository.ts')
const repository = readFileSync(repositoryPath, 'utf8')
const failures = []
const legacySelect = repository.match(
  /const LEGACY_TOOTHLIGHT_SELECT\s*=\s*\n\s*'([^']+)'/,
)?.[1] ?? ''

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(/CURRENT_TOOTHLIGHT_SELECT/.test(repository), 'repository must name the current Toothlight select projection')
assert(/LEGACY_TOOTHLIGHT_SELECT/.test(repository), 'repository must keep a legacy Toothlight select projection')
assert(/isMissingColumnError/.test(repository), 'repository must detect Supabase missing-column errors')
assert(
  legacySelect.includes('source_image_uri') && legacySelect.includes('rendered_image_uri'),
  'legacy select must keep source/rendered images from the creation UX migration',
)
assert(
  !legacySelect.includes('artwork_image_uri') && !legacySelect.includes('drawing_layer_image_uri'),
  'legacy select must not require artwork_image_uri',
)
assert(
  /savePersistedToothlightLegacy/.test(repository),
  'save path must retry without new layer columns when an older schema is still deployed',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-schema-backcompat: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-schema-backcompat')
