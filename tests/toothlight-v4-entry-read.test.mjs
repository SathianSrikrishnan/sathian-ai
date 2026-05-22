import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const componentPath = resolve(root, 'src/components/toothlight/v4/ProductEntryRead.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/ProductEntryRead.module.css')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(componentPath), 'ProductEntryRead component must exist')
assert(existsSync(cssPath), 'ProductEntryRead CSS module must exist')

const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''

assert(
  component.includes('/toothfairy/animation/live-hero-v1/'),
  'entry animation must use existing Tanda live-hero assets',
)
assert(
  /Smile Fund|coin|piggy/i.test(component),
  'entry animation must include a tooth-to-coin Smile Fund hint',
)
assert(
  /wand|shared glow|glow transfer/i.test(component),
  'entry animation must include the shared wand/glow transfer',
)
assert(
  /phone|photo|drawing|Toothlight/i.test(component),
  'entry animation must show phone/photo/drawing becoming a Toothlight',
)
assert(
  /Product Entry Read/i.test(component),
  'entry animation must label Product Entry Read for maintainability',
)
assert(
  /prefers-reduced-motion/.test(css),
  'entry animation CSS must include reduced-motion fallback',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-entry-read: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-entry-read')
