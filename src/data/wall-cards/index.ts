import { wallCards } from './cards'
import { comingSoonTraditions } from './coming-soon'
import type { WallCard, ComingSoonTradition } from './types'

export { wallCards, comingSoonTraditions }
export type { WallCard, ComingSoonTradition }

/** Get a single card by slug */
export function getCardById(id: string): WallCard | undefined {
  return wallCards.find((c) => c.id === id)
}

/** Get a single coming-soon tradition by slug */
export function getComingSoonBySlug(slug: string): ComingSoonTradition | undefined {
  return comingSoonTraditions.find((t) => t.slug === slug)
}

/** Get all cards for a given continent */
export function getCardsByContinent(continent: WallCard['continent']): WallCard[] {
  return wallCards.filter((c) => c.continent === continent)
}

/** Get only the cards that link to a full story */
export function getLinkedCards(): WallCard[] {
  return wallCards.filter((c) => c.linkedFullStory != null)
}

/** Unique continents present in the current card set */
export function getContinents(): WallCard['continent'][] {
  return Array.from(new Set(wallCards.map((c) => c.continent)))
}

/** Globe marker shape — small + decoupled from card shape */
export interface GlobeMarker {
  id: string
  slug: string
  lat: number
  lng: number
  active: boolean
  featured: boolean
}

/** All 50 traditions formatted as globe markers */
export function allTraditionsForGlobe(): GlobeMarker[] {
  const wc: GlobeMarker[] = wallCards.map((c) => ({
    id: c.id,
    slug: c.slug,
    lat: c.coordinates.lat,
    lng: c.coordinates.lng,
    active: true,
    featured: c.featured ?? false,
  }))
  const cs: GlobeMarker[] = comingSoonTraditions.map((t) => ({
    id: t.id,
    slug: t.slug,
    lat: t.coordinates.lat,
    lng: t.coordinates.lng,
    active: false,
    featured: false,
  }))
  return [...wc, ...cs]
}

/** Photo-border thumbnail shape */
export interface TraditionThumbnail {
  slug: string
  src: string
  alt: string
  active: boolean
  featured: boolean
}

/** All 50 traditions formatted as photo border thumbnails */
export function allTraditionImages(): TraditionThumbnail[] {
  const wc: TraditionThumbnail[] = wallCards.map((c) => ({
    slug: c.slug,
    src: c.image,
    alt: c.title,
    active: true,
    featured: c.featured ?? false,
  }))
  const cs: TraditionThumbnail[] = comingSoonTraditions.map((t) => ({
    slug: t.slug,
    src: '/story-assets/placeholder-gold.svg',
    alt: t.title,
    active: false,
    featured: false,
  }))
  return [...wc, ...cs]
}

/** Look up a tradition (active OR coming-soon) by slug */
export function findTraditionBySlug(slug: string): {
  type: 'wall-card'
  data: WallCard
} | {
  type: 'coming-soon'
  data: ComingSoonTradition
} | null {
  const wc = wallCards.find((c) => c.slug === slug)
  if (wc) return { type: 'wall-card', data: wc }
  const cs = comingSoonTraditions.find((t) => t.slug === slug)
  if (cs) return { type: 'coming-soon', data: cs }
  return null
}
