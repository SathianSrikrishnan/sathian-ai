import StorySelector from '@/components/toothfairy/story/StorySelector'
import { ALL_STORIES } from '@/data/stories'

export const metadata = {
  title: 'Tooth Fairy Network — Choose Your Tradition',
  description: '13 traditions. 13 characters. 5 continents. Pick your culture and begin the magic.',
}

export default function StoryPage() {
  return <StorySelector stories={ALL_STORIES} />
}
