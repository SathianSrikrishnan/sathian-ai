'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { getImageProps } from 'next/image'
import Link from 'next/link'
import type { ArtworkSlide } from '@/content/home-hero-slides'
import { HOME_HERO_INTERVAL_MS } from '@/content/home-hero-slides'
import styles from './HomeHeroCarousel.module.css'

type Props = { slides: readonly ArtworkSlide[]; label: string; sizes: string; hero?: boolean; href?: string }

export function ArtworkCarousel({ slides, label, sizes, hero = false, href }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [requested, setRequested] = useState<number | null>(null)
  const [ready, setReady] = useState<number | null>(null)
  const [due, setDue] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [running, setRunning] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [failed, setFailed] = useState(false)
  const next = (index + 1) % slides.length
  const target = requested ?? next
  const rotating = running && !reducedMotion && !hovered && visible && pageVisible

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    setRunning(!media.matches)
    const onMotion = () => { setReducedMotion(media.matches); setRunning(false) }
    const onVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.3), { threshold: [0, 0.3] })
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

  // At most one image ahead, only after the first image loads and while visible.
  // Slow connections keep the last good picture instead of flashing an empty frame.
  useEffect(() => {
    if (!visible || !pageVisible || !imageLoaded || (requested === null && !rotating)) return
    let cancelled = false
    setReady(null)
    const slide = slides[target]
    const { props } = getImageProps({ src: slide.src, alt: slide.alt, width: slide.width, height: slide.height, sizes, quality: 65 })
    const preload = new window.Image()
    preload.decoding = 'async'
    preload.fetchPriority = 'low'
    preload.onload = () => {
      void preload.decode().then(() => { if (!cancelled) { setReady(target); setFailed(false) } }).catch(() => {
        if (!cancelled) { setFailed(true); setRunning(false) }
      })
    }
    preload.onerror = () => { if (!cancelled) { setFailed(true); setRunning(false) } }
    preload.sizes = props.sizes || sizes
    preload.srcset = props.srcSet || ''
    preload.src = props.src
    return () => { cancelled = true; preload.onload = null; preload.onerror = null }
  }, [target, slides, sizes, visible, pageVisible, imageLoaded, rotating, requested])

  useEffect(() => {
    setDue(false)
    if (!rotating || !imageLoaded) return
    const timer = window.setTimeout(() => setDue(true), HOME_HERO_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [rotating, index, imageLoaded])

  useEffect(() => {
    if (requested !== null && ready === requested) {
      setIndex(requested); setRequested(null); setDue(false)
    } else if (rotating && due && ready === next) {
      setIndex(next); setDue(false)
    }
  }, [requested, ready, rotating, due, next])

  const move = (step: number) => {
    // A tap shows the next picture and the carousel keeps turning.
    setFailed(false)
    setRequested(value => ((value ?? index) + step + slides.length) % slides.length)
  }
  const slide = slides[index]
  const picture = <Image className={styles.picture} src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} sizes={sizes} quality={65} priority={hero && index === 0} loading={hero && index === 0 ? undefined : 'lazy'} onLoad={() => setImageLoaded(true)} />

  return (
    <div ref={root} className={`${hero ? 'village-home-art' : styles.mini} ${styles.carousel}`} role="region" aria-roledescription="carousel" aria-label={label} data-slide={index + 1} data-ready={ready === next} data-running={rotating} data-image-count={slides.length}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false) }} onFocusCapture={event => { if ((event.target as HTMLElement).matches(':focus-visible')) setRunning(false) }} onBlurCapture={() => setRunning(!reducedMotion)}>
      <div className={styles.frame}>
        <div className={styles.slide} aria-live={running ? 'off' : 'polite'} aria-atomic="true">
          <div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            {/* Nov 9 (owner): no arrows or pause icon. It turns by itself; a tap shows the next picture. Hover and keyboard focus pause it, and reduced motion keeps it still. */}
            {href ? <Link href={href} prefetch={false} aria-label="See what a child gets from Tooth Fairy Network">{picture}</Link> : <button type="button" className={styles.tap} aria-label="Show the next picture" onClick={() => move(1)}>{picture}</button>}
          </div>
        </div>
      </div>
      {failed && <span className={styles.srOnly} role="status">This image could not load. The previous picture is still shown.</span>}
    </div>
  )
}
