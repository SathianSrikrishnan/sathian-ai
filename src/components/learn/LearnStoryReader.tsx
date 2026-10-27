'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Story } from '@/lib/learn/storybook'

export function LearnStoryReader({ story }: { story: Story }) {
  const [page, setPage] = useState(0)
  const caption = useRef<HTMLElement>(null)
  const touch = useRef<number | null>(null)
  const frame = story.frames[page]
  function go(step: number) { setPage(p => Math.max(0, Math.min(story.frames.length - 1, p + step))) }
  useEffect(() => { caption.current?.focus({ preventScroll: true }) }, [page])
  return <article className="learn-story-reader" aria-label={story.title} onKeyDown={e => {
    if (['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SUMMARY'].includes((e.target as HTMLElement).tagName)) return
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }}>
    <figure onTouchStart={e => { touch.current = e.touches[0].clientX }} onTouchEnd={e => {
      if (touch.current !== null) { const delta = e.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 60) go(delta < 0 ? 1 : -1); touch.current = null }
    }}><img src={frame.image} alt={`Illustration for ${story.title}, page ${page + 1}`} decoding="async" /><figcaption ref={caption} tabIndex={-1}>{frame.text}</figcaption></figure>
    <nav className="learn-story-controls" aria-label="Story pages"><button className="learn-button secondary" disabled={page === 0} onClick={() => go(-1)}>Previous page</button><p aria-live="polite">{page + 1} / {story.frames.length}</p><button className="learn-button" disabled={page === story.frames.length - 1} onClick={() => go(1)}>Next page</button></nav>
    <progress max={story.frames.length} value={page + 1} aria-label="Story reading progress" />
    {page === story.frames.length - 1 && <div className="learn-story-end"><p>The end. What would you draw from this story?</p><button className="learn-button secondary" onClick={() => setPage(0)}>Read again</button><Link className="learn-button" href="/learn/stories">Choose another story</Link></div>}
  </article>
}
