import type { AgentOperationalEvent } from '@/lib/agent/observability'

type FunnelEvent = Extract<
  AgentOperationalEvent,
  { event: 'site_session_started' | 'agent_widget_viewed' }
>

interface AgentEventDependencies {
  recordEvent: (event: FunnelEvent) => Promise<void>
  isRateLimited?: (request: Request, event: FunnelEvent) => boolean | Promise<boolean>
}

interface AgentEventBody {
  event?: unknown
  sessionId?: unknown
  page?: unknown
  source?: unknown
}

const EVENT_NAMES = new Set(['site_session_started', 'agent_widget_viewed'])
const SOURCES = new Set(['site', 'inline', 'floating'])
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

function safePage(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null
  return value.length <= 256 ? value : null
}

function isSameEventOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    const supplied = new URL(origin)
    const target = new URL(request.url)
    if (supplied.origin === target.origin) return true
    const declaredDeploymentHosts = new Set([
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
    ].filter((host): host is string => Boolean(host)))
    if (declaredDeploymentHosts.has(supplied.host)) return true
    if (process.env.NODE_ENV === 'production') return false

    const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]'])
    return supplied.protocol === 'http:'
      && target.protocol === 'http:'
      && supplied.port === target.port
      && loopbackHosts.has(supplied.hostname)
      && loopbackHosts.has(target.hostname)
  } catch {
    return false
  }
}

export function createAgentEventHandler({
  recordEvent,
  isRateLimited = () => false,
}: AgentEventDependencies) {
  return async function handleAgentEvent(request: Request): Promise<Response> {
    if (!isSameEventOrigin(request)) {
      return json({ error: 'Cross-origin event writes are not allowed.' }, 403)
    }

    let body: AgentEventBody
    try {
      body = (await request.json()) as AgentEventBody
    } catch {
      return json({ error: 'A valid JSON body is required.' }, 400)
    }

    const page = safePage(body.page)
    if (
      typeof body.event !== 'string'
      || !EVENT_NAMES.has(body.event)
      || typeof body.sessionId !== 'string'
      || !UUID_PATTERN.test(body.sessionId)
      || typeof body.source !== 'string'
      || !SOURCES.has(body.source)
      || !page
    ) {
      return json({ error: 'Invalid operational event.' }, 400)
    }

    const event: FunnelEvent = {
      event: body.event as FunnelEvent['event'],
      sessionId: body.sessionId,
      page,
      source: body.source as FunnelEvent['source'],
    }
    if (await isRateLimited(request, event)) {
      return json({ error: 'Too many operational events.' }, 429)
    }

    try {
      await recordEvent(event)
    } catch {
      return json({ error: 'Operational event unavailable.' }, 503)
    }
    return json({ accepted: true }, 202)
  }
}
