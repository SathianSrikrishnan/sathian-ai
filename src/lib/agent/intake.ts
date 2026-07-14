import type { AgentRoute } from '@/lib/agent/types'
import type { PublicDeliveryStatus } from '@/lib/agent/receipts'

type IntakeRoute = Extract<AgentRoute, 'intake' | 'answer_and_intake'>

export interface PersistAgentIntakeInput {
  idempotencyKey: string
  message: string
  route: IntakeRoute
  reasonCodes: string[]
  policyVersion: string
  consentNoticeVersion: string
  pageContext: string
  visitorHash: string | null
  displayName?: string | null
  replyEmail?: string | null
}

interface IntakeRpcRow {
  receipt_token: string
  delivery_status: PublicDeliveryStatus
  created: boolean
  retention_until: string
}

export interface AgentIntakeRpcClient {
  rpc(
    functionName: 'agent_create_intake',
    params: Record<string, unknown>,
  ): Promise<{ data: IntakeRpcRow[] | IntakeRpcRow | null; error: { message: string } | null }>
}

export type PersistAgentIntakeResult =
  | {
      ok: true
      receiptToken: string
      deliveryStatus: PublicDeliveryStatus
      created: boolean
      retentionUntil: string
    }
  | { ok: false; code: 'persistence_failed' }

function isRpcRow(value: unknown): value is IntakeRpcRow {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.receipt_token === 'string' &&
    ['queued', 'delivered', 'failed'].includes(String(row.delivery_status)) &&
    typeof row.created === 'boolean' &&
    typeof row.retention_until === 'string'
  )
}

export async function persistAgentIntake(
  client: AgentIntakeRpcClient,
  input: PersistAgentIntakeInput,
): Promise<PersistAgentIntakeResult> {
  try {
    const { data, error } = await client.rpc('agent_create_intake', {
      p_idempotency_key: input.idempotencyKey,
      p_message: input.message,
      p_route: input.route,
      p_reason_codes: input.reasonCodes,
      p_policy_version: input.policyVersion,
      p_consent_notice_version: input.consentNoticeVersion,
      p_page_context: input.pageContext,
      p_visitor_hash: input.visitorHash,
      p_display_name: input.displayName ?? null,
      p_reply_email: input.replyEmail ?? null,
    })

    if (error) return { ok: false, code: 'persistence_failed' }

    const row = Array.isArray(data) ? data[0] : data
    if (!isRpcRow(row)) return { ok: false, code: 'persistence_failed' }

    return {
      ok: true,
      receiptToken: row.receipt_token,
      deliveryStatus: row.delivery_status,
      created: row.created,
      retentionUntil: row.retention_until,
    }
  } catch {
    return { ok: false, code: 'persistence_failed' }
  }
}
