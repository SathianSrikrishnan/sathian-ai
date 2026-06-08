import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const docPath = resolve(root, 'docs/toothlight/v4/11-first-50-readiness-audit.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(docPath), 'first-50 readiness audit doc must exist')

const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : ''

for (const text of [
  'First 50 Readiness Audit',
  'local-ready and build-verified; preview deployed with environment health proof, protected make-page browser proof, family-demo image proof, save-auth boundary proof, and authenticated end-to-end pass pending',
  'not ready to send to the full first-50 visitor group',
  'http://localhost:3000/toothlight',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.104:3000/toothlight/make',
  'public/toothlight/style-objects/product-renders/v4/',
  'Simplified make UI',
  'talk/type memory field',
  'mobile next-action strip',
  'Tell it.',
  'primary save button',
  'Make it a Toothlight',
  'Mobile Chrome',
  'Mobile Safari',
  'npx.cmd tsc --noEmit --pretty false --incremental false',
  'Production build',
  'npm.cmd run build',
  'passed after the generated `.next` cache was rebuilt with write access',
  'Clean Vercel preview',
  'dpl_254uYk49yxhAF6sBWMw414Kgufgb',
  '3fc7daa5a0c715d32bdc876c6522c4b66f5f2c2c',
  'Preview environment health',
  'https://toothlight-preview.sathian.ai',
  'caece212b50aa12844245fc35fcc76fa27867a35',
  '1e4ade85edaf5718327e7bc24d34be7ca97dc576',
  'Protected preview bypass',
  'shareable-link protection bypass',
  'Protected make-page browser proof',
  'Protected save-auth boundary proof',
  'ordinary HTTP',
  'headless mobile-sized Playwright browser',
  'Google sign-in',
  '8 passed',
  'mobile-sized protected preview screenshot',
  'fresh protected-preview save-boundary probe',
  'state `/toothlight/make?save=1`',
  'family demo image fallback',
  'Moon Window product image',
  'Moon Window Toothlight card instead of the old placeholder',
  'family action probe',
  '/api/toothlight/demo-toothlight/family-contribution',
  'family completion link appeared',
  'Continuation check on 2026-06-08',
  '8ad68ecdf25e0ce92632526b1121d215cb21dedf',
  'clean verification worktree',
  'toothlight-v4-*.test.mjs',
  'Latest clean PR checkpoint',
  'Latest protected preview route checks',
  'Latest protected-preview save-boundary probe',
  'Preview environment readiness on 2026-06-08',
  'Fresh environment-enabled preview deployment',
  'Protected Vercel curl checks',
  '/api/toothlight/health',
  'tfn_product_events',
  'toothlight-images',
  'Minimal protected-deployment save boundary check',
  'Local retest after the checkpoint fast-forward',
  '0.0.0.0:3000',
  'six product object Light Style images with keeper portrait chips',
  'mobile style carousel visible before the saved preview',
  'Latest protected Vercel curl checks',
  'Latest `/api/toothlight/health` check',
  'Authenticated end-to-end browser proof',
  'token_expired',
  'MoonPay',
  'Coinbase',
  'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
  'OPENAI_API_KEY',
  'TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true',
  'normal browser/mobile preview pass',
]) {
  assert(doc.includes(text), `readiness audit must include ${text}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-readiness-audit: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-readiness-audit')
