'use client'

import clsx from 'clsx'
import type { RefObject } from 'react'

import { getLightStyle } from '@/lib/toothlight/visual-treatments'
import styles from './ToothlightPreview.module.css'

type ToothlightPreviewProps = {
  sourceImageSrc?: string | null
  treatmentId: string
  title: string
  caption?: string
  renderTargetRef?: RefObject<HTMLElement>
}

export function ToothlightPreview({
  sourceImageSrc,
  treatmentId,
  title,
  caption,
  renderTargetRef,
}: ToothlightPreviewProps) {
  const treatment = getLightStyle(treatmentId)

  return (
    <article
      ref={renderTargetRef as RefObject<HTMLElement>}
      className={clsx(styles.preview, styles[treatment.cssClass])}
      style={{
        ['--treatment-accent' as string]: treatment.accent,
        ['--treatment-secondary' as string]: treatment.secondaryAccent,
      }}
      data-treatment={treatment.id}
      aria-label={`${title}. ${treatment.label}.`}
    >
      <div className={styles.media}>
        {sourceImageSrc ? (
          <img src={sourceImageSrc} alt="" className={styles.sourceImage} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span>Add a photo or drawing</span>
          </div>
        )}
        <div className={styles.treatmentWash} aria-hidden="true" />
        <div className={styles.edgeLight} aria-hidden="true" />
        <div className={styles.sparkLayer} aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <span>{treatment.label}</span>
        <h2>{title}</h2>
        {caption && <p>{caption}</p>}
      </div>
    </article>
  )
}
