/**
 * Simple in-memory rate limiter for the mint API.
 * Resets on server restart. Good enough for hackathon MVP.
 * Replace with Redis/Upstash for production.
 */

const windowMs = 60 * 60 * 1000 // 1 hour
const maxRequests = 10 // per IP per hour

const hits = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  hits.forEach((entry, ip) => {
    if (now > entry.resetAt) hits.delete(ip)
  })
}, 10 * 60 * 1000)
