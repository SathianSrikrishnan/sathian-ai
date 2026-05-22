import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const authPath = resolve(root, 'src/lib/toothlight/client/toothlight-auth.ts')
const makePath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(authPath), 'client Toothlight auth helper must exist')

const auth = existsSync(authPath) ? readFileSync(authPath, 'utf8') : ''
const make = readFileSync(makePath, 'utf8')

assert(auth.includes('toothlight:v4:pending-save'), 'auth helper must persist pending save intent')
assert(auth.includes('/api/auth/google?next='), 'auth helper must route through Google auth')
assert(auth.includes('encodeURIComponent(nextPath)'), 'auth helper must safely encode the return path')
assert(auth.includes("params.get('save') === '1'"), 'auth helper must recognize save resume intent')
assert(auth.includes("params.get('returning') === 'auth'"), 'auth helper must require auth-return marker')
assert(make.includes('redirectToToothlightParentAuth'), 'make flow must redirect to parent auth on 401')
assert(make.includes("'/toothlight/make?save=1'"), 'make flow must return to the saved draft after auth')
assert(make.includes('hasToothlightSavePending'), 'make flow must resume only when save was explicitly pending')
assert(make.includes('Google keeps it in your parent account.'), 'make flow must frame Google as account storage copy')
assert(!/Continue with Google/.test(make.split('Save this Toothlight')[0] ?? ''), 'Google must not replace the emotional save CTA')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-auth-return: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-auth-return')
