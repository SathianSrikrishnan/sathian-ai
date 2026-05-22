import clsx from 'clsx'

import type { ToothlightCardProps } from './types'
import styles from './ToothlightCard.module.css'

const stateClasses = {
  draft_glow: styles.draftGlow,
  spark: styles.spark,
  note_started: styles.noteStarted,
  sealed: styles.sealed,
  smile_fund_active: styles.smileFundActive,
  constellated: styles.constellated,
}

const stateLabels = {
  draft_glow: 'Draft glow',
  spark: 'Glow ready',
  note_started: 'Note Started',
  sealed: 'Sealed for later',
  smile_fund_active: 'Smile Fund active',
  constellated: 'Family constellation added',
}

export function ToothlightCard({
  imageSrc,
  title,
  caption,
  createdLabel,
  visualState = 'draft_glow',
  familyNodes = [],
  smileFundActive = false,
  className,
}: ToothlightCardProps) {
  const isConstellated = visualState === 'constellated' || familyNodes.length > 0
  const accessibleStatus = [
    stateLabels[visualState],
    smileFundActive ? 'Smile Fund linked' : null,
    isConstellated ? `${familyNodes.length} family node${familyNodes.length === 1 ? '' : 's'}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <article
      className={clsx(
        styles.card,
        stateClasses[visualState],
        isConstellated && styles.hasConstellation,
        className,
      )}
      aria-label={`${title}. ${accessibleStatus}`}
    >
      <div className={styles.glowShell} aria-hidden="true" />
      <div className={styles.media}>
        {imageSrc ? (
          <img src={imageSrc} alt="" className={styles.image} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span>Toothlight</span>
          </div>
        )}
        <div className={styles.sourceGlow} aria-hidden="true" />
        {visualState === 'note_started' && <div className={styles.noteThread} aria-hidden="true" />}
        {visualState === 'sealed' && <div className={styles.sealMark} aria-hidden="true" />}
      </div>

      <div className={styles.body}>
        <div className={styles.kicker}>
          <span>{stateLabels[visualState]}</span>
          {smileFundActive && <span>Fund linked</span>}
        </div>
        <h3>{title}</h3>
        {caption && <p>{caption}</p>}
        {createdLabel && <time>{createdLabel}</time>}
      </div>

      {isConstellated && (
        <div className={styles.familyNodes} aria-hidden="true">
          {(familyNodes.length > 0 ? familyNodes : [{ id: 'constellation', kind: 'family_note' as const }]).map(
            (node, index) => (
              <span
                key={node.id}
                className={styles.familyNode}
                data-kind={node.kind}
                style={{ ['--node-index' as string]: index }}
              />
            ),
          )}
        </div>
      )}
    </article>
  )
}
