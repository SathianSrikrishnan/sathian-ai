import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/toothlight/page.tsx')
const cssPath = resolve(root, 'src/app/toothlight/page.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const page = existsSync(pagePath) ? readFileSync(pagePath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''

assert(/FRONT_DOOR_BEATS/.test(page), 'entry page must define a compact first-viewport product story')
for (const beat of ['Capture', 'Story', 'Note', 'Learn']) {
  assert(page.includes(beat), `front-door story must include ${beat}`)
}
assert(!/Family \+ Smile Fund|optional Smile Fund|links a Smile Fund/i.test(page), 'front door must fold Smile Fund into the family note and optional gift path')
for (const cue of ['Drawings welcome', 'Original stays saved', 'Parent controls the handoff']) {
  assert(page.includes(cue), `front-door trust cue must include ${cue}`)
}
assert(/aria-label="10-second Toothlight story"/.test(page), 'entry page must label the short product story accessibly')
assert(/aria-label="Parent trust cues"/.test(page), 'entry page must expose parent trust cues')
assert(/href="\/toothlight\/start"/.test(page), 'front door must drive directly into the simplified start flow')
assert(/beatRail/.test(page + css), 'entry page must style the first-viewport beat rail')
assert(/trustPills/.test(page + css), 'entry page must style the trust cues compactly')
assert(/heroNote/.test(page + css), 'entry page must include a concise note under the CTAs')
assert(/grid-template-areas:\s*"copy"\s*"visual"/.test(css), 'mobile front door must show the product explanation before the large animation')
assert(!/connect wallet|wallet-first|crypto-first/i.test(page), 'front door must avoid wallet-first language')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-front-door: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-front-door')
