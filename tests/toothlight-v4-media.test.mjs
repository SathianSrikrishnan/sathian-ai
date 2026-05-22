import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const mediaPath = resolve(root, 'src/lib/toothlight/server/toothlight-media.ts')
const saveRoutePath = resolve(root, 'src/app/api/toothlight/save/route.ts')
const migrationPath = resolve(root, 'supabase/migrations/20260521_tfn_toothlight_v4.sql')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(mediaPath), 'Toothlight media helper must exist')

const media = existsSync(mediaPath) ? readFileSync(mediaPath, 'utf8') : ''
const saveRoute = readFileSync(saveRoutePath, 'utf8')
const migration = readFileSync(migrationPath, 'utf8')

for (const token of [
  'TOOTHLIGHT_IMAGE_BUCKET',
  'toothlight-images',
  'parseDataUrlImage',
  'uploadToothlightImage',
  'storage.from(TOOTHLIGHT_IMAGE_BUCKET).upload',
  'getPublicUrl',
]) {
  assert(media.includes(token), `media helper must include ${token}`)
}

assert(/image\/png/.test(media) && /image\/jpeg/.test(media) && /image\/webp/.test(media), 'media helper must restrict supported image MIME types')
assert(/MAX_TOOTHLIGHT_IMAGE_BYTES/.test(media), 'media helper must enforce max image size')
assert(/randomUUID/.test(media), 'media helper must generate unique storage paths')
assert(saveRoute.includes('uploadToothlightImage'), 'save route must upload Toothlight image before persistence')
assert(saveRoute.includes('imageUri'), 'save route must pass uploaded image URI to persistence')
assert(migration.includes('storage.buckets'), 'migration must define expected Supabase storage bucket')
assert(migration.includes('toothlight-images'), 'migration must include toothlight-images bucket')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-media: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-media')
