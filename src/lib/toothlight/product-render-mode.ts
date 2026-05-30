export const TOOTHLIGHT_PRODUCT_RENDER_MODE_ID = 'story-artifact'
export const TOOTHLIGHT_TRUST_CONTROL_RENDER_MODE_ID = 'memory-polish'
export const TOOTHLIGHT_STORY_FOCUS_OPTIONS = ['memory', 'marks', 'keeper'] as const

export type ToothlightStoryFocus = (typeof TOOTHLIGHT_STORY_FOCUS_OPTIONS)[number]

export const toothlightProductRenderContract = {
  modeId: TOOTHLIGHT_PRODUCT_RENDER_MODE_ID,
  controlModeId: TOOTHLIGHT_TRUST_CONTROL_RENDER_MODE_ID,
  parentLabel: '3D Toothlight Charm',
  childLabel: 'Make it a Toothlight',
  shortPromise: 'Turns the real memory and drawing into a finished Toothlight object.',
  preserveOriginalCopy: 'The original photo and drawing stay saved with the Toothlight.',
  promptGuardrails: [
    'Preserve child identity, expression, skin tone, tooth moment, pose, and camera angle.',
    'Make one physical keepsake object, charm, locket, card, or luminous token that could be saved as the Toothlight.',
    'Keep the real photo memory visibly embedded inside the Toothlight object instead of replacing it with a new character.',
    'Interpret the child drawing into the image material instead of pasting it unchanged.',
    'Transform the whole image through light, surface, depth, and keepsake object materials.',
    'Reject stickers, generic filters, fake labels, watermarks, unrelated fantasy scenes, and face replacement.',
  ],
} as const

export type ToothlightProductPromptInput = {
  styleLabel: string
  photoEffect: string
  drawingEffect: string
  objectForm: string
  compositionDirective: string
  drawingIntegration: string
  storyMotifs: readonly string[]
  fairyCarryCue: string
  layerMode?: 'layered' | 'flattened'
  creativePass?: number
  storyFocus?: ToothlightStoryFocus
}

export function buildToothlightProductPrompt(input: ToothlightProductPromptInput) {
  const layerInstruction =
    input.layerMode === 'layered'
      ? 'Use the flattened composition for placement, the source photo for identity, and the transparent drawing layer for the child-made marks.'
      : 'Use the supplied image as the memory source and preserve its real composition.'
  const storyFocus = normalizeToothlightStoryFocus(input.storyFocus)

  return [
    `Approved Toothlight product render: ${toothlightProductRenderContract.parentLabel}.`,
    toothlightProductRenderContract.shortPromise,
    layerInstruction,
    getStoryFocusPrompt(storyFocus),
    `Selected Light Style: ${input.styleLabel}.`,
    `Object form: ${input.objectForm}.`,
    `Composition directive: ${input.compositionDirective}`,
    `Drawing integration: ${input.drawingIntegration}`,
    `Story motifs to use subtly: ${input.storyMotifs.join(', ')}.`,
    `Fairy-world carry cue: ${input.fairyCarryCue}`,
    `Creative pass ${Math.max(1, Math.floor(input.creativePass ?? 1))}: the selected Light Style must produce a different physical silhouette from the other options, with a different material, edge, depth, and carrying method.`,
    'Do not reuse the round locket or pendant composition unless the selected object form explicitly asks for the Golden Locket.',
    'Treat the child drawing layer as structural information for the object: turn marks into edges, etched paths, embroidery, paper cuts, neon tubes, inlays, or seams that visibly follow the original drawing placement.',
    'If child marks resemble eyeglasses, face frames, masks, crowns, or wearable outlines, do not put eyeglasses on the child and do not turn the marks into a literal accessory; reinterpret them as windows, story portals, orbit rails, handles, seams, keeper trails, or map paths in the Toothlight object.',
    `Photo treatment: ${input.photoEffect}`,
    `Drawing treatment: ${input.drawingEffect}`,
    `Guardrails: ${toothlightProductRenderContract.promptGuardrails.join(' ')}`,
  ].join(' ')
}

export function normalizeToothlightStoryFocus(value: unknown): ToothlightStoryFocus {
  return value === 'memory' || value === 'marks' || value === 'keeper' ? value : 'keeper'
}

function getStoryFocusPrompt(storyFocus: ToothlightStoryFocus) {
  if (storyFocus === 'memory') {
    return 'Story focus: memory-first. Keep the photo structure closest to the original while adding a gentle Toothlight object finish.'
  }

  if (storyFocus === 'marks') {
    return 'Story focus: drawing-first. Let the child marks drive object structure, edge rhythm, and material paths, while preserving the real face and tooth moment.'
  }

  return 'Story focus: story-world. Turn the child marks into a Toothlight artifact that fairies or keepers can carry through the story world, using symbols as routes, seals, ribbons, windows, and future-note cues.'
}
