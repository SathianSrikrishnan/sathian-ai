import StorySelector from '@/components/toothfairy/story/StorySelector'
import { ALL_STORIES } from '@/data/stories'

export const metadata = {
  title: 'Tooth Fairy Network - Read the Stories',
  description: 'Seven tooth tradition storybooks, seven keepers, and one growing family memory network.',
}

export default function StoryPage() {
  return <StorySelector stories={ALL_STORIES} />
}
