'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HOME_HERO_INTERVAL_MS, HOME_HERO_SLIDES } from '@/content/home-hero-slides'
import styles from './HomeHeroCarousel.module.css'

export function HomeHeroCarousel() {
  const root = useRef<HTMLDivElement>(null)
  const pointerRotationIntent = useRef<boolean | null>(null)
  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    setRunning(!media.matches)
    const onMotion = () => { setReducedMotion(media.matches); setRunning(false) }
    const onVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 })
    if (root.current) observer.observe(root.current)
    onVisibility()
    media.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const rotating = running && !reducedMotion && !hovered && visible && pageVisible
  useEffect(() => {
    if (!rotating) return
    const timer = window.setTimeout(() => setIndex(value => (value + 1) % HOME_HERO_SLIDES.length), HOME_HERO_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [rotating, index])

  const move = (step: number) => {
    setRunning(false)
    setIndex(value => (value + step + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length)
  }
  const slide = HOME_HERO_SLIDES[index]

  return (
    <div ref={root} className={`village-home-art ${styles.carousel}`} role="region" aria-roledescription="carousel" aria-label="A child's village" data-slide={index + 1}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setRunning(false)}>
      <div aria-live={running ? 'off' : 'polite'} aria-atomic="true">
        <div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${HOME_HERO_SLIDES.length}`}>
          <Link href="/village" prefetch={false} aria-label="See what a child gets from Tooth Fairy Network">
            <Image src={slide.src} alt={slide.alt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 460px" quality={75} priority={index === 0} />
          </Link>
        </div>
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous image" onClick={() => move(-1)}>&larr;</button>
        <span className={styles.count} aria-hidden="true">{index + 1} / {HOME_HERO_SLIDES.length}</span>
        <button type="button" className={styles.rotation} disabled={reducedMotion}
          aria-label={reducedMotion ? 'Automatic rotation off: reduced motion' : running ? 'Pause automatic rotation' : 'Start automatic rotation'}
          onPointerDown={() => { pointerRotationIntent.current = !running }}
          onPointerCancel={() => { pointerRotationIntent.current = null }}
          onBlur={() => { pointerRotationIntent.current = null }}
          onClick={() => { setRunning(pointerRotationIntent.current ?? !running); pointerRotationIntent.current = null }}>
          {reducedMotion ? 'Motion off' : running ? 'Pause' : 'Play'}
        </button>
        <button type="button" aria-label="Next image" onClick={() => move(1)}>&rarr;</button>
      </div>
      <p className={styles.note}>One image every 3 minutes. Browse at your own pace.</p>
    </div>
  )
}
