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
  return `Preserve the input drawing exactly — keep all lines, strokes, proportions, and the child-drawn character as-is. Add only subtle magical accents: ${accent}. Use a soft watercolor wash in the background. Do not redraw, smooth, or "correct" any of the existing lines. The child's drawing must remain the center of the image.`
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

  const result = (await fal.subscribe("fal-ai/flux-pro/kontext", {
    input: {
      prompt,
      image_url: req.imageDataUrl,
      num_images: 1,
      guidance_scale: 3.5,
      safety_tolerance: "2",
    },
    logs: false,
  })) as { data?: { images?: Array<{ url: string }> } }

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
