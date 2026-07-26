import { afterEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/api/unsubscribe/route'

const originalEnv = { ...process.env }
const token = '6aad17c7-06a4-4560-93aa-97fe20e7ba5a'

afterEach(() => {
  vi.restoreAllMocks()
  process.env = { ...originalEnv }
})

function request(value: unknown) {
  return new Request('https://sathian.ai/api/unsubscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(value),
  })
}

describe('newsletter unsubscribe route', () => {
  it('does not mutate from an invalid token', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const response = await POST(request({ token: 'invalid' }))
    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns success after the private RPC confirms the record', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([{ found: true, status: 'unsubscribed' }]))

    const response = await POST(request({ token }))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
  })
})
