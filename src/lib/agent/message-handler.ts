import { createHash, createHmac } from 'node:crypto'

import {
  SAFE_MODEL_FAILURE,
  type AgentAnswerResult,
} from '@/lib/agent/answer'
import type {
  PersistAgentIntakeInput,
  PersistAgentIntakeResult,
} from '@/lib/agent/intake'
import { evaluateAgentPolicy } from '@/lib/agent/policy'
import { createPublicReceipt } from '@/lib/agent/receipts'
import type { AgentPolicyDecision } from '@/lib/agent/types'

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
  attachmentIntent?: unknown
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

export function agentVisitorHash(request: Request): string | null {
  const forwarded = request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
  if (!forwarded) return null

  const key = process.env.AGENT_VISITOR_HASH_KEY
  if (!key) return null
  return createHmac('sha256', key).update(forwarded).digest('hex')
}

export function agentDedupeKey(publicKey: string, visitor: string | null): string {
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

    let policy = evaluateAgentPolicy({ message: body.message })
    if (policy.route === 'block') {
      return json({
        route: 'block',
        reasonCodes: policy.reasonCodes,
        message: 'I cannot help with private data, credentials, system access, or external actions.',
      }, 403)
    }
    if (body.attachmentIntent === true && policy.route === 'answer') {
      policy = {
        ...policy,
        route: 'answer_and_intake',
        reasonCodes: [...policy.reasonCodes, 'ATTACHMENT_INTAKE_REQUEST'],
      }
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

      const visitor = agentVisitorHash(request)
      persisted = await persistIntake({
        idempotencyKey: agentDedupeKey(publicIdempotencyKey, visitor),
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
