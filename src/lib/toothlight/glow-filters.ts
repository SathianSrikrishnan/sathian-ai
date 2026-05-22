export type GlowFilter = {
  id: string
  label: string
  accent: string
  previewClass: string
  descriptionForInternalUse: string
}

export const DEFAULT_GLOW_FILTER_ID = 'starlace'

export const GLOW_FILTERS = [
  {
    id: 'starlace',
    label: 'Star',
    accent: '#F6C95F',
    previewClass: 'glowStarlace',
    descriptionForInternalUse: 'Warm gold rim light with small star flecks for the default Toothlight state.',
  },
  {
    id: 'moonmilk',
    label: 'Moon',
    accent: '#D8F3FF',
    previewClass: 'glowMoonmilk',
    descriptionForInternalUse: 'Soft cool halo that keeps the tooth photo readable and parent-trustworthy.',
  },
  {
    id: 'mintveil',
    label: 'Mint',
    accent: '#8FE6C6',
    previewClass: 'glowMintveil',
    descriptionForInternalUse: 'Fresh green-blue edge glow for calm memories and early Smile Fund hints.',
  },
  {
    id: 'rosebeam',
    label: 'Rose',
    accent: '#F7A7BA',
    previewClass: 'glowRosebeam',
    descriptionForInternalUse: 'Gentle rose highlight for sweet note-started moments without becoming too pastel.',
  },
  {
    id: 'sunpenny',
    label: 'Coin',
    accent: '#EAA340',
    previewClass: 'glowSunpenny',
    descriptionForInternalUse: 'Coin-tinted sparkle that can pair with the Tooth Fairy savings ritual.',
  },
  {
    id: 'skyforge',
    label: 'Sky',
    accent: '#7AB8FF',
    previewClass: 'glowSkyforge',
    descriptionForInternalUse: 'Clear blue atmospheric glow for flight, Network, and open-air transitions.',
  },
  {
    id: 'orchidpin',
    label: 'Wish',
    accent: '#BFA2FF',
    previewClass: 'glowOrchidpin',
    descriptionForInternalUse: 'Small violet accent used sparingly for magical wish states and keeper cameos.',
  },
  {
    id: 'emberdot',
    label: 'Ember',
    accent: '#FF8A5C',
    previewClass: 'glowEmberdot',
    descriptionForInternalUse: 'Tiny coral-orange pulse for funny or high-energy child memories.',
  },
  {
    id: 'silverthread',
    label: 'Seal',
    accent: '#BFC7D5',
    previewClass: 'glowSilverthread',
    descriptionForInternalUse: 'Refined silver thread for private sealed notes and future-delivery framing.',
  },
] as const satisfies readonly GlowFilter[]

export type GlowFilterId = (typeof GLOW_FILTERS)[number]['id']

export const defaultGlowFilter = GLOW_FILTERS.find(
  (filter) => filter.id === DEFAULT_GLOW_FILTER_ID,
) ?? GLOW_FILTERS[0]

export function getRecommendedGlow() {
  return defaultGlowFilter
}

export function getGlowFilter(id: string | null | undefined) {
  return GLOW_FILTERS.find((filter) => filter.id === id) ?? defaultGlowFilter
}
