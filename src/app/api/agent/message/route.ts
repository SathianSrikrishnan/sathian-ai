import { createHash, createHmac } from 'node:crypto'

import { createClient } from '@supabase/supabase-js'

import {
  persistAgentIntake,
  type AgentIntakeRpcClient,
  type PersistAgentIntakeInput,
  type PersistAgentIntakeResult,
} from '@/lib/agent/intake'
import { evaluateAgentPolicy } from '@/lib/agent/policy'
import { createPublicReceipt } from '@/lib/agent/receipts'

export const runtime = 'nodejs'

export const CONSENT_NOTICE_VERSION = 'public-agent-notice/2026-07-14'

type PersistIntake = (input: PersistAgentIntakeInput) => Promise<PersistAgentIntakeResult>

interface HandlerDependencies {
  persistIntake: PersistIntake
}

interface AgentMessageBody {
  message?: unknown
  page?: unknown
  consent?: unknown
  displayName?: unknown
  replyEmail?: unknown
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

export function createAgentMessageHandler({ persistIntake }: HandlerDependencies) {
  return async function handleAgentMessage(request: Request): Promise<Response> {
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

    if (policy.route === 'answer') {
      return json({
        route: 'answer',
        answer: null,
        receipt: null,
        capabilities: {
          answered: false,
          intakeStored: false,
          deliveryConfirmed: false,
        },
      })
    }

    const publicIdempotencyKey = request.headers.get('idempotency-key') ?? ''
    if (!/^[A-Za-z0-9._:-]{16,128}$/.test(publicIdempotencyKey)) {
      return json({ error: 'A valid idempotency key is required.' }, 400)
    }
    if (body.consent !== true) {
      return json({ error: 'Consent is required before a note can be stored.' }, 400)
    }

    const visitor = visitorHash(request)
    const persisted = await persistIntake({
      idempotencyKey: dedupeKey(publicIdempotencyKey, visitor),
      message: policy.normalizedMessage,
      route: policy.route,
      reasonCodes: policy.reasonCodes,
      policyVersion: policy.policyVersion,
      consentNoticeVersion: CONSENT_NOTICE_VERSION,
      pageContext: pageContext(body.page),
      visitorHash: visitor,
      displayName: optionalString(body.displayName, 120),
      replyEmail: optionalString(body.replyEmail, 320),
    })

    if (!persisted.ok) {
      return json({ error: 'Your note could not be stored. Please try again.' }, 503)
    }

    return json({
      route: policy.route,
      answer: null,
      receipt: createPublicReceipt(persisted),
      capabilities: {
        answered: false,
        intakeStored: true,
        deliveryConfirmed: persisted.deliveryStatus === 'delivered',
      },
    }, persisted.created ? 202 : 200)
  }
}

function createDefaultHandler(): ReturnType<typeof createAgentMessageHandler> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) return null

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as AgentIntakeRpcClient

  return createAgentMessageHandler({
    persistIntake: (input) => persistAgentIntake(client, input),
  })
}

export async function POST(request: Request): Promise<Response> {
  const handler = createDefaultHandler()
  if (!handler) return json({ error: 'The site agent is temporarily unavailable.' }, 503)
  return handler(request)
}
