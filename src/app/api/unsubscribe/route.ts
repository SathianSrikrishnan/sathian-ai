function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { token?: unknown } | null
  const token = typeof body?.token === 'string' ? body.token.trim() : ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    return json({ error: 'This unsubscribe link is not valid.' }, 400)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Unsubscribe is temporarily unavailable.' }, 503)
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/newsletter_unsubscribe`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
    body: JSON.stringify({ p_token: token }),
  })
  if (!response.ok) return json({ error: 'That did not save. Please try again.' }, 502)

  const rows = await response.json() as Array<{ found: boolean }>
  if (!rows[0]?.found) return json({ error: 'This unsubscribe link is no longer valid.' }, 404)
  return json({ ok: true })
}
