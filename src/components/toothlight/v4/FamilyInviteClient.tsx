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
import { FamilyContributionForm } from './FamilyContributionForm'
import styles from './FamilyInviteClient.module.css'
import { ToothlightCard } from './ToothlightCard'

type FamilyInviteClientProps = {
  toothlightId: string
}

const fallbackToothlight: LocalToothlight = {
  toothlightId: 'local-preview',
  childName: 'Your child',
  toothName: 'Toothlight',
  caption: 'A saved memory for later.',
  imageSrc: null,
  sourceImageSrc: null,
  renderedImageSrc: null,
  glowId: 'golden-locket',
  treatmentId: 'golden-locket',
  treatmentVersion: 'deterministic-css-v2',
  shareUrl: '/toothlight/t/local-preview',
  savedAt: new Date(0).toISOString(),
}

export function FamilyInviteClient({ toothlightId }: FamilyInviteClientProps) {
  const [toothlight, setToothlight] = useState<LocalToothlight | null>(null)
  const [futureNote, setFutureNote] = useState<LocalFutureNote | null>(null)
  const [familyNodes, setFamilyNodes] = useState<LocalFamilyContribution[]>([])
  const [memoryLoaded, setMemoryLoaded] = useState(false)

  useEffect(() => {
    setMemoryLoaded(false)
    const localToothlight = readLocalToothlight(toothlightId)
    setToothlight(localToothlight)
    setFutureNote(readLocalFutureNote(toothlightId))
    setFamilyNodes(readLocalFamilyContributions(toothlightId))
    if (localToothlight) setMemoryLoaded(true)

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
        // Local preview storage is the source of truth while testing this loop.
      } finally {
        if (!cancelled) setMemoryLoaded(true)
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
  const showMemoryCard = memoryLoaded || Boolean(toothlight)
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

  function handleContributionSaved(contribution: LocalFamilyContribution) {
    setFamilyNodes((currentNodes) => [
      ...currentNodes.filter((node) => node.id !== contribution.id),
      contribution,
    ])
  }

  return (
    <div className={styles.shell}>
      <section className={styles.memory} aria-label="Family invite Toothlight">
        <Link href={`/toothlight/t/${toothlightId}`} className={styles.backLink}>
          Saved Toothlight
        </Link>
        <p className={styles.eyebrow}>Family invite</p>
        <h1>Invite family.</h1>
        <p>Note first. Gift optional.</p>
        {showMemoryCard ? (
          <ToothlightCard
            imageSrc={current.renderedImageSrc ?? current.imageSrc}
            title={title}
            caption={current.caption}
            createdLabel="Family invite"
            visualState={state.visualState}
            smileFundActive={state.smileFundActive}
            familyNodes={familyNodes.map((node) => ({
              id: node.id,
              kind: node.nodeKind,
              label: node.contributorName,
            }))}
          />
        ) : (
          <div className={styles.loadingCard} aria-label="Loading saved Toothlight">
            <span>Loading Toothlight</span>
          </div>
        )}
      </section>
      <FamilyContributionForm toothlightId={toothlightId} onContributionSaved={handleContributionSaved} />
    </div>
  )
}
