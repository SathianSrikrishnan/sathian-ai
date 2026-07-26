import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

import { createAgentEventHandler } from '@/lib/agent/event-handler'
import {
  createOperationalAuditRow,
  createOperationalLog,
} from '@/lib/agent/observability'

export const runtime = 'nodejs'

const FUNNEL_EVENTS_PER_HOUR = 40

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

function createDefaultHandler(): ReturnType<typeof createAgentEventHandler> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) return null

  const serviceClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return createAgentEventHandler({
    isRateLimited: async (_request, event) => {
      const visitorHash = createHash('sha256')
        .update(`sathian-ai:funnel:${event.sessionId}`)
        .digest('hex')
      const { data, error } = await serviceClient.rpc('agent_consume_message_rate_limit', {
        p_visitor_hash: visitorHash,
        p_limit: FUNNEL_EVENTS_PER_HOUR,
        p_window_seconds: 3600,
      })
      return error || typeof data !== 'boolean' ? true : !data
    },
    recordEvent: async (event) => {
      console.info(JSON.stringify(createOperationalLog(event)))
      const { error } = await serviceClient.from('audit_events').insert(
        createOperationalAuditRow(event),
      )
      if (error) throw error
    },
  })
}

export async function POST(request: Request): Promise<Response> {
  if (process.env.PUBLIC_AGENT_ENABLED !== 'true') {
    return json({ error: 'The site agent is not active yet.' }, 503)
  }
  const handler = createDefaultHandler()
  if (!handler) return json({ error: 'The site agent is temporarily unavailable.' }, 503)
  return handler(request)
}
