import { NextRequest, NextResponse } from 'next/server'

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

import { ALLOWED_ORIGINS } from '@/lib/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // --- Subdomain routing: toothfairy.sathian.ai → /toothfairy/* ---
  if (hostname === 'toothfairy.sathian.ai') {
    // Don't rewrite static assets (images, videos, fonts, etc.)
    if (pathname.match(/\.\w+$/)) return NextResponse.next()
    const dest = pathname === '/' ? '/toothfairy/network' : `/toothfairy/network${pathname}`
    return NextResponse.rewrite(new URL(dest, request.url))
  }

  // --- Studio authentication ---
  if (pathname.startsWith('/studio') || pathname.startsWith('/api/studio/')) {
    if (pathname !== '/studio/login' && pathname !== '/api/studio/auth') {
      const studioAuth = request.cookies.get('studio_auth')?.value
      // Verify signed token format: timestamp.hmac (not just 'true')
      const isValidFormat = studioAuth && /^\d+\.[a-f0-9]{64}$/.test(studioAuth)
      const isNotExpired = isValidFormat && (Date.now() - parseInt(studioAuth!.split('.')[0], 10)) < 30 * 24 * 60 * 60 * 1000
      if (!isNotExpired) {
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
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
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

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
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
