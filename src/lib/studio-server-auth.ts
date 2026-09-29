import { NextRequest, NextResponse } from 'next/server'

import {
  decideStudioAccess,
  hasStudioAdminRole,
  isStudioEmailAllowed,
  parseStudioAllowedEmails,
} from '@/lib/studio-authorization'
import { isStudioAccessGranted } from '@/lib/cloudflare-access'
import {
  copySupabaseCookies,
  createRouteSupabase,
  isSupabaseConfigured,
} from '@/lib/supabase-auth'

export async function requireStudioAal2(request: NextRequest) {
  // Google sign-in through Cloudflare Access counts as the owner's strong login (see cloudflare-access.ts).
  if (await isStudioAccessGranted(request.headers, parseStudioAllowedEmails(process.env.STUDIO_ACCESS_EMAILS))) {
    return null
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'studio_not_configured' }, { status: 503 })
  }

  const { supabase, response: authResponse } = createRouteSupabase(request)
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  let aal: 'aal1' | 'aal2' | null = null

  if (user) {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (!error) aal = data.currentLevel
  }

  const decision = decideStudioAccess({
    pathname: request.nextUrl.pathname,
    hasUser: Boolean(user),
    emailAllowed: isStudioEmailAllowed(
      user?.email,
      parseStudioAllowedEmails(process.env.STUDIO_ALLOWED_EMAILS),
    ),
    hasStudioRole: hasStudioAdminRole(user?.app_metadata),
    aal,
  })

  if (decision.kind === 'allow') return null

  const status = decision.kind === 'deny' ? decision.status : 403
  const error = decision.kind === 'deny' ? decision.code : 'forbidden'
  return copySupabaseCookies(
    authResponse,
    NextResponse.json({ error }, { status }),
  )
}
