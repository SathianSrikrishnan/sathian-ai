"use client"
import { useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import styles from './GiftPresentation.module.css'
export type GiftPicture = { src: string; alt: string; title: string; caption: string; width: number; height: number }
export function GiftGallery({ id, items }: { id: string; items: readonly GiftPicture[] }) {
  const [index, setIndex] = useState(0)
  const move = (step: number) => setIndex(current => (current + step + items.length) % items.length)
  const picture = items[index]
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setIndex(event.key === 'Home' ? 0 : items.length - 1) }
  }
  return <section className={styles.gallery} role="region" aria-roledescription="carousel" aria-labelledby={`${id}-title`} onKeyDown={onKeyDown} tabIndex={0} data-gift-gallery>
    <h2 id={`${id}-title`}>Small moments, kept close.</h2>
    <div id={`${id}-slide`} className={styles.frame} role="group" aria-roledescription="slide" aria-label={`Picture ${index + 1} of ${items.length}`}>
      <Image key={picture.src} src={picture.src} alt={picture.alt} width={picture.width} height={picture.height} sizes="(max-width:600px) 100vw, 580px" loading="lazy" />
      <div><h3>{picture.title}</h3><p>{picture.caption}</p></div>
    </div>
    <div className={styles.controls}><button type="button" onClick={() => move(-1)} aria-label="Previous picture" aria-controls={`${id}-slide`}>Previous</button><p aria-live="polite" aria-atomic="true">{index + 1} of {items.length}: {picture.title}</p><button type="button" onClick={() => move(1)} aria-label="Next picture" aria-controls={`${id}-slide`}>Next</button></div>
  </section>
}
