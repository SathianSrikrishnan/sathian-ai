import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/early-testing/route'
import { EARLY_TESTING, normalizedSignupEmail } from '@/lib/early-testing'

const id = '11111111-1111-4111-8111-111111111111'
const data = { email: ' Adult+Test@Example.COM ', sourceSite: 'proof', sourcePage: '/', availabilityConsent: true, requestId: id, company: '' }
const request = (body: unknown = data, origin = 'https://proof.sathian.ai') => new Request('https://proof.sathian.ai/api/early-testing', {
  method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.5' }, body: JSON.stringify(body),
})
beforeEach(() => { vi.stubEnv('CENTRAL_SIGNUP_REVIEW', ''); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'true'); vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.invalid'); vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-placeholder') })
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('central early-testing intake', () => {
  it('never writes from a protected review even if the activation flag is accidentally true', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_REVIEW', 'true'); const f = vi.fn(); vi.stubGlobal('fetch', f)
    expect((await POST(request())).status).toBe(503); expect(f).not.toHaveBeenCalled()
  })
  it('defaults to no writes until explicitly enabled', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_ENABLED', ''); const f = vi.fn(); vi.stubGlobal('fetch', f)
    expect((await POST(request())).status).toBe(503); expect(f).not.toHaveBeenCalled()
  })
  it.each([null, [], {}, { ...data, email: 'bad' }, { ...data, email: 'a..b@example.com' }, { ...data, email: 'a@-bad.com' },
    { ...data, availabilityConsent: false }, { ...data, company: 'bot' }, { ...data, requestId: 'bad' },
    { ...data, sourceSite: 'unknown' }, { ...data, sourcePage: '/?child=private' }, { ...data, childAge: 6 }, { ...data, marketingOptIn: true }])(
    'rejects invalid or excess personal data without any persistence', async body => {
      const f = vi.fn(); vi.stubGlobal('fetch', f); expect((await POST(request(body))).status).toBe(400); expect(f).not.toHaveBeenCalled()
    })
  it('rejects cross-origin signup without persistence', async () => {
    const f = vi.fn(); vi.stubGlobal('fetch', f); expect((await POST(request(data, 'https://elsewhere.invalid'))).status).toBe(403); expect(f).not.toHaveBeenCalled()
  })
  it('bounds the body before parsing or saving', async () => {
    const f = vi.fn(); vi.stubGlobal('fetch', f); expect((await POST(request({ ...data, email: 'x'.repeat(2200) }))).status).toBe(413); expect(f).not.toHaveBeenCalled()
  })
  it('does not report saved without backend configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', ''); const f = vi.fn(); vi.stubGlobal('fetch', f)
    expect((await POST(request())).status).toBe(503); expect(f).not.toHaveBeenCalled()
  })
  it.each([['proof', '/'], ['proof', '/proof'], ['learn', '/learn'], ['learn', '/learn/stories']])(
    'uses the same persistence contract for %s %s', async (sourceSite, sourcePage) => {
      const f = vi.fn().mockResolvedValue(Response.json([{ receipt: id }]))
      vi.stubGlobal('fetch', f)
      const result = await POST(request({ ...data, sourceSite, sourcePage }))
      expect(await result.json()).toEqual({ ok: true, receipt: id })
      expect(f).toHaveBeenCalledTimes(1)
      expect(f.mock.calls[0][0]).toBe('https://example.invalid/rest/v1/rpc/register_early_tester')
      const sent = JSON.parse(f.mock.calls[0][1].body)
      expect(sent).toMatchObject({ p_email: 'adult+test@example.com', p_source_site: sourceSite, p_source_page: sourcePage,
        p_consent_copy_version: EARLY_TESTING.consentVersion, p_consent_copy: EARLY_TESTING.consent, p_request_id: id })
      expect(sent.p_visitor_hash).toMatch(/^[0-9a-f]{64}$/)
      expect(Object.keys(sent).sort()).toEqual(['p_email', 'p_request_id', 'p_source_site', 'p_source_page', 'p_visitor_hash', 'p_consent_copy_version', 'p_consent_copy'].sort())
      expect(result.headers.get('cache-control')).toBe('no-store')
    })
  it('waits for persistence before reporting success', async () => {
    let resolve!: (response: Response) => void
    const persisted = new Promise<Response>(done => { resolve = done })
    vi.stubGlobal('fetch', vi.fn(() => persisted))
    let completed = false; const result = POST(request()).then(response => { completed = true; return response })
    await new Promise(done => setTimeout(done, 5)); expect(completed).toBe(false)
    resolve(Response.json([{ receipt: id }])); expect((await result).status).toBe(200)
  })
  it.each([[], [{ receipt: 'wrong' }], null])('fails closed on malformed persistence receipts', async rows => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(rows))); expect((await POST(request())).status).toBe(502)
  })
  it('surfaces the database rate limit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('early_tester_rate_limit', { status: 400 })))
    expect((await POST(request())).status).toBe(429)
  })
  it('does not leak database/provider details on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('private database details', { status: 500 })))
    const result = await POST(request()); expect(result.status).toBe(502); expect(await result.json()).toEqual({ error: EARLY_TESTING.failure })
  })
  it('handles unavailable persistence without reporting success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network'))); expect((await POST(request())).status).toBe(502)
  })
  it('normalizes case and whitespace without merging plus-address or dotted identities', () => {
    expect(normalizedSignupEmail(' A.B+tag@Example.com ')).toBe('a.b+tag@example.com')
    expect(normalizedSignupEmail('ab@example.com')).not.toBe(normalizedSignupEmail('a.b+tag@example.com'))
  })
  it('recognizes a committed UUID receipt regardless of its serialized letter case', async () => {
    const requestId = 'ABCDEFAB-ABCD-4ABC-8ABC-ABCDEFABCDEF'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([{ receipt: requestId.toLowerCase() }])))
    expect(await (await POST(request({ ...data, requestId }))).json()).toEqual({ ok: true, receipt: requestId })
  })
})
