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

const ALLOWED_ORIGINS = [
  'https://sathian.ai',
  'https://www.sathian.ai',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to API routes
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

  // --- Add CORS headers to response ---
  const response = NextResponse.next()

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
