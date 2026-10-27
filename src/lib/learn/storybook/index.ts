import tandaOrigin from './tanda-origin'
import firstToothFee from './first-tooth-fee'
import toothlightTreaty from './toothlight-treaty'
import roofSong from './roof-song'
import edgeOfTheLight from './edge-of-the-light'
import oneYearWish from './one-year-wish'
import gapInTheGold from './gap-in-the-gold'

/** One page of a bedtime story: a full-frame illustration plus its read-aloud text. */
export type StoryFrame = {
  /** Full public URL of the frame illustration (Supabase Storage). */
  image: string
  /** Read-aloud text for that frame. */
  text: string
}

export type Story = {
  slug: string
  title: string
  /** One-line hook shown on the shelf. */
  hook: string
  /** The keeper (main character) of this story. */
  keeper: string
  /** The tooth tradition this story belongs to. */
  tradition: string
  /** Full public URL of the cover illustration. */
  cover: string
  /** Approximate read-aloud time in minutes. */
  minutes: number
  /** Optional illustrated film that complements this story entry. */
  film?: {
    href: string
    label: string
  }
  frames: StoryFrame[]
}

export const STORIES: Story[] = [
  tandaOrigin,
  firstToothFee,
  toothlightTreaty,
  roofSong,
  edgeOfTheLight,
  oneYearWish,
  gapInTheGold,
]

export function getStory(slug: string): Story | undefined {
  return STORIES.find((story) => story.slug === slug)
}
