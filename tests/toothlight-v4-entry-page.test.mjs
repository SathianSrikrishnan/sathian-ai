import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const page = readFileSync(resolve(root, 'src/app/toothlight/page.tsx'), 'utf8')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(page.includes('ProductEntryRead'), 'entry page must import and render ProductEntryRead')
assert(page.includes('href="/toothlight/make"'), 'primary CTA must link to /toothlight/make')
assert(!/Continue with Google/i.test(page), 'entry page must not use Continue with Google as primary CTA')
assert(/How It Works|howSteps|Make.+Save.+Seal.+Share/s.test(page), 'entry page must include a visual How It Works strip')
assert(/Tanda/i.test(page), 'entry page must include Tanda as product-world guide language')
assert(/Network/i.test(page), 'entry page must include Network language')
assert(!/blockchain.{0,120}blockchain/is.test(page), 'entry page must avoid long blockchain explanation')
assert(!/wallet-first|connect wallet|crypto-first/i.test(page), 'entry page must avoid wallet-first copy')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-entry-page: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-entry-page')
