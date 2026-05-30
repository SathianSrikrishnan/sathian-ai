'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { callEnhance } from '@/lib/toothfairy/enhance-client'
import {
  buildToothlightParentAuthUrl,
  clearToothlightSavePending,
  hasToothlightSavePending,
  isParentAuthRequired,
  redirectToToothlightParentAuth,
  shouldResumeToothlightSave,
} from '@/lib/toothlight/client/toothlight-auth'
import {
  TOOTHLIGHT_DRAFT_STORAGE_KEY,
  readToothlightDraftFromBrowser,
  saveLocalToothlight,
  saveToothlightDraftToBrowser,
} from '@/lib/toothlight/client/toothlight-local-state'
import { logToothlightClientEvent } from '@/lib/toothlight/client/product-events'
import {
  LIGHT_STYLE_VERSION,
  getLightStyle,
  getRecommendedLightStyle,
} from '@/lib/toothlight/visual-treatments'
import type { LayeredDrawingExport } from '@/components/toothfairy/app/drawing-canvas-v2'
import { getToothlightVisualState } from '@/lib/toothlight/toothlight-states'
import {
  buildToothlightProductPrompt,
  toothlightProductRenderContract,
  type ToothlightStoryFocus,
} from '@/lib/toothlight/product-render-mode'
import { LightStyleCarousel } from './LightStyleCarousel'
import { SaveFlightSequence } from './SaveFlightSequence'
import { ToothlightMemoryEditor } from './ToothlightMemoryEditor'
import { ToothlightPreview } from './ToothlightPreview'
import styles from './ToothlightMakeClient.module.css'

type ToothlightAiRenderOption = {
  id: string
  imageSrc: string
  treatmentId: string
  treatmentLabel: string
  createdAt: string
}

type StoryFocusId = ToothlightStoryFocus

type ToothlightDraft = {
  childName: string
  toothName: string
  caption: string
  sourceImageSrc: string | null
  photoImageSrc: string | null
  artworkImageSrc: string | null
  drawingLayerImageSrc: string | null
  renderedImageSrc: string | null
  aiRenderedImageSrc: string | null
  aiRenderOptions: ToothlightAiRenderOption[]
  treatmentId: string
  treatmentVersion: string
  storyFocus: StoryFocusId
}

type StoredToothlightDraft = Partial<ToothlightDraft> & {
  imageSrc?: string | null
  glowId?: string
}

type AiRenderReferences = {
  drawingDataUrl: string
  sourceImageDataUrl: string | null
  drawingLayerDataUrl: string | null
  compositionImageDataUrl: string
  finalDrawingLayerDataUrl: string | null
  layerMode: 'layered' | 'flattened'
}

const MAX_SOURCE_IMAGE_SIDE = 1400
const AI_REFERENCE_IMAGE_SIZE = 1024
const PREVIEW_IMAGE_WIDTH = 900
const PREVIEW_IMAGE_HEIGHT = 1125
const IMAGE_EXPORT_QUALITY = 0.82
const TOOTHLIGHT_PENDING_AI_RENDER_STORAGE_KEY = 'toothlight:v4:pending-ai-render'
const MAX_AI_RENDER_OPTIONS = 6
const STORY_FOCUS_OPTIONS: readonly {
  id: StoryFocusId
  label: string
  brief: string
}[] = [
  {
    id: 'memory',
    label: 'Memory',
    brief: 'kept close',
  },
  {
    id: 'marks',
    label: 'Drawing',
    brief: 'object lines',
  },
  {
    id: 'keeper',
    label: 'Story',
    brief: 'story path',
  },
]
const MAKE_FLOW_STEPS = [
  { id: 'memory', label: 'Memory', href: '#toothlight-memory-step' },
  { id: 'style', label: 'Style', href: '#toothlight-style-step' },
  { id: 'story', label: 'Story', href: '#toothlight-story-step' },
  { id: 'seal', label: 'Seal', href: '#toothlight-save-step' },
] as const

type MakeFlowStepId = (typeof MAKE_FLOW_STEPS)[number]['id']
type MakeFlowStepState = 'done' | 'active' | 'next' | 'idle'

const defaultDraft: ToothlightDraft = {
  childName: '',
  toothName: '',
  caption: '',
  sourceImageSrc: null,
  photoImageSrc: null,
  artworkImageSrc: null,
  drawingLayerImageSrc: null,
  renderedImageSrc: null,
  aiRenderedImageSrc: null,
  aiRenderOptions: [],
  treatmentId: getRecommendedLightStyle().id,
  treatmentVersion: LIGHT_STYLE_VERSION,
  storyFocus: 'keeper',
}

export function ToothlightMakeClient() {
  const router = useRouter()
  const previewRef = useRef<HTMLElement>(null)
  const storyLoggedRef = useRef(false)
  const [draft, setDraft] = useState<ToothlightDraft>(defaultDraft)
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [resumedSave, setResumedSave] = useState(false)
  const [aiRenderState, setAiRenderState] = useState<'idle' | 'rendering' | 'complete' | 'error'>('idle')
  const [aiRenderMessage, setAiRenderMessage] = useState('')

  useEffect(() => {
    logToothlightClientEvent('make_viewed', { version: 'creation-ux-v1' })
    let cancelled = false

    void (async () => {
      try {
        const stored = await readToothlightDraftFromBrowser<StoredToothlightDraft>()
        if (stored && !cancelled) {
          setDraft(normalizeStoredDraft(stored))
        }
      } catch {
        window.localStorage.removeItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
      } finally {
        if (!cancelled) {
          setDraftRestored(true)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!draftRestored) return
    void saveToothlightDraftToBrowser(draft)
  }, [draft, draftRestored])

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
    if (!draftRestored) return
    if (!shouldResumeToothlightAiRender(window.location.search)) return
    if (!hasToothlightAiRenderPending()) return

    clearToothlightAiRenderPending()
    logToothlightClientEvent('auth_returned', { reason: 'ai_render' })
    setAiRenderMessage('Parent account connected. Rendering the AI final now.')
    void handleAiRender()
  }, [draftRestored])

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
  const selectedStoryFocus =
    STORY_FOCUS_OPTIONS.find((option) => option.id === draft.storyFocus) ?? STORY_FOCUS_OPTIONS[2]
  const creationImageSrc = getCreationImageSrc(draft)
  const hasMemory = Boolean(creationImageSrc)
  const hasAiFinal = Boolean(draft.aiRenderedImageSrc)
  const hasStoryDetails = Boolean(
    draft.childName.trim() || draft.toothName.trim() || draft.caption.trim(),
  )
  const noteHandoffUrl = buildToothlightNoteUrl(shareUrl, 'demo-toothlight')
  const nextAction = getNextAction({
    hasMemory,
    hasAiFinal,
    hasStoryDetails,
    saved,
  })
  const flowSteps = MAKE_FLOW_STEPS.map((step) => ({
    ...step,
    state: getMakeFlowStepState(step.id, {
      hasMemory,
      hasAiFinal,
      hasStoryDetails,
      saved,
    }),
  }))
  const visualState = getToothlightVisualState({
    hasSourcePhoto: Boolean(creationImageSrc),
    hasGlow: Boolean(draft.treatmentId),
  }).visualState

  function commitDraft(updater: (current: ToothlightDraft) => ToothlightDraft) {
    setDraft(updater)
    setSaved(false)
    setSaveMessage('')
    setShareUrl(null)
  }

  function updateDraft(patch: Partial<ToothlightDraft>) {
    commitDraft((current) => ({ ...current, ...patch }))
  }

  function handleImageFile(file: File | null, source: 'library' | 'camera' = 'camera') {
    if (!file) return
    void prepareUploadedImage(file, source)
  }

  async function prepareUploadedImage(file: File, source: 'library' | 'camera') {
    try {
      const photoImageSrc = await normalizeImageFile(file)
      updateDraft({
        sourceImageSrc: photoImageSrc,
        photoImageSrc,
        artworkImageSrc: null,
        drawingLayerImageSrc: null,
        renderedImageSrc: null,
        aiRenderedImageSrc: null,
        aiRenderOptions: [],
      })
      setAiRenderState('idle')
      setAiRenderMessage('')
      logToothlightClientEvent('source_added', { source })
      logToothlightClientEvent('photo_added', { source })
    } catch {
      setSaveMessage('That photo could not be prepared. Try a different image.')
    }
  }

  function selectTreatment(treatmentId: string) {
    updateDraft({ treatmentId, renderedImageSrc: null, aiRenderedImageSrc: null })
    setAiRenderState('idle')
    setAiRenderMessage('')
    logToothlightClientEvent('treatment_selected', { treatmentId })
    logToothlightClientEvent('style_previewed', { treatmentId })
  }

  function selectStoryFocus(storyFocus: StoryFocusId) {
    updateDraft({ storyFocus, renderedImageSrc: null, aiRenderedImageSrc: null })
    setAiRenderState('idle')
    setAiRenderMessage('')
  }

  async function handleAiRender() {
    const imageForAiRender = getCreationImageSrc(draft)
    if (!imageForAiRender) {
      setAiRenderState('error')
      setAiRenderMessage('Add a photo or drawing first.')
      return
    }

    const treatment = getLightStyle(draft.treatmentId)
    const aiReferences = await createAiRenderReferences({ draft, treatment })
    const layerMode = aiReferences.layerMode
    const layerEvent =
      layerMode === 'layered'
        ? { layerMode: 'layered' as const }
        : { layerMode: 'flattened' as const }
    setAiRenderState('rendering')
    setAiRenderMessage('Making the final image. Your instant preview stays ready.')
    logToothlightClientEvent('ai_render_started', {
      treatmentId: treatment.id,
      aiStyleId: treatment.aiStyleId,
      ...layerEvent,
    })
    const promptOverride = buildToothlightProductPrompt({
      styleLabel: treatment.label,
      photoEffect: treatment.photoEffect,
      drawingEffect: treatment.drawingEffect,
      objectForm: treatment.objectForm,
      compositionDirective: treatment.compositionDirective,
      drawingIntegration: treatment.drawingIntegration,
      storyMotifs: treatment.storyMotifs,
      fairyCarryCue: treatment.fairyCarryCue,
      layerMode,
      storyFocus: draft.storyFocus,
      creativePass: draft.aiRenderOptions.length + 1,
    })

    const outcome = await callEnhance({
      drawingDataUrl: aiReferences.drawingDataUrl,
      sourceImageDataUrl: aiReferences.sourceImageDataUrl,
      drawingLayerDataUrl: aiReferences.drawingLayerDataUrl,
      compositionImageDataUrl: aiReferences.compositionImageDataUrl,
      layerMode,
      tradition: 'default',
      charms: ['sparkle', 'glow'],
      style: treatment.aiStyleId,
      promptOverride,
      productRenderModeId: toothlightProductRenderContract.modeId,
      productStyleId: treatment.id,
      productCreativePass: draft.aiRenderOptions.length + 1,
      productStoryFocus: draft.storyFocus,
    })

    if (!outcome.ok) {
      if (outcome.error === 'auth_required') {
        markToothlightAiRenderPending()
        logToothlightClientEvent('auth_started', { reason: 'ai_render' })
        setAiRenderMessage('Parent sign-in unlocks the AI final before any generation cost starts.')
        window.location.assign(buildToothlightParentAuthUrl('/toothlight/make?render=1'))
        return
      }

      setAiRenderState('error')
      const message = outcome.detail ?? 'AI final is not ready. You can still save the instant preview.'
      setAiRenderMessage(message)
      logToothlightClientEvent('ai_render_failed', {
        treatmentId: treatment.id,
        error: outcome.error,
      })
      return
    }

    const providerImageSrc = await imageUrlToCompressedDataUrl(outcome.result.enhancedImageUrl)
    const aiRenderedImageSrc = await composeLayerAwareAiFinal({
      aiImageSrc: providerImageSrc,
      drawingLayerImageSrc: aiReferences.finalDrawingLayerDataUrl,
      treatmentId: draft.treatmentId,
    })
    const aiRenderOption: ToothlightAiRenderOption = {
      id: createAiRenderOptionId(),
      imageSrc: aiRenderedImageSrc,
      treatmentId: treatment.id,
      treatmentLabel: treatment.label,
      createdAt: new Date().toISOString(),
    }
    commitDraft((current) => ({
      ...current,
      aiRenderedImageSrc,
      renderedImageSrc: aiRenderedImageSrc,
      aiRenderOptions: rememberAiRenderOption(current.aiRenderOptions, aiRenderOption),
    }))
    setAiRenderState('complete')
    setAiRenderMessage('AI final ready. The original memory is still preserved.')
    logToothlightClientEvent('ai_render_completed', {
      treatmentId: treatment.id,
      aiStyleId: treatment.aiStyleId,
      generationMs: outcome.result.generationMs,
      renderMode: outcome.result.renderMode,
    })
  }

  function chooseAiRenderOption(option: ToothlightAiRenderOption) {
    const treatment = getLightStyle(option.treatmentId)
    updateDraft({
      treatmentId: treatment.id,
      aiRenderedImageSrc: option.imageSrc,
      renderedImageSrc: option.imageSrc,
    })
    setAiRenderState('complete')
    setAiRenderMessage(`Using ${option.treatmentLabel} AI final. The original memory is still preserved.`)
    logToothlightClientEvent('ai_render_option_selected', {
      treatmentId: treatment.id,
      optionId: option.id,
    })
  }

  async function handleSave() {
    logToothlightClientEvent('save_attempted', {
      treatmentId: draft.treatmentId,
      hasSource: Boolean(creationImageSrc),
      hasAiRenderedImage: Boolean(draft.aiRenderedImageSrc),
      hasDrawingLayer: Boolean(draft.drawingLayerImageSrc),
    })
    logToothlightClientEvent('save_clicked', {
      treatmentId: draft.treatmentId,
      hasSource: Boolean(creationImageSrc),
    })

    const renderedImageSrc =
      draft.aiRenderedImageSrc ??
      creationImageSrc ??
      draft.renderedImageSrc ??
      (await captureToothlightPreviewImage({
        sourceImageSrc: creationImageSrc,
        treatmentId: draft.treatmentId,
        title,
        caption,
      }))
    const saveDraft = {
      ...draft,
      renderedImageSrc: renderedImageSrc ?? creationImageSrc,
    }

    await saveToothlightDraftToBrowser(saveDraft)
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
          sourceImageSrc: saveDraft.sourceImageSrc,
          artworkImageSrc: saveDraft.artworkImageSrc,
          drawingLayerImageSrc: saveDraft.drawingLayerImageSrc,
          renderedImageSrc: saveDraft.renderedImageSrc,
          aiRenderedImageSrc: saveDraft.aiRenderedImageSrc,
          glowId: saveDraft.treatmentId,
          treatmentId: saveDraft.treatmentId,
          treatmentVersion: saveDraft.treatmentVersion,
        }),
      })
      const result = await readSaveResponse(response)

      if (!response.ok) {
        if (isParentAuthRequired(response.status)) {
          logToothlightClientEvent('auth_started', { reason: 'save' })
          setSaveMessage('Saving this Toothlight to your parent account.')
          redirectToToothlightParentAuth('/toothlight/make?save=1')
          return
        }
        throw new Error(result.error || 'Save is not ready yet.')
      }

      if (!result.toothlightId) {
        throw new Error('Save completed without a Toothlight id.')
      }

      setSaved(true)
      setShareUrl(result.shareUrl ?? null)
      saveLocalToothlight({
        toothlightId: result.toothlightId,
        childName: saveDraft.childName.trim() || 'Your child',
        toothName: saveDraft.toothName.trim() || 'Toothlight',
        caption: saveDraft.caption.trim() || 'A small tooth became a bright memory.',
        imageSrc: saveDraft.renderedImageSrc ?? creationImageSrc,
        sourceImageSrc: saveDraft.sourceImageSrc,
        artworkImageSrc: saveDraft.artworkImageSrc,
        drawingLayerImageSrc: saveDraft.drawingLayerImageSrc,
        renderedImageSrc: saveDraft.renderedImageSrc ?? creationImageSrc,
        aiRenderedImageSrc: saveDraft.aiRenderedImageSrc,
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
      logToothlightClientEvent('save_completed', {
        toothlightId: result.toothlightId,
        treatmentId: saveDraft.treatmentId,
        hasAiRenderedImage: Boolean(saveDraft.aiRenderedImageSrc),
      })
      setSaveMessage('Saved. Seal the parent note next.')
    } catch (error) {
      setSaved(false)
      setSaveMessage(error instanceof Error ? error.message : 'Save is not ready yet.')
    } finally {
      setIsSaving(false)
    }
  }

  async function prepareDrawnImage(dataUrl: string, layers?: LayeredDrawingExport) {
    try {
      const artworkImageSrc = await normalizeImageDataUrl(dataUrl)
      const drawingLayerImageSrc = layers?.drawingLayerDataUrl
        ? await normalizeTransparentImageDataUrl(layers.drawingLayerDataUrl)
        : null
      updateDraft({
        artworkImageSrc,
        drawingLayerImageSrc,
        sourceImageSrc: draft.photoImageSrc ?? draft.sourceImageSrc ?? artworkImageSrc,
        renderedImageSrc: null,
        aiRenderedImageSrc: null,
        aiRenderOptions: [],
      })
      setAiRenderState('idle')
      setAiRenderMessage('')
      logToothlightClientEvent('source_added', { source: 'drawing' })
      logToothlightClientEvent('photo_added', { source: 'drawing' })
    } catch {
      setSaveMessage('That drawing could not be prepared. Try again.')
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

      <nav className={styles.flowRail} aria-label="Toothlight creation progress">
        <div className={styles.flowSteps}>
          {flowSteps.map((step, index) => (
            <a key={step.id} href={step.href} className={styles.flowStep} data-state={step.state}>
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
            </a>
          ))}
        </div>
        <div className={styles.nextActionCard}>
          <span>Next</span>
          <strong>{nextAction}</strong>
        </div>
      </nav>

      <main className={styles.creator} aria-label="Make a Toothlight">
        <section
          id="toothlight-memory-step"
          className={styles.sourceFirst}
          aria-label="Add photo or drawing"
        >
          <ToothlightMemoryEditor
            photoImageSrc={draft.photoImageSrc}
            artworkImageSrc={draft.artworkImageSrc}
            selectedTreatment={selectedTreatment}
            onPhotoFile={(file, source) => handleImageFile(file, source)}
            onArtworkReady={(dataUrl, layers) => {
              void prepareDrawnImage(dataUrl, layers)
            }}
            onStudioOpened={() => {
              logToothlightClientEvent('drawing_opened', { treatmentId: draft.treatmentId })
            }}
          />
          <div
            id="toothlight-style-step"
            className={styles.studioStyleDock}
            aria-label="Studio styles and AI filter"
          >
            <div className={styles.studioDockHeader}>
              <div>
                <p className={styles.eyebrow}>AI filter studio</p>
                <h2>Choose a Light Style</h2>
              </div>
              <span>{selectedTreatment.visualPromise}</span>
            </div>
            <LightStyleCarousel selectedId={draft.treatmentId} onSelect={selectTreatment} />
            <div className={styles.aiRenderBox}>
              <div>
                <strong>
                  {toothlightProductRenderContract.childLabel}.
                </strong>
                <p>
                  AI creates a story object from the memory and drawing. Original stays saved.
                </p>
                <p className={styles.objectBrief}>
                  Story target: {selectedTreatment.keeperName}'s {selectedTreatment.keeperObject}. Drawing becomes {selectedStoryFocus.brief}.
                </p>
              </div>
              <div className={styles.storyFocusControl} aria-label="Story focus">
                <span>Story focus</span>
                <div className={styles.storyFocusOptions} role="group" aria-label="Story focus">
                  {STORY_FOCUS_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.storyFocusOption}
                      data-selected={draft.storyFocus === option.id}
                      onClick={() => selectStoryFocus(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleAiRender}
                disabled={!creationImageSrc || aiRenderState === 'rendering'}
              >
                {aiRenderState === 'rendering'
                  ? 'Rendering final image'
                  : draft.aiRenderOptions.length > 0
                    ? 'Render another AI final'
                    : 'Render AI final image'}
              </button>
              {aiRenderMessage && (
                <p className={styles.aiRenderMessage} data-state={aiRenderState}>
                  {aiRenderMessage}
                </p>
              )}
              {draft.aiRenderOptions.length > 0 && (
                <div className={styles.aiVariationRail} aria-label="AI final options">
                  <div className={styles.aiVariationHeader}>
                    <strong>AI final options</strong>
                    <span>{draft.aiRenderOptions.length} saved</span>
                  </div>
                  <div className={styles.aiVariationGrid}>
                    {draft.aiRenderOptions.map((option, index) => (
                      <button
                        key={option.id}
                        type="button"
                        className={styles.aiVariationOption}
                        data-selected={draft.aiRenderedImageSrc === option.imageSrc}
                        onClick={() => chooseAiRenderOption(option)}
                        aria-label={`Use ${option.treatmentLabel} AI final ${index + 1}`}
                      >
                        <img src={option.imageSrc} alt="" aria-hidden="true" />
                        <span>{index === 0 ? 'Latest' : `Option ${index + 1}`}</span>
                        <small>{option.treatmentLabel}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.previewStage} aria-label="Toothlight preview">
          <ToothlightPreview
            sourceImageSrc={creationImageSrc}
            aiImageSrc={draft.aiRenderedImageSrc}
            treatmentId={draft.treatmentId}
            title={title}
            caption={caption}
            renderTargetRef={previewRef}
          />
        </section>

        <section
          id="toothlight-story-step"
          className={styles.panel}
          aria-label="Add the story"
        >
          <div className={styles.panelHeader}>
            <span>3</span>
            <h2>Add the story</h2>
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
            <span>Toothlight name</span>
            <input
              value={draft.toothName}
              onChange={(event) => updateDraft({ toothName: event.target.value })}
              placeholder="First Tooth"
            />
          </label>
          <label className={styles.field}>
            <span>What happened?</span>
            <textarea
              value={draft.caption}
              onChange={(event) => updateDraft({ caption: event.target.value })}
              placeholder="Lost after breakfast and showed everyone."
              rows={3}
            />
          </label>
        </section>

        <section
          id="toothlight-save-step"
          className={styles.savePanel}
          aria-label="Save this Toothlight"
        >
          <SaveFlightSequence
            mode="child"
            intensity="wonder"
            isActive={saved}
            saveSucceeded={saved}
            onComplete={() => router.push(noteHandoffUrl)}
          />
          <div>
            <p className={styles.saveKicker}>{visualState === 'spark' ? 'Preview ready' : 'Draft preview'}</p>
            <h2>Save this Toothlight.</h2>
            <p>After saving, seal the private note for later. Smile Fund stays optional.</p>
          </div>
          <button type="button" className={styles.primaryButton} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving Toothlight' : 'Save this Toothlight'}
          </button>
          {saved && (
            <Link href={noteHandoffUrl} className={styles.noteHandoffLink}>
              Seal the future note
            </Link>
          )}
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
  const photoImageSrc = stored.photoImageSrc ?? sourceImageSrc
  const artworkImageSrc = stored.artworkImageSrc ?? null
  const treatmentId = stored.treatmentId ?? stored.glowId ?? defaultDraft.treatmentId
  const aiRenderOptions = normalizeAiRenderOptions(stored.aiRenderOptions)

  return {
    ...defaultDraft,
    ...stored,
    sourceImageSrc,
    photoImageSrc,
    artworkImageSrc,
    drawingLayerImageSrc: stored.drawingLayerImageSrc ?? null,
    renderedImageSrc: stored.renderedImageSrc ?? null,
    aiRenderedImageSrc: stored.aiRenderedImageSrc ?? null,
    aiRenderOptions,
    treatmentId: getLightStyle(treatmentId).id,
    treatmentVersion: stored.treatmentVersion ?? LIGHT_STYLE_VERSION,
    storyFocus: normalizeStoryFocus(stored.storyFocus),
  }
}

function normalizeStoryFocus(value: unknown): StoryFocusId {
  return value === 'memory' || value === 'marks' || value === 'keeper' ? value : 'keeper'
}

function normalizeAiRenderOptions(options: unknown): ToothlightAiRenderOption[] {
  if (!Array.isArray(options)) return []

  return options
    .filter((option): option is Partial<ToothlightAiRenderOption> =>
      Boolean(option) && typeof option === 'object' && !Array.isArray(option),
    )
    .flatMap((option) => {
      if (typeof option.id !== 'string' || typeof option.imageSrc !== 'string') return []
      if (!option.imageSrc.startsWith('data:image/')) return []
      const treatment = getLightStyle(option.treatmentId ?? defaultDraft.treatmentId)
      return [
        {
          id: option.id,
          imageSrc: option.imageSrc,
          treatmentId: treatment.id,
          treatmentLabel:
            typeof option.treatmentLabel === 'string' ? option.treatmentLabel : treatment.label,
          createdAt: typeof option.createdAt === 'string' ? option.createdAt : new Date().toISOString(),
        },
      ]
    })
    .slice(0, MAX_AI_RENDER_OPTIONS)
}

function rememberAiRenderOption(
  options: ToothlightAiRenderOption[],
  option: ToothlightAiRenderOption,
) {
  return [
    option,
    ...options.filter((current) => current.id !== option.id && current.imageSrc !== option.imageSrc),
  ].slice(0, MAX_AI_RENDER_OPTIONS)
}

function createAiRenderOptionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `ai-final-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getCreationImageSrc(draft: Pick<ToothlightDraft, 'artworkImageSrc' | 'photoImageSrc' | 'sourceImageSrc'>) {
  return draft.artworkImageSrc ?? draft.photoImageSrc ?? draft.sourceImageSrc
}

function getNextAction({
  hasMemory,
  hasAiFinal,
  hasStoryDetails,
  saved,
}: {
  hasMemory: boolean
  hasAiFinal: boolean
  hasStoryDetails: boolean
  saved: boolean
}) {
  if (saved) return 'Seal the future note'
  if (!hasMemory) return 'Add photo or drawing'
  if (!hasAiFinal) return 'Choose a style or render AI final'
  if (!hasStoryDetails) return 'Add name and memory line'
  return 'Save this Toothlight'
}

function getMakeFlowStepState(
  stepId: MakeFlowStepId,
  state: {
    hasMemory: boolean
    hasAiFinal: boolean
    hasStoryDetails: boolean
    saved: boolean
  },
): MakeFlowStepState {
  if (stepId === 'memory') return state.hasMemory ? 'done' : 'active'
  if (stepId === 'style') {
    if (!state.hasMemory) return 'next'
    return state.hasAiFinal ? 'done' : 'active'
  }
  if (stepId === 'story') {
    if (!state.hasMemory) return 'idle'
    return state.hasStoryDetails ? 'done' : state.hasAiFinal ? 'active' : 'next'
  }
  if (stepId === 'seal') {
    if (state.saved) return 'active'
    return state.hasMemory && state.hasStoryDetails ? 'next' : 'idle'
  }
  return 'idle'
}

async function createAiRenderReferences({
  draft,
  treatment,
}: {
  draft: ToothlightDraft
  treatment: ReturnType<typeof getLightStyle>
}): Promise<AiRenderReferences> {
  const imageForAiRender = getCreationImageSrc(draft)
  const layerMode: AiRenderReferences['layerMode'] =
    draft.photoImageSrc && draft.drawingLayerImageSrc ? 'layered' : 'flattened'
  const baseline: AiRenderReferences = {
    drawingDataUrl: imageForAiRender ?? '',
    sourceImageDataUrl: draft.photoImageSrc,
    drawingLayerDataUrl: draft.drawingLayerImageSrc,
    compositionImageDataUrl: imageForAiRender ?? '',
    finalDrawingLayerDataUrl: draft.drawingLayerImageSrc,
    layerMode,
  }

  if (
    !imageForAiRender ||
    !draft.photoImageSrc ||
    !draft.drawingLayerImageSrc ||
    draft.storyFocus === 'memory' ||
    typeof document === 'undefined'
  ) {
    return baseline
  }

  try {
    const finalDrawingLayerDataUrl = await abstractDrawingLayerForStory({
      drawingLayerImageSrc: draft.drawingLayerImageSrc,
      treatment,
      storyFocus: draft.storyFocus,
    })
    const compositionImageDataUrl =
      (await composeStoryMapImage({
        sourceImageSrc: draft.photoImageSrc,
        drawingLayerImageSrc: draft.drawingLayerImageSrc,
        abstractDrawingLayerImageSrc: finalDrawingLayerDataUrl,
        treatment,
        storyFocus: draft.storyFocus,
      })) ?? imageForAiRender

    return {
      drawingDataUrl: compositionImageDataUrl,
      sourceImageDataUrl: draft.photoImageSrc,
      drawingLayerDataUrl: finalDrawingLayerDataUrl ?? draft.drawingLayerImageSrc,
      compositionImageDataUrl,
      finalDrawingLayerDataUrl: finalDrawingLayerDataUrl ?? draft.drawingLayerImageSrc,
      layerMode,
    }
  } catch {
    return baseline
  }
}

async function composeStoryMapImage({
  sourceImageSrc,
  drawingLayerImageSrc,
  abstractDrawingLayerImageSrc,
  treatment,
  storyFocus,
}: {
  sourceImageSrc: string
  drawingLayerImageSrc: string
  abstractDrawingLayerImageSrc: string | null
  treatment: ReturnType<typeof getLightStyle>
  storyFocus: StoryFocusId
}) {
  const sourceImage = await loadCanvasImage(sourceImageSrc)
  const abstractLayerImage = abstractDrawingLayerImageSrc
    ? await loadCanvasImage(abstractDrawingLayerImageSrc)
    : await loadCanvasImage(drawingLayerImageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = AI_REFERENCE_IMAGE_SIZE
  canvas.height = AI_REFERENCE_IMAGE_SIZE
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = '#fbf8ef'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.save()
  context.filter = storyFocus === 'keeper' ? `${treatment.canvasFilter} saturate(0.9)` : treatment.canvasFilter
  drawCoverImage(context, sourceImage, 0, 0, canvas.width, canvas.height)
  context.restore()

  context.save()
  context.globalCompositeOperation = 'soft-light'
  context.globalAlpha = storyFocus === 'keeper' ? 0.52 : 0.38
  const storyWash = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  storyWash.addColorStop(0, treatment.accent)
  storyWash.addColorStop(0.48, 'rgba(255,255,255,0.12)')
  storyWash.addColorStop(1, treatment.secondaryAccent)
  context.fillStyle = storyWash
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.restore()

  context.save()
  context.globalCompositeOperation = storyFocus === 'keeper' ? 'screen' : 'source-over'
  context.globalAlpha = storyFocus === 'keeper' ? 0.62 : 0.72
  context.drawImage(abstractLayerImage, 0, 0, canvas.width, canvas.height)
  context.restore()

  if (storyFocus === 'keeper') {
    drawStoryRouteWash(context, treatment)
  }

  drawFineGrain(context, treatment, storyFocus === 'keeper' ? 0.14 : 0.08)
  return canvas.toDataURL('image/jpeg', IMAGE_EXPORT_QUALITY)
}

async function abstractDrawingLayerForStory({
  drawingLayerImageSrc,
  treatment,
  storyFocus,
}: {
  drawingLayerImageSrc: string
  treatment: ReturnType<typeof getLightStyle>
  storyFocus: StoryFocusId
}) {
  const drawingLayer = await loadCanvasImage(drawingLayerImageSrc)
  const mask = document.createElement('canvas')
  mask.width = AI_REFERENCE_IMAGE_SIZE
  mask.height = AI_REFERENCE_IMAGE_SIZE
  const maskContext = mask.getContext('2d')
  if (!maskContext) return null

  maskContext.save()
  maskContext.globalAlpha = storyFocus === 'keeper' ? 0.64 : 0.78
  maskContext.filter =
    storyFocus === 'keeper'
      ? 'blur(18px) saturate(1.55) brightness(1.18)'
      : 'blur(9px) saturate(1.32) brightness(1.08)'
  maskContext.drawImage(drawingLayer, 0, 0, mask.width, mask.height)
  maskContext.restore()

  const canvas = document.createElement('canvas')
  canvas.width = AI_REFERENCE_IMAGE_SIZE
  canvas.height = AI_REFERENCE_IMAGE_SIZE
  const context = canvas.getContext('2d')
  if (!context) return null

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, treatment.brushAccent)
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.82)')
  gradient.addColorStop(1, treatment.brushSecondaryAccent)
  context.drawImage(mask, 0, 0)
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (storyFocus === 'marks') {
    const rawMask = document.createElement('canvas')
    rawMask.width = AI_REFERENCE_IMAGE_SIZE
    rawMask.height = AI_REFERENCE_IMAGE_SIZE
    const rawContext = rawMask.getContext('2d')
    if (rawContext) {
      rawContext.globalAlpha = 0.2
      rawContext.drawImage(drawingLayer, 0, 0, rawMask.width, rawMask.height)
      const rawTint = makeTintedLayer(rawMask, treatment.brushSecondaryAccent)
      if (rawTint) {
        context.globalCompositeOperation = 'source-over'
        context.globalAlpha = 0.28
        context.filter = 'blur(1px) saturate(1.1)'
        context.drawImage(rawTint, 0, 0)
      }
    }
  }

  return canvas.toDataURL('image/png')
}

function drawStoryRouteWash(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.22
  context.strokeStyle = treatment.secondaryAccent
  context.lineWidth = 10
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(width * 0.18, height * 0.78)
  context.bezierCurveTo(width * 0.35, height * 0.6, width * 0.44, height * 0.28, width * 0.68, height * 0.2)
  context.bezierCurveTo(width * 0.78, height * 0.16, width * 0.82, height * 0.24, width * 0.74, height * 0.34)
  context.stroke()
  context.restore()
}

function markToothlightAiRenderPending() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOOTHLIGHT_PENDING_AI_RENDER_STORAGE_KEY, 'true')
}

function clearToothlightAiRenderPending() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOOTHLIGHT_PENDING_AI_RENDER_STORAGE_KEY)
}

function hasToothlightAiRenderPending() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(TOOTHLIGHT_PENDING_AI_RENDER_STORAGE_KEY) === 'true'
}

function shouldResumeToothlightAiRender(search: string) {
  const params = new URLSearchParams(search)
  return params.get('render') === '1' && params.get('returning') === 'auth'
}

function buildToothlightNoteUrl(shareUrl: string | null, fallbackToothlightId: string) {
  const savedUrl = shareUrl ?? `/toothlight/t/${fallbackToothlightId}`
  const path = savedUrl.startsWith('http') ? new URL(savedUrl).pathname : savedUrl
  return `${path.replace(/\/$/, '')}/note?handoff=1`
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
  canvas.width = PREVIEW_IMAGE_WIDTH
  canvas.height = PREVIEW_IMAGE_HEIGHT
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
      context.save()
      context.filter = treatment.canvasFilter
      drawCoverImage(context, image, 0, 0, canvas.width, 835)
      context.restore()
    } catch {
      drawPlaceholder(context, treatment.accent)
    }
  } else {
    drawPlaceholder(context, treatment.accent)
  }

  drawTreatmentOverlays(context, treatment)

  context.fillStyle = 'rgba(255,255,255,0.92)'
  context.fillRect(0, 835, canvas.width, 290)
  context.fillStyle = '#17262a'
  context.font = '700 34px serif'
  context.fillText(treatment.label.toUpperCase(), 60, 910)
  context.font = '700 52px serif'
  context.fillText(title.slice(0, 32), 60, 978)
  context.fillStyle = '#4c6064'
  context.font = '400 32px sans-serif'
  context.fillText(caption.slice(0, 54), 60, 1035)

  return canvas.toDataURL('image/jpeg', IMAGE_EXPORT_QUALITY)
}

async function normalizeImageFile(file: File) {
  const dataUrl = await readFileAsDataUrl(file)
  return normalizeImageDataUrl(dataUrl)
}

async function imageUrlToCompressedDataUrl(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) return url
    const blob = await response.blob()
    const dataUrl = await readBlobAsDataUrl(blob)
    return normalizeImageDataUrl(dataUrl)
  } catch {
    return url
  }
}

async function composeLayerAwareAiFinal({
  aiImageSrc,
  drawingLayerImageSrc,
  treatmentId,
}: {
  aiImageSrc: string
  drawingLayerImageSrc: string | null
  treatmentId: string
}) {
  if (typeof document === 'undefined') return aiImageSrc

  try {
    const aiImage = await loadCanvasImage(aiImageSrc)
    const drawingLayer = drawingLayerImageSrc ? await loadCanvasImage(drawingLayerImageSrc) : null
    const treatment = getLightStyle(treatmentId)
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')
    if (!context) return aiImageSrc

    drawCoverImage(context, aiImage, 0, 0, canvas.width, canvas.height)
    drawAiFinalPhotoTreatment(context, treatment)
    if (drawingLayer) {
      drawInterpretedDrawingLayer(context, drawingLayer, treatment)
    }
    return canvas.toDataURL('image/jpeg', IMAGE_EXPORT_QUALITY)
  } catch {
    return aiImageSrc
  }
}

function drawAiFinalPhotoTreatment(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas

  context.save()
  context.globalCompositeOperation = 'soft-light'
  context.globalAlpha = 0.34 + treatment.renderIntensity * 0.18
  const deepWash = context.createLinearGradient(0, 0, width, height)
  deepWash.addColorStop(0, treatment.accent)
  deepWash.addColorStop(0.46, 'rgba(255,255,255,0.08)')
  deepWash.addColorStop(1, treatment.deepAccent)
  context.fillStyle = deepWash
  context.fillRect(0, 0, width, height)
  context.restore()

  if (treatment.effectClass === 'effectStorybookInk') {
    drawPaperTexture(context, treatment, 0.48)
    drawSoftInkEdges(context, treatment)
  } else if (treatment.effectClass === 'effectPrismPop') {
    drawPrismSplits(context, treatment)
    drawHalftone(context, treatment, 16, 0.34)
  } else if (treatment.effectClass === 'effectMoonGlass') {
    drawMoonGlass(context, treatment)
  } else if (treatment.effectClass === 'effectPencilSpark') {
    drawPaperTexture(context, treatment, 0.38)
    drawPencilHatching(context, treatment)
  } else if (treatment.effectClass === 'effectLanternPaper') {
    drawLanternPaper(context, treatment)
  } else {
    drawLocketGlass(context, treatment)
  }

  drawFineGrain(context, treatment, 0.22 + treatment.renderIntensity * 0.16)
  drawSoftVignette(context, treatment)
}

function drawInterpretedDrawingLayer(
  context: CanvasRenderingContext2D,
  drawingLayer: HTMLImageElement,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskContext = mask.getContext('2d')
  if (!maskContext) return

  maskContext.drawImage(drawingLayer, 0, 0, width, height)
  const accentLayer = makeTintedLayer(mask, treatment.brushAccent)
  const secondaryLayer = makeTintedLayer(mask, treatment.brushSecondaryAccent)
  if (!accentLayer || !secondaryLayer) return

  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.42 + treatment.renderIntensity * 0.18
  context.filter = treatment.effectClass === 'effectMoonGlass'
    ? 'blur(14px) saturate(1.6) brightness(1.18)'
    : 'blur(9px) saturate(1.35) brightness(1.08)'
  context.drawImage(accentLayer, 0, 0)
  context.restore()

  if (treatment.effectClass === 'effectPrismPop') {
    context.save()
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.74
    context.filter = 'saturate(1.5) contrast(1.12)'
    context.drawImage(accentLayer, -5, 0)
    context.drawImage(secondaryLayer, 5, 3)
    context.restore()
  } else if (treatment.effectClass === 'effectStorybookInk') {
    context.save()
    context.globalCompositeOperation = 'multiply'
    context.globalAlpha = 0.62
    context.filter = 'contrast(1.22) saturate(0.78)'
    context.drawImage(accentLayer, 1, 1)
    context.restore()
  } else if (treatment.effectClass === 'effectPencilSpark') {
    context.save()
    context.globalCompositeOperation = 'multiply'
    context.globalAlpha = 0.52
    context.filter = 'contrast(1.35) saturate(0.86)'
    context.drawImage(secondaryLayer, 1, 0)
    context.restore()
    drawLayerStitches(context, mask, treatment)
  } else if (treatment.effectClass === 'effectLanternPaper') {
    context.save()
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.66
    context.filter = 'blur(2px) saturate(1.18) brightness(1.08)'
    context.drawImage(accentLayer, 0, 0)
    context.restore()
  } else {
    context.save()
    context.globalCompositeOperation = 'soft-light'
    context.globalAlpha = 0.58
    context.filter = 'blur(2px) saturate(1.18)'
    context.drawImage(secondaryLayer, 0, 0)
    context.restore()
  }

  context.save()
  context.globalCompositeOperation =
    treatment.effectClass === 'effectStorybookInk' || treatment.effectClass === 'effectPencilSpark'
      ? 'multiply'
      : 'screen'
  context.globalAlpha = treatment.effectClass === 'effectStorybookInk' ? 0.48 : 0.68
  context.filter = 'contrast(1.18) saturate(1.22)'
  context.drawImage(accentLayer, 0, 0)
  context.restore()
}

function makeTintedLayer(mask: HTMLCanvasElement, color: string) {
  const layer = document.createElement('canvas')
  layer.width = mask.width
  layer.height = mask.height
  const layerContext = layer.getContext('2d')
  if (!layerContext) return null

  layerContext.drawImage(mask, 0, 0)
  layerContext.globalCompositeOperation = 'source-in'
  layerContext.fillStyle = color
  layerContext.fillRect(0, 0, layer.width, layer.height)
  return layer
}

function drawLocketGlass(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.52
  const shine = context.createLinearGradient(0, 0, width, height * 0.72)
  shine.addColorStop(0, 'rgba(255,255,255,0.68)')
  shine.addColorStop(0.18, treatment.accent)
  shine.addColorStop(0.34, 'rgba(255,255,255,0.06)')
  shine.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = shine
  context.fillRect(0, 0, width, height)
  context.restore()
}

function drawMoonGlass(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'multiply'
  context.globalAlpha = 0.18
  context.fillStyle = treatment.deepAccent
  context.fillRect(0, 0, width, height)
  context.restore()

  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.58
  const glow = context.createRadialGradient(width * 0.72, height * 0.18, 10, width * 0.72, height * 0.18, width * 0.45)
  glow.addColorStop(0, treatment.secondaryAccent)
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)
  context.restore()
}

function drawStorySurfaceLine(
  context: CanvasRenderingContext2D,
  color: string,
  alpha: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  context.save()
  context.globalAlpha = alpha
  context.strokeStyle = color
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.restore()
}

function drawSoftInkEdges(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'multiply'
  for (let x = -height; x < width; x += 34) {
    drawStorySurfaceLine(context, treatment.deepAccent, 0.08, x, 0, x + height, height)
  }
  context.restore()
}

function drawPrismSplits(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.28
  context.fillStyle = treatment.accent
  context.fillRect(-8, 0, width, height)
  context.fillStyle = treatment.secondaryAccent
  context.fillRect(8, 0, width, height)
  context.restore()
}

function drawHalftone(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
  spacing: number,
  alpha: number,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'soft-light'
  context.globalAlpha = alpha
  context.fillStyle = treatment.deepAccent
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      context.beginPath()
      context.arc(x, y, 1.2, 0, Math.PI * 2)
      context.fill()
    }
  }
  context.restore()
}

function drawPaperTexture(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
  alpha: number,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'multiply'
  context.globalAlpha = alpha
  context.strokeStyle = treatment.deepAccent
  context.lineWidth = 1
  for (let y = 6; y < height; y += 17) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y + Math.sin(y) * 3)
    context.stroke()
  }
  context.restore()
}

function drawPencilHatching(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'multiply'
  context.globalAlpha = 0.12
  context.strokeStyle = treatment.deepAccent
  context.lineWidth = 1
  for (let x = -height; x < width; x += 22) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x + height, height)
    context.stroke()
  }
  context.restore()
}

function drawLanternPaper(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.38
  const glow = context.createRadialGradient(width * 0.18, height * 0.22, 12, width * 0.18, height * 0.22, width * 0.62)
  glow.addColorStop(0, treatment.accent)
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)
  context.restore()
}

function drawLayerStitches(
  context: CanvasRenderingContext2D,
  mask: HTMLCanvasElement,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const stitchLayer = makeTintedLayer(mask, treatment.brushSecondaryAccent)
  if (!stitchLayer) return

  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.42
  context.filter = 'blur(1px)'
  context.drawImage(stitchLayer, 3, 3)
  context.restore()
}

function drawFineGrain(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
  alpha: number,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'soft-light'
  context.globalAlpha = alpha
  context.fillStyle = treatment.deepAccent
  for (let y = 0; y < height; y += 11) {
    for (let x = (y / 11) % 2 === 0 ? 0 : 5; x < width; x += 11) {
      context.fillRect(x, y, 1, 1)
    }
  }
  context.restore()
}

function drawSoftVignette(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  const { width, height } = context.canvas
  context.save()
  context.globalCompositeOperation = 'multiply'
  context.globalAlpha = 0.22
  const vignette = context.createRadialGradient(width / 2, height * 0.42, width * 0.18, width / 2, height / 2, width * 0.72)
  vignette.addColorStop(0, 'rgba(255,255,255,0)')
  vignette.addColorStop(1, treatment.deepAccent)
  context.fillStyle = vignette
  context.fillRect(0, 0, width, height)
  context.restore()
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Image file could not be read.'))
      }
    }
    reader.onerror = () => reject(new Error('Image file could not be read.'))
    reader.readAsDataURL(file)
  })
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Image file could not be read.'))
      }
    }
    reader.onerror = () => reject(new Error('Image file could not be read.'))
    reader.readAsDataURL(blob)
  })
}

async function normalizeImageDataUrl(dataUrl: string) {
  if (typeof document === 'undefined') return dataUrl

  const image = await loadCanvasImage(dataUrl)
  const scale = Math.min(1, MAX_SOURCE_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return dataUrl

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', IMAGE_EXPORT_QUALITY)
}

async function normalizeTransparentImageDataUrl(dataUrl: string) {
  if (typeof document === 'undefined') return dataUrl

  const image = await loadCanvasImage(dataUrl)
  const scale = Math.min(1, MAX_SOURCE_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return dataUrl

  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}

async function readSaveResponse(response: Response): Promise<{
  error?: string
  shareUrl?: string
  toothlightId?: string
}> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const bodyText = await response.text().catch(() => '')
  if (bodyText.toLowerCase().includes('request en') || response.status === 413) {
    return { error: 'That photo made the save too large. Try once more, or choose a smaller photo.' }
  }

  return { error: bodyText || 'Save is not ready yet.' }
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

function drawTreatmentOverlays(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
) {
  drawAiFinalPhotoTreatment(context, treatment)

  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = 0.46
  const edge = context.createLinearGradient(32, 32, context.canvas.width - 32, 803)
  edge.addColorStop(0, 'rgba(255,255,255,0.86)')
  edge.addColorStop(0.5, treatment.accent)
  edge.addColorStop(1, treatment.secondaryAccent)
  context.strokeStyle = edge
  context.lineWidth = 2
  context.strokeRect(34, 34, context.canvas.width - 68, 767)
  context.restore()
}

function drawPlaceholder(context: CanvasRenderingContext2D, accent: string) {
  const centerX = context.canvas.width / 2
  const centerY = Math.min(460, context.canvas.height * 0.4)

  context.fillStyle = 'rgba(255, 255, 255, 0.8)'
  context.beginPath()
  context.arc(centerX, centerY, 175, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = accent
  context.beginPath()
  context.arc(centerX, centerY, 98, 0, Math.PI * 2)
  context.fill()
}
