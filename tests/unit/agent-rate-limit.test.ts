import { describe, expect, it, vi } from 'vitest'

import {
  PUBLIC_AGENT_MODEL_CALLS_PER_DAY,
  PUBLIC_AGENT_REQUESTS_PER_HOUR,
  consumeGlobalModelQuota,
  globalModelQuotaHash,
} from '@/lib/agent/rate-limits'

describe('public-agent durable cost limits', () => {
  it('uses the approved visitor and global launch ceilings', () => {
    expect(PUBLIC_AGENT_REQUESTS_PER_HOUR).toBe(10)
    expect(PUBLIC_AGENT_MODEL_CALLS_PER_DAY).toBe(100)
  })

  it('uses a stable, non-visitor database key for the global model quota', () => {
    expect(globalModelQuotaHash()).toMatch(/^[a-f0-9]{64}$/)
    expect(globalModelQuotaHash()).toBe(globalModelQuotaHash())
  })

  it('consumes the service-only durable limiter with a rolling 24-hour window', async () => {
    const rpc = vi.fn(async () => ({ data: true, error: null }))

    const allowed = await consumeGlobalModelQuota({ rpc })

    expect(allowed).toBe(true)
    expect(rpc).toHaveBeenCalledWith('agent_consume_message_rate_limit', {
      p_visitor_hash: globalModelQuotaHash(),
      p_limit: 100,
      p_window_seconds: 86_400,
    })
  })

  it('fails closed when the database denies or cannot decide the global quota', async () => {
    expect(await consumeGlobalModelQuota({
      rpc: vi.fn(async () => ({ data: false, error: null })),
    })).toBe(false)
    expect(await consumeGlobalModelQuota({
      rpc: vi.fn(async () => ({ data: null, error: { message: 'unavailable' } })),
    })).toBe(false)
    expect(await consumeGlobalModelQuota({
      rpc: vi.fn(async () => { throw new Error('unavailable') }),
    })).toBe(false)
  })
})
