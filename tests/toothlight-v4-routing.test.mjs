import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const middleware = readFileSync(resolve(root, 'src/middleware.ts'), 'utf8')
const authRedirect = readFileSync(resolve(root, 'src/lib/toothfairy/auth-redirect.ts'), 'utf8')

const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

const passthroughIndex = middleware.indexOf("pathname.startsWith('/toothlight')")
const catchAllIndex = middleware.indexOf("`/toothfairy${pathname}`")

assert(
  passthroughIndex !== -1 && catchAllIndex !== -1 && passthroughIndex < catchAllIndex,
  'middleware must pass /toothlight through on the TFN domain before the catch-all /toothfairy rewrite',
)

assert(
  /pathname\.startsWith\('\/toothlight'\)/.test(middleware),
  'middleware app/session refresh must include /toothlight',
)

assert(
  /pathname\.startsWith\('\/api\/toothlight\/'\)/.test(middleware),
  'middleware API session refresh must include /api/toothlight/',
)

assert(
  authRedirect.includes('"/toothlight"') || authRedirect.includes("'/toothlight'"),
  'safe auth redirect prefixes must include /toothlight',
)

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-routing: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-routing')
