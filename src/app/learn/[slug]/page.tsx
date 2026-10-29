import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { available, lessonById } from '@/lib/learn/catalog'
import { LessonPlayer } from '@/components/learn/LessonPlayer'
import { StablecoinLesson } from '@/components/learn/StablecoinLesson'
import { StablecoinFilm } from '@/components/learn/StablecoinFilm'
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ mode?: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const l = lessonById(slug); return { title: `${l?.title || 'Lesson'} | Learn with Tanda`, alternates: { canonical: `https://sathian.ai/learn/${slug}` } } }
export default async function LessonPage({ params, searchParams }: Props) {
  const { slug } = await params; const { mode } = await searchParams; const lesson = lessonById(slug); if (!lesson) notFound()
  return <main className="learn-lesson"><nav className="learn-nav" aria-label="Learning navigation"><Link href="/learn">← All topics</Link><a href="https://proof.sathian.ai">PROOF</a></nav>
    <header className="learn-lesson-title"><p className="learn-kicker">Learn with Tanda · {lesson.label}</p><h1>{lesson.title}</h1></header>
    {lesson.introduction && <p className="learn-context">{lesson.introduction}</p>}
    {lesson.interactive === 'stablecoin' ? <><StablecoinFilm /><StablecoinLesson /></> : available(lesson) ? <LessonPlayer key={`${slug}-${mode}`} lesson={lesson} mode={mode === 'watch' || lesson.chapters.length === 0 ? 'watch' : 'try'} /> : <div className="learn-unavailable"><img src={lesson.art} alt="" /><p>{lesson.availabilityMessage || 'This lesson is not available to play here yet.'}</p><Link className="learn-button" href="/learn">Back to topics</Link></div>}
    {!lesson.interactive && <details className="learn-sources"><summary>Story and sources</summary>{lesson.sourceNote && <p>{lesson.sourceNote}</p>}{lesson.chapters.map(c => <div key={c.id}><strong>{c.title}</strong><p>{c.clips.question.transcript}</p><p>Yes: {c.clips.yes.transcript}</p><p>No: {c.clips.no.transcript}</p><p>{c.clips.close.transcript}</p></div>)}<ul>{lesson.sources.map(s => <li key={s.url}><a href={s.url}>{s.title} ↗</a></li>)}</ul></details>}
  </main>
}
