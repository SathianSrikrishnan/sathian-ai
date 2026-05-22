'use client'

import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './DraftGlowSequence.module.css'

type DraftGlowSequenceProps = {
  isActive?: boolean
  glowLabel?: string
  children: ReactNode
}

export function DraftGlowSequence({
  isActive = true,
  glowLabel = 'Draft Glow',
  children,
}: DraftGlowSequenceProps) {
  return (
    <div className={clsx(styles.sequence, isActive && styles.active)} aria-label={glowLabel}>
      <div className={styles.cardSlot}>{children}</div>
      <div className={styles.glowRing} aria-hidden="true" />
      <div className={styles.readyMark} aria-hidden="true">
        {glowLabel}
      </div>
    </div>
  )
}
