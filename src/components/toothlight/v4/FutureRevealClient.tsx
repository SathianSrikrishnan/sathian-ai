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
import styles from './FutureRevealClient.module.css'

type FutureRevealClientProps = {
  toothlightId: string
  preview?: boolean
}

const demoToothlightImageSrc =
  '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg'

const fallbackToothlight: LocalToothlight = {
  toothlightId: 'demo-toothlight',
  childName: 'Kai',
  toothName: 'First Tooth',
  caption: 'Lost after breakfast and showed everyone.',
  imageSrc: demoToothlightImageSrc,
  sourceImageSrc: demoToothlightImageSrc,
  renderedImageSrc: demoToothlightImageSrc,
  glowId: 'moon-window',
  treatmentId: 'moon-window',
  treatmentVersion: 'deterministic-css-v2',
  shareUrl: '/toothlight/t/demo-toothlight',
  savedAt: new Date(0).toISOString(),
}

export function FutureRevealClient({ toothlightId, preview = false }: FutureRevealClientProps) {
  const [toothlight, setToothlight] = useState<LocalToothlight | null>(null)
  const [futureNote, setFutureNote] = useState<LocalFutureNote | null>(null)
  const [familyNodes, setFamilyNodes] = useState<LocalFamilyContribution[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const localToothlight = readLocalToothlight(toothlightId)
    setToothlight(localToothlight)
    setFutureNote(readLocalFutureNote(toothlightId))
    setFamilyNodes(readLocalFamilyContributions(toothlightId))

    let cancelled = false
    async function fetchPersistedToothlight() {
      try {
        const response = await fetch(`/api/toothlight/${toothlightId}`)
        if (!response.ok) return
        const result = await response.json()
        if (!cancelled && result.toothlight) {
          setToothlight((current) => current ?? normalizePersistedToothlight(result.toothlight))
          setFutureNote((current) => current ?? normalizePersistedFutureNote(result.toothlight))
          setFamilyNodes((current) =>
            current.length > 0 ? current : normalizePersistedFamilyNodes(result.toothlight.familyNodes),
          )
        }
      } catch {
        // Local browser state is enough for the parent audit preview.
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    fetchPersistedToothlight()
    return () => {
      cancelled = true
    }
  }, [toothlightId])

  const current =
    toothlight ??
    (toothlightId === 'demo-toothlight'
      ? fallbackToothlight
      : { ...fallbackToothlight, toothlightId, childName: 'Your child', toothName: 'Toothlight' })
  const noteStatus =
    futureNote?.status && futureNote.status !== 'none'
      ? futureNote.status
      : toothlightId === 'demo-toothlight'
        ? 'sealed'
        : 'none'
  const unlockAge = futureNote?.unlockAge ?? 10
  const isOpen = preview
  const parentNoteText = readParentNoteText(toothlightId, futureNote, isOpen)
  const familyNotes = readFamilyNotes(toothlightId, familyNodes, isOpen)
  const hasFamilyGift = familyNodes.some((node) => node.nodeKind === 'family_gift' || node.nodeKind === 'family_note_gift')
  const state = getToothlightVisualState({
    hasSourcePhoto: Boolean(current.imageSrc),
    hasGlow: Boolean(current.treatmentId ?? current.glowId),
    futureNoteStatus: noteStatus,
    hasFullFutureNote: noteStatus === 'sealed',
    smileFundStatus: hasFamilyGift ? 'active' : 'none',
    familyNodes: familyNodes.map((node) => node.nodeKind),
  })
  const title = useMemo(
    () => `${current.childName || 'Your child'}'s ${current.toothName || 'Toothlight'}`,
    [current.childName, current.toothName],
  )

  return (
    <div className={styles.shell}>
      <section className={styles.copy} aria-label="Future reveal preview">
        <Link href={`/toothlight/t/${toothlightId}`} className={styles.backLink}>
          Saved Toothlight
        </Link>
        <p className={styles.eyebrow}>{preview ? 'Preview reveal' : 'Future reveal'}</p>
        <h1>Open the Toothlight.</h1>
        <p>
          {preview
            ? 'Parent preview. This is what opens later.'
            : `Closed until age ${unlockAge}.`}
        </p>

        <div className={styles.revealStack} aria-label="Future Toothlight contents">
          <section className={styles.revealItem} data-state="open">
            <span>1</span>
            <div>
              <strong>The memory</strong>
              <p>{current.caption || 'A small tooth became a bright memory.'}</p>
            </div>
          </section>

          <section className={styles.revealItem} data-state={parentNoteText ? 'open' : 'locked'}>
            <span>2</span>
            <div>
              <strong>Parent note</strong>
              {parentNoteText ? (
                <blockquote>{parentNoteText}</blockquote>
              ) : (
                <p>{noteStatus === 'sealed' ? `Sealed. Opens at age ${unlockAge}.` : 'No parent note yet.'}</p>
              )}
            </div>
          </section>

          <section className={styles.revealItem} data-state={familyNotes.length ? 'open' : 'locked'}>
            <span>3</span>
            <div>
              <strong>Family notes</strong>
              {familyNotes.length ? (
                <div className={styles.familyNotes}>
                  {familyNotes.map((node) => (
                    <article key={node.id}>
                      <b>{node.contributorName}</b>
                      <p>{node.notePreviewText}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>{familyNodes.length ? `${familyNodes.length} family note${familyNodes.length === 1 ? '' : 's'} saved for later.` : 'Family can add notes later.'}</p>
              )}
            </div>
          </section>
        </div>

        <div className={styles.actions}>
          <Link href={`/toothlight/t/${toothlightId}/note?handoff=1`}>Parent note</Link>
          <Link href={`/toothlight/t/${toothlightId}/family`}>Invite family</Link>
          {!preview && <Link href={`/toothlight/t/${toothlightId}/reveal?preview=1`}>Preview opening</Link>}
        </div>
      </section>

      <div className={styles.cardColumn} data-loaded={loaded}>
        <ToothlightCard
          imageSrc={current.renderedImageSrc ?? current.imageSrc}
          title={title}
          caption={current.caption}
          createdLabel={isOpen ? 'Opened preview' : `Opens at age ${unlockAge}`}
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

function normalizePersistedToothlight(persisted: any): LocalToothlight {
  return {
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
  }
}

function normalizePersistedFutureNote(persisted: any): LocalFutureNote {
  return {
    toothlightId: persisted.toothlightId,
    status: persisted.futureNoteStatus,
    unlockAge: Number(persisted.unlockAge ?? 10),
    updatedAt: persisted.savedAt,
  }
}

function normalizePersistedFamilyNodes(nodes: unknown): LocalFamilyContribution[] {
  if (!Array.isArray(nodes)) return []
  return nodes.map((node: any) => ({
    id: node.id,
    toothlightId: node.toothlightId ?? '',
    contributorName: node.contributorName ?? 'Family',
    nodeKind: node.nodeKind ?? 'family_note',
    noteOnly: node.noteOnly ?? true,
    createdAt: node.createdAt ?? new Date().toISOString(),
  }))
}

function readParentNoteText(toothlightId: string, note: LocalFutureNote | null, isOpen: boolean) {
  if (!isOpen) return ''
  if (note?.sealedPreviewText) return note.sealedPreviewText
  if (toothlightId === 'demo-toothlight') {
    return 'You were so proud of this tiny tooth. I hope opening this reminds you how loved you have always been.'
  }
  return ''
}

function readFamilyNotes(
  toothlightId: string,
  familyNodes: LocalFamilyContribution[],
  isOpen: boolean,
) {
  if (!isOpen) return []
  const notes = familyNodes.filter((node) => node.notePreviewText?.trim())
  if (notes.length > 0) return notes
  if (toothlightId === 'demo-toothlight') {
    return [
      {
        id: 'demo-family-note',
        toothlightId,
        contributorName: 'Nana',
        nodeKind: 'family_note' as const,
        noteOnly: true,
        createdAt: new Date(0).toISOString(),
        notePreviewText: 'I saved a little sparkle here for the day you open it.',
      },
    ]
  }
  return []
}
