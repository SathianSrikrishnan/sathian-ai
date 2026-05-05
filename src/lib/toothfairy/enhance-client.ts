export type EnhanceCharm = "sparkle" | "glow" | "magic"
export type EnhanceTradition =
  | "tanda"
  | "anna-bogle"
  | "raton-perez"
  | "kkachi"
  | "ethiopian-hyena"
  | "mayil"
  | "hazara"
  | "finland"
  | "anka"
  | "default"

export interface EnhanceRequest {
  drawingDataUrl: string
  tradition: EnhanceTradition
  charms: EnhanceCharm[]
}

export interface EnhanceResult {
  enhancedImageUrl: string
  traditionUsed: EnhanceTradition
  charmsUsed: EnhanceCharm[]
  generationMs: number
  remaining: number
}

type EnhanceOutcome =
  | { ok: true; result: EnhanceResult }
  | {
      ok: false
      error:
        | "rate_limit"
        | "moderation_block"
        | "provider_unconfigured"
        | "service_unavailable"
        | "invalid_input"
        | "network"
        | "timeout"
      detail?: string
      retryAfter?: number
    }

const ENHANCE_CLIENT_TIMEOUT_MS = 55_000

async function compressIfNeeded(dataUrl: string, maxChars = 2_600_000): Promise<string> {
  if (typeof window === "undefined" || dataUrl.length <= maxChars) return dataUrl
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 1024
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      let quality = 0.85
      let result = canvas.toDataURL("image/jpeg", quality)
      while (result.length > maxChars && quality > 0.3) {
        quality -= 0.1
        result = canvas.toDataURL("image/jpeg", quality)
      }
      resolve(result)
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

export async function callEnhance(
  req: EnhanceRequest
): Promise<EnhanceOutcome> {
  const controller = new AbortController()
  const timeoutId =
    typeof window === "undefined"
      ? undefined
      : window.setTimeout(() => controller.abort(), ENHANCE_CLIENT_TIMEOUT_MS)

  try {
    const drawingDataUrl = await compressIfNeeded(req.drawingDataUrl)
    const res = await fetch("/api/toothfairy/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ ...req, drawingDataUrl }),
    })

    if (res.ok) {
      const data = await res.json()
      return { ok: true, result: data as EnhanceResult }
    }

    const body = await res.json().catch(() => ({}))

    if (res.status === 429) {
      return {
        ok: false,
        error: "rate_limit",
        retryAfter: body.retryAfter,
        detail: `Try again in ${body.retryAfter ?? "a few"} seconds`,
      }
    }

    if (res.status === 400) {
      return {
        ok: false,
        error: "invalid_input",
        detail: body.detail ?? "Invalid input",
      }
    }

    if (res.status === 503) {
      if (body.error === "moderation_block") {
        return { ok: false, error: "moderation_block" }
      }
      if (body.error === "provider_unconfigured") {
        return {
          ok: false,
          error: "provider_unconfigured",
          detail:
            body.detail ??
            "Magic polish is not connected yet. Continue with the original artwork.",
        }
      }
      return {
        ok: false,
        error: "service_unavailable",
        detail: body.detail,
      }
    }

    if (res.status === 504 || body.error === "timeout") {
      return {
        ok: false,
        error: "timeout",
        detail:
          body.detail ??
          "Magic polish took too long. Your original artwork is still saved.",
      }
    }

    return {
      ok: false,
      error: "service_unavailable",
      detail: `HTTP ${res.status}`,
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        ok: false,
        error: "timeout",
        detail: "Magic polish took too long. Your original artwork is still saved.",
      }
    }
    return { ok: false, error: "network" }
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
  }
}
