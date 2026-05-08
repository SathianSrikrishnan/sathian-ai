import { NextRequest, NextResponse } from "next/server"
import {
  enhanceDrawing,
  type EnhanceCharm,
  type EnhanceTradition,
} from "@/lib/toothfairy/ai-enhance"
import { isAllowedOrigin } from "@/lib/constants"
import { createRouteSupabase } from "@/lib/supabase-auth"
import {
  completeMagicCredit,
  getOrCreateMagicCreditAccount,
  logMagicGeneration,
  refundMagicCredit,
  reserveMagicCredit,
  type MagicCreditAccount,
} from "@/lib/toothfairy/magic-credits"
import {
  MAGIC_GENERATION_COST_USD,
  getMagicStyle,
  isMagicStyleId,
  type MagicStyleId,
} from "@/lib/toothfairy/magic-studio"

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

function serializeCredits(account: MagicCreditAccount) {
  return {
    lifetime: account.lifetimeCredits,
    remaining: account.remainingCredits,
    reserved: account.reservedCredits,
    used: account.usedCredits,
    estimatedCostUsd: MAGIC_GENERATION_COST_USD,
  }
}

function estimateDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",")
  const payload = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  return Math.ceil((payload.length * 3) / 4)
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get("origin")
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { supabase } = createRouteSupabase(req)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ authenticated: false, credits: null })
    }

    const account = await getOrCreateMagicCreditAccount(
      supabase,
      user.id,
      user.email
    )

    return NextResponse.json({
      authenticated: true,
      credits: serializeCredits(account),
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Magic credits unavailable"
    console.error("[enhance.credits] Error:", message)
    return NextResponse.json(
      { error: "credits_unavailable", detail: message },
      { status: 503 }
    )
  }
}

export async function POST(req: NextRequest) {
  let creditReserved = false
  let userIdForRefund: string | null = null
  let supabaseForRefund: ReturnType<typeof createRouteSupabase>["supabase"] | null =
    null

  try {
    const origin = req.headers.get("origin")
    if (!isAllowedOrigin(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { supabase } = createRouteSupabase(req)
    supabaseForRefund = supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "auth_required",
          detail: "Sign in to unlock Magic Studio credits.",
        },
        { status: 401 }
      )
    }
    userIdForRefund = user.id

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
    const { drawingDataUrl, tradition, charms, style } = body

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
    const resolvedStyle: MagicStyleId = isMagicStyleId(style)
      ? style
      : getMagicStyle(style).id

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

    const account = await getOrCreateMagicCreditAccount(
      supabase,
      user.id,
      user.email
    )

    if (account.remainingCredits <= 0) {
      return NextResponse.json(
        {
          error: "no_credits",
          credits: serializeCredits(account),
          detail:
            "This account has used its starter Magic Studio credits.",
        },
        { status: 402 }
      )
    }

    const reservedAccount = await reserveMagicCredit(supabase, user.id)
    if (!reservedAccount) {
      return NextResponse.json(
        {
          error: "no_credits",
          credits: serializeCredits(account),
          detail:
            "This account has used its starter Magic Studio credits.",
        },
        { status: 402 }
      )
    }
    creditReserved = true

    const result = await enhanceDrawing({
      imageDataUrl: drawingDataUrl,
      tradition: resolvedTradition,
      charms: charmsForEnhance,
      style: resolvedStyle,
    })
    const credits = await completeMagicCredit(supabase, user.id)
    creditReserved = false

    await logMagicGeneration(supabase, {
      userId: user.id,
      styleId: resolvedStyle,
      traditionSlug: resolvedTradition,
      prompt: result.prompt,
      enhancedImageUrl: result.imageUrl,
      generationMs: result.generationMs,
      originalBytes: estimateDataUrlBytes(drawingDataUrl),
    }).catch((err) => {
      const message =
        err instanceof Error ? err.message : "generation log failed"
      console.error("[enhance] Generation log failed:", message)
    })

    // Log latency + tradition (NOT the drawing data URL)
    console.log(
      `[enhance] tradition=${resolvedTradition} style=${resolvedStyle} latency=${result.generationMs}ms`
    )

    return NextResponse.json({
      enhancedImageUrl: result.imageUrl,
      traditionUsed: resolvedTradition,
      charmsUsed: charmsForEnhance,
      styleUsed: resolvedStyle,
      generationMs: result.generationMs,
      remaining: rateLimit.remaining,
      credits: serializeCredits(credits),
    })
  } catch (err: unknown) {
    if (creditReserved && supabaseForRefund && userIdForRefund) {
      await refundMagicCredit(supabaseForRefund, userIdForRefund).catch(
        (refundErr) => {
          const message =
            refundErr instanceof Error
              ? refundErr.message
              : "credit refund failed"
          console.error("[enhance] Credit refund failed:", message)
        }
      )
    }

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
