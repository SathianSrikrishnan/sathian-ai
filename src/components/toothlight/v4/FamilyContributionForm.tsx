'use client'

import { useState } from 'react'

import { saveLocalFamilyContribution } from '@/lib/toothlight/client/toothlight-local-state'
import { FamilyNodeOrbit } from './FamilyNodeOrbit'
import styles from './FamilyContributionForm.module.css'

type FamilyContributionFormProps = {
  toothlightId: string
}

export function FamilyContributionForm({ toothlightId }: FamilyContributionFormProps) {
  const [contributorName, setContributorName] = useState('')
  const [noteText, setNoteText] = useState('')
  const [giftAmount, setGiftAmount] = useState('25')
  const [includeGift, setIncludeGift] = useState(true)
  const [nodeKind, setNodeKind] = useState<'family_note' | 'family_gift' | 'family_note_gift'>('family_note_gift')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function submitContribution(noteOnly = false) {
    setSaving(true)
    setMessage('')
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
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Contribution is not ready yet.')
      setNodeKind(result.nodeKind)
      saveLocalFamilyContribution({
        id: result.contributionId,
        toothlightId,
        contributorName: result.contributorName,
        nodeKind: result.nodeKind,
        noteOnly: result.noteOnly,
        createdAt: new Date().toISOString(),
      })
      setMessage(result.noteOnly ? 'Note added for later.' : 'Gift and note added for later.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Contribution is not ready yet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.panel} aria-label="Add a gift and a note for later">
      <div className={styles.visual}>
        <FamilyNodeOrbit nodes={[{ id: 'current', kind: nodeKind }]} />
      </div>
      <div className={styles.form}>
        <p className={styles.eyebrow}>Family note</p>
        <h1>Add a gift and a note for later.</h1>
        <p>
          Leave a short message the child can receive with this Toothlight when
          the future moment opens.
        </p>

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
          <span>Add a small gift</span>
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
          <button type="button" onClick={() => submitContribution(false)} disabled={saving}>
            Add a gift and a note for later
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            data-path="note-only"
            onClick={() => submitContribution(true)}
            disabled={saving}
          >
            Add note only
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </section>
  )
}
