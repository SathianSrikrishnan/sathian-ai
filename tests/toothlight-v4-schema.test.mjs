import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const migrationPath = resolve(root, 'supabase/migrations/20260521_tfn_toothlight_v4.sql')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(migrationPath), 'V4 Toothlight migration must exist')

const sql = existsSync(migrationPath) ? readFileSync(migrationPath, 'utf8') : ''

for (const table of [
  'tfn_toothlights',
  'tfn_future_notes',
  'tfn_family_contributions',
  'tfn_product_events',
]) {
  assert(sql.includes(table), `migration must include ${table}`)
}

assert(/ALTER TABLE tfn_toothlights ENABLE ROW LEVEL SECURITY/i.test(sql), 'tfn_toothlights must enable RLS')
assert(/ALTER TABLE tfn_future_notes ENABLE ROW LEVEL SECURITY/i.test(sql), 'tfn_future_notes must enable RLS')
assert(/ALTER TABLE tfn_family_contributions ENABLE ROW LEVEL SECURITY/i.test(sql), 'tfn_family_contributions must enable RLS')
assert(/ALTER TABLE tfn_product_events ENABLE ROW LEVEL SECURITY/i.test(sql), 'tfn_product_events must enable RLS')
assert(!/Public read.*tfn_future_notes/is.test(sql), 'future notes must not have public-read policy')
assert(/user_id/i.test(sql), 'migration must index or store user_id')
assert(/toothlight_id/i.test(sql), 'migration must index or store toothlight_id')
assert(/child_id|child_profile_pda/i.test(sql), 'migration must index or store child identity')
assert(/INSERT INTO storage\.buckets[\s\S]*toothlight-images/i.test(sql), 'migration must create the Toothlight image bucket')
assert(/allowed_mime_types[\s\S]*image\/png[\s\S]*image\/jpeg[\s\S]*image\/webp/i.test(sql), 'image bucket must restrict supported image MIME types')
assert(!/Service can manage toothlights" ON tfn_toothlights\s+FOR ALL USING/i.test(sql), 'toothlight service policy must not apply to public roles')
assert(!/Service can manage future notes" ON tfn_future_notes\s+FOR ALL USING/i.test(sql), 'future note service policy must not apply to public roles')
assert(!/Service can manage product events" ON tfn_product_events\s+FOR ALL USING/i.test(sql), 'event service policy must not apply to public roles')
assert(/Service can manage toothlights" ON tfn_toothlights\s+FOR ALL TO service_role/i.test(sql), 'toothlight service policy must be service_role-only')
assert(/Service can manage future notes" ON tfn_future_notes\s+FOR ALL TO service_role/i.test(sql), 'future note service policy must be service_role-only')
assert(/Service can insert family contributions" ON tfn_family_contributions\s+FOR INSERT TO service_role/i.test(sql), 'family contribution insert policy must be service_role-only')
assert(/Service can manage product events" ON tfn_product_events\s+FOR ALL TO service_role/i.test(sql), 'event service policy must be service_role-only')
assert(/DROP POLICY IF EXISTS "Users can read own toothlights"/i.test(sql), 'migration must be safe to rerun named Toothlight policies')
assert(/DROP POLICY IF EXISTS "Service can manage future notes"/i.test(sql), 'migration must be safe to rerun named future-note policies')

for (const indexToken of [
  'idx_tfn_toothlights_user_id',
  'idx_tfn_toothlights_child',
  'idx_tfn_future_notes_toothlight_id',
  'idx_tfn_family_contributions_toothlight_id',
]) {
  assert(sql.includes(indexToken), `migration must define ${indexToken}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-schema: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-schema')
