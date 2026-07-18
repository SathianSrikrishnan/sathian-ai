import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

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
  type AgentOperationalEvent,
} from '@/lib/agent/observability'
import {
  PUBLIC_AGENT_MODEL_CALLS_PER_DAY,
  PUBLIC_AGENT_REQUESTS_PER_HOUR,
  consumeGlobalModelQuota,
  type AgentRateLimitRpcClient,
} from '@/lib/agent/rate-limits'
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
      p_limit: PUBLIC_AGENT_REQUESTS_PER_HOUR,
      p_window_seconds: 3600,
    })
    return error || typeof data !== 'boolean' ? true : !data
  }

  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null
  const model: AnswerModelAdapter = {
    async generate(input) {
      if (!openai) throw new Error('answer_model_unavailable')
      const quotaAvailable = await consumeGlobalModelQuota(
        serviceClient as unknown as AgentRateLimitRpcClient,
        PUBLIC_AGENT_MODEL_CALLS_PER_DAY,
      )
      if (!quotaAvailable) throw new Error('answer_model_daily_quota')
      const response = await openai.chat.completions.create({
        model: 'gpt-5.4-mini',
        max_completion_tokens: input.maxTokens,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
      }, { signal: input.signal })
      return response.choices[0]?.message.content ?? ''
    },
  }

  return createAgentMessageHandler({
    persistIntake: (input) => persistAgentIntake(client, input),
    answerQuestion: async (input) => answerAgentQuestion({
      ...input,
      cards: await getPublicMemoryCards(),
    }, { model }),
    isRateLimited: consumeMessageRateLimit,
    recordOperationalEvent: async (record) => {
      const { policyVersion, ...event } = record
      const operationalEvent = event as AgentOperationalEvent
      const log = JSON.stringify(createOperationalLog(operationalEvent))
      if (operationalEvent.event === 'agent_answer_model_failed') console.error(log)
      else console.info(log)
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
