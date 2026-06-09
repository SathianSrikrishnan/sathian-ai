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
import {
  TOOTHLIGHT_PRODUCT_RENDER_MODE_ID,
  buildToothlightProductPrompt,
  normalizeToothlightStoryFocus,
} from "@/lib/toothlight/product-render-mode"
import { getLightStyle } from "@/lib/toothlight/visual-treatments"

export const maxDuration = 60

const AI_MAX_PER_HOUR = 10
const windowMs = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()
const PREVIEW_AI_RENDER_BYPASS_USER_ID = "preview-ai-render"

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
  "ratoncito-perez",
  "korea",
  "kkachi",
  "waraba-edge-light",
  "daga-one-year-wish",
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

function isValidImageDataUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/")
}

function isPreviewAiRenderBypassAllowed(origin: string | null, req: NextRequest): boolean {
  if (process.env.TOOTHLIGHT_PREVIEW_AI_RENDER_BYPASS !== "true") return false

  const host =
    origin ||
    `${req.nextUrl.protocol}//${req.headers.get("host") ?? req.headers.get("x-forwarded-host") ?? ""}`

  try {
    const { hostname } = new URL(host)
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "toothlight-preview.sathian.ai" ||
      hostname.endsWith("-sathiansrikrishnans-projects.vercel.app")
    )
  } catch {
    return false
  }
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

    const previewAiRenderBypass = isPreviewAiRenderBypassAllowed(origin, req)
    const { supabase } = createRouteSupabase(req)
    supabaseForRefund = supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user && !previewAiRenderBypass) {
      return NextResponse.json(
        {
          error: "auth_required",
          detail: "Sign in to unlock Magic Studio credits.",
        },
        { status: 401 }
      )
    }

    if (userError && !previewAiRenderBypass) {
      return NextResponse.json(
        {
          error: "auth_required",
          detail: "Sign in to unlock Magic Studio credits.",
        },
        { status: 401 }
      )
    }

    const userIdForRender = user?.id ?? PREVIEW_AI_RENDER_BYPASS_USER_ID
    userIdForRefund = user?.id ?? null

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
    const {
      drawingDataUrl,
      sourceImageDataUrl,
      drawingLayerDataUrl,
      compositionImageDataUrl,
      tradition,
      charms,
      style,
      promptOverride,
      productRenderModeId,
      productStyleId,
      productCreativePass,
      productStoryFocus,
    } = body

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

    for (const [label, value] of [
      ["source photo", sourceImageDataUrl],
      ["drawing layer", drawingLayerDataUrl],
      ["composition", compositionImageDataUrl],
    ] as const) {
      if (value == null || value === "") continue
      if (!isValidImageDataUrl(value)) {
        return NextResponse.json(
          { error: "invalid_input", detail: `${label} data is corrupted. Please try again.` },
          { status: 400 }
        )
      }
      if (value.length > 4_000_000) {
        return NextResponse.json(
          { error: "invalid_input", detail: `${label} image is too large. Try a smaller photo.` },
          { status: 400 }
        )
      }
    }

    const resolvedTradition: EnhanceTradition = VALID_TRADITIONS.has(tradition)
      ? tradition
      : "default"
    const resolvedStyle: MagicStyleId = isMagicStyleId(style)
      ? style
      : getMagicStyle(style).id
    const productStyle = getLightStyle(
      typeof productStyleId === "string" ? productStyleId : undefined
    )
    const requestLayerMode =
      sourceImageDataUrl && drawingLayerDataUrl ? "layered" : "flattened"
    const resolvedProductStoryFocus =
      normalizeToothlightStoryFocus(productStoryFocus)
    const productPromptOverride =
      productRenderModeId === TOOTHLIGHT_PRODUCT_RENDER_MODE_ID
        ? buildToothlightProductPrompt({
            styleLabel: productStyle.label,
            photoEffect: productStyle.photoEffect,
            drawingEffect: productStyle.drawingEffect,
            objectForm: productStyle.objectForm,
            compositionDirective: productStyle.compositionDirective,
            drawingIntegration: productStyle.drawingIntegration,
            storyMotifs: productStyle.storyMotifs,
            fairyCarryCue: productStyle.fairyCarryCue,
            layerMode: requestLayerMode,
            storyFocus: resolvedProductStoryFocus,
            creativePass:
              typeof productCreativePass === "number" ? productCreativePass : 1,
          })
        : undefined

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

    let credits: MagicCreditAccount | null = null
    if (!previewAiRenderBypass && user) {
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
    }

    const result = await enhanceDrawing({
      imageDataUrl: drawingDataUrl,
      sourceImageDataUrl,
      drawingLayerDataUrl,
      compositionImageDataUrl,
      tradition: resolvedTradition,
      charms: charmsForEnhance,
      style: resolvedStyle,
      promptOverride:
        productPromptOverride ??
        (previewAiRenderBypass && typeof promptOverride === "string"
          ? promptOverride
          : undefined),
    })
    if (!previewAiRenderBypass && user) {
      credits = await completeMagicCredit(supabase, user.id)
      creditReserved = false
    }

    if (user) {
      await logMagicGeneration(supabase, {
        userId: user.id,
        styleId: resolvedStyle,
        traditionSlug: resolvedTradition,
        prompt: result.prompt,
        enhancedImageUrl: result.imageUrl,
        generationMs: result.generationMs,
        originalBytes: estimateDataUrlBytes(drawingDataUrl),
        renderMode: result.renderMode,
        modelUsed: result.modelUsed,
      }).catch((err) => {
        const message =
          err instanceof Error ? err.message : "generation log failed"
        console.error("[enhance] Generation log failed:", message)
      })
    } else {
      console.log(
        `[enhance] ${userIdForRender} generation log skipped; preview bypass active`
      )
    }

    // Log latency + tradition (NOT the drawing data URL)
    console.log(
      `[enhance] tradition=${resolvedTradition} style=${resolvedStyle} mode=${result.renderMode} latency=${result.generationMs}ms`
    )

    return NextResponse.json({
      enhancedImageUrl: result.imageUrl,
      traditionUsed: resolvedTradition,
      charmsUsed: charmsForEnhance,
      styleUsed: resolvedStyle,
      generationMs: result.generationMs,
      remaining: rateLimit.remaining,
      credits: credits ? serializeCredits(credits) : undefined,
      renderMode: result.renderMode,
      modelUsed: result.modelUsed,
      previewBypass: previewAiRenderBypass,
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
