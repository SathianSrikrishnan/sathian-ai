import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const docPath = resolve(root, 'docs/toothlight/v4/10-preview-handoff-status.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(docPath), 'preview handoff status doc must exist')

const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : ''

for (const text of [
  'Preview Handoff Status',
  'preview-deployed, preview environment health verified, protected make-page browser verified, family-demo image verified, and save-auth boundary verified; authenticated end-to-end pass pending',
  'codex/toothlight-v4-creation-ux',
  'https://github.com/SathianSrikrishnan/sathian-ai/pull/7',
  'ca18b61bd1b56ef57500e6b29650c72f8b488d17',
  '6b6601bf41fda67fc7a13716390ee7f4c98f3d30',
  'beceb341d5ef415cfedbbbaf551e2c7c9f17ab9f',
  '02362827ad7e20cac67c2012a49738ea6f1a99b0',
  'bfb78d1c61ab0b2371d4510400334eda360c1f40',
  '690c4426eff796f861ad487d06f470bb80345647',
  '418a7fe4d9670caa1f20de237e75b3f4f4f7a586',
  '269b618df94b51b4c5f292c333a92df81e65af42',
  'caece212b50aa12844245fc35fcc76fa27867a35',
  '890ecf13c9123a9e958f93b7057bd74957421d60',
  '1e4ade85edaf5718327e7bc24d34be7ca97dc576',
  '13af986979d2e781ca2d798210e1e42d8f72daff',
  '8ad68ecdf25e0ce92632526b1121d215cb21dedf',
  'ddbe5bc4e1203401ee42341a029d72a373b917b6',
  '0238aa12e86a8fa1ac638a577b8bf2e0b9a17183',
  'e506e7c3dca708c52ebaf7008e99838d60f2bbde',
  'http://localhost:3000/toothlight/make',
  'http://192.168.1.104:3000/toothlight/make',
  'https://sathian-5hjfgksag-sathiansrikrishnans-projects.vercel.app',
  'dpl_254uYk49yxhAF6sBWMw414Kgufgb',
  '3fc7daa5a0c715d32bdc876c6522c4b66f5f2c2c',
  'https://sathian-onqxdqnk1-sathiansrikrishnans-projects.vercel.app',
  'dpl_FzRxG5oBZN32jdJgv6LndfZiRfVr',
  '827ed6535fe4f382fdb02ccfc641bc004ac6c2d5',
  'https://toothlight-preview.sathian.ai',
  'https://sathian-5op825thb-sathiansrikrishnans-projects.vercel.app',
  'dpl_djSqxwotyhttyxq6yekc1zPs59Me',
  'shareable-link protection bypass',
  'bypass token is intentionally not committed',
  '/toothlight/t/[id]/note?handoff=1',
  'Mobile Chrome',
  'Mobile Safari',
  'family contribution',
  'TypeScript compile check passed',
  'visual simplification',
  'Full production build passed',
  'Clean Vercel preview build passed',
  'Fresh preview check',
  'ordinary HTTP request',
  'headless mobile-sized Playwright browser',
  'Protected preview browser interaction probe',
  '/api/toothlight/save',
  'Google sign-in',
  'mobile next-action strip',
  'Add photo',
  'Tell it.',
  'redundant visible save heading',
  'mobile-sized Playwright screenshot confirmed the deployed protected make page shows the polished UI',
  'Fresh protected-preview save-boundary probe',
  'state `/toothlight/make?save=1`',
  'Family demo image fallback fix',
  '/toothlight/t/demo-toothlight/family',
  '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg',
  'Moon Window Toothlight image instead of a placeholder',
  'family action probe',
  '/api/toothlight/demo-toothlight/family-contribution',
  'family completion link appeared',
  'Continuation check on 2026-06-08',
  'clean verification worktree',
  'toothlight-v4-*.test.mjs',
  'Latest clean PR checkpoint',
  'Latest protected demo Toothlight API check',
  'Latest protected-preview save-boundary probe',
  'Preview environment readiness on 2026-06-08',
  'Fresh environment-enabled preview deployment',
  'Protected Vercel curl route checks',
  '/api/toothlight/health',
  'tfn_future_notes',
  'tfn_family_contributions',
  'toothlight-images',
  'Minimal protected-deployment save boundary check',
  'Local retest after the checkpoint fast-forward on 2026-06-08',
  '0.0.0.0:3000',
  'six product object images with keeper portrait chips',
  'mobile layout exposes the style carousel',
  'Latest protected Vercel curl checks',
  'Latest `/api/toothlight/health` check',
  'Latest style/story preview deployment',
  'Latest unauthenticated `/api/toothlight/save` POST check returned `401`',
  'Mobile voice record-first checkpoint',
  'touch devices to start Voice Assist in `Record` mode',
  'toothlight-v4-local-mobile-save.spec.ts',
  'toothlight-v4-voice-assist.spec.ts',
  'Mobile proof extension on 2026-06-08',
  'same Toothlight memory',
  'sealed parent note preview',
  'family note preview',
  'Toothlight card title',
  '/api/toothlight/voice-transcribe',
  'vercel curl /toothlight/make',
  'EPERM',
  'elevated build completed successfully',
  'merge state is `CLEAN`',
  'token_expired',
  'elevated Playwright screenshot',
  'authenticated browser/mobile pass',
  'TFN_ADMIN_SECRET',
  'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
  'OPENAI_API_KEY',
  'Do not invite the full first-50 group',
]) {
  assert(doc.includes(text), `preview handoff doc must include ${text}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-preview-handoff: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-preview-handoff')
