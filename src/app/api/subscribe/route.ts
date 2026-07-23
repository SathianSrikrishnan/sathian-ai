import { Resend } from 'resend'

import { agentVisitorHash } from '@/lib/agent/message-handler'
import { newsletterConfirmation } from '@/lib/newsletter-email'

const CONSENT_NOTICE_VERSION = 'newsletter-notice/2026-07-23'
const VALID_SOURCES = new Set(['sathian-home', 'tfn-footer'])

interface SubscribeResult {
  subscriber_id: string
  created: boolean
  status: string
  receipt_token: string | null
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown; company?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'A valid request is required.' }, 400)
  }

  if (typeof body.company === 'string' && body.company.trim()) {
    return json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body.source === 'string' ? body.source : 'sathian-home'
  if (
    email.length > 320
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !VALID_SOURCES.has(source)
  ) {
    return json({ error: 'Enter a valid email address.' }, 400)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Subscriptions are temporarily unavailable.' }, 503)
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/newsletter_subscribe`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
    body: JSON.stringify({
      p_email: email,
      p_source: source,
      p_consent_notice_version: CONSENT_NOTICE_VERSION,
      p_visitor_hash: agentVisitorHash(request),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    if (errorText.includes('newsletter_rate_limited')) {
      return json({ error: 'Too many attempts. Please try again later.' }, 429)
    }
    console.error('[subscribe] persistence failed', { status: response.status })
    return json({ error: 'That did not save. Please try again.' }, 502)
  }

  const rows = await response.json() as SubscribeResult[]
  const result = rows[0]
  if (!result?.subscriber_id) {
    console.error('[subscribe] invalid persistence response')
    return json({ error: 'That did not save. Please try again.' }, 502)
  }

  let confirmationSent = false
  if (result.created && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const confirmation = newsletterConfirmation(source as 'sathian-home' | 'tfn-footer')
      await resend.emails.send({ ...confirmation, to: email })
      confirmationSent = true
      await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers?id=eq.${encodeURIComponent(result.subscriber_id)}`, {
        method: 'PATCH',
        headers: {
          apikey: serviceRoleKey,
          authorization: `Bearer ${serviceRoleKey}`,
          'content-type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ confirmation_sent_at: new Date().toISOString() }),
      })
    } catch {
      console.error('[subscribe] confirmation email failed')
    }
  }

  return json({
    ok: true,
    created: result.created,
    confirmationSent,
  })
}
