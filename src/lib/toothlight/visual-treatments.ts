export type VisualTreatment = {
  id: string
  label: string
  shortLabel: string
  accent: string
  secondaryAccent: string
  cssClass: string
  swatchClass: string
  descriptionForInternalUse: string
}

export const LIGHT_STYLE_VERSION = 'deterministic-css-v1'
export const DEFAULT_VISUAL_TREATMENT_ID = 'keepsake-glow'

export const LIGHT_STYLE_TREATMENTS = [
  {
    id: 'keepsake-glow',
    label: 'Keepsake Glow',
    shortLabel: 'Keepsake',
    accent: '#F3C85D',
    secondaryAccent: '#8EDCC7',
    cssClass: 'keepsakeGlow',
    swatchClass: 'swatchKeepsake',
    descriptionForInternalUse:
      'Warm gold memory treatment with a clear photo, soft rim light, and subtle Toothlight sparkle.',
  },
  {
    id: 'nightlight',
    label: 'Nightlight',
    shortLabel: 'Night',
    accent: '#88C8FF',
    secondaryAccent: '#D8F3FF',
    cssClass: 'nightlight',
    swatchClass: 'swatchNightlight',
    descriptionForInternalUse:
      'Cool bedtime treatment with moonlit blue wash and tiny quiet flecks while preserving the source image.',
  },
  {
    id: 'storybook-ink',
    label: 'Storybook Ink',
    shortLabel: 'Ink',
    accent: '#263D41',
    secondaryAccent: '#F2DFA3',
    cssClass: 'storybookInk',
    swatchClass: 'swatchStorybook',
    descriptionForInternalUse:
      'Soft paper and ink-edge treatment that nods to a child drawing without replacing the real photo.',
  },
  {
    id: 'lucky-penny',
    label: 'Lucky Penny',
    shortLabel: 'Penny',
    accent: '#EAA340',
    secondaryAccent: '#72D7BD',
    cssClass: 'luckyPenny',
    swatchClass: 'swatchPenny',
    descriptionForInternalUse:
      'Coin-warm treatment for Tooth Fairy ritual and optional Smile Fund moments without becoming wallet-first.',
  },
  {
    id: 'confetti-light',
    label: 'Confetti Light',
    shortLabel: 'Confetti',
    accent: '#FF7F62',
    secondaryAccent: '#7AB8FF',
    cssClass: 'confettiLight',
    swatchClass: 'swatchConfetti',
    descriptionForInternalUse:
      'High-energy celebration treatment with stronger color flecks for funny or proud child memory moments.',
  },
] as const satisfies readonly VisualTreatment[]

export type VisualTreatmentId = (typeof LIGHT_STYLE_TREATMENTS)[number]['id']

export const defaultVisualTreatment =
  LIGHT_STYLE_TREATMENTS.find((treatment) => treatment.id === DEFAULT_VISUAL_TREATMENT_ID) ??
  LIGHT_STYLE_TREATMENTS[0]

export function getRecommendedLightStyle() {
  return defaultVisualTreatment
}

export function getLightStyle(id: string | null | undefined) {
  return LIGHT_STYLE_TREATMENTS.find((treatment) => treatment.id === id) ?? defaultVisualTreatment
}
