'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import DrawingCanvasV2 from '@/components/toothfairy/app/drawing-canvas-v2'
import {
  clearToothlightSavePending,
  hasToothlightSavePending,
  isParentAuthRequired,
  redirectToToothlightParentAuth,
  shouldResumeToothlightSave,
} from '@/lib/toothlight/client/toothlight-auth'
import {
  TOOTHLIGHT_DRAFT_STORAGE_KEY,
  saveLocalToothlight,
} from '@/lib/toothlight/client/toothlight-local-state'
import { getRecommendedGlow } from '@/lib/toothlight/glow-filters'
import { getToothlightVisualState } from '@/lib/toothlight/toothlight-states'
import { DraftGlowSequence } from './DraftGlowSequence'
import { GlowPicker } from './GlowPicker'
import { SaveFlightSequence } from './SaveFlightSequence'
import { ToothlightCard } from './ToothlightCard'
import styles from './ToothlightMakeClient.module.css'

type ToothlightDraft = {
  childName: string
  toothName: string
  caption: string
  imageSrc: string | null
  glowId: string
}

const defaultDraft: ToothlightDraft = {
  childName: '',
  toothName: '',
  caption: '',
  imageSrc: null,
  glowId: getRecommendedGlow().id,
}

export function ToothlightMakeClient() {
  const router = useRouter()
  const [draft, setDraft] = useState<ToothlightDraft>(defaultDraft)
  const [showDrawing, setShowDrawing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [resumedSave, setResumedSave] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
      if (stored) {
        setDraft({ ...defaultDraft, ...JSON.parse(stored) })
      }
    } catch {
      window.localStorage.removeItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
    } finally {
      setDraftRestored(true)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(TOOTHLIGHT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (!draftRestored || resumedSave) return
    if (!shouldResumeToothlightSave(window.location.search)) return
    if (!hasToothlightSavePending()) return

    setResumedSave(true)
    clearToothlightSavePending()
    setSaveMessage('Parent account connected. Saving this Toothlight now.')
    void handleSave()
  }, [draftRestored, resumedSave])

  const title = useMemo(() => {
    const child = draft.childName.trim() || 'Your child'
    const tooth = draft.toothName.trim() || 'Toothlight'
    return `${child}'s ${tooth}`
  }, [draft.childName, draft.toothName])

  const visualState = getToothlightVisualState({
    hasSourcePhoto: Boolean(draft.imageSrc),
    hasGlow: Boolean(draft.glowId),
  }).visualState

  function updateDraft(patch: Partial<ToothlightDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
    setSaved(false)
    setSaveMessage('')
    setShareUrl(null)
  }

  function handleImageFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateDraft({ imageSrc: typeof reader.result === 'string' ? reader.result : null })
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    window.localStorage.setItem(TOOTHLIGHT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/toothlight/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const result = await response.json()

      if (!response.ok) {
        if (isParentAuthRequired(response.status)) {
          setSaveMessage('Saving this Toothlight to your parent account.')
          redirectToToothlightParentAuth('/toothlight/make?save=1')
          return
        }
        throw new Error(result.error || 'Save is not ready yet.')
      }

      setSaved(true)
      setShareUrl(result.shareUrl ?? null)
      saveLocalToothlight({
        toothlightId: result.toothlightId,
        childName: draft.childName.trim() || 'Your child',
        toothName: draft.toothName.trim() || 'Toothlight',
        caption: draft.caption.trim() || 'A small tooth became a bright memory.',
        imageSrc: draft.imageSrc,
        glowId: draft.glowId,
        shareUrl: result.shareUrl ?? `/toothlight/t/${result.toothlightId}`,
        savedAt: new Date().toISOString(),
      })
      setSaveMessage('Saved. Now add the parent note for later.')
    } catch (error) {
      setSaved(false)
      setSaveMessage(error instanceof Error ? error.message : 'Save is not ready yet.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.shell}>
      <section className={styles.workbench} aria-label="Make a Toothlight">
        <div className={styles.copy}>
          <Link href="/toothlight" className={styles.backLink}>
            Toothlight
          </Link>
          <p className={styles.eyebrow}>Make the memory</p>
          <h1>Create the glow first.</h1>
          <p>
            Add the photo or drawing now. The parent save comes after the
            Toothlight feels right.
          </p>
        </div>

        <div className={styles.previewColumn}>
          <DraftGlowSequence isActive={!saved}>
            <ToothlightCard
              imageSrc={draft.imageSrc}
              title={title}
              caption={draft.caption || 'Add one line from the day.'}
              createdLabel={saved ? 'Saved draft' : 'Draft Glow'}
              visualState={visualState}
            />
          </DraftGlowSequence>
          <SaveFlightSequence
            mode="child"
            intensity="wonder"
            isActive={saved}
            saveSucceeded={saved}
            onComplete={() => router.push(shareUrl ?? '/toothlight/t/demo-toothlight')}
          />
        </div>
      </section>

      <section className={styles.controls} aria-label="Toothlight details">
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>1</span>
            <h2>Photo or drawing</h2>
          </div>
          <label className={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageFile(event.target.files?.[0] ?? null)}
            />
            <strong>Choose photo</strong>
            <span>Or draw below</span>
          </label>
          <button type="button" className={styles.secondaryButton} onClick={() => setShowDrawing((value) => !value)}>
            {showDrawing ? 'Hide drawing' : 'Open drawing tools'}
          </button>
          {showDrawing && (
            <div className={styles.drawingWrap}>
              <DrawingCanvasV2
                initialBackground={draft.imageSrc}
                onDone={(dataUrl) => {
                  updateDraft({ imageSrc: dataUrl })
                  setShowDrawing(false)
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>2</span>
            <h2>Choose the Glow</h2>
          </div>
          <GlowPicker selectedId={draft.glowId} onSelect={(glowId) => updateDraft({ glowId })} />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>3</span>
            <h2>Name and story</h2>
          </div>
          <label className={styles.field}>
            <span>Child name</span>
            <input
              value={draft.childName}
              onChange={(event) => updateDraft({ childName: event.target.value })}
              placeholder="Kai"
            />
          </label>
          <label className={styles.field}>
            <span>Tooth nickname</span>
            <input
              value={draft.toothName}
              onChange={(event) => updateDraft({ toothName: event.target.value })}
              placeholder="First Tooth"
            />
          </label>
          <label className={styles.field}>
            <span>One-line story</span>
            <textarea
              value={draft.caption}
              onChange={(event) => updateDraft({ caption: event.target.value })}
              placeholder="Lost after breakfast and showed everyone."
              rows={3}
            />
          </label>
          <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving Toothlight' : 'Save this Toothlight'}
          </button>
          <p className={styles.accountHint}>Google keeps it in your parent account.</p>
          {saveMessage && (
            <p className={styles.savedLine}>
              {saveMessage}
              {shareUrl && (
                <>
                  {' '}
                  <Link href={shareUrl}>Open saved Toothlight</Link>
                </>
              )}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
