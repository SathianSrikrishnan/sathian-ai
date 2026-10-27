'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { initialState, transition, type PlayerEvent } from '@/lib/learn/player-machine'
import type { Lesson, Mode } from '@/lib/learn/types'

export function LessonPlayer({ lesson, mode, onChooseTopic }: { lesson: Lesson; mode: Mode; onChooseTopic?: () => void }) {
  const [state, setState] = useState(() => initialState(mode))
  const [revision, setRevision] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [cc, setCc] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const question = useRef<HTMLParagraphElement>(null)
  const finish = useRef<HTMLParagraphElement>(null)
  const standalone = state.mode === 'watch' ? lesson.watch : undefined
  const chapter = standalone ? undefined : lesson.chapters[state.chapter]
  const clip = standalone || chapter!.clips[state.part]
  const key = `${state.chapter}-${state.part}-${revision}`
  const phaseBase = state.part === 'question' ? 0 : state.part === 'close' ? .72 : .42
  const progress = state.phase === 'finished' ? 1 : standalone ? time / (duration || 1) : (state.chapter + (state.phase === 'choice' ? .42 : phaseBase + Math.min(1, time / (duration || clip.duration || 1)) * (state.part === 'question' ? .42 : .28))) / lesson.chapters.length
  const caption = clip.captions?.find(c => time >= c[0] && time < c[1])?.[2] || (!clip.captions?.length ? clip.transcript : '')

  function send(e: PlayerEvent) {
    if (['replay', 'back', 'restart', 'mode'].includes(e.type)) { setRevision(n => n + 1); setError(false) }
    setState(s => transition(s, e))
  }
  useEffect(() => {
    setTime(0); setDuration(0); setError(false); setPlaying(false)
    const v = video.current; let current = true
    if (v && state.phase === 'playing') v.play().catch(() => { if (current) setPlaying(false) })
    return () => { current = false; v?.pause() }
  }, [key, state.phase, clip.src])
  useEffect(() => { if (state.phase === 'choice') question.current?.focus(); if (state.phase === 'finished') finish.current?.focus() }, [state.phase])
  useEffect(() => { const pause = () => { if (document.hidden) video.current?.pause() }; document.addEventListener('visibilitychange', pause); return () => document.removeEventListener('visibilitychange', pause) }, [])

  function start() { void video.current?.play().catch(() => {}); send({ type: 'start' }) }
  function toggle() { const v = video.current; if (!v || state.phase !== 'playing' || error) return; if (v.paused) void v.play().catch(() => setPlaying(false)); else v.pause() }
  function changeMode(next: Mode) { if (next === state.mode) return; video.current?.pause(); send({ type: 'mode', mode: next }); window.history.replaceState(null, '', window.location.hash ? `#${lesson.id}-${next}` : `?mode=${next}`) }

  return <section className="learn-player" aria-label={`${lesson.title} lesson player`} onKeyDown={e => {
    if (e.code === 'Space' && !['BUTTON', 'A', 'INPUT', 'SUMMARY'].includes((e.target as HTMLElement).tagName) && state.phase === 'playing') { e.preventDefault(); toggle() }
  }}>
    {lesson.chapters.length > 0 && <div className="learn-mode" aria-label="Choose how to learn"><button aria-pressed={state.mode === 'watch'} onClick={() => changeMode('watch')}>Watch</button><button aria-pressed={state.mode === 'try'} onClick={() => changeMode('try')}>Try it yourself</button></div>}
    <div className="learn-part-label"><span>{chapter?.title || 'Watch the story'}</span>{chapter && <span>{state.chapter + 1} / {lesson.chapters.length}</span>}</div>
    <div className={`learn-stage ${state.phase === 'choice' ? 'awaiting-answer' : ''}`} tabIndex={0} aria-label="Video. Space pauses or resumes.">
      <video key={key} ref={video} src={clip.src} poster={lesson.poster} preload="metadata" playsInline aria-label={clip.transcript || lesson.title}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onPlay={e => { if (e.currentTarget === video.current) setPlaying(true) }} onPause={e => { if (e.currentTarget === video.current) setPlaying(false) }}
        onError={() => { setError(true); setPlaying(false) }}
        onEnded={e => { if (e.currentTarget !== video.current) return; if (standalone) setState(s => ({ ...s, phase: 'finished' })); else send({ type: 'ended', canonicalAnswer: chapter!.answer, chapters: lesson.chapters.length }) }} />
      {chapter && !clip.embeddedDrawing && state.phase !== 'choice' && state.phase !== 'finished' && <img className="learn-scene-art" src={chapter.art} alt="" />}
      {state.phase === 'idle' && !error && <div className="learn-start"><button className="learn-button" aria-label={state.mode === 'watch' ? 'Watch the story' : 'Start learning'} onClick={start}>▶ {state.mode === 'watch' ? 'Watch the story' : 'Start learning'}</button></div>}
      {state.phase === 'choice' && !error && chapter && <div className="learn-choice" role="group" aria-labelledby="lesson-question"><p ref={question} id="lesson-question" tabIndex={-1}>{chapter.question}</p><div><button className="learn-answer" onClick={() => send({ type: 'choose', answer: 'yes' })}>Yes</button><button className="learn-answer" onClick={() => send({ type: 'choose', answer: 'no' })}>No</button></div></div>}
      {state.phase === 'finished' && !error && <div className="learn-finish"><p ref={finish} tabIndex={-1}>Lesson complete</p><div className="learn-actions"><button className="learn-button" onClick={() => send({ type: 'restart' })}>Play again</button><Link className="learn-button secondary" href="/learn" onClick={e => { if (onChooseTopic) { e.preventDefault(); onChooseTopic() } }}>Choose a topic</Link></div></div>}
      {error && <div className="learn-error" role="alert"><p>We couldn’t load this part.</p><button className="learn-button" onClick={() => { setError(false); setRevision(n => n + 1) }}>Try again</button><Link href="/learn">Back to topics</Link></div>}
    </div>
    <progress className="learn-progress" value={Math.max(0, Math.min(1, progress))} max={1} aria-label="Lesson progress" />
    <div className="learn-controls"><button onClick={toggle} disabled={state.phase !== 'playing' || error} aria-label={playing ? 'Pause video' : 'Resume video'}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button><button onClick={() => send({ type: 'replay' })} disabled={state.phase === 'idle'}>↺ Replay {chapter ? 'question' : 'story'}</button><button onClick={() => send({ type: 'back' })} disabled={!chapter || state.chapter === 0 || state.phase === 'idle'}>← Back</button><button aria-pressed={cc} disabled={!!standalone && !clip.captions?.length} title={standalone && !clip.captions?.length ? 'Timed captions are available in Try it yourself.' : 'Captions'} onClick={() => setCc(v => !v)}>{standalone && !clip.captions?.length ? 'CC pending' : 'CC'}</button></div>
    {cc && state.phase !== 'choice' && <p className="learn-caption" aria-live="off">{caption || ' '}</p>}
    <p className="learn-sr" aria-live="polite">{state.phase === 'choice' ? 'Choose Yes or No to continue.' : state.phase === 'finished' ? 'Lesson complete.' : state.phase === 'playing' ? `Playing ${state.part}` : 'Ready to start.'}</p>
  </section>
}
