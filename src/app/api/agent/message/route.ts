import { createHash, createHmac } from 'node:crypto'

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

import {
  answerAgentQuestion,
  SAFE_MODEL_FAILURE,
  type AgentAnswerResult,
  type AnswerModelAdapter,
} from '@/lib/agent/answer'
import {
  persistAgentIntake,
  type AgentIntakeRpcClient,
  type PersistAgentIntakeInput,
  type PersistAgentIntakeResult,
} from '@/lib/agent/intake'
import { evaluateAgentPolicy } from '@/lib/agent/policy'
import { createPublicReceipt } from '@/lib/agent/receipts'
import type { AgentPolicyDecision } from '@/lib/agent/types'
import { getPublicMemoryCards } from '@/lib/memory'

export const runtime = 'nodejs'

export const CONSENT_NOTICE_VERSION = 'public-agent-notice/2026-07-14'

type PersistIntake = (input: PersistAgentIntakeInput) => Promise<PersistAgentIntakeResult>
type AnswerQuestion = (input: {
  message: string
  page: string
  policy: AgentPolicyDecision
}) => Promise<AgentAnswerResult>

interface HandlerDependencies {
  persistIntake: PersistIntake
  answerQuestion?: AnswerQuestion
  isRateLimited?: (request: Request) => boolean
}

interface AgentMessageBody {
  message?: unknown
  page?: unknown
  consent?: unknown
  displayName?: unknown
  replyEmail?: unknown
}

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

function pageContext(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.length > 256) return '/'
  if (value.startsWith('//')) return '/'
  return value
}

function optionalString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if (!normalized || normalized.length > maxLength) return null
  return normalized
}

function visitorHash(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (!forwarded) return null

  const key = process.env.AGENT_VISITOR_HASH_KEY
  if (!key) return null
  return createHmac('sha256', key).update(forwarded).digest('hex')
}

function dedupeKey(publicKey: string, visitor: string | null): string {
  const value = `${visitor ?? 'anonymous'}:${publicKey}`
  const secret = process.env.AGENT_IDEMPOTENCY_SECRET
  if (!secret) return createHash('sha256').update(value).digest('hex')
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function createAgentMessageHandler({
  persistIntake,
  answerQuestion,
  isRateLimited = () => false,
}: HandlerDependencies) {
  return async function handleAgentMessage(request: Request): Promise<Response> {
    if (isRateLimited(request)) {
      return json({ error: 'Too many messages. Please wait and try again.' }, 429)
    }

    let body: AgentMessageBody
    try {
      body = (await request.json()) as AgentMessageBody
    } catch {
      return json({ error: 'A valid JSON body is required.' }, 400)
    }

    if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) {
      return json({ error: 'Message must be between 1 and 2000 characters.' }, 400)
    }

    const policy = evaluateAgentPolicy({ message: body.message })
    if (policy.route === 'block') {
      return json({
        route: 'block',
        reasonCodes: policy.reasonCodes,
        message: 'I cannot help with private data, credentials, system access, or external actions.',
      }, 403)
    }

    const currentPage = pageContext(body.page)
    let persisted: PersistAgentIntakeResult | null = null
    if (policy.route === 'intake' || policy.route === 'answer_and_intake') {
      const publicIdempotencyKey = request.headers.get('idempotency-key') ?? ''
      if (!/^[A-Za-z0-9._:-]{16,128}$/.test(publicIdempotencyKey)) {
        return json({ error: 'A valid idempotency key is required.' }, 400)
      }
      if (body.consent !== true) {
        return json({ error: 'Consent is required before a note can be stored.' }, 400)
      }

      const visitor = visitorHash(request)
      persisted = await persistIntake({
        idempotencyKey: dedupeKey(publicIdempotencyKey, visitor),
        message: policy.normalizedMessage,
        route: policy.route,
        reasonCodes: policy.reasonCodes,
        policyVersion: policy.policyVersion,
        consentNoticeVersion: CONSENT_NOTICE_VERSION,
        pageContext: currentPage,
        visitorHash: visitor,
        displayName: optionalString(body.displayName, 120),
        replyEmail: optionalString(body.replyEmail, 320),
      })

      if (!persisted.ok) {
        return json({ error: 'Your note could not be stored. Please try again.' }, 503)
      }
    }

    let answerResult: AgentAnswerResult | null = null
    if (policy.route === 'answer' || policy.route === 'answer_and_intake') {
      try {
        answerResult = answerQuestion
          ? await answerQuestion({ message: policy.normalizedMessage, page: currentPage, policy })
          : { answer: SAFE_MODEL_FAILURE, sources: [], unknown: true, modelUsed: false }
      } catch {
        answerResult = { answer: SAFE_MODEL_FAILURE, sources: [], unknown: true, modelUsed: false }
      }
    }

    const receipt = persisted?.ok ? createPublicReceipt(persisted) : null

    return json({
      route: policy.route,
      answer: answerResult?.answer ?? null,
      sources: answerResult?.sources ?? [],
      receipt,
      capabilities: {
        answered: answerResult !== null,
        intakeStored: persisted?.ok === true,
        deliveryConfirmed: persisted?.ok === true && persisted.deliveryStatus === 'delivered',
      },
    }, persisted?.ok === true && persisted.created ? 202 : 200)
  }
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
