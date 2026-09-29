import { NextRequest, NextResponse } from 'next/server'

import { isStudioAccessGranted } from '@/lib/cloudflare-access'
import { parseStudioAllowedEmails } from '@/lib/studio-authorization'

// Handler-level check for every Studio API route (the middleware checks too). The only way in is a
// verified Cloudflare Access JWT (Google sign-in at studio.sathian.ai) for an email on
// STUDIO_ACCESS_EMAILS. The name is kept so the routes need no change.
export async function requireStudioAal2(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production' && process.env.STUDIO_E2E_BYPASS === 'true') return null
  if (await isStudioAccessGranted(request.headers, parseStudioAllowedEmails(process.env.STUDIO_ACCESS_EMAILS))) {
    return null
  }
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}
