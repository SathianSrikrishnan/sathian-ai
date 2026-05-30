import { fal } from "@fal-ai/client"
import {
  MAGIC_LAYERED_MODEL,
  MAGIC_MODEL,
  buildMagicPrompt,
  getMagicStyle,
  type MagicStyleId,
} from "@/lib/toothfairy/magic-studio"

fal.config({
  credentials: process.env.FAL_KEY,
})

export type EnhanceCharm = "sparkle" | "glow" | "magic"
export type { MagicStyleId }

export type EnhanceTradition =
  | "tanda"
  | "anna-bogle"
  | "raton-perez"
  | "ratoncito-perez"
  | "korea"
  | "kkachi"
  | "waraba-edge-light"
  | "daga-one-year-wish"
  | "ethiopian-hyena"
  | "mayil"
  | "hazara"
  | "finland"
  | "anka"
  | "default"

const TRADITION_ELEMENTS: Record<EnhanceTradition, string> = {
  tanda:
    "stardust trails forming a subtle constellation across the background",
  "anna-bogle":
    "tiny four-leaf clovers with soft green glow in the corners",
  "raton-perez":
    "soft Spanish tile pattern in one corner and a tiny mouse tail peeking from the edge",
  "ratoncito-perez":
    "soft Spanish tile pattern in one corner and a tiny mouse tail peeking from the edge",
  korea:
    "two or three Korean magpie feathers drifting gently in the background",
  kkachi:
    "two or three Korean magpie feathers drifting gently in the background",
  "waraba-edge-light":
    "warm amber edge-shadow, a soft earth wash, and one far-off protective eye glow",
  "daga-one-year-wish":
    "tiny silver mouse tracks, calendar-moon glow, roofline specks, and warm tropical night light",
  "ethiopian-hyena":
    "warm earth-toned wash and one single golden eye glow in the far background",
  mayil: "iridescent peacock eye-feathers as a background flourish",
  hazara:
    "deep tree roots curling from the bottom and falling banyan leaves in earthy tones",
  finland:
    "aurora ribbons in the sky and a subtle frost pattern along the edges",
  anka: "emerald jungle leaves curling in from the edges and two golden jaguar eyes in the far background",
  default: "soft stardust and gentle magical sparkle",
}

const CHARM_ELEMENTS: Record<string, string> = {
  sparkle: "gold dust and tiny twinkling stars floating on top of the drawing",
  glow: "a soft warm halo and background wash matching the tradition's color palette",
}

const PROVIDER_TIMEOUT_MS = 50_000

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("AI enhancement timed out"))
    }, timeoutMs)

    promise
      .then(resolve, reject)
      .finally(() => clearTimeout(timeoutId))
  })
}

function buildPrompt(
  tradition: EnhanceTradition,
  charms: EnhanceCharm[],
  style?: MagicStyleId,
  layerMode?: "layered" | "flattened",
  promptOverride?: string
): string {
  if (promptOverride?.trim()) {
    return promptOverride.trim()
  }

  if (style) {
    return buildMagicPrompt({
      style: getMagicStyle(style),
      tradition,
      layerMode,
    })
  }

  const traditionElement = TRADITION_ELEMENTS[tradition]

  const parts: string[] = []
  for (const charm of charms) {
    if (charm === "magic") {
      parts.push(traditionElement)
    } else if (CHARM_ELEMENTS[charm]) {
      parts.push(CHARM_ELEMENTS[charm])
    }
  }
  if (parts.length === 0) {
    parts.push(traditionElement)
  }

  const accent = parts.join(", and ")
  return [
    "Create a meaningful global image edit for this lost-tooth memory so the whole picture changes visibly.",
    "Preserve the real source photo as the emotional anchor: keep the face identity, tooth or smile moment, pose, camera angle, room layout, and object placement recognizable.",
    "Reinterpret child marks, parent marks, handwriting, highlights, and marker strokes into the magical style; restyle handwriting as playful designed lettering and restyle child marks as integrated graphic strokes, not pixel-perfect or pasted back unchanged.",
    `Use these story cues around the memory: ${accent}, with a luminous edge, tooth-focused light, and a polished memory-card glow.`,
    "Do not replace the child, do not invent a different scene, and do not erase the handmade meaning. The result should feel AI-enhanced, abstract, tinted, and special while the family can still recognize the original memory.",
  ].join(" ")
}

export interface EnhanceRequest {
  imageDataUrl: string
  sourceImageDataUrl?: string | null
  drawingLayerDataUrl?: string | null
  compositionImageDataUrl?: string | null
  tradition: EnhanceTradition
  charms?: EnhanceCharm[]
  style?: MagicStyleId
  promptOverride?: string
}

export interface EnhanceResult {
  imageUrl: string
  prompt: string
  generationMs: number
  styleUsed?: MagicStyleId
  renderMode: "layered" | "flattened"
  modelUsed: string
}

export async function enhanceDrawing(
  req: EnhanceRequest
): Promise<EnhanceResult> {
  const renderMode =
    req.sourceImageDataUrl && req.drawingLayerDataUrl ? "layered" : "flattened"
  const modelUsed = renderMode === "layered" ? MAGIC_LAYERED_MODEL : MAGIC_MODEL
  const prompt = buildPrompt(
    req.tradition,
    req.charms ?? [],
    req.style,
    renderMode,
    req.promptOverride
  )
  const startedAt = Date.now()
  const sourceImageForLayer = req.sourceImageDataUrl ?? req.imageDataUrl
  const drawingLayerForLayer = req.drawingLayerDataUrl ?? req.imageDataUrl
  const compositionImageForLayer = req.compositionImageDataUrl ?? req.imageDataUrl
  const safetyTolerance = "2" as const
  const input =
    renderMode === "layered"
      ? {
          prompt,
          image_urls: [
            compositionImageForLayer,
            sourceImageForLayer,
            drawingLayerForLayer
          ],
          num_images: 1,
          guidance_scale: 6.75,
          safety_tolerance: safetyTolerance,
        }
      : {
          prompt,
          image_url: req.imageDataUrl,
          num_images: 1,
          guidance_scale: 6.75,
          safety_tolerance: safetyTolerance,
        }

  const result = (await withTimeout(
    fal.subscribe(modelUsed, {
      input,
      logs: false,
    }),
    PROVIDER_TIMEOUT_MS
  )) as { data?: { images?: Array<{ url: string }> } }

  const imageUrl = result.data?.images?.[0]?.url
  if (!imageUrl) {
    throw new Error("AI enhancement returned no image")
  }

  return {
    imageUrl,
    prompt,
    generationMs: Date.now() - startedAt,
    styleUsed: req.style,
    renderMode,
    modelUsed,
  }
}
