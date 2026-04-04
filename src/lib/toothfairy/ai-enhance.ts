import { fal } from "@fal-ai/client"

fal.config({
  credentials: process.env.FAL_KEY,
})

export interface EnhanceResult {
  imageUrl: string
  seed: number
}

/**
 * Take a sketch/drawing (base64 PNG) and enhance it with AI using
 * ControlNet scribble conditioning on SDXL via fal.ai.
 *
 * Cost: ~$0.025 per image (FLUX) or ~$0.0065 (SDXL ControlNet)
 */
export async function enhanceDrawing(
  imageBase64: string,
  prompt?: string,
): Promise<EnhanceResult> {
  const defaultPrompt =
    "magical tooth fairy art, enchanted glowing tooth, whimsical fairy dust and sparkles, " +
    "beautiful watercolor illustration style, soft pastel colors, dreamy fantasy atmosphere, " +
    "children's storybook quality, delicate wings, gentle starlight"

  const result = await fal.subscribe("fal-ai/fast-sdxl/image-to-image", {
    input: {
      image_url: `data:image/png;base64,${imageBase64}`,
      prompt: prompt || defaultPrompt,
      negative_prompt: "ugly, blurry, low quality, distorted, scary, dark, violent, text, watermark",
      strength: 0.65, // 0.0 = keep original, 1.0 = ignore original. 0.65 = good blend
      num_inference_steps: 25,
      guidance_scale: 7.5,
      image_size: "square",
      num_images: 1,
      enable_safety_checker: true,
    },
    logs: false,
  }) as any

  const image = result.data?.images?.[0]
  if (!image?.url) {
    throw new Error("AI enhancement failed — no image returned")
  }

  return {
    imageUrl: image.url,
    seed: result.data?.seed ?? 0,
  }
}
