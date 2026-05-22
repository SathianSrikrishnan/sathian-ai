import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const statePath = resolve(root, 'src/lib/toothlight/toothlight-states.ts')
const glowPath = resolve(root, 'src/lib/toothlight/glow-filters.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(statePath), 'state model file must exist')
assert(existsSync(glowPath), 'glow filter file must exist')

const stateSource = existsSync(statePath) ? readFileSync(statePath, 'utf8') : ''
const glowSource = existsSync(glowPath) ? readFileSync(glowPath, 'utf8') : ''

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

const filterIdMatches = glowSource.match(/id:\s*['"][a-z0-9_-]+['"]/g) || []
assert(filterIdMatches.length >= 8, 'glow catalog must define at least 8 glow filters')
assert(
  /DEFAULT_GLOW_FILTER_ID|defaultGlowFilter|getRecommendedGlow/.test(glowSource),
  'glow catalog must expose a recommended/default glow',
)
assert(
  /descriptionForInternalUse/.test(glowSource),
  'glow filters must keep longer descriptions internal',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-state: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-state')
