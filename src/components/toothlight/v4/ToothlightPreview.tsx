'use client'

import clsx from 'clsx'
import type { RefObject } from 'react'

import { getLightStyle } from '@/lib/toothlight/visual-treatments'
import styles from './ToothlightPreview.module.css'

type ToothlightPreviewProps = {
  sourceImageSrc?: string | null
  aiImageSrc?: string | null
  treatmentId: string
  title: string
  caption?: string
  renderTargetRef?: RefObject<HTMLElement>
}

export function ToothlightPreview({
  sourceImageSrc,
  aiImageSrc,
  treatmentId,
  title,
  caption,
  renderTargetRef,
}: ToothlightPreviewProps) {
  const treatment = getLightStyle(treatmentId)
  const displayImageSrc = aiImageSrc ?? sourceImageSrc
  const hasAiFinal = Boolean(aiImageSrc)

  return (
    <article
      ref={renderTargetRef as RefObject<HTMLElement>}
      className={clsx(styles.preview, styles[treatment.cssClass], hasAiFinal && styles.aiFinal)}
      style={{
        ['--treatment-accent' as string]: treatment.accent,
        ['--treatment-secondary' as string]: treatment.secondaryAccent,
        ['--treatment-deep' as string]: treatment.deepAccent,
      }}
      data-treatment={treatment.id}
      data-effect={treatment.effectClass}
      data-symbol={treatment.storySymbol}
      data-render={hasAiFinal ? 'ai-final' : 'deterministic-preview'}
      aria-label={`${title}. ${treatment.label}.`}
    >
      <div className={styles.media}>
        {displayImageSrc ? (
          <img
            src={displayImageSrc}
            alt=""
            className={styles.sourceImage}
            style={{ filter: treatment.cssFilter }}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span>Add a photo or drawing</span>
          </div>
        )}
        <div className={styles.lightBloom} aria-hidden="true" />
        <div className={styles.photoEffectLayer} aria-hidden="true" />
        <div className={styles.treatmentWash} aria-hidden="true" />
        <div className={styles.materialLayer} aria-hidden="true" />
        <div className={styles.textureLayer} aria-hidden="true" />
        <div className={styles.drawingInterpretation} aria-hidden="true" />
        <div className={styles.edgeLight} aria-hidden="true" />
        <div className={styles.sparkLayer} aria-hidden="true" />
        <div className={styles.symbolLayer} data-symbol={treatment.storySymbol} aria-hidden="true" />
        <div className={styles.memoryFrame} aria-hidden="true" />
        <div className={styles.beforeAfter} aria-label="Original preserved and enhanced preview state">
          <span className={styles.originalChip}>Original preserved</span>
          <span className={hasAiFinal ? styles.aiFinalChip : styles.previewChip}>
            {hasAiFinal ? 'AI final' : 'Live preview'}
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <span>{treatment.label}</span>
        <h2>{title}</h2>
        {caption && <p>{caption}</p>}
        <small>{treatment.visualPromise}</small>
      </div>
    </article>
  )
}
