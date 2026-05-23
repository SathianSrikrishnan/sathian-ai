import {
  DEFAULT_VISUAL_TREATMENT_ID,
  LIGHT_STYLE_TREATMENTS,
  getLightStyle,
  getRecommendedLightStyle,
  type VisualTreatment,
} from './visual-treatments'

export type GlowFilter = VisualTreatment & {
  previewClass: string
}

export const DEFAULT_GLOW_FILTER_ID = DEFAULT_VISUAL_TREATMENT_ID

export const GLOW_FILTERS = LIGHT_STYLE_TREATMENTS.map((treatment) => ({
  ...treatment,
  previewClass: treatment.swatchClass,
})) satisfies readonly GlowFilter[]

export type GlowFilterId = (typeof GLOW_FILTERS)[number]['id']

export const defaultGlowFilter = GLOW_FILTERS.find(
  (filter) => filter.id === DEFAULT_GLOW_FILTER_ID,
) ?? GLOW_FILTERS[0]

export function getRecommendedGlow() {
  return getRecommendedLightStyle()
}

export function getGlowFilter(id: string | null | undefined) {
  return getLightStyle(id)
}
