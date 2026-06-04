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
  const selectedTreatment =
    LIGHT_STYLE_TREATMENTS.find((treatment) => treatment.id === selectedId) ?? recommended

  return (
    <div
      className={styles.stylePicker}
      style={{
        ['--style-accent' as string]: selectedTreatment.accent,
        ['--style-secondary' as string]: selectedTreatment.secondaryAccent,
      }}
    >
      <div className={styles.carousel} aria-label="Light Style choices">
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
              data-keeper={treatment.keeperName.toLowerCase().replace(/\s+/g, '-')}
              data-symbol={treatment.storySymbol}
              data-story-href={treatment.storyHref}
              data-recommended={treatment.id === recommended.id}
              aria-label={`${treatment.label}. ${treatment.visualPromise} Keeper: ${treatment.keeperName}. Story object: ${treatment.keeperObject}. Object form: ${treatment.objectForm}`}
              onClick={() => onSelect(treatment.id)}
            >
              <span
                className={clsx(styles.swatch, styles[treatment.swatchClass])}
                aria-hidden="true"
              >
                <span />
              </span>
              <span className={styles.keeperMark} aria-hidden="true">
                <i />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
