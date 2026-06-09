import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const eventRoutePath = resolve(root, 'src/app/api/toothlight/event/route.ts')
const serverEventsPath = resolve(root, 'src/lib/toothlight/server/product-events.ts')
const clientEventsPath = resolve(root, 'src/lib/toothlight/client/product-events.ts')
const makePath = resolve(root, 'src/components/toothlight/v4/ToothlightMakeClient.tsx')
const middlewarePath = resolve(root, 'src/middleware.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

for (const path of [eventRoutePath, serverEventsPath, clientEventsPath]) {
  assert(existsSync(path), `${path.replace(root, '.')} must exist`)
}

const route = existsSync(eventRoutePath) ? readFileSync(eventRoutePath, 'utf8') : ''
const serverEvents = existsSync(serverEventsPath) ? readFileSync(serverEventsPath, 'utf8') : ''
const clientEvents = existsSync(clientEventsPath) ? readFileSync(clientEventsPath, 'utf8') : ''
const make = readFileSync(makePath, 'utf8')
const middleware = readFileSync(middlewarePath, 'utf8')

assert(route.includes('logToothlightProductEvent'), 'event route must use server event helper')
assert(/eventName/.test(route), 'event route must accept an eventName')
assert(/properties/.test(route), 'event route must accept event properties')
assert(/allowedToothlightClientEvents/.test(route), 'event route must whitelist client event names')
assert(/NextResponse\.json/.test(route), 'event route must return JSON')
assert(/fail open|return null|catch/i.test(serverEvents), 'server event logging must fail open')
assert(/fetch\('\/api\/toothlight\/event'/.test(clientEvents), 'client event helper must post to event API')
assert(/keepalive/.test(clientEvents), 'client event helper should use keepalive for navigation-safe logging')
assert(/isToothlightTelemetryRoute/.test(middleware), 'middleware must identify Toothlight telemetry separately')
assert(/isToothlightTelemetryRoute[\s\S]*60/.test(middleware), 'Toothlight telemetry must not consume the normal low API rate limit')
assert(/rateLimitKey/.test(middleware), 'middleware must use route-scoped rate limit keys so telemetry cannot block save')

for (const eventName of [
  'make_viewed',
  'make_step_viewed',
  'source_added',
  'photo_added',
  'drawing_opened',
  'treatment_selected',
  'style_previewed',
  'ai_render_started',
  'ai_render_completed',
  'story_completed',
  'save_attempted',
  'save_clicked',
  'save_completed',
  'save_succeeded',
  'auth_started',
  'note_completed',
  'family_contribution_completed',
]) {
  assert(clientEvents.includes(eventName) || route.includes(eventName) || make.includes(eventName), `event taxonomy must include ${eventName}`)
}

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-events: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-events')
