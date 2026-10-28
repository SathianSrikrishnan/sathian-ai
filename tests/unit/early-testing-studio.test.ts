import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
const auth = vi.hoisted(() => ({ check: vi.fn() }))
vi.mock('@/lib/studio-server-auth', () => ({ requireStudioAal2: auth.check }))
import { GET } from '@/app/api/studio/early-testers/route'

const request = (query = '') => new NextRequest(`https://studio.sathian.ai/api/studio/early-testers${query}`)
beforeEach(() => { auth.check.mockResolvedValue(null); vi.stubEnv('CENTRAL_SIGNUP_REVIEW', ''); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'true'); vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.invalid'); vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-placeholder') })
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks() })
describe('private centralized early-testing review', () => {
  it('requires existing Studio authorization before reading any personal data', async () => {
    auth.check.mockResolvedValue(Response.json({ error: 'unauthorized' }, { status: 401 }))
    const f = vi.fn(); vi.stubGlobal('fetch', f); expect((await GET(request())).status).toBe(401); expect(f).not.toHaveBeenCalled()
  })
  it('stays unavailable before schema enablement', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_ENABLED', ''); const f = vi.fn(); vi.stubGlobal('fetch', f)
    expect((await GET(request())).status).toBe(503); expect(f).not.toHaveBeenCalled()
  })
  it.each(['?page=-1', '?page=1.5', '?page=99999', '?page=no'])('rejects unbounded pagination %s', async query => {
    const f = vi.fn(); vi.stubGlobal('fetch', f); expect((await GET(request(query))).status).toBe(400); expect(f).not.toHaveBeenCalled()
  })
  it('returns at most50 private rows, with independent newsletter state and source history', async () => {
    const rows = Array.from({ length: 51 }, (_, i) => ({ id: i, newsletter_subscribers: { status: 'unsubscribed' }, early_tester_interests: [] }))
    const f = vi.fn().mockResolvedValue(Response.json(rows)); vi.stubGlobal('fetch', f)
    const response = await GET(request('?page=1')); const body = await response.json()
    expect(body.items).toHaveLength(50); expect(body.hasMore).toBe(true); expect(body.items[0].newsletter_subscribers.status).toBe('unsubscribed')
    const url = new URL(f.mock.calls[0][0]); expect(url.searchParams.get('offset')).toBe('50'); expect(url.searchParams.get('limit')).toBe('51')
    expect(response.headers.get('cache-control')).toBe('no-store'); expect(f).toHaveBeenCalledTimes(1)
  })
  it('does not expose backend details on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('private', { status: 500 })))
    const result = await GET(request()); expect(result.status).toBe(503); expect(JSON.stringify(await result.json())).not.toContain('private')
  })
  it('normalizes the unique contact-to-interest embedding for the private view', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([{ id: 'contact', newsletter_subscribers: null,
      early_tester_interests: { status: 'requested', early_tester_signup_events: [] } }])))
    const body = await (await GET(request())).json()
    expect(body.items[0].early_tester_interests).toEqual([{ status: 'requested', early_tester_signup_events: [] }])
    expect(body.items[0].newsletter_subscribers).toBeNull()
  })
})
