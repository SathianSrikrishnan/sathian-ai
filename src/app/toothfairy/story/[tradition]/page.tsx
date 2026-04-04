import { notFound } from 'next/navigation'
import StoryPlayer from '@/components/toothfairy/story/StoryPlayer'
import { getStoryById, ALL_STORIES } from '@/data/stories'

interface Props {
  params: Promise<{ tradition: string }>
}

export async function generateStaticParams() {
  return ALL_STORIES.filter(s => s.available).map(s => ({
    tradition: s.id,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { tradition } = await params
  const story = getStoryById(tradition)
  if (!story) return { title: 'Story Not Found' }

  return {
    title: `${story.title} — Tooth Fairy Network`,
    description: `A magical story from ${story.region}. ${story.description}.`,
  }
}

export default async function TraditionPage({ params }: Props) {
  const { tradition } = await params
  const story = getStoryById(tradition)

  if (!story || !story.available) {
    notFound()
  }

  // Find the next available story for navigation
  const available = ALL_STORIES.filter(s => s.available)
  const currentIndex = available.findIndex(s => s.id === tradition)
  const next = currentIndex >= 0 && currentIndex < available.length - 1
    ? available[currentIndex + 1]
    : available[0] // wrap around to first
  const nextStory = next && next.id !== tradition
    ? { id: next.id, title: next.title, region: next.region }
    : null

  return <StoryPlayer story={story} nextStory={nextStory} />
}
