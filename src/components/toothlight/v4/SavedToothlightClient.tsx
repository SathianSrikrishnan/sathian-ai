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
  glowId: 'starlace',
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
          imageSrc: persisted.imageSrc,
          glowId: persisted.glowId,
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
    hasGlow: Boolean(current.glowId),
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

  return (
    <div className={styles.shell}>
      <section className={styles.copy} aria-label="Saved Toothlight status">
        <Link href="/toothlight" className={styles.backLink}>
          Toothlight
        </Link>
        <p className={styles.eyebrow}>Saved Toothlight</p>
        <h1>{statusLabel === 'No note yet' ? 'Saved for later.' : `${statusLabel}.`}</h1>
        <p>
          The child can revisit the Toothlight now without seeing the private
          note. Parents control the note for later, Smile Fund, and family
          invite.
        </p>

        <div className={styles.statusGrid}>
          <div className={styles.status}>
            <strong>{statusLabel}</strong>
            <span>Status can show without content.</span>
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

        <div className={styles.actions}>
          <Link href={`/toothlight/t/${toothlightId}/note`} className={`${styles.actionLink} ${styles.primary}`}>
            Write a note for later
          </Link>
          <Link href={`/toothlight/t/${toothlightId}/family`} className={`${styles.actionLink} ${styles.secondary}`}>
            Invite family
          </Link>
        </div>
      </section>

      <div className={styles.cardColumn}>
        <ToothlightCard
          imageSrc={current.imageSrc}
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
