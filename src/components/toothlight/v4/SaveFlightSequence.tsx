'use client'

import clsx from 'clsx'
import { useEffect } from 'react'

import styles from './SaveFlightSequence.module.css'

type SaveFlightSequenceProps = {
  mode?: 'child' | 'parent'
  intensity?: 'calm' | 'wonder'
  isActive?: boolean
  saveSucceeded?: boolean
  onComplete?: () => void
}

const assetRoot = '/toothfairy/animation/live-hero-v1/'

export function SaveFlightSequence({
  mode = 'child',
  intensity = 'wonder',
  isActive = false,
  saveSucceeded = false,
  onComplete,
}: SaveFlightSequenceProps) {
  const shouldRun = isActive && saveSucceeded

  useEffect(() => {
    if (!shouldRun || !onComplete) return
    const timer = window.setTimeout(onComplete, intensity === 'calm' ? 1400 : 2100)
    return () => window.clearTimeout(timer)
  }, [intensity, onComplete, shouldRun])

  return (
    <div
      className={clsx(
        styles.sequence,
        shouldRun && styles.active,
        mode === 'parent' && styles.parentMode,
        intensity === 'calm' && styles.calm,
      )}
      aria-hidden={!shouldRun}
      aria-label="Save Flight to the Tooth Fairy Network"
    >
      <div className={styles.networkAperture}>
        <span>Network</span>
      </div>
      <div className={styles.lightCard} />
      <img
        src={`${assetRoot}tanda-wave.webp`}
        alt=""
        className={styles.tandaGuide}
        aria-hidden="true"
      />
      <div className={styles.trail} aria-hidden="true" />
      <div className={styles.success}>Saved</div>
    </div>
  )
}
