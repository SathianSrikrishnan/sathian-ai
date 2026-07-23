import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: vi.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null }) }
  },
}))

import { POST } from '@/app/api/subscribe/route'

const originalEnv = { ...process.env }

function request(body: unknown) {
  return new Request('https://sathian.ai/api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.4',
    },
    body: JSON.stringify(body),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  process.env = { ...originalEnv }
})

describe('newsletter subscribe route', () => {
  it('rejects invalid email addresses before persistence', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const response = await POST(request({ email: 'not-an-email', source: 'sathian-home' }))

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('quietly accepts honeypot submissions without persistence', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const response = await POST(request({
      email: 'bot@example.com',
      source: 'sathian-home',
      company: 'Automated spam',
    }))

    expect(response.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not report success when Supabase persistence fails', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('failed', { status: 500 }))

    const response = await POST(request({ email: 'reader@example.com', source: 'sathian-home' }))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) })
  })

  it('returns a saved subscription only after the RPC confirms it', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
    delete process.env.RESEND_API_KEY
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([{
      subscriber_id: '8c4bb12e-f829-4a45-9bbd-066497e12058',
      created: true,
      status: 'subscribed',
      receipt_token: '22f20452-8e0f-4ed7-985f-cc3f3ba1f565',
      unsubscribe_token: '6aad17c7-06a4-4560-93aa-97fe20e7ba5a',
      confirmation_sent_at: null,
    }]))

    const response = await POST(request({ email: 'Reader@Example.com', source: 'sathian-home' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      created: true,
      confirmationSent: false,
    })
  })

  it('records a confirmation only when Resend returns an email id', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
    process.env.RESEND_API_KEY = 'test-resend-key'
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json([{
        subscriber_id: '8c4bb12e-f829-4a45-9bbd-066497e12058',
        created: true,
        status: 'subscribed',
        receipt_token: '22f20452-8e0f-4ed7-985f-cc3f3ba1f565',
        unsubscribe_token: '6aad17c7-06a4-4560-93aa-97fe20e7ba5a',
        confirmation_sent_at: null,
      }]))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))

    const response = await POST(request({ email: 'reader@example.com', source: 'sathian-home' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ confirmationSent: true })
    const deliveryUpdate = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(deliveryUpdate).toMatchObject({
      confirmation_email_id: 'email-1',
      confirmation_error_code: null,
    })
  })
})
