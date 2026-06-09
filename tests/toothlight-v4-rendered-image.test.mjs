import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const migrationPath = resolve(root, 'supabase/migrations/20260522_toothlight_v4_creation_ux.sql')
const saveRoutePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const saveServicePath = resolve(root, 'src/lib/toothlight/server/save-toothlight.ts')
const repositoryPath = resolve(root, 'src/lib/toothlight/server/toothlight-repository.ts')
const mediaPath = resolve(root, 'src/lib/toothlight/server/toothlight-media.ts')
const localStatePath = resolve(root, 'src/lib/toothlight/client/toothlight-local-state.ts')
const makeClientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(migrationPath), 'additive creation UX migration must exist')

const migration = existsSync(migrationPath) ? readFileSync(migrationPath, 'utf8') : ''
const saveRoute = readFileSync(saveRoutePath, 'utf8')
const saveService = readFileSync(saveServicePath, 'utf8')
const repository = readFileSync(repositoryPath, 'utf8')
const media = readFileSync(mediaPath, 'utf8')
const localState = readFileSync(localStatePath, 'utf8')
const makeClient = readFileSync(makeClientPath, 'utf8')

for (const column of ['source_image_uri', 'rendered_image_uri', 'treatment_id', 'treatment_version']) {
  assert(migration.includes(column), `migration must add ${column}`)
  assert(repository.includes(column), `repository must persist/read ${column}`)
}

assert(/sourceImageSrc/.test(saveService), 'save draft must accept sourceImageSrc')
assert(/renderedImageSrc/.test(saveService), 'save draft must accept renderedImageSrc')
assert(/treatmentId/.test(saveService), 'save draft must accept treatmentId')
assert(/treatmentVersion/.test(saveService), 'save draft must accept treatmentVersion')
assert(/uploadToothlightImage[\s\S]*sourceImageSrc/.test(saveRoute), 'save route must upload the source image')
assert(/uploadToothlightImage[\s\S]*renderedImageSrc/.test(saveRoute), 'save route must upload the rendered Toothlight image')
assert(/sourceImageUri/.test(saveRoute + repository), 'save path must carry sourceImageUri')
assert(/renderedImageUri/.test(saveRoute + repository), 'save path must carry renderedImageUri')
assert(/pathPrefix/.test(media), 'media helper must support storage path prefixes for source/rendered images')
assert(/sourceImageSrc/.test(localState), 'local saved Toothlight state must keep source image')
assert(/renderedImageSrc/.test(localState), 'local saved Toothlight state must keep rendered image')
assert(/treatmentId/.test(localState), 'local saved Toothlight state must keep treatment id')
assert(
  /const renderedImageSrc\s*=\s*draft\.aiRenderedImageSrc\s*\?\?[\s\S]*creationImageSrc/.test(makeClient),
  'save flow must prefer the AI final, then the composed artwork, before capturing a fallback preview card',
)
assert(
  /captureToothlightPreviewImage[\s\S]*\?\? creationImageSrc/.test(makeClient),
  'preview-card capture should only be a last fallback when no composed image exists',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-rendered-image: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-rendered-image')
