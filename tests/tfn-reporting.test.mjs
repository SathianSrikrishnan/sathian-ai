import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const files = {
  client: resolve(root, 'src/lib/toothlight/client/product-analytics.ts'),
  clientEvents: resolve(root, 'src/lib/toothlight/client/product-events.ts'),
  component: resolve(root, 'src/components/toothlight/analytics/TFNProductAnalytics.tsx'),
  eventsRoute: resolve(root, 'src/app/api/toothlight/events/route.ts'),
  legacyEventRoute: resolve(root, 'src/app/api/toothlight/event/route.ts'),
  reportRoute: resolve(root, 'src/app/api/toothlight/reporting/route.ts'),
  flow: resolve(root, 'src/components/toothlight/v4/ToothlightCreationFlowClient.tsx'),
  saved: resolve(root, 'src/components/toothlight/v4/SavedToothlightClient.tsx'),
  notePanel: resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx'),
  entryPage: resolve(root, 'src/app/toothlight/page.tsx'),
  layout: resolve(root, 'src/app/layout.tsx'),
  middleware: resolve(root, 'src/middleware.ts'),
}

const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const [name, path] of Object.entries(files)) {
  assert(existsSync(path), `${name} file must exist`)
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

const client = read(files.client)
const clientEvents = read(files.clientEvents)
const component = read(files.component)
const eventsRoute = read(files.eventsRoute)
const legacyEventRoute = read(files.legacyEventRoute)
const reportRoute = read(files.reportRoute)
const flow = read(files.flow)
const saved = read(files.saved)
const notePanel = read(files.notePanel)
const entryPage = read(files.entryPage)
const layout = read(files.layout)
const middleware = read(files.middleware)

const launchFunnelEvents = [
  'landing_view',
  'cta_click',
  'start_flow',
  'source_added',
  'google_parent_auth',
  'story_completed',
  'parent_note_saved',
  'toothlight_sealed',
  'invite_clicked',
  'learn_clicked',
]

for (const token of [
  'TOOTHLIGHT_VISITOR_ID_KEY',
  'TOOTHLIGHT_SESSION_ID_KEY',
  'tfn_visitor_id',
  'navigator.sendBeacon',
  'navigator.webdriver',
  'codex_agent',
  'ai_bot',
  'crawler',
  'human_like',
  'createToothlightAnalyticsId',
  'Math.random',
]) {
  assert(client.includes(token), `client analytics must include ${token}`)
}

for (const token of [
  'buildToothlightAnalyticsProperties',
  'fetch(\'/api/toothlight/event\'',
  'keepalive',
]) {
  assert(clientEvents.includes(token), `legacy client event helper must include ${token}`)
}

for (const token of [
  'trackToothlightEvent',
  'page_view',
  'landing_view',
  'ui_click',
  'cta_click',
  'usePathname',
  'closest',
]) {
  assert(component.includes(token), `analytics component must include ${token}`)
}

for (const eventName of launchFunnelEvents) {
  assert(reportRoute.includes(eventName), `reporting route must include launch funnel event ${eventName}`)
  assert(
    clientEvents.includes(eventName) ||
      component.includes(eventName) ||
      flow.includes(eventName) ||
      saved.includes(eventName) ||
      notePanel.includes(eventName) ||
      entryPage.includes(eventName),
    `client instrumentation must emit or tag ${eventName}`,
  )
}

for (const token of [
  'logToothlightProductEvent',
  'visitorId',
  'sessionId',
  'botCategory',
  'userAgent',
  'eventName',
  'properties',
]) {
  assert(eventsRoute.includes(token), `event route must include ${token}`)
}

assert(!/cf-connecting-ip|x-forwarded-for|x-real-ip/.test(eventsRoute), 'event route must not persist raw visitor IP addresses')
assert(legacyEventRoute.includes('cf-ipcountry'), 'legacy event route must preserve Cloudflare country metadata')

for (const token of [
  'requireToothFairyAdminRequest',
  'tfn_product_events',
  'tfn_toothlights',
  'tfn_children',
  'uniqueVisitors',
  'uniqueSessions',
  'botBreakdown',
  'topPages',
  'topClicks',
  'funnel',
  'LAUNCH_FUNNEL_EVENTS',
  'conversionFromPrevious',
  'Launch Funnel',
  'mintedNfts',
]) {
  assert(reportRoute.includes(token), `reporting route must include ${token}`)
}

assert(layout.includes('TFNProductAnalytics'), 'root layout must mount TFN product analytics')
assert(layout.includes('NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN'), 'root layout must support optional Cloudflare Web Analytics token')
assert(layout.includes('static.cloudflareinsights.com/beacon.min.js'), 'root layout must support the Cloudflare Web Analytics beacon')
assert(middleware.includes("pathname === '/api/toothlight/events'"), 'middleware must treat new analytics route as telemetry')
assert(/isToothlightTelemetryRoute[\s\S]*60/.test(middleware), 'Toothlight telemetry must not consume the normal low API rate limit')

if (failures.length > 0) {
  console.error(`FAIL tfn-reporting: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS tfn-reporting')
