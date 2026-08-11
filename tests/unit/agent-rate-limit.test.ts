import { describe, expect, it, vi } from 'vitest'

import {
  PUBLIC_AGENT_MODEL_CALLS_PER_DAY,
  PUBLIC_AGENT_REQUESTS_PER_HOUR,
  createAgentTesterToken,
  consumeGlobalModelQuota,
  globalModelQuotaHash,
  isAuthorizedAgentTesterRequest,
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

  it('accepts a short-lived signed tester token when the server secret matches', () => {
    vi.stubEnv('SITE_AGENT_TESTER_SECRET', 'test-only-secret-with-enough-entropy')
    const now = Date.UTC(2026, 7, 10, 18, 0, 0)
    const token = createAgentTesterToken({
      runId: 'phase1-674406a',
      expiresAtSeconds: Math.floor(now / 1000) + 600,
      secret: 'test-only-secret-with-enough-entropy',
    })
    const request = new Request('https://sathian.ai/api/agent/message', {
      method: 'POST',
      headers: { 'x-site-agent-test-token': token },
    })

    expect(isAuthorizedAgentTesterRequest(request, now)).toBe(true)
    vi.unstubAllEnvs()
  })

  it('fails closed for absent, expired, far-future, or tampered tester tokens', () => {
    vi.stubEnv('SITE_AGENT_TESTER_SECRET', 'test-only-secret-with-enough-entropy')
    const now = Date.UTC(2026, 7, 10, 18, 0, 0)
    const validToken = createAgentTesterToken({
      runId: 'phase1-674406a',
      expiresAtSeconds: Math.floor(now / 1000) + 600,
      secret: 'test-only-secret-with-enough-entropy',
    })
    const withToken = (token?: string) => new Request('https://sathian.ai/api/agent/message', {
      method: 'POST',
      headers: token ? { 'x-site-agent-test-token': token } : {},
    })
    const tamperedToken = `${validToken.slice(0, -1)}${validToken.endsWith('0') ? '1' : '0'}`

    expect(isAuthorizedAgentTesterRequest(withToken(), now)).toBe(false)
    expect(isAuthorizedAgentTesterRequest(withToken(tamperedToken), now)).toBe(false)
    expect(isAuthorizedAgentTesterRequest(withToken(createAgentTesterToken({
      runId: 'phase1-674406a',
      expiresAtSeconds: Math.floor(now / 1000) - 1,
      secret: 'test-only-secret-with-enough-entropy',
    })), now)).toBe(false)
    expect(isAuthorizedAgentTesterRequest(withToken(createAgentTesterToken({
      runId: 'phase1-674406a',
      expiresAtSeconds: Math.floor(now / 1000) + 3_601,
      secret: 'test-only-secret-with-enough-entropy',
    })), now)).toBe(false)

    vi.unstubAllEnvs()
    expect(isAuthorizedAgentTesterRequest(withToken(validToken), now)).toBe(false)
  })
})
