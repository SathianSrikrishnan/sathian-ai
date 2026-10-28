'use client'

import { useEffect, useRef, useState } from 'react'
import { LessonPlayer } from './LessonPlayer'
import { StablecoinLesson } from './StablecoinLesson'
import { lessonEntryMode } from '@/lib/learn/selection'
import type { Lesson, Mode } from '@/lib/learn/types'

const childQuestions: Record<string, string> = {
  bitcoin: 'Can money copy like a picture?',
  solana: 'Which happened first?',
  ethereum: 'How do we follow shared rules?',
}

export function LessonCollection({ lessons, readyIds }: { lessons: Lesson[]; readyIds: string[] }) {
  const [selection, setSelection] = useState<{ id: string; mode: Mode; revision: number } | null>(null)
  const collection = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const selected = lessons.find(l => l.id === selection?.id)
  const selectedTitle = selected?.id === 'solana' ? selected.boardTitle || selected.title : selected?.title
  function pauseVideos() { collection.current?.querySelectorAll('video').forEach(v => v.pause()) }
  function choose(id: string, mode: Mode, button?: HTMLButtonElement) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    const entryMode = lessonEntryMode(lesson, mode)
    trigger.current = button || null
    pauseVideos()
    setSelection(previous => ({ id, mode: entryMode, revision: (previous?.revision || 0) + 1 }))
    window.history.replaceState(null, '', `#${id}-${entryMode}`)
  }
  function clear() {
    pauseVideos(); setSelection(null); window.history.replaceState(null, '', window.location.pathname)
    requestAnimationFrame(() => {
      const target = trigger.current || collection.current?.querySelector<HTMLButtonElement>('.learn-picture-caption button')
      target?.scrollIntoView({ block: 'center', behavior: 'instant' })
      target?.focus({ preventScroll: true })
    })
  }
  useEffect(() => {
    if (!selection || !panel.current) return
    panel.current.scrollIntoView({ block: 'start', behavior: 'instant' })
    panel.current.querySelector<HTMLHeadingElement>('h2')?.focus({ preventScroll: true })
  }, [selection])
  useEffect(() => {
    const openFromHash = (event?: HashChangeEvent) => {
      const match = window.location.hash.match(/^#([a-z]+)-(watch|try)$/)
      if (match && lessons.some(l => l.id === match[1])) choose(match[1], match[2] as Mode)
      else if (event && !window.location.hash) clear()
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [lessons])
  function renderLesson(lesson: Lesson) {
    const ready = readyIds.includes(lesson.id)
    return <article className={`learn-picture-lesson topic-${lesson.id}`} key={lesson.id} aria-label={lesson.boardTitle || lesson.title}>
      <div className="learn-picture-film">{ready && lesson.watch ? <video controls playsInline preload="none" poster={lesson.poster} aria-label={`Watch the ${lesson.title} lesson`} src={lesson.watch.src}>{lesson.watch.captionSrc && <track kind="captions" src={lesson.watch.captionSrc} srcLang="en" label="English questions and answers" />}<a href={lesson.watch.src}>Open the lesson video</a>.</video> : <p>{lesson.availabilityMessage || 'Video pending.'}</p>}</div>
      <div className="learn-picture-caption"><div><p className="learn-topic-title">{lesson.boardTitle || lesson.title}</p><p className="learn-child-question"><strong>{childQuestions[lesson.id]}</strong></p></div>
        {ready && lesson.chapters.length > 0 ? <button className="learn-button" aria-label={`Try the ${lesson.title} Q&A together`} onClick={event => choose(lesson.id, 'try', event.currentTarget)}>Try the questions</button> : <span className="learn-history-note">History lesson</span>}
      </div>
      {lesson.id === 'solana' && <p className="learn-history-note">An introduction to Solana’s early Proof of History design.</p>}

    </article>
  }
  return <div className="learn-collection" ref={collection} onPlayCapture={e => {
    const active = e.target as HTMLVideoElement
    collection.current?.querySelectorAll('video').forEach(v => { if (v !== active) v.pause() })
  }}>
    <div className="learn-picture-lessons">{lessons.filter(l => l.id === 'bitcoin').map(renderLesson)}{lessons.filter(l => l.id === 'ethereum').map(renderLesson)}<article className="learn-picture-lesson learn-stablecoin-card" aria-labelledby="stablecoin-card-title"><div className="learn-picture-caption"><h3 id="stablecoin-card-title" className="learn-topic-title">What is a stablecoin?</h3><div className="learn-token-preview" aria-hidden="true"><span>$1</span><span>↔</span><span>USDC</span></div><button className="learn-button" onClick={event=>choose('stablecoin','try',event.currentTarget)}>Start the USDC lesson</button></div></article></div><section className="learn-history-feed" aria-label="Historical Solana film">{lessons.filter(l => l.id === 'solana').map(renderLesson)}</section>

    {selected && selection && <section className="learn-inline" ref={panel} aria-label={`${selectedTitle} lesson`}>
      <div className="learn-nav"><button className="learn-button secondary" onClick={clear}>Back to the lessons</button><span>{selected.label}</span></div>
      <h2 tabIndex={-1}>{selectedTitle}</h2>
      {!selected.interactive && <p className="learn-context">{childQuestions[selected.id]}</p>}
      {selected.interactive === 'stablecoin' ? <StablecoinLesson key={`stablecoin-${selection.revision}`} /> : readyIds.includes(selected.id) ? <LessonPlayer key={`${selected.id}-${selection.mode}-${selection.revision}`} lesson={selected} mode={selection.mode} onChooseTopic={clear} /> : <p>{selected.availabilityMessage}</p>}
    </section>}
  </div>
}
