import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const routePath = resolve(root, 'src/app/api/whatsapp/webhook/route.ts')
const helperPath = resolve(root, 'src/lib/tfn/whatsapp.ts')
const middlewarePath = resolve(root, 'src/middleware.ts')
const migrationPath = resolve(root, 'supabase/migrations/20260611_tfn_whatsapp_leads.sql')
const docsPath = resolve(root, 'docs/tfn-whatsapp-cloud-api-mvp.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const path of [routePath, helperPath, migrationPath, docsPath]) {
  assert(existsSync(path), `${path.replace(root, '.')} must exist`)
}

const route = existsSync(routePath) ? readFileSync(routePath, 'utf8') : ''
const helper = existsSync(helperPath) ? readFileSync(helperPath, 'utf8') : ''
const middleware = existsSync(middlewarePath) ? readFileSync(middlewarePath, 'utf8') : ''
const migration = existsSync(migrationPath) ? readFileSync(migrationPath, 'utf8') : ''
const docs = existsSync(docsPath) ? readFileSync(docsPath, 'utf8') : ''

assert(/export async function GET/.test(route), 'webhook route must expose GET verification')
assert(/export async function POST/.test(route), 'webhook route must expose POST receiver')
assert(route.includes('hub.verify_token'), 'GET route must read Meta verify token')
assert(route.includes('hub.challenge'), 'GET route must return Meta challenge')
assert(route.includes('WHATSAPP_WEBHOOK_VERIFY_TOKEN'), 'GET route must compare against env verify token')
assert(route.includes('storeWhatsAppWebhookPayload'), 'POST route must persist webhook payloads')
assert(route.includes('verifyMetaWebhookSignature'), 'POST route must support app-secret signature verification')
assert(route.includes('maybeSendWhatsAppAcknowledgement'), 'POST route must support gated acknowledgement replies')
assert(route.includes('request.text()'), 'POST route must read raw body before JSON parsing')
assert(/status:\s*403/.test(route), 'invalid webhook verification must return 403')

assert(helper.includes('@supabase/supabase-js'), 'helper must use Supabase service client')
assert(helper.includes('tfn_webhook_events'), 'helper must store raw webhook events')
assert(helper.includes('tfn_channel_contacts'), 'helper must upsert channel contacts')
assert(helper.includes('tfn_channel_messages'), 'helper must store normalized messages')
assert(helper.includes('WHATSAPP_APP_SECRET'), 'helper must verify signatures when app secret is configured')
assert(helper.includes('WHATSAPP_AUTO_ACK_ENABLED'), 'acknowledgement sending must be explicitly gated')
assert(helper.includes('WHATSAPP_PHONE_NUMBER_ID'), 'acknowledgement sending must use configured phone number id')
assert(helper.includes('WHATSAPP_ACCESS_TOKEN'), 'acknowledgement sending must use configured access token')
assert(helper.includes('graph.facebook.com'), 'acknowledgement helper must call Meta Graph API')
assert(helper.includes('entry') && helper.includes('changes'), 'helper must traverse Meta webhook entry/change payloads')
assert(helper.includes('messages') && helper.includes('statuses'), 'helper must handle WhatsApp messages and status events')

assert(middleware.includes('isWhatsAppWebhookRoute'), 'middleware must identify WhatsApp webhooks separately')
assert(/isWhatsAppWebhookRoute\s*\?\s*120/.test(middleware), 'WhatsApp webhook must have a higher delivery limit than normal APIs')
assert(middleware.includes('x-hub-signature-256'), 'middleware CORS headers should allow Meta signature header')

for (const table of ['tfn_webhook_events', 'tfn_channel_contacts', 'tfn_channel_messages']) {
  assert(migration.includes(`create table if not exists public.${table}`), `migration must create ${table}`)
  assert(migration.includes(`alter table public.${table} enable row level security`), `${table} must have RLS enabled`)
}
assert(migration.includes('provider_contact_id'), 'migration must retain provider contact ids for lead matching')
assert(migration.includes('lead_status'), 'migration must include lead status for human handoff')
assert(migration.includes('payload jsonb'), 'migration must keep raw JSON payloads')

assert(docs.includes('Callback URL'), 'setup docs must tell user what to paste into Meta Callback URL')
assert(docs.includes('Verify token'), 'setup docs must tell user what to paste into Meta Verify token')
assert(docs.includes('WHATSAPP_WEBHOOK_VERIFY_TOKEN'), 'setup docs must name the Vercel verify-token env var')
assert(docs.includes('WHATSAPP_AUTO_ACK_ENABLED'), 'setup docs must explain acknowledgement is opt-in')
assert(docs.includes('do not paste'), 'setup docs must warn not to paste secrets into chat')

if (failures.length > 0) {
  console.error(`FAIL tfn-whatsapp-webhook: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS tfn-whatsapp-webhook')
