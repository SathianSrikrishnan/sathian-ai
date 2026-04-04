import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    // Store in thoughts table (Brain) as a signup signal
    const res = await fetch(`${supabaseUrl}/rest/v1/thoughts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        content: `TFN email signup: ${email.toLowerCase().trim()}`,
        source: source || 'tfn-landing',
        category: 'signup',
        created_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Supabase error:', text)
      // Still return OK to user — log the email at minimum
      console.log('EMAIL SIGNUP (fallback):', email.toLowerCase().trim())
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
