import { StoryConfig } from './types'
import toothFairy from './tooth-fairy'
import ratoncitoPerez from './ratoncito-perez'
import finland from './finland'
import northAfrica from './north-africa'
import jamaica from './jamaica'
import korea from './korea'
import romania from './romania'
import japan from './japan'
import ethiopia from './ethiopia'
import cherokee from './cherokee'
import ireland from './ireland'
import italy from './italy'
import babylonia from './babylonia'

export const ALL_STORIES: StoryConfig[] = [
  toothFairy,
  ratoncitoPerez,
  finland,
  northAfrica,
  jamaica,
  korea,
  romania,
  japan,
  ethiopia,
  cherokee,
  ireland,
  italy,
  babylonia,
]

export function getStoryById(id: string): StoryConfig | undefined {
  return ALL_STORIES.find(s => s.id === id)
}

export function getAvailableStories(): StoryConfig[] {
  return ALL_STORIES.filter(s => s.available)
}
