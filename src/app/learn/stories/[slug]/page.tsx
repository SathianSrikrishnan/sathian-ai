import Link from 'next/link'
import { notFound } from 'next/navigation'
import { STORIES, getStory } from '@/lib/learn/storybook'
import films from '@/lib/learn/storybook/films.json'
import { LearnStoryReader } from '@/components/learn/LearnStoryReader'
export function generateStaticParams() { return STORIES.map(s => ({ slug: s.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const story = getStory((await params).slug); return { title: `${story?.title || 'Story'} | Learn with Tanda` } }
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) { const story = getStory((await params).slug); if (!story) notFound(); const film = films.find(f => f.slug === story.slug); return <main className="learn-board"><nav className="learn-nav"><Link href="/learn">Learn with Tanda</Link><Link href="/learn/stories">All stories</Link></nav><header className="learn-intro"><h1>{story.title}</h1><p>{story.hook}</p></header><LearnStoryReader story={story} />{film && <details className="learn-story-film"><summary>Watch the illustrated film</summary><video controls playsInline preload="none" poster={film.poster} aria-label={film.title}><source src={film.src} type="video/mp4" /><track kind="captions" src={film.captions} srcLang="en" label="English" /></video></details>}</main> }
