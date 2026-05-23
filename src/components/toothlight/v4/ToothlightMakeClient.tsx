'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

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
import { logToothlightClientEvent } from '@/lib/toothlight/client/product-events'
import {
  LIGHT_STYLE_VERSION,
  getLightStyle,
  getRecommendedLightStyle,
} from '@/lib/toothlight/visual-treatments'
import { getToothlightVisualState } from '@/lib/toothlight/toothlight-states'
import { LightStyleCarousel } from './LightStyleCarousel'
import { SaveFlightSequence } from './SaveFlightSequence'
import { ToothlightPreview } from './ToothlightPreview'
import styles from './ToothlightMakeClient.module.css'

type CreationStep = 'source' | 'style' | 'story'

type ToothlightDraft = {
  childName: string
  toothName: string
  caption: string
  sourceImageSrc: string | null
  renderedImageSrc: string | null
  treatmentId: string
  treatmentVersion: string
}

type StoredToothlightDraft = Partial<ToothlightDraft> & {
  imageSrc?: string | null
  glowId?: string
}

const defaultDraft: ToothlightDraft = {
  childName: '',
  toothName: '',
  caption: '',
  sourceImageSrc: null,
  renderedImageSrc: null,
  treatmentId: getRecommendedLightStyle().id,
  treatmentVersion: LIGHT_STYLE_VERSION,
}

export function ToothlightMakeClient() {
  const router = useRouter()
  const previewRef = useRef<HTMLElement>(null)
  const storyLoggedRef = useRef(false)
  const [draft, setDraft] = useState<ToothlightDraft>(defaultDraft)
  const [activeStep, setActiveStep] = useState<CreationStep>('source')
  const [showDrawing, setShowDrawing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [resumedSave, setResumedSave] = useState(false)

  useEffect(() => {
    logToothlightClientEvent('make_viewed', { version: 'creation-ux-v1' })
    try {
      const stored = window.localStorage.getItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
      if (stored) {
        setDraft(normalizeStoredDraft(JSON.parse(stored)))
      }
    } catch {
      window.localStorage.removeItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
    } finally {
      setDraftRestored(true)
    }
  }, [])

  useEffect(() => {
    logToothlightClientEvent('make_step_viewed', { step: activeStep })
  }, [activeStep])

  useEffect(() => {
    window.localStorage.setItem(TOOTHLIGHT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (!draftRestored || resumedSave) return
    if (!shouldResumeToothlightSave(window.location.search)) return
    if (!hasToothlightSavePending()) return

    setResumedSave(true)
    clearToothlightSavePending()
    logToothlightClientEvent('auth_returned')
    setSaveMessage('Parent account connected. Saving this Toothlight now.')
    void handleSave()
  }, [draftRestored, resumedSave])

  useEffect(() => {
    const hasStory = draft.childName.trim() && draft.toothName.trim() && draft.caption.trim()
    if (!hasStory || storyLoggedRef.current) return
    storyLoggedRef.current = true
    logToothlightClientEvent('story_completed')
  }, [draft.childName, draft.toothName, draft.caption])

  const title = useMemo(() => {
    const child = draft.childName.trim() || 'Your child'
    const tooth = draft.toothName.trim() || 'Toothlight'
    return `${child}'s ${tooth}`
  }, [draft.childName, draft.toothName])

  const caption = draft.caption.trim() || 'Add one line from the day.'
  const selectedTreatment = getLightStyle(draft.treatmentId)
  const visualState = getToothlightVisualState({
    hasSourcePhoto: Boolean(draft.sourceImageSrc),
    hasGlow: Boolean(draft.treatmentId),
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
      const sourceImageSrc = typeof reader.result === 'string' ? reader.result : null
      updateDraft({ sourceImageSrc, renderedImageSrc: null })
      setActiveStep('style')
      logToothlightClientEvent('source_added', { source: 'upload' })
    }
    reader.readAsDataURL(file)
  }

  function selectTreatment(treatmentId: string) {
    updateDraft({ treatmentId, renderedImageSrc: null })
    setActiveStep(draft.sourceImageSrc ? 'story' : 'source')
    logToothlightClientEvent('treatment_selected', { treatmentId })
  }

  async function handleSave() {
    logToothlightClientEvent('save_clicked', {
      treatmentId: draft.treatmentId,
      hasSource: Boolean(draft.sourceImageSrc),
    })

    const renderedImageSrc = await captureToothlightPreviewImage({
      sourceImageSrc: draft.sourceImageSrc,
      treatmentId: draft.treatmentId,
      title,
      caption,
    })
    const saveDraft = {
      ...draft,
      renderedImageSrc: renderedImageSrc ?? draft.sourceImageSrc,
    }

    window.localStorage.setItem(TOOTHLIGHT_DRAFT_STORAGE_KEY, JSON.stringify(saveDraft))
    setDraft(saveDraft)
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/toothlight/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: saveDraft.childName,
          toothName: saveDraft.toothName,
          caption: saveDraft.caption,
          imageSrc: saveDraft.renderedImageSrc ?? saveDraft.sourceImageSrc,
          sourceImageSrc: saveDraft.sourceImageSrc,
          renderedImageSrc: saveDraft.renderedImageSrc,
          glowId: saveDraft.treatmentId,
          treatmentId: saveDraft.treatmentId,
          treatmentVersion: saveDraft.treatmentVersion,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        if (isParentAuthRequired(response.status)) {
          logToothlightClientEvent('auth_started', { reason: 'save' })
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
        childName: saveDraft.childName.trim() || 'Your child',
        toothName: saveDraft.toothName.trim() || 'Toothlight',
        caption: saveDraft.caption.trim() || 'A small tooth became a bright memory.',
        imageSrc: saveDraft.renderedImageSrc ?? saveDraft.sourceImageSrc,
        sourceImageSrc: saveDraft.sourceImageSrc,
        renderedImageSrc: saveDraft.renderedImageSrc ?? saveDraft.sourceImageSrc,
        glowId: saveDraft.treatmentId,
        treatmentId: saveDraft.treatmentId,
        treatmentVersion: saveDraft.treatmentVersion,
        shareUrl: result.shareUrl ?? `/toothlight/t/${result.toothlightId}`,
        savedAt: new Date().toISOString(),
      })
      logToothlightClientEvent('save_succeeded', {
        toothlightId: result.toothlightId,
        treatmentId: saveDraft.treatmentId,
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
      <header className={styles.topbar}>
        <Link href="/toothlight" className={styles.backLink}>
          Toothlight
        </Link>
        <span>{selectedTreatment.label}</span>
      </header>

      <main className={styles.creator} aria-label="Make a Toothlight">
        <section className={styles.sourceFirst} aria-label="Add photo or drawing">
          <p className={styles.eyebrow}>Make the memory</p>
          <h1>Add photo or drawing.</h1>
          <p>Start with the real lost-tooth moment. The Light Style comes next.</p>
          <label className={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => handleImageFile(event.target.files?.[0] ?? null)}
            />
            <strong>{draft.sourceImageSrc ? 'Change photo' : 'Choose photo'}</strong>
            <span>Camera roll or camera</span>
          </label>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setShowDrawing((value) => !value)
              logToothlightClientEvent('drawing_opened')
            }}
          >
            {showDrawing ? 'Hide drawing tools' : 'Draw instead'}
          </button>
          {showDrawing && (
            <div className={styles.drawingWrap}>
              <DrawingCanvasV2
                initialBackground={draft.sourceImageSrc}
                onDone={(dataUrl) => {
                  updateDraft({ sourceImageSrc: dataUrl, renderedImageSrc: null })
                  setShowDrawing(false)
                  setActiveStep('style')
                  logToothlightClientEvent('source_added', { source: 'drawing' })
                }}
              />
            </div>
          )}
        </section>

        <section className={styles.previewStage} aria-label="Toothlight preview">
          <ToothlightPreview
            sourceImageSrc={draft.sourceImageSrc}
            treatmentId={draft.treatmentId}
            title={title}
            caption={caption}
            renderTargetRef={previewRef}
          />
          <div className={styles.stepRail} aria-label="Creation progress">
            <button type="button" className={activeStep === 'source' ? styles.activeStep : ''} onClick={() => setActiveStep('source')}>
              Photo
            </button>
            <button type="button" className={activeStep === 'style' ? styles.activeStep : ''} onClick={() => setActiveStep('style')}>
              Style
            </button>
            <button type="button" className={activeStep === 'story' ? styles.activeStep : ''} onClick={() => setActiveStep('story')}>
              Story
            </button>
          </div>
        </section>

        <section className={styles.panel} aria-label="Choose a Light Style">
          <div className={styles.panelHeader}>
            <span>2</span>
            <h2>Choose a Light Style</h2>
          </div>
          <LightStyleCarousel selectedId={draft.treatmentId} onSelect={selectTreatment} />
        </section>

        <section className={styles.panel} aria-label="Add the story">
          <div className={styles.panelHeader}>
            <span>3</span>
            <h2>Add the story</h2>
          </div>
          <label className={styles.field}>
            <span>Child name</span>
            <input
              value={draft.childName}
              onChange={(event) => updateDraft({ childName: event.target.value })}
              onFocus={() => setActiveStep('story')}
              placeholder="Kai"
            />
          </label>
          <label className={styles.field}>
            <span>Toothlight name</span>
            <input
              value={draft.toothName}
              onChange={(event) => updateDraft({ toothName: event.target.value })}
              onFocus={() => setActiveStep('story')}
              placeholder="First Tooth"
            />
          </label>
          <label className={styles.field}>
            <span>What happened?</span>
            <textarea
              value={draft.caption}
              onChange={(event) => updateDraft({ caption: event.target.value })}
              onFocus={() => setActiveStep('story')}
              placeholder="Lost after breakfast and showed everyone."
              rows={3}
            />
          </label>
        </section>

        <section className={styles.savePanel} aria-label="Save this Toothlight">
          <SaveFlightSequence
            mode="child"
            intensity="wonder"
            isActive={saved}
            saveSucceeded={saved}
            onComplete={() => router.push(shareUrl ?? '/toothlight/t/demo-toothlight')}
          />
          <div>
            <p className={styles.saveKicker}>{visualState === 'spark' ? 'Preview ready' : 'Draft preview'}</p>
            <h2>Save this Toothlight.</h2>
            <p>After saving, the parent can add the private note for later.</p>
          </div>
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
        </section>
      </main>
    </div>
  )
}

function normalizeStoredDraft(stored: StoredToothlightDraft): ToothlightDraft {
  const sourceImageSrc = stored.sourceImageSrc ?? stored.imageSrc ?? null
  const treatmentId = stored.treatmentId ?? stored.glowId ?? defaultDraft.treatmentId

  return {
    ...defaultDraft,
    ...stored,
    sourceImageSrc,
    renderedImageSrc: stored.renderedImageSrc ?? null,
    treatmentId: getLightStyle(treatmentId).id,
    treatmentVersion: stored.treatmentVersion ?? LIGHT_STYLE_VERSION,
  }
}

async function captureToothlightPreviewImage({
  sourceImageSrc,
  treatmentId,
  title,
  caption,
}: {
  sourceImageSrc: string | null
  treatmentId: string
  title: string
  caption: string
}) {
  if (typeof document === 'undefined') return null

  const treatment = getLightStyle(treatmentId)
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const context = canvas.getContext('2d')
  if (!context) return sourceImageSrc

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#fffdf4')
  gradient.addColorStop(0.52, treatment.accent)
  gradient.addColorStop(1, treatment.secondaryAccent)
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (sourceImageSrc) {
    try {
      const image = await loadCanvasImage(sourceImageSrc)
      drawCoverImage(context, image, 0, 0, canvas.width, 1000)
    } catch {
      drawPlaceholder(context, treatment.accent)
    }
  } else {
    drawPlaceholder(context, treatment.accent)
  }

  context.globalAlpha = 0.34
  context.fillStyle = treatment.accent
  context.beginPath()
  context.arc(330, 220, 210, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = treatment.secondaryAccent
  context.beginPath()
  context.arc(850, 760, 260, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 1

  context.fillStyle = 'rgba(255,255,255,0.92)'
  context.fillRect(0, 1000, canvas.width, 350)
  context.fillStyle = '#17262a'
  context.font = '700 42px serif'
  context.fillText(treatment.label.toUpperCase(), 72, 1090)
  context.font = '700 62px serif'
  context.fillText(title.slice(0, 32), 72, 1170)
  context.fillStyle = '#4c6064'
  context.font = '400 38px sans-serif'
  context.fillText(caption.slice(0, 54), 72, 1240)

  return canvas.toDataURL('image/png')
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  context.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  )
}

function drawPlaceholder(context: CanvasRenderingContext2D, accent: string) {
  context.fillStyle = 'rgba(255, 255, 255, 0.8)'
  context.beginPath()
  context.arc(540, 460, 210, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = accent
  context.beginPath()
  context.arc(540, 460, 118, 0, Math.PI * 2)
  context.fill()
}
