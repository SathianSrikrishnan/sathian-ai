import { NextRequest, NextResponse } from "next/server"
import {
  enhanceDrawing,
  type EnhanceCharm,
  type EnhanceTradition,
} from "@/lib/toothfairy/ai-enhance"
import { isAllowedOrigin } from "@/lib/constants"

export const maxDuration = 60

const AI_MAX_PER_HOUR = 10
const windowMs = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()

function checkAiRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  retryAfter?: number
} {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: AI_MAX_PER_HOUR - 1 }
  }
  if (entry.count >= AI_MAX_PER_HOUR) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }
  entry.count++
  return { allowed: true, remaining: AI_MAX_PER_HOUR - entry.count }
}

setInterval(() => {
  const now = Date.now()
  hits.forEach((entry, ip) => {
    if (now > entry.resetAt) hits.delete(ip)
  })
}, 10 * 60 * 1000)

const VALID_TRADITIONS = new Set<EnhanceTradition>([
  "tanda",
  "anna-bogle",
  "raton-perez",
  "kkachi",
  "ethiopian-hyena",
  "mayil",
  "hazara",
  "finland",
  "anka",
  "default",
])

const VALID_CHARMS = new Set<EnhanceCharm>(["sparkle", "glow", "magic"])

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin")
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const rateLimit = checkAiRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "rate_limit",
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { drawingDataUrl, tradition, charms } = body

    if (!drawingDataUrl || typeof drawingDataUrl !== "string") {
      return NextResponse.json(
        { error: "invalid_input", detail: "Drawing data is missing. Please go back and redraw." },
        { status: 400 }
      )
    }

    if (!drawingDataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "invalid_input", detail: "Drawing data is corrupted. Please go back and redraw." },
        { status: 400 }
      )
    }

    if (drawingDataUrl.length > 4_000_000) {
      return NextResponse.json(
        { error: "invalid_input", detail: "Image is too large (max ~3MB). Try a simpler drawing." },
        { status: 400 }
      )
    }

    const resolvedTradition: EnhanceTradition = VALID_TRADITIONS.has(tradition)
      ? tradition
      : "default"

    const resolvedCharms: EnhanceCharm[] = Array.isArray(charms)
      ? charms.filter((c: string) => VALID_CHARMS.has(c as EnhanceCharm))
      : []
    const charmsForEnhance: EnhanceCharm[] =
      resolvedCharms.length > 0 ? resolvedCharms : ["sparkle", "glow"]

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        {
          error: "provider_unconfigured",
          detail:
            "Magic polish is not connected yet. Continue with the original artwork.",
        },
        { status: 503 }
      )
    }

    const result = await enhanceDrawing({
      imageDataUrl: drawingDataUrl,
      tradition: resolvedTradition,
      charms: charmsForEnhance,
    })

    // Log latency + tradition (NOT the drawing data URL)
    console.log(
      `[enhance] tradition=${resolvedTradition} charms=${resolvedCharms.join(",")} latency=${result.generationMs}ms`
    )

    return NextResponse.json({
      enhancedImageUrl: result.imageUrl,
      traditionUsed: resolvedTradition,
      charmsUsed: charmsForEnhance,
      generationMs: result.generationMs,
      remaining: rateLimit.remaining,
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "AI enhancement failed"
    const isModeration =
      message.includes("moderation") ||
      message.includes("safety") ||
      message.includes("content")
    const isProviderAuth =
      message.toLowerCase().includes("unauthorized") ||
      message.includes("401") ||
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("credential")
    const isTimeout =
      message.toLowerCase().includes("timed out") ||
      message.toLowerCase().includes("timeout")

    if (isModeration) {
      return NextResponse.json(
        { error: "moderation_block", fallback: "original" },
        { status: 503 }
      )
    }

    if (isProviderAuth) {
      console.error("[enhance] Provider auth/config error:", message)
      return NextResponse.json(
        {
          error: "provider_unconfigured",
          detail:
            "Magic polish is not authorized yet. Continue with the original artwork.",
        },
        { status: 503 }
      )
    }

    if (isTimeout) {
      console.error("[enhance] Provider timeout:", message)
      return NextResponse.json(
        {
          error: "timeout",
          detail:
            "Magic polish took too long. Continue with the original artwork, or try polish again.",
        },
        { status: 504 }
      )
    }

    console.error("[enhance] Error:", message)
    return NextResponse.json(
      { error: "service_unavailable", detail: message },
      { status: 503 }
    )
  }
}
