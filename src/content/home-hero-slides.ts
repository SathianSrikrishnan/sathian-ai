import artwork from './home-artwork.json'

export type ArtworkSlide = { src: string; alt: string; width: number; height: number }
export const HOME_HERO_INTERVAL_MS = 1_000
// Approved source identities and hashes: docs/marketing/home-artwork-20261109.json.
// Photo-style scenes are generated examples, not customer photographs.
export const HOME_HERO_SLIDES: readonly ArtworkSlide[] = artwork.hero
export const HOME_QUESTION_SLIDES = {
  where: artwork.where, when: artwork.when, why: artwork.why,
} satisfies Record<string, readonly ArtworkSlide[]>
