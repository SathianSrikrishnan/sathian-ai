import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const statePath = resolve(root, 'src/lib/toothlight/toothlight-states.ts')
const glowPath = resolve(root, 'src/lib/toothlight/glow-filters.ts')
const treatmentPath = resolve(root, 'src/lib/toothlight/visual-treatments.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(statePath), 'state model file must exist')
assert(existsSync(glowPath), 'glow filter file must exist')
assert(existsSync(treatmentPath), 'visual treatment catalog must exist')

const stateSource = existsSync(statePath) ? readFileSync(statePath, 'utf8') : ''
const glowSource = existsSync(glowPath) ? readFileSync(glowPath, 'utf8') : ''
const treatmentSource = existsSync(treatmentPath) ? readFileSync(treatmentPath, 'utf8') : ''

for (const token of [
  'draft_glow',
  'spark',
  'note_started',
  'sealed',
  'smile_fund_active',
  'constellated',
]) {
  assert(stateSource.includes(token), `state model must define ${token}`)
}

assert(
  /getToothlightVisualState/.test(stateSource),
  'state model must export getToothlightVisualState',
)
assert(
  /FutureNoteStatus/.test(stateSource),
  'state model must define FutureNoteStatus',
)
assert(
  /FamilyNodeKind/.test(stateSource),
  'state model must define FamilyNodeKind',
)

const treatmentIdMatches = treatmentSource.match(/id:\s*['"][a-z0-9_-]+['"]/g) || []
assert(treatmentIdMatches.length >= 5, 'visual treatment catalog must define at least 5 meaningful styles')
assert(
  /DEFAULT_VISUAL_TREATMENT_ID|defaultVisualTreatment|getRecommendedLightStyle/.test(treatmentSource),
  'visual treatment catalog must expose a recommended/default style',
)
assert(
  /descriptionForInternalUse/.test(treatmentSource),
  'visual treatments must keep longer descriptions internal',
)
assert(/Keepsake Glow/.test(treatmentSource), 'default style should use product language, not generic glow names')
assert(!/label:\s*['"]Seal['"]/.test(treatmentSource), 'Seal must be a note state, not a creation style')
assert(/LIGHT_STYLE_VERSION/.test(treatmentSource), 'visual treatment catalog must include a saved rendering version')
assert(/visual-treatments/.test(glowSource), 'legacy glow catalog must delegate to visual treatments for compatibility')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-state: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-state')
