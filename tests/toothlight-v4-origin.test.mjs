import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const constantsPath = resolve(root, 'src/lib/constants.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(constantsPath), 'constants.ts must exist')

const constants = existsSync(constantsPath) ? readFileSync(constantsPath, 'utf8') : ''

assert(
  constants.includes('https://toothlight-preview.sathian.ai'),
  'origin allowlist must include the stable Toothlight preview domain',
)
assert(
  /hostname\s*===\s*['"]localhost['"]/.test(constants),
  'development origin check must allow any localhost port',
)
assert(
  /hostname\s*===\s*['"]127\.0\.0\.1['"]/.test(constants),
  'development origin check must allow any 127.0.0.1 port',
)
assert(
  /isLocalDevelopmentOrigin/.test(constants),
  'origin handling must separate local development ports from production allowlist',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-origin: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-origin')
