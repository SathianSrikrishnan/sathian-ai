'use client'

import { useEffect, useRef, useState } from 'react'
import { LessonPlayer } from './LessonPlayer'
import type { Lesson, Mode } from '@/lib/learn/types'

export function LessonCollection({ lessons, readyIds }: { lessons: Lesson[]; readyIds: string[] }) {
  const [selection, setSelection] = useState<{ id: string; mode: Mode; revision: number } | null>(null)
  const collection = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const selected = lessons.find(l => l.id === selection?.id)
  function pauseVideos() { collection.current?.querySelectorAll('video').forEach(v => v.pause()) }
  function choose(id: string, mode: Mode) {
    pauseVideos()
    setSelection(previous => ({ id, mode, revision: (previous?.revision || 0) + 1 }))
    window.history.replaceState(null, '', `#${id}-${mode}`)
    requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
  }
  function clear() { pauseVideos(); setSelection(null); window.history.replaceState(null, '', window.location.pathname); collection.current?.scrollIntoView({ block: 'start' }) }
  useEffect(() => {
    const match = window.location.hash.match(/^#([a-z]+)-(watch|try)$/)
    if (match && lessons.some(l => l.id === match[1])) choose(match[1], match[2] as Mode)
  }, [lessons])
  function renderLesson(lesson: Lesson) {
      const ready = readyIds.includes(lesson.id)
      return <article className={`learn-episode topic-${lesson.id}`} key={lesson.id} aria-label={lesson.boardTitle || lesson.title}>
        <div className="learn-episode-copy"><p className="learn-kicker">{lesson.boardTitle ? lesson.title : lesson.label}</p><p className="learn-topic-title">{lesson.boardTitle || lesson.title}</p><p>{lesson.introduction || lesson.description}</p>
          {ready && lesson.chapters.length > 0 && <button className="learn-button" aria-label={`Try the ${lesson.title} Q&A together`} onClick={() => choose(lesson.id, 'try')}>Try the Q&amp;A together</button>}
          {lesson.chapters.length === 0 && <p className="learn-watch-only">Historical PoH film · current-Solana introduction planned</p>}
        </div>
        <div className="learn-episode-media">{ready && lesson.watch ? <video controls playsInline preload="metadata" poster={lesson.poster} aria-label={`Watch the ${lesson.title} lesson`} src={lesson.watch.src}>{lesson.watch.captionSrc && <track kind="captions" src={lesson.watch.captionSrc} srcLang="en" label="English questions and answers" />}Your browser can open <a href={lesson.watch.src}>the lesson video</a>.</video> : <p>{lesson.availabilityMessage || 'Video pending.'}</p>}
          <p className="learn-video-label">Watch the lesson</p>
          <details className="learn-sources"><summary>Story and sources</summary>{lesson.sourceNote && <p>{lesson.sourceNote}</p>}{lesson.chapters.map(c => <div key={c.id}><strong>{c.title}</strong><p>{c.clips.question.transcript}</p><p>Yes: {c.clips.yes.transcript}</p><p>No: {c.clips.no.transcript}</p><p>{c.clips.close.transcript}</p></div>)}{lesson.chapters.length === 0 && lesson.watch?.transcript && <p>{lesson.watch.transcript}</p>}<ul>{lesson.sources.map(s => <li key={s.url}><a href={s.url}>{s.title}</a></li>)}</ul></details>
        </div>
      </article>

  }
  return <div className="learn-collection" ref={collection} onPlayCapture={e => {
    const active = e.target as HTMLVideoElement
    collection.current?.querySelectorAll('video').forEach(v => { if (v !== active) v.pause() })
  }}>
    <div className="learn-lessons">{['bitcoin','solana'].map(id => lessons.find(l => l.id === id)).filter((l): l is Lesson => !!l).map(renderLesson)}
      <article className="learn-episode learn-planned" aria-label="Stablecoins planned lesson"><div className="learn-episode-copy"><p className="learn-kicker">Learning roadmap</p><p className="learn-topic-title">Stablecoins</p><p>Explore reference values, issuers, redemption and the risks that remain.</p></div><div className="learn-planned-copy"><p>Planned lesson</p><p>Video and activity awaiting selection.</p></div></article>
    </div>
    <details className="learn-secondary"><summary>More lessons: Ethereum</summary><div className="learn-lessons">{lessons.filter(l => l.id === 'ethereum').map(renderLesson)}</div></details>
    {selected && selection && <section className="learn-inline" ref={panel} aria-label={`${selected.title} questions`}>
      <div className="learn-nav"><button className="learn-button secondary" onClick={clear}>Back to the lessons</button><span>{selected.label}</span></div>
      <h2>{selected.title}</h2>
      {selected.introduction && <p className="learn-context">{selected.introduction}</p>}
      {readyIds.includes(selected.id) ? <LessonPlayer key={`${selected.id}-${selection.mode}-${selection.revision}`} lesson={selected} mode={selection.mode} onChooseTopic={clear} /> : <p>{selected.availabilityMessage}</p>}
    </section>}
  </div>
}
