import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

import {
  answerAgentQuestion,
  type AnswerModelAdapter,
} from '@/lib/agent/answer'
import {
  persistAgentIntake,
  type AgentIntakeRpcClient,
} from '@/lib/agent/intake'
import {
  agentVisitorHash,
  createAgentMessageHandler,
} from '@/lib/agent/message-handler'
import {
  createOperationalAuditRow,
  createOperationalLog,
} from '@/lib/agent/observability'
import { getPublicMemoryCards } from '@/lib/memory'

export const runtime = 'nodejs'

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function createDefaultHandler(): ReturnType<typeof createAgentMessageHandler> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) return null

  const serviceClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const client = serviceClient as unknown as AgentIntakeRpcClient

  const consumeMessageRateLimit = async (request: Request): Promise<boolean> => {
    const visitorHash = agentVisitorHash(request)
    if (!visitorHash) return true
    const { data, error } = await serviceClient.rpc('agent_consume_message_rate_limit', {
      p_visitor_hash: visitorHash,
      p_limit: 30,
      p_window_seconds: 3600,
    })
    return error || typeof data !== 'boolean' ? true : !data
  }

  const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null
  const model: AnswerModelAdapter = {
    async generate(input) {
      if (!anthropic) throw new Error('answer_model_unavailable')
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: input.maxTokens,
        system: input.system,
        messages: [{ role: 'user', content: input.user }],
      }, { signal: input.signal })
      const text = response.content.find((part) => part.type === 'text')
      return text?.type === 'text' ? text.text : ''
    },
  }

  return createAgentMessageHandler({
    persistIntake: (input) => persistAgentIntake(client, input),
    answerQuestion: async (input) => answerAgentQuestion({
      ...input,
      cards: await getPublicMemoryCards(),
    }, { model }),
    isRateLimited: consumeMessageRateLimit,
    recordOperationalEvent: async ({ event, errorCode, policyVersion }) => {
      const operationalEvent = { event, errorCode }
      console.error(JSON.stringify(createOperationalLog(operationalEvent)))
      const { error } = await serviceClient
        .from('audit_events')
        .insert(createOperationalAuditRow(operationalEvent, policyVersion))
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
