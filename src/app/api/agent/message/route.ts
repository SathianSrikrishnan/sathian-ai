import { createHash } from 'node:crypto'

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
import { createAgentMessageHandler } from '@/lib/agent/message-handler'
import { getPublicMemoryCards } from '@/lib/memory'

export const runtime = 'nodejs'

const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 60 * 1000
const requestTimes = new Map<string, number[]>()

function defaultRateLimit(request: Request): boolean {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const key = createHash('sha256').update(ip).digest('hex')
  const now = Date.now()
  const recent = (requestTimes.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    requestTimes.set(key, recent)
    return true
  }
  recent.push(now)
  requestTimes.set(key, recent)
  return false
}

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

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as AgentIntakeRpcClient

  const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null
  const model: AnswerModelAdapter = {
    async generate(input) {
      if (!anthropic) throw new Error('answer_model_unavailable')
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
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
    isRateLimited: defaultRateLimit,
  })
}

export async function POST(request: Request): Promise<Response> {
  const handler = createDefaultHandler()
  if (!handler) return json({ error: 'The site agent is temporarily unavailable.' }, 503)
  return handler(request)
}
