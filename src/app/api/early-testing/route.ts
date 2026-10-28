import { createHmac } from 'node:crypto'
import { EARLY_TESTING, normalizedSignupEmail, validSignupSource } from '@/lib/early-testing'

export const runtime = 'nodejs'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const allowed = new Set(['email', 'sourceSite', 'sourcePage', 'availabilityConsent', 'requestId', 'company'])
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request: Request) {
  // Remains off until the proposed schema and public copy have been reviewed.
  if (process.env.CENTRAL_SIGNUP_REVIEW === 'true' || process.env.CENTRAL_SIGNUP_ENABLED !== 'true') return reply({ error: 'Signup is not activated.' }, 503)
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Invalid origin.' }, 403)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply({ error: 'A JSON request is required.' }, 415)
  const text = await request.text()
  if (Buffer.byteLength(text, 'utf8') > 2048) return reply({ error: 'Request too large.' }, 413)
  let body: Record<string, unknown>
  try {
    body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error()
  } catch { return reply({ error: 'Invalid request.' }, 400) }
  // Reject extra personal/child data rather than silently forwarding it.
  if (Object.keys(body).some(key => !allowed.has(key))) return reply({ error: 'Please send only the requested signup details.' }, 400)
  if (body.company !== '' || body.availabilityConsent !== true) return reply({ error: 'Please check your signup details.' }, 400)
  const email = normalizedSignupEmail(body.email)
  if (!email || !validSignupSource(body.sourceSite, body.sourcePage) || typeof body.requestId !== 'string' || !uuid.test(body.requestId)) {
    return reply({ error: 'Please check your email and signup details.' }, 400)
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return reply({ error: 'Signup is temporarily unavailable. Please try again later.' }, 503)
  const visitor = createHmac('sha256', key).update(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown').digest('hex')
  try {
    const saved = await fetch(`${url}/rest/v1/rpc/register_early_tester`, {
      method: 'POST',
      headers: { apikey: key, authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_email: email, p_request_id: body.requestId, p_source_site: body.sourceSite, p_source_page: body.sourcePage,
        p_visitor_hash: visitor, p_consent_copy_version: EARLY_TESTING.consentVersion, p_consent_copy: EARLY_TESTING.consent }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!saved.ok) {
      const detail = await saved.text()
      if (detail.includes('early_tester_rate_limit')) return reply({ error: 'Too many attempts. Please try again later.' }, 429)
      return reply({ error: EARLY_TESTING.failure }, 502)
    }
    const rows = await saved.json()
    if (!Array.isArray(rows) || typeof rows[0]?.receipt !== 'string' || rows[0].receipt.toLowerCase() !== body.requestId.toLowerCase()) return reply({ error: EARLY_TESTING.failure }, 502)
    // No automatic newsletter subscription, confirmation email, invite or grant.
    return reply({ ok: true, receipt: body.requestId })
  } catch { return reply({ error: EARLY_TESTING.failure }, 502) }
}
