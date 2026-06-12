export const STARTER_MAGIC_CREDITS = 3
export const MAGIC_GENERATION_COST_USD = 0.04
export const MAGIC_PROVIDER = "fal"
export const MAGIC_MODEL = "fal-ai/flux-pro/kontext"
export const MAGIC_LAYERED_MODEL = "fal-ai/flux-pro/kontext/multi"

export const MAGIC_STYLES = [
  {
    id: "tanda-glow",
    label: "Tanda Glow",
    shortLabel: "Glow",
    tone: "warm gold, parchment wings, soft moonlit tooth glow",
    description: "A gentle TFN house style with gold light and storybook warmth.",
    photoEffect:
      "warm the whole photo into golden locket glass, lift tooth/smile highlights, add translucent keepsake shine, paper grain, and soft edge depth",
    drawingEffect:
      "remake child strokes as raised gold enamel, mint glints, tiny flecks, and soft luminous linework that follows the original drawing placement",
    transformationBrief:
      "the result should look like the same memory sealed inside a magical locket, not a photo with a sticker on top",
    prompt:
      "transform the whole image into a warm Tooth Fairy Network keepsake edit with luminous gold edges, parchment-wing texture, soft moonlight, handmade memory-card finish, and restyled child marks that become polished golden hand-drawn accents",
  },
  {
    id: "storybook-ink",
    label: "Storybook Ink",
    shortLabel: "Ink",
    tone: "inked picture-book lines, hand-painted wash, textured paper",
    description: "A refined picture-book texture that keeps the original memory visible.",
    photoEffect:
      "translate the photo into ink-wash texture with paper tooth, graphite edge detail, lifted whites, softened color, and a hand-printed storybook surface",
    drawingEffect:
      "convert child marks and handwriting into imperfect ink, colored-pencil fill, stamped linework, and page-integrated lettering",
    transformationBrief:
      "the result should feel like a picture-book plate made from the real photo, with the person still recognizable",
    prompt:
      "transform the whole image into a hand-inked children's storybook plate with visible paper texture, painted washes, expressive ink edges, and child handwriting restyled into charming picture-book lettering",
  },
  {
    id: "watercolor-memory",
    label: "Watercolor Memory",
    shortLabel: "Water",
    tone: "transparent watercolor, soft bloom, warm paper grain",
    description: "A soft keepsake wash for tender, quiet photos and drawings.",
    photoEffect:
      "wash the entire photo into translucent watercolor with pigment blooms, softened edges, gentle paper grain, and warm tooth-focused light",
    drawingEffect:
      "turn child strokes into translucent painted marks, soft bleeds, and airy color blooms that still trace the child's idea",
    transformationBrief:
      "the result should feel like the same memory painted into a tender watercolor time capsule",
    prompt:
      "transform the whole image into a luminous watercolor memory with soft pigment blooms, warm paper grain, delicate tooth light, airy negative space, and child strokes softened into translucent painted marks",
  },
  {
    id: "pencil-charm",
    label: "Pencil Charm",
    shortLabel: "Pencil",
    tone: "colored pencil, graphite, smudged paper, handmade charm",
    description: "A sketchbook style that preserves roughness and small marks.",
    photoEffect:
      "reduce the photo into tactile colored-pencil contrast, graphite smudges, stitched paper texture, and visible sketchbook fibers",
    drawingEffect:
      "rebuild child marks as layered pencil, stitched thread, star-pinned charm marks, and hand-rubbed color",
    transformationBrief:
      "the result should feel handmade and materially different, like a treasured sketchbook charm",
    prompt:
      "transform the whole image into a treasured sketchbook page with colored-pencil charm marks, graphite smudges, notebook texture, and child marks restyled as intentional pencil doodles",
  },
  {
    id: "cartoon-3d",
    label: "Soft Studio Depth",
    shortLabel: "3D",
    tone: "3D cartoon, clay-like depth, soft studio light",
    description: "A bigger wow moment with depth and rounded light without replacing the memory.",
    photoEffect:
      "make the whole photo more graphic and dimensional with poster color, rounded studio light, soft depth, satin highlights, and gentle abstraction",
    drawingEffect:
      "turn child marks into glossy gel-marker stickers, color-separated edges, raised line shine, and dimensional doodle accents",
    transformationBrief:
      "the result should look like a Galaxy-style creative photo edit: obviously transformed while identity and composition remain intact",
    prompt:
      "transform the whole image with soft studio depth, rounded light, cozy dimensional highlights, playful storybook atmosphere, and child lines converted into raised glossy sticker-like strokes",
  },
  {
    id: "tradition-magic",
    label: "Tradition Magic",
    shortLabel: "Story",
    tone: "the current story's cultural palette and keeper magic",
    description: "Adapts the transformation to the story the child just read.",
    photoEffect:
      "wrap the whole photo in story-specific lantern paper, symbolic palette, vellum texture, warm depth, and subtle cultural motif light",
    drawingEffect:
      "remake child marks into wax-pencil lantern light, paper-cut edges, note accents, and symbolic handmade details from the story world",
    transformationBrief:
      "the result should feel like the memory belongs inside the Tooth Fairy Network story world without replacing the real family moment",
    prompt:
      "transform the whole image with the selected tooth tradition's keeper-light, landscape palette, symbolic motifs, ritual details, and child marks restyled into that tradition's handmade visual language",
  },
] as const

export type MagicStyle = (typeof MAGIC_STYLES)[number]
export type MagicStyleId = MagicStyle["id"]

const STYLE_BY_ID = new Map<string, MagicStyle>(
  MAGIC_STYLES.map((style) => [style.id, style])
)

const TRADITION_MAGIC: Record<string, string> = {
  tanda:
    "Tanda's warm gold light, tiny parchment-wing texture, Minnesota night air, and moonlit memory-card atmosphere",
  "anna-bogle":
    "Irish green hills, mossy stone, warm coin-gold light, and a mischievous handmade charm feeling",
  "raton-perez":
    "Spanish tile patterns, tiny mouse-keeper warmth, burgundy and gold accents, and cozy Madrid night light",
  "ratoncito-perez":
    "Spanish tile patterns, tiny mouse-keeper warmth, burgundy and gold accents, and cozy Madrid night light",
  korea:
    "Korean magpie feathers, silver-blue song-light, paper lantern warmth, and an elegant night-sky palette",
  kkachi:
    "Korean magpie feathers, silver-blue song-light, paper lantern warmth, and an elegant night-sky palette",
  "waraba-edge-light":
    "Harar threshold warmth, amber edge-light, deep protective shadow, and earth-toned courage",
  "daga-one-year-wish":
    "Philippines roofline moonlight, tiny silver mouse tracks, calendar pages, parol warmth, and hidden-wish glow",
  "ethiopian-hyena":
    "Ethiopian highland earth tones, amber eye-glow, black stone warmth, and ancient starlit scale",
  mayil:
    "iridescent peacock feather color, temple-garden warmth, jewel greens and blues, and soft ritual light",
  hazara:
    "deep roots, falling leaves, earthy browns, banyan shade, and quiet ancestral story texture",
  finland:
    "aurora ribbons, frost-edged paper, cool Nordic blues, and brave winter-fairy light",
  anka:
    "Amazon jungle emeralds, black jaguar shadow, glowing green eyes, rainforest leaves, and deep stillness",
  default:
    "soft tooth-fairy gold, warm paper texture, moonlit edges, and gentle keepsake magic",
}

export function isMagicStyleId(value: string): value is MagicStyleId {
  return STYLE_BY_ID.has(value)
}

export function getMagicStyle(id: string | null | undefined): MagicStyle {
  if (id && STYLE_BY_ID.has(id)) {
    return STYLE_BY_ID.get(id)!
  }
  return STYLE_BY_ID.get("tanda-glow")!
}

export function normalizeMagicStyles(
  styles: readonly string[],
  availableCredits: number
): MagicStyleId[] {
  const max = Math.max(0, Math.floor(availableCredits))
  const normalized: MagicStyleId[] = []
  const seen = new Set<string>()

  for (const style of styles) {
    if (!isMagicStyleId(style) || seen.has(style)) continue
    normalized.push(style)
    seen.add(style)
    if (normalized.length >= max) break
  }

  return normalized
}

export function projectMagicCost(count: number): number {
  return Number((Math.max(0, count) * MAGIC_GENERATION_COST_USD).toFixed(2))
}

export function getTraditionMagic(tradition: string | null | undefined): string {
  if (!tradition) return TRADITION_MAGIC.default
  return TRADITION_MAGIC[tradition] ?? TRADITION_MAGIC.default
}

export function buildMagicPrompt(input: {
  style: MagicStyle
  tradition: string | null | undefined
  layerMode?: "layered" | "flattened"
}): string {
  const traditionMagic = getTraditionMagic(input.tradition)
  const layerInstructions =
    input.layerMode === "layered"
      ? [
          "You are receiving layer-aware references: image 1 is the flattened composition showing the real photo with the child's drawings in exact placement, image 2 is the real source photo for identity and camera reference, and image 3 is a transparent child drawing layer with handwriting or marks.",
          "Treat image 1 as the primary image to edit. Preserve image 2 as the identity anchor. Use image 3 to understand every child mark, then transform those marks into integrated designed elements, magical lettering, sticker-like shine, light trails, texture, or story symbols.",
          "Do not leave the transparent child drawing layer pasted unchanged on top. Restyle it so the marks feel AI-enhanced and part of the image, while the child can still recognize what they drew.",
        ]
      : [
          "Read the supplied image as one flattened memory and restyle the whole image, including any visible child marks or handwriting.",
        ]

  return [
    "Make a meaningful global image edit so the whole picture changes, while the original memory remains recognizable.",
    "Preserve the real source photo as the emotional source of the image: keep face identity, skin tone, body pose, camera angle, same overall composition, tooth moment, room layout, and object placement recognizable.",
    ...layerInstructions,
    "Reinterpret child marks, imperfect lines, doodles, color choices, and handwriting as part of the selected style; restyle handwriting and drawn strokes so they feel magical and designed, not pixel-perfect or pasted back unchanged.",
    `Treatment-specific transformation contract. Photo effect: ${input.style.photoEffect}. Drawing effect: ${input.style.drawingEffect}. Transformation brief: ${input.style.transformationBrief}.`,
    "Do not replace the memory with a new scene, do not redraw the child as a different person, do not erase the meaning of handmade marks, and do not make the image look like generic stock art.",
    `${input.style.prompt}.`,
    `Use these Tooth Fairy Network story cues subtly: ${traditionMagic}.`,
    `Style tone: ${input.style.tone}.`,
    "The finished image should feel like a Samsung or Galaxy-style AI photo edit: visibly transformed, tinted, polished, abstract, and atmospheric, while the child and parent can still recognize the original moment.",
  ].join(" ")
}
