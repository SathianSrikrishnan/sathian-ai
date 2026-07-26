import type { EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import { isStudioEmailAllowed, parseStudioAllowedEmails, resolveStudioPublicOrigin } from '@/lib/studio-authorization'
import {
  copySupabaseCookies,
  createRouteSupabase,
  isSupabaseConfigured,
} from '@/lib/supabase-auth'

const SUPPORTED_EMAIL_OTP_TYPES = new Set<EmailOtpType>(['email', 'magiclink'])

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Studio entrance is not configured.' }, { status: 503 })
  }

  const publicOrigin = resolveStudioPublicOrigin({
    configuredOrigin: process.env.STUDIO_PUBLIC_ORIGIN,
  })
  if (!publicOrigin) {
    return NextResponse.json({ error: 'Studio entrance origin is not approved.' }, { status: 503 })
  }

  const { supabase, response: authResponse } = createRouteSupabase(request)
  const code = request.nextUrl.searchParams.get('code')
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null

  let confirmationError: unknown = null
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    confirmationError = error
  } else if (tokenHash && type && SUPPORTED_EMAIL_OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    confirmationError = error
  } else {
    confirmationError = new Error('Unsupported confirmation payload')
  }

  const redirectWithCookies = (path: string) => {
    const response = NextResponse.redirect(new URL(path, publicOrigin))
    response.headers.set('Cache-Control', 'no-store')
    return copySupabaseCookies(authResponse, response)
  }

  if (confirmationError) {
    return redirectWithCookies('/studio/login?error=invalid_link')
  }

  const { data, error } = await supabase.auth.getUser()
  const allowedEmails = parseStudioAllowedEmails(process.env.STUDIO_ALLOWED_EMAILS)
  if (error || !data.user || !isStudioEmailAllowed(data.user.email, allowedEmails)) {
    await supabase.auth.signOut({ scope: 'local' })
    return redirectWithCookies('/studio/login?error=not_authorized')
  }

  return redirectWithCookies('/studio/mfa')
}
