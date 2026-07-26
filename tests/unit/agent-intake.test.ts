import { describe, expect, it, vi } from 'vitest'

import { persistAgentIntake } from '@/lib/agent/intake'
import { createPublicReceipt } from '@/lib/agent/receipts'

const receiptToken = '6df9bdeb-bf15-4737-ae64-03caaf6f2c82'
const retentionUntil = '2027-01-10T14:00:00.000Z'

const input = {
  idempotencyKey: 'idem_1234567890abcdef',
  message: 'Please pass this note to Sathian.',
  route: 'intake' as const,
  reasonCodes: ['INTAKE_REQUEST'],
  policyVersion: 'public-agent-policy/1.0.0',
  consentNoticeVersion: 'public-agent-notice/2026-07-14',
  pageContext: '/',
  visitorHash: 'visitor_hash',
}

describe('atomic agent intake persistence', () => {
  it('returns no receipt when the persistence transaction fails', async () => {
    const client = {
      rpc: vi.fn(async () => ({ data: null, error: { message: 'database detail' } })),
    }

    const result = await persistAgentIntake(client, input)

    expect(result).toEqual({ ok: false, code: 'persistence_failed' })
    expect('receiptToken' in result).toBe(false)
  })

  it('creates the intake and outbox through one atomic RPC', async () => {
    const client = {
      rpc: vi.fn(async () => ({
        data: [{
          receipt_token: receiptToken,
          delivery_status: 'queued' as const,
          created: true,
          retention_until: retentionUntil,
        }],
        error: null,
      })),
    }

    const result = await persistAgentIntake(client, input)

    expect(client.rpc).toHaveBeenCalledOnce()
    expect(client.rpc).toHaveBeenCalledWith('agent_create_intake', expect.objectContaining({
      p_idempotency_key: input.idempotencyKey,
      p_message: input.message,
      p_policy_version: input.policyVersion,
      p_page_context: input.pageContext,
      p_consent_notice_version: input.consentNoticeVersion,
    }))
    expect(result).toEqual({
      ok: true,
      receiptToken,
      deliveryStatus: 'queued',
      created: true,
      retentionUntil,
    })
  })

  it('returns the same receipt without duplicating the outbox for a repeated key', async () => {
    const receipts = new Map<string, string>()
    let outboxEvents = 0
    const client = {
      rpc: vi.fn(async (_name: string, params: Record<string, unknown>) => {
        const key = String(params.p_idempotency_key)
        const existing = receipts.get(key)
        if (!existing) {
          receipts.set(key, receiptToken)
          outboxEvents += 1
        }
        return {
          data: [{
            receipt_token: receipts.get(key) ?? receiptToken,
            delivery_status: 'queued' as const,
            created: !existing,
            retention_until: retentionUntil,
          }],
          error: null,
        }
      }),
    }

    const first = await persistAgentIntake(client, input)
    const second = await persistAgentIntake(client, input)

    expect(first.ok && first.receiptToken).toBe(receiptToken)
    expect(second.ok && second.receiptToken).toBe(receiptToken)
    expect(outboxEvents).toBe(1)
  })

  it('returns a public receipt without database identifiers or internal errors', () => {
    const receipt = createPublicReceipt({ receiptToken, deliveryStatus: 'queued' })
    const serialized = JSON.stringify(receipt)

    expect(receipt.code).toMatch(/^SA-[A-Z0-9]{10}$/)
    expect(receipt.deliveryStatus).toBe('queued')
    expect(serialized).not.toContain(receiptToken)
    expect(serialized).not.toContain('database')
  })

  it('returns the retention deadline assigned by the transaction', async () => {
    const client = {
      rpc: vi.fn(async () => ({
        data: [{
          receipt_token: receiptToken,
          delivery_status: 'queued' as const,
          created: true,
          retention_until: retentionUntil,
        }],
        error: null,
      })),
    }

    const result = await persistAgentIntake(client, input)

    expect(result.ok && result.retentionUntil).toBe(retentionUntil)
  })
})
