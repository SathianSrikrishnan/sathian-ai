import { StoryConfig } from './types'
import tanda from './tanda'
import vikingOrigin from './viking-origin'
import ratoncitoPerez from './ratoncito-perez'
import korea from './korea'
import warabaEdgeLight from './waraba-edge-light'
import dagaOneYearWish from './daga-one-year-wish'
import annaBogle from './anna-bogle'

/** Original launch trilogy: Tanda -> Viking Origin -> Ratoncito Perez. */
export const FEATURED_STORIES: StoryConfig[] = [
  tanda,
  vikingOrigin,
  ratoncitoPerez,
]

/** Live story shelf: the seven production full storybooks. */
export const LIVE_STORIES: StoryConfig[] = [
  ...FEATURED_STORIES,
  korea,
  warabaEdgeLight,
  dagaOneYearWish,
  annaBogle,
]

export const ALL_STORIES: StoryConfig[] = LIVE_STORIES

export function getStoryById(id: string): StoryConfig | undefined {
  return ALL_STORIES.find(s => s.id === id)
}

export function getAvailableStories(): StoryConfig[] {
  return ALL_STORIES.filter(s => s.available)
}
