import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const read = (file) => readFileSync(resolve(root, file), 'utf8')

const routes = [
  'src/app/page.tsx',
  'src/app/launch-loop/page.tsx',
  'src/app/certificate/page.tsx',
  'src/app/create/page.tsx',
  'src/app/capsule/[id]/page.tsx',
  'src/app/capsule/[id]/unlock/page.tsx',
  'src/app/api/tfn-capsules/route.ts',
  'src/app/api/tfn-capsules/[id]/route.ts',
  'src/app/family-note/[inviteId]/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
]

for (const route of routes) {
  assert.equal(existsSync(resolve(root, route)), true, `${route} must exist for the capsule MVP route map`)
}

const component = read('src/components/tfn-capsule/TfnCapsuleMvpClient.tsx')
const launchLoop = read('src/app/launch-loop/page.tsx')
const analytics = read('src/lib/toothlight/client/product-events.ts')
const capsuleStore = read('src/lib/tfn-capsule/local-capsule-store.ts')

for (const copy of [
  'Turn a lost tooth into a future memory.',
  'Parent-led. Private by default. No wallet required.',
  'Official Tooth Light Capsule Certificate',
  'Make a Tooth Fairy certificate tonight.',
  'Free tooth fairy certificate',
  'Make tonight feel official in under a minute.',
  'Make the printable first.',
  'Add tooth details or leave defaults',
  'Save the story as a capsule',
  'Keep the certificate. Save the story.',
  'Remembers nickname, tooth date, and message.',
  'Certificate details carried over.',
  'Tooth Light Time Capsule',
  'Make a tiny time capsule your child can open later.',
  'under two minutes',
  'Start the time capsule',
  'Make tonight capsule',
  'Message to future-you',
  'Share with family',
  'Add one message for future-you.',
  'Tap a message',
  'Open this when I am bigger.',
  'Seal my time capsule',
  'Time capsule mission',
  'Saved. Capsule link is ready.',
  'Capsule link loaded.',
  'Magical Keepsake Bank',
  'The certificate is the receipt. The keepsake bank is the reason to save it.',
  'starter coin',
  'Build the bank loop',
  'Tanda says',
  'Tonight the Tooth Fairy made it official.',
  'I am the parent or guardian creating this private family time capsule.',
  'No child identity or private memory goes on-chain.',
  'Download certificate',
  'Share certificate',
  'Share family update',
  'Invite family note',
]) {
  assert.match(component, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `MVP copy missing: ${copy}`)
}

for (const eventName of [
  'certificate_started',
  'certificate_generated',
  'email_submitted',
  'certificate_downloaded',
  'capsule_started',
  'capsule_mission_selected',
  'parent_gate_completed',
  'tooth_photo_added',
  'tooth_story_added',
  'child_mode_started',
  'capsule_style_selected',
  'child_prompt_answered',
  'capsule_created',
  'capsule_sealed',
  'capsule_saved',
  'unlock_date_set',
  'share_clicked',
  'family_note_started',
  'family_invite_clicked',
  'upgrade_viewed',
]) {
  assert.match(analytics, new RegExp(`'${eventName}'`), `${eventName} must be allowed for MVP funnel logging`)
}

const earlyLanding = component.slice(component.indexOf('return ('), component.indexOf("if (variant === 'certificate')"))
assert.doesNotMatch(earlyLanding, /NFT|Token|Investment|wallet connect|crypto for kids/i)
assert.match(component, /new Blob\(\[svg\]/, 'certificate download must create a real SVG artifact')
assert.match(component, /navigator\.share/, 'certificate sharing should use native browser sharing when available')
assert.match(component, /navigator\.clipboard\?\.writeText/, 'certificate sharing needs a clipboard fallback')
assert.match(component, /fetch\('\/api\/tfn-capsules'/, 'capsules must save to the local MVP API')
assert.match(component, /fetch\(`\/api\/tfn-capsules\/\$\{encodeURIComponent\(activeCapsuleId\)\}`/, 'capsule links must load from the local MVP API')
assert.match(capsuleStore, /local_file_mvp/, 'local capsule store must label file-backed MVP persistence')
assert.match(capsuleStore, /\.data.+tfn-capsules/s, 'local capsule store must use a local data directory')
assert.doesNotMatch(component, /window\.print\(\)/, 'certificate download should not be browser print only')
assert.match(component, /tanda-guide-v1\.png/, 'MVP should use the Tanda guide asset')
assert.match(component, /ratoncito-perez/, 'MVP should include the Perez storybook scene asset')
assert.match(component, /piggy-cutout-soft-no-coin\.png/, 'MVP should show the Magical Keepsake Bank piggy asset')
assert.match(component, /tanda-carry-coin\.webp/, 'MVP should show Tanda carrying the starter coin')
assert.match(component, /loopBankBadge/, 'MVP should visibly mark the piggy bank as the SOL-ready keepsake unit')

for (const copy of [
  'Tooth fell out tonight?',
  'Make the proof, save the magic',
  'Magical Keepsake Bank',
  'Free certificate',
  'Toothlight memory',
  'Starter coin',
  'Make the free certificate',
  'No wallet at bedtime.',
]) {
  assert.match(launchLoop, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Launch loop copy missing: ${copy}`)
}

for (const asset of [
  'toothlight-keepsake-current.jpg',
  'tanda-carry-coin.webp',
  'piggy-cutout-soft-no-coin.png',
]) {
  assert.match(launchLoop, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Launch loop asset missing: ${asset}`)
}

console.log('PASS tfn-capsule-mvp')
