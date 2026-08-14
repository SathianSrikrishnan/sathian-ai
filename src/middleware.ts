import { NextRequest, NextResponse } from 'next/server'
import {
  copySupabaseCookies,
  isSupabaseConfigured,
  refreshSupabaseSession,
} from '@/lib/supabase-auth'
import {
  decideStudioAccess,
  hasStudioAdminRole,
  isStudioEmailAllowed,
  parseStudioAllowedEmails,
} from '@/lib/studio-authorization'

// Simple in-memory rate limiter (resets on deploy/restart — fine for Vercel serverless)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  entry.count++
  return entry.count > limit
}

export function hasDedicatedApiRateLimit(pathname: string): boolean {
  return pathname === '/api/agent/message' || pathname === '/api/agent/event'
}

// Clean up stale entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach(key => rateLimitMap.delete(key))
}, 60_000)

import { ALLOWED_ORIGINS, isAllowedOrigin } from '@/lib/constants'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  if (hostname === 'studio.sathian.ai' && pathname === '/') {
    return NextResponse.redirect(new URL('/studio', request.url), 307)
  }

  // ── Supabase session refresh for TFN app + API routes ──
  // Captures the response so auth cookies propagate through domain rewrites.
  const isTfnApp = pathname.startsWith('/toothfairy/app') || pathname.startsWith('/app/')
  const isTfnApi = pathname.startsWith('/api/toothfairy/') || pathname.startsWith('/api/auth/')
  const isStudioPath = pathname.startsWith('/studio') || pathname.startsWith('/api/studio/')
  const studioE2eBypass = isStudioPath
    && process.env.NODE_ENV !== 'production'
    && process.env.STUDIO_E2E_BYPASS === 'true'
  const publicStudioDecision = isStudioPath ? decideStudioAccess({ pathname }) : null
  const needsStudioSession = isStudioPath && !studioE2eBypass && publicStudioDecision?.kind !== 'allow'
  const hasSupabaseConfig = isSupabaseConfigured()
  let supabaseResponse: NextResponse | null = null
  let studioSession: Awaited<ReturnType<typeof refreshSupabaseSession>> | null = null
  if ((isTfnApp || isTfnApi || needsStudioSession) && hasSupabaseConfig) {
    const refreshed = await refreshSupabaseSession(request)
    supabaseResponse = refreshed.response
    if (needsStudioSession) studioSession = refreshed
  }

  // Helper: create a rewrite that preserves auth cookies from session refresh
  const rewriteWithCookies = (dest: URL) => {
    const res = NextResponse.rewrite(dest)
    if (supabaseResponse) {
      copySupabaseCookies(supabaseResponse, res)
    }
    return res
  }

  // --- Subdomain routing: toothfairy.sathian.ai → /toothfairy/* ---
  if (hostname === 'toothfairy.sathian.ai') {
    // Don't rewrite static assets (images, videos, fonts, etc.)
    if (pathname.match(/\.\w+$/)) return NextResponse.next()
    const dest = pathname === '/' ? '/toothfairy' : `/toothfairy${pathname}`
    return rewriteWithCookies(new URL(dest, request.url))
  }

  // --- Domain routing: toothfairy.network → /toothfairy/* ---
  const isTfnDomain = hostname === 'toothfairy.network' || hostname === 'www.toothfairy.network'
  if (isTfnDomain) {
    if (pathname.match(/\.\w+$/)) return NextResponse.next()
    if (pathname.startsWith('/api/')) return NextResponse.next() // API routes pass through
    // Landing page at root
    if (pathname === '/') {
      return rewriteWithCookies(new URL('/toothfairy', request.url))
    }
    // App at /app
    if (pathname === '/app') {
      return rewriteWithCookies(new URL('/toothfairy/app', request.url))
    }
    // Dashboard
    if (pathname === '/dashboard') {
      return rewriteWithCookies(new URL('/toothfairy/app/dashboard', request.url))
    }
    // Child pages: /tooth/isa → /tooth/isa (pass through to app route)
    if (pathname.startsWith('/tooth/')) {
      return rewriteWithCookies(new URL(pathname, request.url))
    }
    // Gift links
    if (pathname.startsWith('/gift/')) {
      return rewriteWithCookies(new URL(`/toothfairy/app${pathname}`, request.url))
    }
    // About page
    if (pathname === '/about') {
      return rewriteWithCookies(new URL('/toothfairy/network/about', request.url))
    }
    // App sub-routes: /app/new, /app/dashboard, etc.
    if (pathname.startsWith('/app/')) {
      return rewriteWithCookies(new URL(`/toothfairy${pathname}`, request.url))
    }
    // /network → redirect to root (chain animation is the new landing)
    if (pathname === '/network') {
      return NextResponse.redirect(new URL('/', request.url), 307)
    }
    // /stories → redirect to homepage trilogy (explore archived during trilogy launch)
    if (pathname === '/stories' || pathname.startsWith('/stories/')) {
      return NextResponse.redirect(new URL('/#stories', request.url), 307)
    }
    // /network/about still works
    if (pathname.startsWith('/network/')) {
      return rewriteWithCookies(new URL(`/toothfairy${pathname}`, request.url))
    }
    // Bare /toothfairy on TFN domain → redirect to root (clean URL, and
    // prevents the catch-all from double-prefixing to /toothfairy/toothfairy)
    if (pathname === '/toothfairy') {
      return NextResponse.redirect(new URL('/', request.url), 307)
    }
    // Links already prefixed with /toothfairy/ — pass through without double-prefixing
    if (pathname.startsWith('/toothfairy/')) {
      return rewriteWithCookies(new URL(pathname, request.url))
    }
    // Everything else
    return rewriteWithCookies(new URL(`/toothfairy${pathname}`, request.url))
  }

  // --- Studio authentication ---
  if (isStudioPath && !studioE2eBypass) {
    let aal: 'aal1' | 'aal2' | null = null
    if (studioSession?.user) {
      const { data, error } = await studioSession.supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!error) aal = data.currentLevel
    }

    const decision = decideStudioAccess({
      pathname,
      hasUser: Boolean(studioSession?.user),
      emailAllowed: isStudioEmailAllowed(
        studioSession?.user?.email,
        parseStudioAllowedEmails(process.env.STUDIO_ALLOWED_EMAILS),
      ),
      hasStudioRole: hasStudioAdminRole(studioSession?.user?.app_metadata),
      aal,
    })

    if (decision.kind === 'redirect') {
      const response = NextResponse.redirect(new URL(decision.location, request.url))
      return supabaseResponse ? copySupabaseCookies(supabaseResponse, response) : response
    }
    if (decision.kind === 'deny') {
      const response = NextResponse.json({ error: decision.code }, { status: decision.status })
      return supabaseResponse ? copySupabaseCookies(supabaseResponse, response) : response
    }
  }

  // Only apply rate limiting / CORS to API routes
  if (!pathname.startsWith('/api/')) {
    return supabaseResponse ?? NextResponse.next()
  }

  // --- CORS check ---
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: 'Not allowed' },
      { status: 403 }
    )
  }

  // --- Rate limiting ---
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  const limit = 10
  const windowMs = 60_000  // 1 minute

  if (!hasDedicatedApiRateLimit(pathname) && isRateLimited(ip, limit, windowMs)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    )
  }

  // --- Add CORS + security headers to response ---
  const response = NextResponse.next()

  if (supabaseResponse) copySupabaseCookies(supabaseResponse, response)

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key, x-voice-pin')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    // Match all paths for subdomain routing
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
