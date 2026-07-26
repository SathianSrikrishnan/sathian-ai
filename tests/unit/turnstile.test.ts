import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyFileIntakeHuman } from '@/lib/agent/turnstile'

const original = {
  endpoint: process.env.TURNSTILE_VERIFY_URL,
  hostnames: process.env.TURNSTILE_ALLOWED_HOSTNAMES,
}

afterEach(() => {
  vi.restoreAllMocks()
  if (original.endpoint === undefined) delete process.env.TURNSTILE_VERIFY_URL
  else process.env.TURNSTILE_VERIFY_URL = original.endpoint
  if (original.hostnames === undefined) delete process.env.TURNSTILE_ALLOWED_HOSTNAMES
  else process.env.TURNSTILE_ALLOWED_HOSTNAMES = original.hostnames
})

function input() {
  return {
    token: 'turnstile-token',
    request: new Request('https://sathian.ai/api/agent/upload/reserve', {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    }),
    idempotencyKey: 'a94fc2ea-2d45-4b65-9e3f-57b7b0830dea',
  }
}

describe('file-intake Turnstile verification', () => {
  it('accepts only the expected action and hostname through the server worker', async () => {
    process.env.TURNSTILE_VERIFY_URL = 'https://turnstile.example.workers.dev'
    process.env.TURNSTILE_ALLOWED_HOSTNAMES = 'sathian.ai,www.sathian.ai'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({
      success: true,
      action: 'turnstile-spin-v1',
      hostname: 'sathian.ai',
    }))

    await expect(verifyFileIntakeHuman(input())).resolves.toBe(true)

    const request = fetchMock.mock.calls[0]
    expect(request[0]).toBeInstanceOf(URL)
    const body = JSON.parse(String((request[1] as RequestInit).body))
    expect(body).toMatchObject({ token: 'turnstile-token', remoteip: '203.0.113.10' })
    expect(body.idempotency_key).toBe(input().idempotencyKey)
    expect(body.secret).toBeUndefined()
  })

  it.each([
    [{ success: true, action: 'other-action', hostname: 'sathian.ai' }],
    [{ success: true, action: 'turnstile-spin-v1', hostname: 'attacker.example' }],
    [{ success: false, action: 'turnstile-spin-v1', hostname: 'sathian.ai' }],
  ])('fails closed for an invalid verification contract', async (result) => {
    process.env.TURNSTILE_VERIFY_URL = 'https://turnstile.example.workers.dev'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(result))

    await expect(verifyFileIntakeHuman(input())).resolves.toBe(false)
  })

  it('fails closed when the verification worker is not configured', async () => {
    delete process.env.TURNSTILE_VERIFY_URL
    await expect(verifyFileIntakeHuman(input())).rejects.toThrow('turnstile_verify_url_missing')
  })
})
