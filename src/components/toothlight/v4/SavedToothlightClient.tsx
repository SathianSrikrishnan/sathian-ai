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
  imageSrc: null,
  sourceImageSrc: null,
  renderedImageSrc: null,
  glowId: 'golden-locket',
  treatmentId: 'golden-locket',
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
  const state = getToothlightVisualState({
    hasSourcePhoto: Boolean(current.imageSrc),
    hasGlow: Boolean(current.treatmentId ?? current.glowId),
    futureNoteStatus: noteStatus,
    hasFullFutureNote: noteStatus === 'sealed',
    hasShortSeedNote: noteStatus === 'seed' || noteStatus === 'started',
    smileFundStatus: 'active',
    familyNodes: familyNodes.map((node) => node.nodeKind),
  })
  const title = useMemo(
    () => `${current.childName || 'Your child'}'s ${current.toothName || 'Toothlight'}`,
    [current.childName, current.toothName],
  )

  const statusLabel =
    noteStatus === 'sealed' ? 'Sealed for later' : noteStatus === 'seed' || noteStatus === 'started' ? 'Note Started' : 'No note yet'
  const noteCtaLabel = noteStatus === 'sealed' ? 'Review sealed status' : 'Seal the future note'
  const privateNoteStatus =
    noteStatus === 'sealed'
      ? 'Private note sealed'
      : noteStatus === 'seed' || noteStatus === 'started'
        ? 'Note started'
        : 'Ready to seal'
  const noteStatusDetail =
    noteStatus === 'sealed'
      ? 'The private note is sealed. The public page only shows status.'
      : 'Parent note is the next step. The child can see the Toothlight, not the note.'
  const familyStatus = familyNodes.length ? `${familyNodes.length} family note${familyNodes.length === 1 ? '' : 's'}` : 'Invite family'
  const capsuleChecklist = [
    {
      label: 'Memory saved',
      detail: current.caption || 'The child-facing Toothlight is ready.',
      state: 'done',
    },
    {
      label: 'Future note',
      detail: privateNoteStatus,
      state: noteStatus === 'sealed' ? 'done' : 'next',
    },
    {
      label: 'Family invite',
      detail: familyStatus,
      state: familyNodes.length ? 'done' : noteStatus === 'sealed' ? 'next' : 'idle',
    },
    {
      label: 'Smile Fund optional',
      detail: 'Connect later when ready.',
      state: 'idle',
    },
  ]
  const nextStepTitle = noteStatus === 'sealed' ? 'Next: invite family' : 'Next: seal the future note'
  const nextStepDetail =
    noteStatus === 'sealed'
      ? 'Family can add a note for later. A gift or Smile Fund contribution stays optional.'
      : 'Seal the parent note first, then invite family when the time capsule is ready.'

  return (
    <div className={styles.shell}>
      <section className={styles.copy} aria-label="Saved Toothlight status">
        <Link href="/toothlight" className={styles.backLink}>
          Toothlight
        </Link>
        <p className={styles.eyebrow}>Saved Toothlight</p>
        <h1>Toothlight time capsule.</h1>
        <p>
          The memory is saved. The private note, family invite, and optional
          Smile Fund can be added around it without changing the child-facing
          Toothlight.
        </p>

        <div className={styles.capsuleChecklist} aria-label="Toothlight time capsule checklist">
          {capsuleChecklist.map((item, index) => (
            <div key={item.label} className={styles.capsuleStep} data-state={item.state}>
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </div>
          ))}
        </div>

        <div className={styles.statusGrid}>
          <div className={styles.status}>
            <strong>{statusLabel}</strong>
            <span>{noteStatusDetail}</span>
          </div>
          <div className={styles.status}>
            <strong>Smile Fund</strong>
            <span>Optional savings layer is ready to connect.</span>
          </div>
          <div className={styles.status}>
            <strong>Family nodes</strong>
            <span>{familyNodes.length ? `${familyNodes.length} added` : 'Invite family when ready'}</span>
          </div>
        </div>

        <div className={styles.nextStepPanel} aria-label="Next step">
          <div>
            <strong>{nextStepTitle}</strong>
            <span>{nextStepDetail}</span>
          </div>
          <div className={styles.nextActions}>
            <Link
              href={noteStatus === 'sealed' ? `/toothlight/t/${toothlightId}/family` : `/toothlight/t/${toothlightId}/note?handoff=1`}
              className={`${styles.actionLink} ${styles.primary}`}
            >
              {noteStatus === 'sealed' ? 'Invite family' : 'Seal the future note'}
            </Link>
            <Link
              href={noteStatus === 'sealed' ? `/toothlight/t/${toothlightId}/note` : `/toothlight/t/${toothlightId}/family`}
              className={`${styles.actionLink} ${styles.secondary}`}
            >
              {noteStatus === 'sealed' ? noteCtaLabel : 'Invite family later'}
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
