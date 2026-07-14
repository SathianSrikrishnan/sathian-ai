import { NextRequest, NextResponse } from 'next/server'
import { updateSupabaseSession } from '@/lib/supabase-auth'
import { verifyStudioToken } from '@/lib/studio-token'

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

  // ── Supabase session refresh for TFN app + API routes ──
  // Captures the response so auth cookies propagate through domain rewrites.
  const isTfnApp = pathname.startsWith('/toothfairy/app') || pathname.startsWith('/app/')
  const isTfnApi = pathname.startsWith('/api/toothfairy/') || pathname.startsWith('/api/auth/')
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  let supabaseResponse: NextResponse | null = null
  if ((isTfnApp || isTfnApi) && hasSupabaseConfig) {
    supabaseResponse = await updateSupabaseSession(request)
  }

  // Helper: create a rewrite that preserves auth cookies from session refresh
  const rewriteWithCookies = (dest: URL) => {
    const res = NextResponse.rewrite(dest)
    if (supabaseResponse) {
      supabaseResponse.cookies.getAll().forEach(cookie => {
        res.cookies.set(cookie.name, cookie.value)
      })
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
  if (pathname.startsWith('/studio') || pathname.startsWith('/api/studio/')) {
    if (pathname !== '/studio/login' && pathname !== '/api/studio/auth') {
      const studioAuth = request.cookies.get('studio_auth')?.value
      const studioSecret = process.env.STUDIO_PASSWORD
      const isAuthorized = Boolean(
        studioAuth &&
          studioSecret &&
          await verifyStudioToken(studioAuth, studioSecret)
      )
      if (!isAuthorized) {
        if (pathname.startsWith('/api/studio/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/studio/login', request.url))
      }
    }
  }

  // Only apply rate limiting / CORS to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
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

  const isVoiceRoute = pathname.startsWith('/api/voice/')
  const limit = isVoiceRoute ? 5 : 10  // 5/min voice, 10/min chat
  const windowMs = 60_000  // 1 minute

  if (isRateLimited(ip, limit, windowMs)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    )
  }

  // --- Add CORS + security headers to response ---
  const response = NextResponse.next()

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-voice-pin')
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
