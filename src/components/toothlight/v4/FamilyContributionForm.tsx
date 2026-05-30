'use client'

import Link from 'next/link'
import { useState } from 'react'

import { saveLocalFamilyContribution } from '@/lib/toothlight/client/toothlight-local-state'
import { logToothlightClientEvent } from '@/lib/toothlight/client/product-events'
import { FamilyNodeOrbit } from './FamilyNodeOrbit'
import styles from './FamilyContributionForm.module.css'

type FamilyContributionFormProps = {
  toothlightId: string
}

type FamilyContributionResponse = {
  error?: string
  contributionId?: string
  contributorName?: string
  nodeKind?: 'family_note' | 'family_gift' | 'family_note_gift'
  noteOnly?: boolean
  giftAmountCents?: number
}

export function FamilyContributionForm({ toothlightId }: FamilyContributionFormProps) {
  const [contributorName, setContributorName] = useState('')
  const [noteText, setNoteText] = useState('')
  const [giftAmount, setGiftAmount] = useState('25')
  const [includeGift, setIncludeGift] = useState(false)
  const [nodeKind, setNodeKind] = useState<'family_note' | 'family_gift' | 'family_note_gift'>('family_note')
  const [message, setMessage] = useState('')
  const [contributionSaved, setContributionSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function submitContribution(noteOnly = false) {
    setSaving(true)
    setMessage('')
    setContributionSaved(false)
    try {
      const response = await fetch(`/api/toothlight/${toothlightId}/family-contribution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributorName,
          noteText,
          includeGift: noteOnly ? false : includeGift,
          giftAmountCents: noteOnly || !includeGift ? 0 : Number(giftAmount) * 100,
        }),
      })
      const result = await readJsonResponse(response)
      if (!response.ok) throw new Error(result.error || 'Contribution is not ready yet.')
      const savedNodeKind = result.nodeKind ?? 'family_note'
      const savedNoteOnly = result.noteOnly ?? true
      setNodeKind(savedNodeKind)
      saveLocalFamilyContribution({
        id: result.contributionId ?? `local-${Date.now()}`,
        toothlightId,
        contributorName: result.contributorName ?? contributorName,
        nodeKind: savedNodeKind,
        noteOnly: savedNoteOnly,
        createdAt: new Date().toISOString(),
      })
      logToothlightClientEvent('family_contribution_completed', {
        toothlightId,
        nodeKind: savedNodeKind,
        noteOnly: savedNoteOnly,
        giftAmountCents: result.giftAmountCents ?? 0,
      })
      setContributionSaved(true)
      setMessage(savedNoteOnly ? 'Note added for later.' : 'Gift and note added for later.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Contribution is not ready yet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.panel} aria-label="Add a note for later">
      <div className={styles.visual}>
        <FamilyNodeOrbit nodes={[{ id: 'current', kind: nodeKind }]} />
      </div>
      <div className={styles.form}>
        <p className={styles.eyebrow}>Family invite</p>
        <h1>Family note for later.</h1>
        <p>Add one note. Gift optional.</p>
        <div className={styles.familyNoteDefault}>Note first. Gift optional.</div>

        <label className={styles.field}>
          <span>Your name</span>
          <input value={contributorName} onChange={(event) => setContributorName(event.target.value)} placeholder="Nana" />
        </label>

        <label className={styles.field}>
          <span>Note for later</span>
          <textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="I hope this reminds you how loved you are."
            rows={4}
          />
        </label>

        <label className={styles.toggle}>
          <input type="checkbox" checked={includeGift} onChange={(event) => setIncludeGift(event.target.checked)} />
          <span>Add optional gift</span>
        </label>

        {includeGift && (
          <label className={styles.field}>
            <span>Gift amount</span>
            <input
              value={giftAmount}
              inputMode="decimal"
              onChange={(event) => setGiftAmount(event.target.value)}
            />
          </label>
        )}

        <div className={styles.actions}>
          <button type="button" onClick={() => submitContribution(!includeGift)} disabled={saving}>
            {includeGift ? 'Add gift and family note' : 'Add family note'}
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
        {contributionSaved && (
          <div className={styles.completionPanel} aria-label="Family contribution saved">
            <strong>Family note added.</strong>
            <Link href={`/toothlight/t/${toothlightId}`}>View saved Toothlight</Link>
          </div>
        )}
      </div>
    </section>
  )
}

async function readJsonResponse(response: Response): Promise<FamilyContributionResponse> {
  const text = await response.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as FamilyContributionResponse
  } catch {
    return {
      error: response.ok ? 'Unexpected contribution response.' : 'Contribution is not ready yet.',
    }
  }
}
