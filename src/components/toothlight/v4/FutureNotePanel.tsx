'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  isLocalToothlightId,
  isLocalToothlightPreviewHost,
} from '@/lib/toothlight/client/toothlight-auth'
import { readLocalFutureNote, saveLocalFutureNote } from '@/lib/toothlight/client/toothlight-local-state'
import { logToothlightClientEvent } from '@/lib/toothlight/client/product-events'
import { VoiceAssistField } from './VoiceAssistField'
import styles from './FutureNotePanel.module.css'

type FutureNotePanelProps = {
  toothlightId: string
  initialStatus?: 'none' | 'seed' | 'started' | 'sealed'
  handoff?: boolean
}

type FutureNoteStatus = NonNullable<FutureNotePanelProps['initialStatus']>

type NoteSaveResponse = {
  error?: string
  status?: string
  unlockAge?: number
}

type ToothlightStatusResponse = {
  toothlight?: {
    futureNoteStatus?: unknown
    unlockAge?: unknown
  }
}

export function FutureNotePanel({ toothlightId, initialStatus = 'none', handoff = false }: FutureNotePanelProps) {
  const [sealedText, setSealedText] = useState('')
  const [unlockAge, setUnlockAge] = useState(10)
  const [status, setStatus] = useState(initialStatus)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const canSealNote = sealedText.trim().length > 0 && !saving
  const statusLabel =
    status === 'sealed' ? 'Sealed for later' : status === 'seed' || status === 'started' ? 'Note Started' : 'No note'

  useEffect(() => {
    setStatus(initialStatus)
    const localNote = readLocalFutureNote(toothlightId)
    if (localNote) {
      setStatus(localNote.status)
      setUnlockAge(localNote.unlockAge)
    }

    let cancelled = false
    async function hydratePersistedStatus() {
      try {
        const response = await fetch(`/api/toothlight/${toothlightId}`)
        if (!response.ok) return
        const result = await readToothlightStatusResponse(response)
        const futureNoteStatus = result.toothlight?.futureNoteStatus
        if (!cancelled && isFutureNoteStatus(futureNoteStatus)) {
          setStatus(futureNoteStatus)
          setUnlockAge(Number(result.toothlight?.unlockAge ?? 10))
        }
      } catch {
        // Local status is enough for the preview flow when the API is unavailable.
      }
    }

    hydratePersistedStatus()
    return () => {
      cancelled = true
    }
  }, [initialStatus, toothlightId])

  function completeLocalNoteSave(savedUnlockAge: number) {
    setStatus('sealed')
    saveLocalFutureNote({
      toothlightId,
      status: 'sealed',
      unlockAge: savedUnlockAge,
      updatedAt: new Date().toISOString(),
      sealedPreviewText: sealedText.trim(),
    })
    logToothlightClientEvent('note_completed', {
      toothlightId,
      status: 'sealed',
      unlockAge: savedUnlockAge,
      mode: 'local-preview',
    })
    setMessage('Sealed. The note stays private.')
  }

  async function saveNote() {
    if (!canSealNote) {
      setMessage('Add the private note before sealing it for later.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/toothlight/${toothlightId}/future-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sealedText, unlockAge }),
      })
      const result = await readJsonResponse(response)
      if (!response.ok) {
        if (response.status === 401 && isLocalToothlightPreviewHost() && isLocalToothlightId(toothlightId)) {
          completeLocalNoteSave(unlockAge)
          return
        }
        throw new Error(result.error || 'Note save is not ready yet.')
      }
      setStatus(result.status === 'sealed' ? 'sealed' : 'seed')
      saveLocalFutureNote({
        toothlightId,
        status: result.status === 'sealed' ? 'sealed' : 'seed',
        unlockAge: result.unlockAge ?? unlockAge,
        updatedAt: new Date().toISOString(),
        sealedPreviewText: sealedText.trim(),
      })
      logToothlightClientEvent('note_completed', {
        toothlightId,
        status: result.status,
        unlockAge: result.unlockAge ?? unlockAge,
      })
      setMessage(
        result.status === 'sealed'
          ? 'Sealed. The note stays private.'
          : 'Note Started',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Note save is not ready yet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.panel} aria-label="Write a note for later">
      <div className={styles.statusPill} aria-label="Future note status">{statusLabel}</div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>Parent note</p>
        <h1>Seal the note.</h1>
        <p>{handoff ? 'Tap mic, talk, then seal.' : 'The note stays closed.'}</p>
      </div>

      <VoiceAssistField
        label="Private note for later"
        value={sealedText}
        onChange={setSealedText}
        placeholder="Write what you want them to receive later."
        rows={6}
        voicePrompt="Tap mic. Talk. Seal."
      />

      <label className={styles.field}>
        <span>Unlock age</span>
        <select value={unlockAge} onChange={(event) => setUnlockAge(Number(event.target.value))}>
          <option value={10}>Age 10 recommended</option>
          <option value={12}>Age 12</option>
          <option value={18}>Age 18</option>
        </select>
      </label>

      <button type="button" onClick={saveNote} disabled={!canSealNote} className={styles.primaryButton}>
        {saving ? 'Saving note' : 'Seal the note'}
      </button>

      {message && <p className={styles.message}>{message}</p>}
      {status === 'sealed' && (
        <div className={styles.sealedMoment} aria-label="Sealed future note confirmation">
          <strong>Sealed for later</strong>
          <span>The private note stays closed.</span>
          <p>Next: invite family.</p>
          <div>
            <Link href={`/toothlight/t/${toothlightId}`}>View saved Toothlight</Link>
            <Link href={`/toothlight/t/${toothlightId}/reveal?preview=1`}>Preview reveal</Link>
            <Link href={`/toothlight/t/${toothlightId}/family`}>Invite family</Link>
          </div>
        </div>
      )}
    </section>
  )
}

async function readJsonResponse(response: Response): Promise<NoteSaveResponse> {
  const text = await response.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as NoteSaveResponse
  } catch {
    return {
      error: response.ok ? 'Unexpected note save response.' : 'Note save is not ready yet.',
    }
  }
}

async function readToothlightStatusResponse(response: Response): Promise<ToothlightStatusResponse> {
  const text = await response.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as ToothlightStatusResponse
  } catch {
    return {}
  }
}

function isFutureNoteStatus(value: unknown): value is FutureNoteStatus {
  return value === 'none' || value === 'seed' || value === 'started' || value === 'sealed'
}
