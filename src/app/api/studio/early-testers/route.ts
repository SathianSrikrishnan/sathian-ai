import type { NextRequest } from 'next/server'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial
  if (process.env.CENTRAL_SIGNUP_REVIEW === 'true' || process.env.CENTRAL_SIGNUP_ENABLED !== 'true') return reply({ error: 'Early-testing intake is not enabled.' }, 503)
  const page = Number(new URL(request.url).searchParams.get('page') || 0)
  if (!Number.isInteger(page) || page < 0 || page > 2000) return reply({ error: 'Invalid page.' }, 400)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return reply({ error: 'Early-testing records are unavailable.' }, 503)
  const query = new URLSearchParams({
    select: 'id,email_normalized,created_at,newsletter_subscribers(status),early_tester_interests!inner(status,early_tester_signup_events(source_site,source_page,consented_at,consent_copy_version,marketing_opt_in))',
    order: 'created_at.desc,id.desc', limit: '51', offset: String(page * 50),
  })
  try {
    const response = await fetch(`${url}/rest/v1/audience_contacts?${query}`, {
      headers: { apikey: key, authorization: `Bearer ${key}` }, cache: 'no-store', signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error('unavailable')
    const rows = await response.json()
    if (!Array.isArray(rows)) throw new Error('unavailable')
    // PostgREST can embed a unique-FK relationship as an object; keep one UI shape.
    const items = rows.slice(0, 50).map(row => ({
      ...row,
      newsletter_subscribers: Array.isArray(row.newsletter_subscribers) ? row.newsletter_subscribers[0] || null : row.newsletter_subscribers || null,
      early_tester_interests: Array.isArray(row.early_tester_interests) ? row.early_tester_interests : row.early_tester_interests ? [row.early_tester_interests] : [],
    }))
    return reply({ items, hasMore: rows.length > 50, page })
  } catch { return reply({ error: 'Early-testing records are unavailable.' }, 503) }
}
