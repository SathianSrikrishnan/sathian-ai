import { fal } from "@fal-ai/client"

fal.config({
  credentials: process.env.FAL_KEY,
})

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

const TRADITION_ELEMENTS: Record<EnhanceTradition, string> = {
  tanda:
    "stardust trails forming a subtle constellation across the background",
  "anna-bogle":
    "tiny four-leaf clovers with soft green glow in the corners",
  "raton-perez":
    "soft Spanish tile pattern in one corner and a tiny mouse tail peeking from the edge",
  kkachi:
    "two or three Korean magpie feathers drifting gently in the background",
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
  charms: EnhanceCharm[]
): string {
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
  return `Create a visible but gentle magical polish for this lost-tooth memory image. Keep every existing child or parent drawing mark exactly where it is, including lines, colors, handwriting, highlights, and marker strokes. Do not erase, repaint, smooth, or correct any existing marks. Add a warm storybook finish around the memory: ${accent}, a soft luminous edge, brighter tooth-focused light, and a delicate memory-card glow. The result should clearly look more magical than the input while preserving the original photo and drawings.`
}

export interface EnhanceRequest {
  imageDataUrl: string
  tradition: EnhanceTradition
  charms: EnhanceCharm[]
}

export interface EnhanceResult {
  imageUrl: string
  prompt: string
  generationMs: number
}

export async function enhanceDrawing(
  req: EnhanceRequest
): Promise<EnhanceResult> {
  const prompt = buildPrompt(req.tradition, req.charms)
  const startedAt = Date.now()

  const result = (await withTimeout(
    fal.subscribe("fal-ai/flux-pro/kontext", {
      input: {
        prompt,
        image_url: req.imageDataUrl,
        num_images: 1,
        guidance_scale: 4.25,
        safety_tolerance: "2",
      },
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
  }
}
