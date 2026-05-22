'use client'

import clsx from 'clsx'

import { GLOW_FILTERS, getRecommendedGlow } from '@/lib/toothlight/glow-filters'
import styles from './GlowPicker.module.css'

type GlowPickerProps = {
  selectedId: string
  onSelect: (id: string) => void
}

export function GlowPicker({ selectedId, onSelect }: GlowPickerProps) {
  const recommended = getRecommendedGlow()

  return (
    <div className={styles.picker} aria-label="Choose the Glow">
      {GLOW_FILTERS.map((filter) => {
        const selected = selectedId === filter.id
        return (
          <button
            key={filter.id}
            type="button"
            className={clsx(styles.option, selected && styles.selected)}
            style={{ ['--glow-accent' as string]: filter.accent }}
            aria-pressed={selected}
            onClick={() => onSelect(filter.id)}
          >
            <span className={clsx(styles.preview, styles[filter.previewClass])} aria-hidden="true" />
            <span>{filter.label}</span>
            {filter.id === recommended.id && <small>Recommended</small>}
          </button>
        )
      })}
    </div>
  )
}
