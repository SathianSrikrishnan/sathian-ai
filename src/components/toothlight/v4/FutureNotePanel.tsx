'use client'

import { useState } from 'react'

import { saveLocalFutureNote } from '@/lib/toothlight/client/toothlight-local-state'
import styles from './FutureNotePanel.module.css'

type FutureNotePanelProps = {
  toothlightId: string
  initialStatus?: 'none' | 'seed' | 'started' | 'sealed'
}

export function FutureNotePanel({ toothlightId, initialStatus = 'none' }: FutureNotePanelProps) {
  const [seedNote, setSeedNote] = useState('')
  const [sealedText, setSealedText] = useState('')
  const [unlockAge, setUnlockAge] = useState(10)
  const [status, setStatus] = useState(initialStatus)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function saveNote() {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/toothlight/${toothlightId}/future-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedNote, sealedText, unlockAge }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Note save is not ready yet.')
      setStatus(result.status === 'sealed' ? 'sealed' : 'seed')
      saveLocalFutureNote({
        toothlightId,
        status: result.status === 'sealed' ? 'sealed' : 'seed',
        unlockAge: result.unlockAge ?? unlockAge,
        updatedAt: new Date().toISOString(),
      })
      setMessage(result.status === 'sealed' ? 'Sealed for later' : 'Note Started')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Note save is not ready yet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.panel} aria-label="Write a note for later">
      <div className={styles.statusRail} aria-label="Future note status">
        <span className={status === 'none' ? styles.active : ''}>No note</span>
        <span className={status === 'seed' || status === 'started' ? styles.active : ''}>Note Started</span>
        <span className={status === 'sealed' ? styles.active : ''}>Sealed for later</span>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>Write a note for later</p>
        <h1>Save a few words for the future.</h1>
        <p>
          The child can revisit the Toothlight now. This private note stays for
          the unlock moment.
        </p>
      </div>

      <label className={styles.field}>
        <span>Small note starter</span>
        <input
          value={seedNote}
          onChange={(event) => setSeedNote(event.target.value)}
          placeholder="I want you to remember how proud I was today."
        />
      </label>

      <label className={styles.field}>
        <span>Private note for later</span>
        <textarea
          value={sealedText}
          onChange={(event) => setSealedText(event.target.value)}
          placeholder="Write what you want them to receive later."
          rows={7}
        />
      </label>

      <label className={styles.field}>
        <span>Unlock age</span>
        <select value={unlockAge} onChange={(event) => setUnlockAge(Number(event.target.value))}>
          <option value={10}>Age 10 recommended</option>
          <option value={12}>Age 12</option>
          <option value={18}>Age 18</option>
        </select>
      </label>

      <button type="button" onClick={saveNote} disabled={saving} className={styles.primaryButton}>
        {saving ? 'Saving note' : 'Seal the note'}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  )
}
