import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const componentPath = resolve(root, 'src/components/toothlight/v4/ToothlightCard.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/ToothlightCard.module.css')
const typePath = resolve(root, 'src/components/toothlight/v4/types.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(componentPath), 'ToothlightCard component must exist')
assert(existsSync(cssPath), 'ToothlightCard CSS module must exist')
assert(existsSync(typePath), 'V4 component types must exist')

const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''

for (const token of ['draft_glow', 'note_started', 'sealed', 'constellated']) {
  assert(component.includes(token), `card source must handle ${token}`)
}

assert(component.includes('aria-label'), 'card must expose an accessible aria-label')
assert(
  !component.includes('toothlight-data'),
  'card must not depend on V3 demo memory arrays from toothlight-data.ts',
)
assert(
  /aspect-ratio/.test(css),
  'card CSS must define stable aspect ratio',
)
assert(
  /object-fit:\s*contain/.test(css),
  'saved Toothlight card must contain saved square artwork instead of cropping it',
)
assert(
  /object-position:\s*center\s+center/.test(css),
  'saved Toothlight card image must stay visually centered',
)
assert(
  /prefers-reduced-motion/.test(css),
  'card CSS must include reduced-motion handling',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-card: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-card')
