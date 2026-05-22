import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const draftPath = resolve(root, 'src/components/toothlight/v4/DraftGlowSequence.tsx')
const savePath = resolve(root, 'src/components/toothlight/v4/SaveFlightSequence.tsx')
const draftCssPath = resolve(root, 'src/components/toothlight/v4/DraftGlowSequence.module.css')
const saveCssPath = resolve(root, 'src/components/toothlight/v4/SaveFlightSequence.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(draftPath), 'DraftGlowSequence must exist')
assert(existsSync(savePath), 'SaveFlightSequence must exist')
assert(existsSync(draftCssPath), 'DraftGlowSequence CSS must exist')
assert(existsSync(saveCssPath), 'SaveFlightSequence CSS must exist')

const draft = existsSync(draftPath) ? readFileSync(draftPath, 'utf8') : ''
const save = existsSync(savePath) ? readFileSync(savePath, 'utf8') : ''
const draftCss = existsSync(draftCssPath) ? readFileSync(draftCssPath, 'utf8') : ''
const saveCss = existsSync(saveCssPath) ? readFileSync(saveCssPath, 'utf8') : ''

assert(/Draft Glow/i.test(draft), 'Draft Glow must be a separate sequence')
assert(/Save Flight/i.test(save), 'Save Flight must be a separate sequence')
assert(/saveSucceeded|isActive|onComplete/.test(save), 'Save Flight must only run after save success or active state')
assert(/prefers-reduced-motion/.test(draftCss), 'Draft Glow must include reduced-motion fallback')
assert(/prefers-reduced-motion/.test(saveCss), 'Save Flight must include reduced-motion fallback')
assert(/Network/i.test(save), 'Save Flight must reference the Network')
assert(/Tanda|guide/i.test(save), 'Save Flight must reference Tanda or guide layer')
assert(/mode\?:\s*['"]child['"]\s*\|\s*['"]parent['"]|mode.*child.*parent/s.test(save), 'Save Flight must support parent/child mode prop')
assert(/intensity\?:\s*['"]calm['"]\s*\|\s*['"]wonder['"]|intensity.*calm.*wonder/s.test(save), 'Save Flight must support calm/wonder intensity prop')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-sequences: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-sequences')
