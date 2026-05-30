'use client'

import clsx from 'clsx'
import Link from 'next/link'

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
              aria-label={`${treatment.label}. ${treatment.visualPromise} Keeper: ${treatment.keeperName}. Story object: ${treatment.keeperObject}. Object form: ${treatment.objectForm}`}
              onClick={() => onSelect(treatment.id)}
            >
              <span
                className={clsx(styles.swatch, styles[treatment.swatchClass])}
                aria-hidden="true"
              >
                <span />
              </span>
              <span className={styles.label}>{treatment.label}</span>
              <span className={styles.keeperBadge}>{treatment.keeperName}</span>
              {treatment.id === recommended.id && <small>Recommended</small>}
            </button>
          )
        })}
      </div>

      <div className={styles.styleStoryPanel} aria-label={`${selectedTreatment.label} story source`}>
        <div>
          <span className={styles.keeperBadge}>{selectedTreatment.keeperName}</span>
          <strong>{selectedTreatment.label}</strong>
          <p>{selectedTreatment.visualPromise}</p>
        </div>
        <dl>
          <div>
            <dt>Story object</dt>
            <dd>{selectedTreatment.keeperObject}</dd>
          </div>
          <div>
            <dt>Keeper cue</dt>
            <dd>{selectedTreatment.keeperCue}</dd>
          </div>
        </dl>
        <Link href={selectedTreatment.storyHref}>Open {selectedTreatment.keeperName} story</Link>
      </div>
    </div>
  )
}
