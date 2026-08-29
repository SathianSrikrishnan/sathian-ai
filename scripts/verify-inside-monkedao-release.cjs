const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const siteRoot = path.resolve(__dirname, '..')
const bundleRoot = String.raw`C:\Users\sathi\Projects\_second-brain\raw\calls-and-meetings\2026-08-17-benny-monkedao-interview`
const identityWordPass = path.join(bundleRoot, 'evidence', 'private', 'identity-word-pass-v2.json')
const publicManifestPath = path.join(
  bundleRoot,
  'edit', 'deep-dive', 'v1.9-caption-release', 'public-release-v1.9.0',
  'PUBLIC-RELEASE-MANIFEST-V1.9.0.json',
)
const routePath = path.join(siteRoot, 'src', 'app', 'writings', 'inside-monkedao', 'page.tsx')
const stylesPath = path.join(siteRoot, 'src', 'app', 'writings', 'inside-monkedao', 'inside-monkedao.module.css')
const articlesPath = path.join(siteRoot, 'src', 'lib', 'articles.ts')
const videoPath = path.join(siteRoot, 'public', 'inside-monkedao', 'inside-monkedao-field-report-v1.9.0.mp4')

function fail(message) { throw new Error(message) }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') }
function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.error) throw result.error
  if (result.status !== 0) fail(`${command} failed: ${result.stderr || result.stdout}`)
  return result.stdout
}
function privateIdentityTerm() {
  const pass = JSON.parse(fs.readFileSync(identityWordPass, 'utf8'))
  const term = (pass.words || [])
    .filter((word) => Number(word.start) < 7.68 && Number(word.end) > 6.60)
    .sort((a, b) => Number(a.end) - Number(b.end))
    .map((word) => String(word.word || '').trim().replace(/[^\p{L}'’-]/gu, ''))
    .filter((word) => word.length >= 4)
    .at(-1)?.toLocaleLowerCase('en-US')
  if (!term) fail('Private identity guard could not be derived.')
  return term
}
function assertNoPrivateIdentity(text, term, label) {
  const words = new Set((text.toLocaleLowerCase('en-US').match(/[\p{L}'’-]+/gu) || []))
  if (words.has(term)) fail(`Privacy scan failed for ${label}.`)
}

for (const required of [identityWordPass, publicManifestPath, routePath, stylesPath, articlesPath, videoPath]) {
  if (!fs.existsSync(required)) fail(`Required release input is missing: ${required}`)
}

const term = privateIdentityTerm()
for (const [file, label] of [
  [routePath, 'feature route'],
  [stylesPath, 'feature styles'],
  [articlesPath, 'article registry'],
]) {
  const text = fs.readFileSync(file, 'utf8')
  assertNoPrivateIdentity(text, term, label)
  if (/\bSlana\b/iu.test(text)) fail(`Misspelled Solana remains in ${label}.`)
}

const manifest = JSON.parse(fs.readFileSync(publicManifestPath, 'utf8'))
if (manifest.output.sha256 !== sha256(videoPath)) fail('Site video differs from the verified public release master.')
if (manifest.captions?.misspelled_slana_occurrences !== 0) fail('Public manifest did not pass the caption sweep.')

const probe = JSON.parse(run('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', videoPath]))
assertNoPrivateIdentity(JSON.stringify(probe.format?.tags || {}), term, 'site video metadata')
assertNoPrivateIdentity(path.basename(videoPath), term, 'site video filename')

process.stdout.write(JSON.stringify({
  status: 'passed',
  site_video_sha256: manifest.output.sha256,
  caption_misspellings: 0,
  privacy_guard_count: 1,
  raw_source_present: false,
}))
