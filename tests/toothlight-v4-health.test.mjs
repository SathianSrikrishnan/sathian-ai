import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const routePath = resolve(root, 'src/app/api/toothlight/health/route.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(routePath), 'Toothlight health route must exist')

const route = existsSync(routePath) ? readFileSync(routePath, 'utf8') : ''

for (const token of [
  'requireToothFairyAdminRequest',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
  'TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE',
  'OPENAI_API_KEY',
  'tfn_toothlights',
  'tfn_future_notes',
  'tfn_family_contributions',
  'tfn_product_events',
  'TOOTHLIGHT_IMAGE_BUCKET',
  'storage.getBucket',
  'healthy',
]) {
  assert(route.includes(token), `health route must include ${token}`)
}

assert(/export const dynamic = ['"]force-dynamic['"]/.test(route), 'health route must be dynamic')
assert(/status: healthy \? 200 : 503/.test(route), 'health route must fail closed when checks fail')
assert(/addVoiceTranscriptionCheck/.test(route), 'health route must expose voice transcription readiness')
assert(/Voice transcription disabled/.test(route), 'health route must make disabled production voice fallback visible as a warning')
assert(/Voice transcription enabled but OPENAI_API_KEY is missing/.test(route), 'health route must fail if production voice fallback is enabled without OpenAI')
assert(!/TFN_MINT_SECRET_KEY|NEXT_PUBLIC_SOLANA_RPC|TFN_MERKLE_TREE/.test(route), 'Toothlight V4 health must not depend on mint infrastructure yet')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-health: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-health')
