import { NextRequest, NextResponse } from 'next/server'

import {
  parseStudioAllowedEmails,
  requestStudioMagicLink,
  resolveStudioPublicOrigin,
} from '@/lib/studio-authorization'
import {
  copySupabaseCookies,
  createRouteSupabase,
  isSupabaseConfigured,
} from '@/lib/supabase-auth'

const ACCEPTED_MESSAGE = 'If this address is approved, a secure sign-in link is on its way.'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Studio entrance is not configured.' }, { status: 503 })
  }

  const publicOrigin = resolveStudioPublicOrigin({
    configuredOrigin: process.env.STUDIO_PUBLIC_ORIGIN,
  })
  if (!publicOrigin) {
    return NextResponse.json({ error: 'Studio entrance origin is not approved.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  const email =
    body && typeof body === 'object' && typeof (body as { email?: unknown }).email === 'string'
      ? (body as { email: string }).email
      : ''
  const { supabase, response: authResponse } = createRouteSupabase(request)
  const result = await requestStudioMagicLink(
    { email },
    {
      allowedEmails: parseStudioAllowedEmails(process.env.STUDIO_ALLOWED_EMAILS),
      publicOrigin,
      signInWithOtp: (input) => supabase.auth.signInWithOtp(input),
    },
  )

  if (result.kind === 'invalid_email') {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  const acceptedResponse = NextResponse.json(
    { ok: true, message: ACCEPTED_MESSAGE },
    { status: 202 },
  )
  return copySupabaseCookies(authResponse, acceptedResponse)
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true })
  }

  const { supabase, response: authResponse } = createRouteSupabase(request)
  await supabase.auth.signOut({ scope: 'local' })
  return copySupabaseCookies(authResponse, NextResponse.json({ ok: true }))
}
