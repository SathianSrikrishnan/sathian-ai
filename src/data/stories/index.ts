import { StoryConfig } from './types'
import tanda from './tanda'
import vikingOrigin from './viking-origin'
import ratoncitoPerez from './ratoncito-perez'

/** Featured trilogy — the three stories on the home page, in order.
 *  Tanda (converter) → Viking Origin (lore) → Ratoncito Pérez (broadener). */
export const FEATURED_STORIES: StoryConfig[] = [
  tanda,
  vikingOrigin,
  ratoncitoPerez,
]

/** ALL_STORIES is currently scoped to the trilogy only — the other 14 story
 *  files remain on disk for future re-activation, but aren't surfaced anywhere
 *  until the trilogy has proven the loop end-to-end. */
export const ALL_STORIES: StoryConfig[] = [
  tanda,
  vikingOrigin,
  ratoncitoPerez,
]

export function getStoryById(id: string): StoryConfig | undefined {
  return ALL_STORIES.find(s => s.id === id)
}

export function getAvailableStories(): StoryConfig[] {
  return ALL_STORIES.filter(s => s.available)
}
