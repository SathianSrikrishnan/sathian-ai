export const STARTER_MAGIC_CREDITS = 3
export const MAGIC_GENERATION_COST_USD = 0.04
export const MAGIC_PROVIDER = "fal"
export const MAGIC_MODEL = "fal-ai/flux-pro/kontext"

export const MAGIC_STYLES = [
  {
    id: "tanda-glow",
    label: "Tanda Glow",
    shortLabel: "Glow",
    tone: "warm gold, parchment wings, soft moonlit tooth glow",
    description: "A gentle TFN house style with gold light and storybook warmth.",
    prompt:
      "transform the drawing into a warm Tooth Fairy Network keepsake with luminous gold edges, parchment-wing texture, soft moonlight, and a handmade memory-card finish",
  },
  {
    id: "storybook-ink",
    label: "Storybook Ink",
    shortLabel: "Ink",
    tone: "inked picture-book lines, hand-painted wash, textured paper",
    description: "A refined picture-book version that still feels drawn by a child.",
    prompt:
      "transform the drawing into a hand-inked children's storybook illustration with visible paper texture, gentle painted washes, and imperfect expressive linework",
  },
  {
    id: "watercolor-memory",
    label: "Watercolor Memory",
    shortLabel: "Water",
    tone: "transparent watercolor, soft bloom, warm paper grain",
    description: "A soft keepsake wash for tender, quiet drawings.",
    prompt:
      "transform the drawing into a luminous watercolor keepsake with soft pigment blooms, warm paper grain, delicate tooth light, and airy negative space",
  },
  {
    id: "pencil-charm",
    label: "Pencil Charm",
    shortLabel: "Pencil",
    tone: "colored pencil, graphite, smudged paper, handmade charm",
    description: "A sketchbook style that preserves roughness and small marks.",
    prompt:
      "transform the drawing into a colored-pencil and graphite charm with visible sketch strokes, soft smudges, and a treasured notebook feeling",
  },
  {
    id: "cartoon-3d",
    label: "3D Cartoon",
    shortLabel: "3D",
    tone: "3D cartoon, clay-like depth, soft studio light",
    description: "A bigger wow moment with toy-like depth and rounded light.",
    prompt:
      "transform the drawing into a 3D cartoon keepsake with soft clay-like depth, rounded forms, cozy studio light, and playful storybook dimension",
  },
  {
    id: "tradition-magic",
    label: "Tradition Magic",
    shortLabel: "Story",
    tone: "the current story's cultural palette and keeper magic",
    description: "Adapts the transformation to the story the child just read.",
    prompt:
      "transform the drawing into a keepsake shaped by the selected tooth tradition, using its keeper, landscape, color palette, and ritual details as subtle magical framing",
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
}): string {
  const traditionMagic = getTraditionMagic(input.tradition)

  return [
    "Preserve the child's original drawing as the emotional source of the image.",
    "Keep the same overall composition, silhouette, placement, childlike proportions, imperfect marks, color choices, and any handwriting or note-like details.",
    "Do not replace the child's idea with a professional illustration, do not erase the handmade feeling, and do not make the image look like generic stock art.",
    `${input.style.prompt}.`,
    `Use these Tooth Fairy Network story cues subtly: ${traditionMagic}.`,
    `Style tone: ${input.style.tone}.`,
    "The finished image should feel like the child's drawing transformed into a magical keepsake while the child can still recognize their own work inside it.",
  ].join(" ")
}
