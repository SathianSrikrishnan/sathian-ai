import { NextRequest, NextResponse } from "next/server"
import { enhanceDrawing } from "@/lib/toothfairy/ai-enhance"

// Separate rate limiter for AI generations (more restrictive)
const AI_MAX_PER_HOUR = 3 // 3 enhancements per IP per hour
const windowMs = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()

function checkAiRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: AI_MAX_PER_HOUR - 1 }
  }
  if (entry.count >= AI_MAX_PER_HOUR) {
    return { allowed: false, remaining: 0 }
  }
  entry.count++
  return { allowed: true, remaining: AI_MAX_PER_HOUR - entry.count }
}

// Cleanup stale entries
setInterval(() => {
  const now = Date.now()
  hits.forEach((entry, ip) => {
    if (now > entry.resetAt) hits.delete(ip)
  })
}, 10 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    // Origin check
    const origin = req.headers.get("origin") || ""
    const allowed = ["https://toothfairy.network", "http://localhost:3000", "http://localhost:3001"]
    if (!allowed.some((o) => origin.startsWith(o))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Rate limit
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const { allowed: ok, remaining } = checkAiRateLimit(ip)
    if (!ok) {
      return NextResponse.json(
        { error: "Rate limited — 3 AI enhancements per hour. Try again later." },
        { status: 429 },
      )
    }

    const body = await req.json()
    const { imageBase64, prompt } = body

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 })
    }

    // Max ~2MB base64 (prevents abuse)
    if (imageBase64.length > 2_800_000) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 })
    }

    const result = await enhanceDrawing(imageBase64, prompt)

    return NextResponse.json({
      imageUrl: result.imageUrl,
      remaining,
    })
  } catch (err: any) {
    console.error("[enhance] Error:", err.message)
    return NextResponse.json(
      { error: err.message || "AI enhancement failed" },
      { status: 500 },
    )
  }
}
