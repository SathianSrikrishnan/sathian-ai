'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  readLocalFamilyContributions,
  readLocalFutureNote,
  readLocalToothlight,
  type LocalFamilyContribution,
  type LocalFutureNote,
  type LocalToothlight,
} from '@/lib/toothlight/client/toothlight-local-state'
import { getToothlightVisualState } from '@/lib/toothlight/toothlight-states'
import { ToothlightCard } from './ToothlightCard'
import styles from './SavedToothlightClient.module.css'

type SavedToothlightClientProps = {
  toothlightId: string
}

const fallbackToothlight: LocalToothlight = {
  toothlightId: 'demo-toothlight',
  childName: 'Kai',
  toothName: 'Toothlight',
  caption: 'First tooth. Big smile.',
  imageSrc: '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg',
  sourceImageSrc: '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg',
  renderedImageSrc: '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg',
  glowId: 'moon-window',
  treatmentId: 'moon-window',
  treatmentVersion: 'deterministic-css-v2',
  shareUrl: '/toothlight/t/demo-toothlight',
  savedAt: new Date(0).toISOString(),
}

export function SavedToothlightClient({ toothlightId }: SavedToothlightClientProps) {
  const [toothlight, setToothlight] = useState<LocalToothlight | null>(null)
  const [futureNote, setFutureNote] = useState<LocalFutureNote | null>(null)
  const [familyNodes, setFamilyNodes] = useState<LocalFamilyContribution[]>([])

  useEffect(() => {
    setToothlight(readLocalToothlight(toothlightId))
    setFutureNote(readLocalFutureNote(toothlightId))
    setFamilyNodes(readLocalFamilyContributions(toothlightId))

    let cancelled = false
    async function fetchPersistedToothlight() {
      try {
        const response = await fetch(`/api/toothlight/${toothlightId}`)
        if (!response.ok) return
        const result = await response.json()
        if (!cancelled && result.toothlight) {
          applyPersistedToothlight(result.toothlight)
        }
      } catch {
        // Local demo continuity remains the fallback when the API is unavailable.
      }
    }

    function applyPersistedToothlight(persisted: any) {
      setToothlight((current) =>
        current ?? {
          toothlightId: persisted.toothlightId,
          childName: persisted.childName,
          toothName: persisted.toothName,
          caption: persisted.caption,
          imageSrc: persisted.renderedImageSrc ?? persisted.imageSrc,
          sourceImageSrc: persisted.sourceImageSrc ?? persisted.imageSrc,
          renderedImageSrc: persisted.renderedImageSrc ?? persisted.imageSrc,
          glowId: persisted.glowId,
          treatmentId: persisted.treatmentId ?? persisted.glowId,
          treatmentVersion: persisted.treatmentVersion,
          shareUrl: persisted.shareUrl,
          savedAt: persisted.savedAt,
        },
      )
      setFutureNote((current) =>
        current ?? {
          toothlightId: persisted.toothlightId,
          status: persisted.futureNoteStatus,
          unlockAge: persisted.unlockAge,
          updatedAt: persisted.savedAt,
        },
      )
      setFamilyNodes((current) => (current.length > 0 ? current : persisted.familyNodes ?? []))
    }

    fetchPersistedToothlight()
    return () => {
      cancelled = true
    }
  }, [toothlightId])

  const current = toothlight ?? { ...fallbackToothlight, toothlightId }
  const noteStatus = futureNote?.status ?? 'none'
  const hasFamilyGift = familyNodes.some((node) => node.nodeKind === 'family_gift' || node.nodeKind === 'family_note_gift')
  const state = getToothlightVisualState({
    hasSourcePhoto: Boolean(current.imageSrc),
    hasGlow: Boolean(current.treatmentId ?? current.glowId),
    futureNoteStatus: noteStatus,
    hasFullFutureNote: noteStatus === 'sealed',
    hasShortSeedNote: noteStatus === 'seed' || noteStatus === 'started',
    smileFundStatus: hasFamilyGift ? 'active' : 'none',
    familyNodes: familyNodes.map((node) => node.nodeKind),
  })
  const title = useMemo(
    () => `${current.childName || 'Your child'}'s ${current.toothName || 'Toothlight'}`,
    [current.childName, current.toothName],
  )

  const statusLabel =
    noteStatus === 'sealed' ? 'Sealed for later' : noteStatus === 'seed' || noteStatus === 'started' ? 'Note Started' : 'No note yet'
  const noteCtaLabel = noteStatus === 'sealed' ? 'Review note' : 'Seal note'
  const privateNoteStatus =
    noteStatus === 'sealed'
      ? 'Private note sealed'
      : noteStatus === 'seed' || noteStatus === 'started'
        ? 'Note started'
        : 'Ready to seal'
  const familyStatus = familyNodes.length ? `${familyNodes.length} added` : 'Invite family'
  const capsuleChecklist = [
    {
      label: 'Memory',
      detail: current.caption || 'The child-facing Toothlight is ready.',
      state: 'done',
    },
    {
      label: 'Parent note',
      detail: privateNoteStatus,
      state: noteStatus === 'sealed' ? 'done' : 'next',
    },
    {
      label: 'Family note + gift',
      detail: familyStatus,
      state: familyNodes.length ? 'done' : noteStatus === 'sealed' ? 'next' : 'idle',
    },
  ]
  const nextStepLabel = noteStatus === 'sealed' ? 'Invite family' : 'Seal note'
  const nextStepHelper = noteStatus === 'sealed' ? 'Note first. Gift optional.' : 'Private parent note.'

  return (
    <div className={styles.shell}>
      <section className={styles.copy} aria-label="Saved Toothlight status">
        <Link href="/toothlight" className={styles.backLink}>
          Toothlight
        </Link>
        <p className={styles.eyebrow}>Saved Toothlight</p>
        <h1>Toothlight time capsule.</h1>
        <p>{noteStatus === 'sealed' ? 'Saved. Invite family when ready.' : 'Saved. Seal the note next.'}</p>

        <div className={styles.capsuleChecklist} aria-label="Toothlight time capsule checklist">
          {capsuleChecklist.map((item, index) => (
            <div key={item.label} className={styles.capsuleStep} data-state={item.state}>
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </div>
          ))}
        </div>

        <div className={styles.nextStepPanel} aria-label="Next action">
          <div>
            <strong>Next</strong>
            <span>{nextStepLabel}</span>
            <small>{nextStepHelper}</small>
          </div>
          <div className={styles.nextActions}>
            <Link
              href={noteStatus === 'sealed' ? `/toothlight/t/${toothlightId}/family` : `/toothlight/t/${toothlightId}/note?handoff=1`}
              className={`${styles.actionLink} ${styles.primary}`}
            >
              {noteStatus === 'sealed' ? 'Invite family' : 'Seal note'}
            </Link>
            <Link
              href={noteStatus === 'sealed' ? `/toothlight/t/${toothlightId}/note` : `/toothlight/t/${toothlightId}/family`}
              className={`${styles.actionLink} ${styles.secondary}`}
            >
              {noteStatus === 'sealed' ? noteCtaLabel : 'Family can wait'}
            </Link>
            <Link
              href={`/toothlight/t/${toothlightId}/reveal?preview=1`}
              className={`${styles.actionLink} ${styles.secondary}`}
            >
              Preview reveal
            </Link>
          </div>
        </div>

      </section>

      <div className={styles.cardColumn}>
        <ToothlightCard
          imageSrc={current.renderedImageSrc ?? current.imageSrc}
          title={title}
          caption={current.caption}
          createdLabel={statusLabel}
          visualState={state.visualState}
          smileFundActive={state.smileFundActive}
          familyNodes={familyNodes.map((node) => ({
            id: node.id,
            kind: node.nodeKind,
            label: node.contributorName,
          }))}
        />
      </div>
    </div>
  )
}
