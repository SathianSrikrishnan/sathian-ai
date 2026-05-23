'use client'

import clsx from 'clsx'

import {
  LIGHT_STYLE_TREATMENTS,
  getRecommendedLightStyle,
} from '@/lib/toothlight/visual-treatments'
import styles from './LightStyleCarousel.module.css'

type LightStyleCarouselProps = {
  selectedId: string
  onSelect: (id: string) => void
}

export function LightStyleCarousel({ selectedId, onSelect }: LightStyleCarouselProps) {
  const recommended = getRecommendedLightStyle()

  return (
    <div className={styles.carousel} aria-label="Choose a Light Style">
      {LIGHT_STYLE_TREATMENTS.map((treatment) => {
        const selected = selectedId === treatment.id
        return (
          <button
            key={treatment.id}
            type="button"
            className={clsx(styles.option, selected && styles.selected)}
            style={{
              ['--style-accent' as string]: treatment.accent,
              ['--style-secondary' as string]: treatment.secondaryAccent,
            }}
            aria-pressed={selected}
            data-treatment={treatment.id}
            onClick={() => onSelect(treatment.id)}
          >
            <span
              className={clsx(styles.swatch, styles[treatment.swatchClass])}
              aria-hidden="true"
            >
              <span />
            </span>
            <span className={styles.label}>{treatment.label}</span>
            {treatment.id === recommended.id && <small>Recommended</small>}
          </button>
        )
      })}
    </div>
  )
}
