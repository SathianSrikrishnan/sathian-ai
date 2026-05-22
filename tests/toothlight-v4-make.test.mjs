import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/toothlight/make/page.tsx')
const clientPath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const glowPath = resolve(root, 'src/components/toothlight/v4/GlowPicker.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const page = readFileSync(pagePath, 'utf8')
const client = existsSync(clientPath) ? readFileSync(clientPath, 'utf8') : ''
const glowPicker = existsSync(glowPath) ? readFileSync(glowPath, 'utf8') : ''

assert(page.includes('ToothlightMakeClient'), '/toothlight/make must use the V4 client component')
assert(existsSync(clientPath), 'ToothlightMakeClient must exist')
assert(existsSync(glowPath), 'GlowPicker must exist')
assert(
  /DrawingCanvasV2/.test(client),
  'creation shell must import or wrap DrawingCanvasV2',
)
assert(client.includes('GlowPicker'), 'creation shell must use GlowPicker')
assert(
  client.includes('TOOTHLIGHT_DRAFT_STORAGE_KEY') || client.includes('toothlight:v4:draft'),
  'creation shell must store V4 draft under a Toothlight-specific localStorage key',
)
assert(
  /Save this Toothlight/.test(client),
  'primary save CTA must say Save this Toothlight',
)
assert(
  !/Continue with Google/.test(client.split('Save this Toothlight')[0] ?? ''),
  'creation must happen before Google/account language appears',
)
assert(
  /GLOW_FILTERS|getRecommendedGlow|getGlowFilter/.test(glowPicker),
  'GlowPicker must use the deterministic V4 glow catalog',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-make: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-make')
