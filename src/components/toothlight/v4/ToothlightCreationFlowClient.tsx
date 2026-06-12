'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'

import DrawingCanvasV2, {
  type LayeredDrawingExport,
} from '@/components/toothfairy/app/drawing-canvas-v2'
import {
  buildToothlightParentAuthUrl,
  isLocalToothlightPreviewHost,
  isParentAuthRequired,
} from '@/lib/toothlight/client/toothlight-auth'
import {
  readToothlightDraftFromBrowser,
  saveLocalFutureNote,
  saveLocalToothlight,
  saveToothlightDraftToBrowser,
} from '@/lib/toothlight/client/toothlight-local-state'
import { logToothlightClientEvent } from '@/lib/toothlight/client/product-events'
import {
  LIGHT_STYLE_VERSION,
  getLightStyle,
  getRecommendedLightStyle,
} from '@/lib/toothlight/visual-treatments'
import { VoiceAssistField } from './VoiceAssistField'
import styles from './ToothlightCreationFlowClient.module.css'

export type ToothlightCreationStep =
  | 'start'
  | 'add-school-drawing'
  | 'create-source'
  | 'draw'
  | 'add-photo'
  | 'parent-check'
  | 'glow'
  | 'story'
  | 'preview'
  | 'parent-note'
  | 'seal'
  | 'saved'

type EnhancementStyle = 'original' | 'soft_glow' | 'storybook_magic'
type UnlockAge = 10 | 13 | 18 | 'custom' | null
type GiftAmount = 10 | 25 | 50 | 'custom'

type ToothlightCreationDraft = {
  sourceMode: 'school_drawing' | 'draw_on_screen' | 'start_with_photo' | null
  originalImageUrl: string | null
  enhancedImageUrl: string | null
  enhancementStyle: 'original' | 'soft_glow' | 'storybook_magic' | null
  childStoryText: string | null
  childStoryAudioUrl: string | null
  childStorySummary: string | null
  toothlightName: string
  childName: string | null
  lostToothDate: string
  parentAuthStatus: 'anonymous' | 'signed_in'
  parentNote: string | null
  unlockAge: 10 | 13 | 18 | 'custom' | null
  customUnlockDate: string | null
  giftSelected: boolean
  giftAmountUsd: number | null
  sealed: boolean
  drawingLayerImageUrl: string | null
  savedToothlightId: string | null
  shareUrl: string | null
}

type SaveResponse = {
  error?: string
  toothlightId?: string
  shareUrl?: string
}

const FLOW_ROUTES: Record<ToothlightCreationStep, string> = {
  start: '/toothlight/start',
  'add-school-drawing': '/toothlight/add-school-drawing',
  'create-source': '/toothlight/create-source',
  draw: '/toothlight/draw',
  'add-photo': '/toothlight/add-photo',
  'parent-check': '/toothlight/parent-check',
  glow: '/toothlight/glow',
  story: '/toothlight/story',
  preview: '/toothlight/preview',
  'parent-note': '/toothlight/parent-note',
  seal: '/toothlight/seal',
  saved: '/toothlight/saved',
}

const STORAGE_VERSION = 'stitch-flow-v1'
const IMAGE_EXPORT_QUALITY = 0.86
const MAX_IMAGE_SIDE = 1400
const DEFAULT_TOOTHLIGHT_NAME = 'The Wobbly Incisor'
const PARENT_GATE_RETURN_TO_SEAL = 'returnTo=/toothlight/seal'
const GIFT_AMOUNTS: GiftAmount[] = [10, 25, 50, 'custom']
const UNLOCK_AGES: Exclude<UnlockAge, null>[] = [10, 13, 18, 'custom']

const PHOTO_GLOW_OPTION: {
  id: EnhancementStyle
  title: string
  subtitle: string
  treatmentId: string
} = {
  id: 'original',
  title: 'Original photo',
  subtitle: 'No filter.',
  treatmentId: getRecommendedLightStyle().id,
}

const DRAWING_GLOW_OPTIONS: {
  id: Exclude<EnhancementStyle, 'original'>
  title: string
  subtitle: string
  treatmentId: string
}[] = [
  {
    id: 'soft_glow',
    title: 'Soft glow',
    subtitle: 'Add a warm Toothlight frame.',
    treatmentId: 'golden-locket',
  },
  {
    id: 'storybook_magic',
    title: 'Storybook magic',
    subtitle: 'Make it feel gently magical.',
    treatmentId: 'storybook-velvet',
  },
]

const TOOTHLIGHT_GLOW_OPTIONS = [PHOTO_GLOW_OPTION, ...DRAWING_GLOW_OPTIONS]

function createDefaultDraft(): ToothlightCreationDraft {
  return {
    sourceMode: null,
    originalImageUrl: null,
    enhancedImageUrl: null,
    enhancementStyle: null,
    childStoryText: null,
    childStoryAudioUrl: null,
    childStorySummary: null,
    toothlightName: DEFAULT_TOOTHLIGHT_NAME,
    childName: 'Kai',
    lostToothDate: new Date().toISOString().slice(0, 10),
    parentAuthStatus: 'anonymous',
    parentNote: null,
    unlockAge: 10,
    customUnlockDate: null,
    giftSelected: false,
    giftAmountUsd: null,
    sealed: false,
    drawingLayerImageUrl: null,
    savedToothlightId: null,
    shareUrl: null,
  }
}

export function ToothlightCreationFlowClient({ step }: { step: ToothlightCreationStep }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const libraryInputRef = useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = useState<ToothlightCreationDraft>(() => createDefaultDraft())
  const [draftRestored, setDraftRestored] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const hasOriginalImage = Boolean(draft.originalImageUrl)
  const isParentSignedIn = draft.parentAuthStatus === 'signed_in'
  const isPhotoSource = draft.sourceMode === 'start_with_photo'
  const finalImageUrl = draft.enhancedImageUrl ?? draft.originalImageUrl
  const selectedGlowId = draft.enhancementStyle ?? (isPhotoSource ? 'original' : 'soft_glow')
  const selectedGlow = TOOTHLIGHT_GLOW_OPTIONS.find((option) => option.id === selectedGlowId) ?? DRAWING_GLOW_OPTIONS[0]
  const imageTreatmentId = isPhotoSource && !draft.enhancedImageUrl ? undefined : selectedGlow.treatmentId
  const childName = draft.childName?.trim() || 'Kai'
  const parentReturnTo = getSafeReturnTo(searchParams.get('returnTo'), FLOW_ROUTES.glow)
  const progress = useMemo(() => getProgress(step), [step])

  useEffect(() => {
    const returningFromAuth = isReturningFromAuth(window.location.search)
    logToothlightClientEvent('make_viewed', { version: STORAGE_VERSION, step })
    logToothlightClientEvent('make_step_viewed', { version: STORAGE_VERSION, step })
    if (step === 'start') {
      logToothlightClientEvent('start_flow', { version: STORAGE_VERSION })
    }
    if (returningFromAuth) {
      logToothlightClientEvent('auth_returned', { provider: 'google', step })
    }
    let cancelled = false

    void (async () => {
      try {
        const stored = await readToothlightDraftFromBrowser<Partial<ToothlightCreationDraft>>()
        if (!cancelled) {
          setDraft({
            ...normalizeCreationDraft(stored),
            parentAuthStatus: returningFromAuth ? 'signed_in' : normalizeCreationDraft(stored).parentAuthStatus,
          })
        }
      } catch {
        if (!cancelled) setDraft(createDefaultDraft())
      } finally {
        if (!cancelled) setDraftRestored(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [step])

  useEffect(() => {
    if (!draftRestored) return
    void saveToothlightDraftToBrowser(draft)
  }, [draft, draftRestored])

  useEffect(() => {
    if (!draftRestored) return
    if (needsExistingVisual(step)) {
      if (!hasOriginalImage) {
        router.replace('/toothlight/start')
        return
      }
    }

    if (!isParentSignedIn && (step === 'glow' || step === 'seal')) {
      const returnTo = step === 'seal' ? `/toothlight/parent-check?${PARENT_GATE_RETURN_TO_SEAL}` : '/toothlight/parent-check'
      router.replace(returnTo)
    }
  }, [draftRestored, hasOriginalImage, isParentSignedIn, router, step])

  function updateDraft(patch: Partial<ToothlightCreationDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
    setMessage('')
  }

  async function persistAndGo(nextDraft: ToothlightCreationDraft, href: string) {
    setDraft(nextDraft)
    await saveToothlightDraftToBrowser(nextDraft)
    router.push(href)
  }

  function chooseStart(sourceMode: 'school_drawing' | 'create_now') {
    if (sourceMode === 'school_drawing') {
      void persistAndGo({ ...draft, sourceMode: 'school_drawing' }, FLOW_ROUTES['add-school-drawing'])
      return
    }
    void persistAndGo({ ...draft, sourceMode: null }, FLOW_ROUTES['create-source'])
  }

  function chooseCreateSource(sourceMode: 'draw_on_screen' | 'start_with_photo') {
    updateDraft({ sourceMode })
  }

  function continueCreateSource() {
    if (draft.sourceMode === 'draw_on_screen') {
      router.push(FLOW_ROUTES.draw)
      return
    }
    if (draft.sourceMode === 'start_with_photo') {
      router.push(FLOW_ROUTES['add-photo'])
    }
  }

  function openCamera() {
    cameraInputRef.current?.click()
  }

  function openLibrary() {
    libraryInputRef.current?.click()
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>, source: 'camera' | 'library') {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''
    if (!file) return
    void handleImageFile(file, source)
  }

  async function handleImageFile(file: File, source: 'camera' | 'library') {
    setBusy(true)
    setMessage('')
    try {
      const originalImageUrl = await normalizeImageFile(file)
      const sourceMode = step === 'add-school-drawing' ? 'school_drawing' : 'start_with_photo'
      const nextDraft: ToothlightCreationDraft = {
        ...draft,
        sourceMode,
        originalImageUrl,
        enhancedImageUrl: null,
        enhancementStyle: null,
        drawingLayerImageUrl: null,
        sealed: false,
        savedToothlightId: null,
        shareUrl: null,
      }
      logToothlightClientEvent('source_added', { source, sourceMode })
      await persistAndGo(nextDraft, FLOW_ROUTES['parent-check'])
    } catch {
      setMessage('That image could not be prepared. Try a different photo.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDrawDone(dataUrl: string, layers?: LayeredDrawingExport) {
    setBusy(true)
    try {
      const originalImageUrl = await normalizeImageDataUrl(dataUrl)
      const drawingLayerImageUrl = layers?.drawingLayerDataUrl
        ? await normalizeTransparentImageDataUrl(layers.drawingLayerDataUrl)
        : null
      const nextDraft: ToothlightCreationDraft = {
        ...draft,
        sourceMode: 'draw_on_screen',
        originalImageUrl,
        enhancedImageUrl: null,
        enhancementStyle: null,
        drawingLayerImageUrl,
        sealed: false,
        savedToothlightId: null,
        shareUrl: null,
      }
      logToothlightClientEvent('source_added', { source: 'drawing', sourceMode: 'draw_on_screen' })
      await persistAndGo(nextDraft, FLOW_ROUTES['parent-check'])
    } catch {
      setMessage('That drawing could not be prepared. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function continueWithGoogle() {
    if (!hasOriginalImage) {
      router.push(FLOW_ROUTES.start)
      return
    }

    const localPreviewAuth = isLocalToothlightPreviewHost()
    logToothlightClientEvent('auth_started', {
      provider: 'google',
      returnTo: parentReturnTo,
      mode: localPreviewAuth ? 'local-preview' : 'oauth',
    })
    logToothlightClientEvent('google_parent_auth', {
      provider: 'google',
      returnTo: parentReturnTo,
      mode: localPreviewAuth ? 'local-preview' : 'oauth',
    })

    if (localPreviewAuth) {
      const nextDraft = { ...draft, parentAuthStatus: 'signed_in' as const }
      await persistAndGo(nextDraft, parentReturnTo)
      return
    }

    await saveToothlightDraftToBrowser(draft)
    window.location.assign(buildToothlightParentAuthUrl(parentReturnTo))
  }

  async function makeToothlight() {
    if (!draft.originalImageUrl) {
      router.push(FLOW_ROUTES.start)
      return
    }

    if (!isParentSignedIn) {
      router.push(FLOW_ROUTES['parent-check'])
      return
    }

    setBusy(true)
    setMessage(isPhotoSource ? 'Saving this photo as a Toothlight.' : 'Tanda is lighting the memory.')
    try {
      const enhancementStyle: EnhancementStyle = draft.sourceMode === 'start_with_photo' ? 'original' : selectedGlow.id
      const treatment = TOOTHLIGHT_GLOW_OPTIONS.find((option) => option.id === enhancementStyle) ?? PHOTO_GLOW_OPTION
      logToothlightClientEvent('ai_render_started', {
        treatmentId: treatment.treatmentId,
        mode: enhancementStyle,
      })
      const enhancedImageUrl =
        enhancementStyle === 'original'
          ? null
          : await createEnhancedToothlightImage({
              originalImageUrl: draft.originalImageUrl,
              enhancementStyle,
              treatmentId: treatment.treatmentId,
              title: draft.toothlightName,
            })
      const nextDraft: ToothlightCreationDraft = {
        ...draft,
        enhancementStyle,
        enhancedImageUrl,
        sealed: false,
      }
      logToothlightClientEvent('ai_render_completed', {
        treatmentId: treatment.treatmentId,
        mode: enhancementStyle,
      })
      await persistAndGo(nextDraft, FLOW_ROUTES.story)
    } catch {
      setMessage('The Toothlight is not ready. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function saveStory() {
    const childStoryText = draft.childStoryText?.trim() ?? ''
    const childStorySummary = createStorySummary(childStoryText, childName)
    const nextDraft = {
      ...draft,
      childStoryText,
      childStorySummary,
      toothlightName: draft.toothlightName.trim() || DEFAULT_TOOTHLIGHT_NAME,
      childName,
    }
    logToothlightClientEvent('story_completed', {
      storyLength: childStoryText.length,
      hasChildName: Boolean(childName),
    })
    await persistAndGo(nextDraft, FLOW_ROUTES.preview)
  }

  async function parentTurn() {
    const nextDraft = {
      ...draft,
      childStorySummary: createStorySummary(draft.childStoryText ?? '', childName),
    }
    await persistAndGo(nextDraft, FLOW_ROUTES['parent-note'])
  }

  async function saveParentNote() {
    logToothlightClientEvent('parent_note_saved', {
      noteLength: draft.parentNote?.trim().length ?? 0,
      unlockAge: draft.unlockAge,
      hasCustomUnlockDate: Boolean(draft.customUnlockDate),
    })
    await persistAndGo(draft, FLOW_ROUTES.seal)
  }

  async function sealToothlight() {
    if (!isParentSignedIn) {
      router.push(`/toothlight/parent-check?${PARENT_GATE_RETURN_TO_SEAL}`)
      return
    }
    if (!draft.originalImageUrl) {
      router.push(FLOW_ROUTES.start)
      return
    }

    setBusy(true)
    setMessage('')
    logToothlightClientEvent('save_clicked', {
      sourceMode: draft.sourceMode,
      giftStatus: draft.giftSelected ? 'planned_only' : 'none',
    })
    logToothlightClientEvent('save_attempted', {
      sourceMode: draft.sourceMode,
      giftStatus: draft.giftSelected ? 'planned_only' : 'none',
    })
    const finalImageUrl = draft.enhancedImageUrl ?? draft.originalImageUrl
    const payload = {
      childName: childName,
      toothName: draft.toothlightName.trim() || DEFAULT_TOOTHLIGHT_NAME,
      caption: draft.childStoryText?.trim() || 'A small tooth became a bright memory.',
      sourceImageSrc: draft.originalImageUrl,
      artworkImageSrc: draft.sourceMode === 'draw_on_screen' ? draft.originalImageUrl : null,
      drawingLayerImageSrc: draft.drawingLayerImageUrl,
      renderedImageSrc: finalImageUrl,
      aiRenderedImageSrc: draft.enhancedImageUrl,
      glowId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      treatmentId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      treatmentVersion: LIGHT_STYLE_VERSION,
    }

    try {
      const response = await fetch('/api/toothlight/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await readSaveResponse(response)

      if (!response.ok) {
        if (isParentAuthRequired(response.status)) {
          if (!isLocalToothlightPreviewHost()) {
            updateDraft({ parentAuthStatus: 'anonymous' })
            router.push(`/toothlight/parent-check?${PARENT_GATE_RETURN_TO_SEAL}`)
            return
          }
          await completeLocalSeal(finalImageUrl)
          return
        }
        throw new Error(result.error || 'Save is not ready yet.')
      }

      await completeSeal({
        toothlightId: result.toothlightId ?? createLocalToothlightId(),
        shareUrl: result.shareUrl ?? `/toothlight/t/${result.toothlightId ?? 'demo-toothlight'}`,
        finalImageUrl,
      })
    } catch (error) {
      if (isLocalToothlightPreviewHost()) {
        await completeLocalSeal(finalImageUrl)
        return
      }
      setMessage(error instanceof Error ? error.message : 'Save is not ready yet.')
    } finally {
      setBusy(false)
    }
  }

  async function completeLocalSeal(finalImageUrl: string) {
    const toothlightId = createLocalToothlightId()
    await completeSeal({
      toothlightId,
      shareUrl: `/toothlight/t/${toothlightId}`,
      finalImageUrl,
    })
  }

  async function completeSeal({
    toothlightId,
    shareUrl,
    finalImageUrl,
  }: {
    toothlightId: string
    shareUrl: string
    finalImageUrl: string
  }) {
    const nextDraft = {
      ...draft,
      sealed: true,
      savedToothlightId: toothlightId,
      shareUrl,
    }
    saveLocalToothlight({
      toothlightId,
      childName,
      toothName: draft.toothlightName.trim() || DEFAULT_TOOTHLIGHT_NAME,
      caption: draft.childStoryText?.trim() || 'A small tooth became a bright memory.',
      imageSrc: finalImageUrl,
      sourceImageSrc: draft.originalImageUrl,
      artworkImageSrc: draft.sourceMode === 'draw_on_screen' ? draft.originalImageUrl : null,
      drawingLayerImageSrc: draft.drawingLayerImageUrl,
      renderedImageSrc: finalImageUrl,
      aiRenderedImageSrc: draft.enhancedImageUrl,
      glowId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      treatmentId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      treatmentVersion: LIGHT_STYLE_VERSION,
      shareUrl,
      savedAt: new Date().toISOString(),
    })
    saveLocalFutureNote({
      toothlightId,
      status: 'sealed',
      unlockAge: typeof draft.unlockAge === 'number' ? draft.unlockAge : 18,
      sealedPreviewText: draft.parentNote?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    })
    logToothlightClientEvent('save_completed', {
      toothlightId,
      treatmentId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      giftSelected: draft.giftSelected,
    })
    logToothlightClientEvent('save_succeeded', {
      toothlightId,
      treatmentId: getTreatmentForEnhancement(draft.enhancementStyle).id,
    })
    logToothlightClientEvent('toothlight_sealed', {
      toothlightId,
      treatmentId: getTreatmentForEnhancement(draft.enhancementStyle).id,
      giftStatus: draft.giftSelected ? 'planned_only' : 'none',
    })
    await persistAndGo(nextDraft, FLOW_ROUTES.saved)
  }

  const hiddenInputs = (
    <>
      <input
        ref={cameraInputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        capture="environment"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => handleFileInput(event, 'camera')}
      />
      <input
        ref={libraryInputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => handleFileInput(event, 'library')}
      />
    </>
  )

  if (step === 'draw') {
    return (
      <>
        {hiddenInputs}
        <DrawingCanvasV2
          onDone={(dataUrl, layers) => {
            void handleDrawDone(dataUrl, layers)
          }}
          onBack={() => router.push(FLOW_ROUTES['create-source'])}
          styleAccent={getRecommendedLightStyle().brushAccent}
          styleSecondaryAccent={getRecommendedLightStyle().brushSecondaryAccent}
          styleName="Draw your Toothlight"
        />
      </>
    )
  }

  return (
    <div className={styles.shell} data-step={step}>
      {hiddenInputs}
      <header className={styles.topbar}>
        <Link href="/toothlight" className={styles.brand}>
          Toothlight
        </Link>
        <span>{progress}</span>
      </header>
      <main className={styles.frame}>{renderStep()}</main>
    </div>
  )

  function renderStep() {
    if (step === 'start') {
      return (
        <FlowScreen
          eyebrow="Toothlight"
          title="Start a Toothlight"
          body="Turn a tooth photo, drawing, or child story into a future asset they can grow into."
          media={<ProductImage treatmentId="golden-locket" imageSrc={draft.originalImageUrl} />}
          hideActions
        >
          <div className={styles.choiceStack}>
            <ChoiceButton
              title="I made a drawing at school"
              subtitle="Use the finished artwork."
              symbol="draw"
              onClick={() => chooseStart('school_drawing')}
            />
            <ChoiceButton
              title="I want to create one now"
              subtitle="Draw or start with a photo."
              symbol="photo"
              onClick={() => chooseStart('create_now')}
            />
          </div>
        </FlowScreen>
      )
    }

    if (step === 'add-school-drawing') {
      return (
        <FlowScreen
          eyebrow="Toothlight"
          title=""
          body=""
          hideCopy
          media={<MemoryImage imageSrc={draft.originalImageUrl} emptyLabel="Tap to frame drawing" />}
          primaryLabel={draft.originalImageUrl ? 'Use this drawing' : 'Take photo'}
          primaryAction={draft.originalImageUrl ? () => router.push(FLOW_ROUTES['parent-check']) : openCamera}
          secondaryLabel={draft.originalImageUrl ? 'Retake' : 'Upload from photos'}
          secondaryAction={draft.originalImageUrl ? openCamera : openLibrary}
          trustLine="Original stays saved."
        />
      )
    }

    if (step === 'create-source') {
      return (
        <FlowScreen
          eyebrow="Toothlight"
          title="Create from scratch"
          body=""
          media={<ProductImage treatmentId="rainbow-room" imageSrc={draft.originalImageUrl} />}
          primaryLabel="Continue"
          primaryAction={continueCreateSource}
          primaryDisabled={draft.sourceMode !== 'draw_on_screen' && draft.sourceMode !== 'start_with_photo'}
        >
          <div className={styles.choiceStack}>
            <ChoiceButton
              title="Draw on screen"
              subtitle="Open a blank canvas."
              symbol="pencil"
              onClick={() => chooseCreateSource('draw_on_screen')}
            />
            <ChoiceButton
              title="Start with a photo"
              subtitle="Use the tooth moment."
              symbol="camera"
              onClick={() => chooseCreateSource('start_with_photo')}
            />
          </div>
        </FlowScreen>
      )
    }

    if (step === 'add-photo') {
      return (
        <FlowScreen
          eyebrow="Toothlight"
          title="Add a photo"
          body=""
          media={<MemoryImage imageSrc={draft.originalImageUrl} emptyLabel="Tap to focus" />}
          primaryLabel={draft.originalImageUrl ? 'Use this photo' : 'Take photo'}
          primaryAction={draft.originalImageUrl ? () => router.push(FLOW_ROUTES['parent-check']) : openCamera}
          secondaryLabel={draft.originalImageUrl ? 'Retake' : 'Choose from photos'}
          secondaryAction={draft.originalImageUrl ? openCamera : openLibrary}
        />
      )
    }

    if (step === 'parent-check') {
      return (
        <FlowScreen
          eyebrow="Parent step"
          title=""
          body=""
          hideCopy
          media={null}
          primaryLabel={isParentSignedIn ? 'Continue' : 'Sign in with Google'}
          primaryAction={isParentSignedIn ? () => router.push(parentReturnTo) : () => void continueWithGoogle()}
          hideActions
          trustLine="No cost to create and preserve your Toothlight."
          subTrustLine="Solana minting and wallet gifts are available in the live network path when you are ready to test ownership."
        >
          <div className={styles.authPanel} aria-label="Parent sign-in options">
            <div className={styles.authIntro}>
              <strong>Save with a parent</strong>
            </div>
            <button type="button" className={styles.authButton} onClick={() => void continueWithGoogle()}>
              <span>G</span>
              <strong>Sign in with Google</strong>
            </button>
            <Link href="/toothfairy/app?from=toothlight-parent-check" className={styles.authButton}>
              <span>S</span>
              <strong>Advanced Solana path</strong>
              <small>Advanced wallet and mint path</small>
            </Link>
          </div>
        </FlowScreen>
      )
    }

    if (step === 'glow') {
      if (isPhotoSource) {
        return (
          <FlowScreen
            eyebrow="Parent signed in"
            title="Create Toothlight"
            body="Keep the photo as the memory."
            media={<MemoryImage imageSrc={draft.originalImageUrl} emptyLabel="Toothlight" />}
            primaryLabel={busy ? 'Creating Toothlight' : 'Create Toothlight using this photo'}
            primaryAction={() => void makeToothlight()}
            primaryDisabled={busy}
            trustLine="No filter is added to photos in this preview."
          >
            {message && <p className={styles.message}>{message}</p>}
          </FlowScreen>
        )
      }

      return (
        <FlowScreen
          eyebrow="Parent signed in"
          title="Create a Toothlight"
          body="Choose a light touch for the drawing."
          media={<MemoryImage imageSrc={finalImageUrl} treatmentId={selectedGlow.treatmentId} emptyLabel="Add the first piece" />}
          primaryLabel={busy ? 'Creating Toothlight' : 'Create Toothlight'}
          primaryAction={() => void makeToothlight()}
          primaryDisabled={busy}
          trustLine="The original stays saved."
        >
          <div className={styles.glowChoices} aria-label="Choose Toothlight glow">
            {DRAWING_GLOW_OPTIONS.map((option) => {
              const treatment = getLightStyle(option.treatmentId)
              return (
                <button
                  key={option.id}
                  type="button"
                  className={styles.glowChoice}
                  data-selected={selectedGlowId === option.id}
                  onClick={() => updateDraft({ enhancementStyle: option.id })}
                >
                  <span className={styles.glowThumb}>
                    <img src={treatment.objectImageSrc} alt="" />
                  </span>
                  <strong>{option.title}</strong>
                  <small>{option.subtitle}</small>
                </button>
              )
            })}
          </div>
          {message && <p className={styles.message}>{message}</p>}
        </FlowScreen>
      )
    }

    if (step === 'story') {
      return (
        <FlowScreen
          eyebrow="Toothlight"
          title="Tell the story"
          body="What happened when the tooth came out?"
          media={<MemoryImage imageSrc={finalImageUrl} treatmentId={imageTreatmentId} emptyLabel="Toothlight" />}
          primaryLabel="Save my words"
          primaryAction={() => void saveStory()}
        >
          <div className={styles.inlineFields}>
            <label>
              <span>Child</span>
              <input
                value={draft.childName ?? ''}
                onChange={(event) => updateDraft({ childName: event.target.value })}
                placeholder="Kai"
              />
            </label>
            <label>
              <span>Name</span>
              <input
                value={draft.toothlightName}
                onChange={(event) => updateDraft({ toothlightName: event.target.value })}
                placeholder={DEFAULT_TOOTHLIGHT_NAME}
              />
            </label>
          </div>
          <VoiceAssistField
            label="Child story"
            value={draft.childStoryText ?? ''}
            onChange={(childStoryText) => updateDraft({ childStoryText })}
            placeholder="Once upon a time..."
            rows={4}
            voicePrompt="Tap to start recording your magical adventure."
            successMessage="Saved. You can edit it."
            transcribingMessage="Writing your story..."
          />
          <div className={styles.promptChips} aria-label="Story prompts">
            {['My tooth fell out when...', 'My drawing shows...', 'I want to remember...'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => updateDraft({ childStoryText: joinPrompt(draft.childStoryText, prompt) })}
              >
                {prompt}
              </button>
            ))}
          </div>
        </FlowScreen>
      )
    }

    if (step === 'preview') {
      return (
        <FlowScreen
          eyebrow=""
          title=""
          body=""
          hideCopy
          media={<MemoryCard draft={draft} imageSrc={finalImageUrl} treatmentId={imageTreatmentId} />}
          primaryLabel="Parent turn"
          primaryAction={() => void parentTurn()}
          secondaryLabel="Edit words"
          secondaryAction={() => router.push(FLOW_ROUTES.story)}
        >
          <div className={styles.previewOnlyStory}>
            <label>
              <span>Story</span>
              <textarea
                value={draft.childStoryText ?? ''}
                onChange={(event) => updateDraft({ childStoryText: event.target.value })}
                rows={3}
              />
            </label>
          </div>
        </FlowScreen>
      )
    }

    if (step === 'parent-note') {
      return (
        <FlowScreen
          eyebrow="For later"
          title="Future note"
          body="Write the message your child can receive around their 10th birthday, or whenever you decide they are ready."
          media={<ProductImage treatmentId="family-lantern" imageSrc={finalImageUrl} />}
          primaryLabel="Save note"
          primaryAction={() => void saveParentNote()}
        >
          <VoiceAssistField
            label="Note"
            value={draft.parentNote ?? ''}
            onChange={(parentNote) => updateDraft({ parentNote })}
            placeholder="What do you want to say then?"
            rows={4}
            voicePrompt="Say the note for later."
            successMessage="Note ready."
            transcribingMessage="Writing the note..."
          />
          <div className={styles.unlockBlock}>
            <span>Time-lock for age</span>
            <div className={styles.chipRow}>
              {UNLOCK_AGES.map((age) => (
                <button
                  key={String(age)}
                  type="button"
                  data-selected={draft.unlockAge === age}
                  onClick={() => updateDraft({ unlockAge: age })}
                >
                  {age === 'custom' ? 'Custom' : age}
                </button>
              ))}
            </div>
            {draft.unlockAge === 'custom' && (
              <input
                type="date"
                value={draft.customUnlockDate ?? ''}
                onChange={(event) => updateDraft({ customUnlockDate: event.target.value })}
              />
            )}
          </div>
        </FlowScreen>
      )
    }

    if (step === 'seal') {
      return (
        <FlowScreen
          eyebrow="Parent signed in"
          title="Seal it"
          body="Save the Toothlight now. Add or invite gifts when the payment path is ready for your family."
          media={<MemoryImage imageSrc={finalImageUrl} treatmentId={imageTreatmentId} emptyLabel="Toothlight" />}
          primaryLabel={busy ? 'Sealing Toothlight' : 'Seal Toothlight'}
          primaryAction={() => void sealToothlight()}
          primaryDisabled={busy}
          trustLine="Parent-controlled. Solana-backed ownership layer."
        >
          <div className={styles.sealChoices}>
            <ChoiceButton
              title="Seal only"
              subtitle="Save the memory, story, and note."
              symbol="lock"
              selected={!draft.giftSelected}
              onClick={() => updateDraft({ giftSelected: false, giftAmountUsd: null })}
            />
            <ChoiceButton
              title="Gift later"
              subtitle="Keep the Smile Fund as the future layer."
              symbol="gift"
              selected={draft.giftSelected}
              onClick={() => updateDraft({ giftSelected: true, giftAmountUsd: draft.giftAmountUsd ?? 25 })}
            />
          </div>
          {draft.giftSelected && (
            <div className={styles.giftBlock}>
              <span>Select gift amount</span>
              <div className={styles.chipRow}>
                {GIFT_AMOUNTS.map((amount) => (
                  <button
                    key={String(amount)}
                    type="button"
                    data-selected={
                      amount === 'custom'
                        ? draft.giftAmountUsd !== null && ![10, 25, 50].includes(draft.giftAmountUsd)
                        : draft.giftAmountUsd === amount
                    }
                    onClick={() => updateDraft({ giftAmountUsd: amount === 'custom' ? 75 : amount })}
                  >
                    {amount === 'custom' ? 'Custom' : `$${amount}`}
                  </button>
                ))}
              </div>
              <small>Gift selection is a planning step until the on-ramp is ready.</small>
            </div>
          )}
          {message && <p className={styles.message}>{message}</p>}
        </FlowScreen>
      )
    }

    return (
      <FlowScreen
        eyebrow="Toothlight"
        title="Saved"
        body="The Toothlight is saved. Family can add love, and the learning track can grow around it."
        media={<MemoryImage imageSrc={finalImageUrl} treatmentId={imageTreatmentId} emptyLabel="Toothlight saved" />}
        primaryLabel="View Toothlight"
        primaryAction={() => router.push(draft.shareUrl ?? '/toothlight/t/demo-toothlight')}
        secondaryLabel="Invite family"
        secondaryAction={() => {
          logToothlightClientEvent('invite_clicked', {
            toothlightId: draft.savedToothlightId,
            source: 'saved_flow',
          })
          router.push(`${draft.shareUrl ?? '/toothlight/t/demo-toothlight'}/family`)
        }}
        trustLine="Parent-controlled. Solana-backed ownership layer."
      >
        <p className={styles.savedCopy}>Toothlight sealed</p>
        <p className={styles.message}>This memory is safe and can wait for {childName}'s future self.</p>
      </FlowScreen>
    )
  }
}

function FlowScreen({
  eyebrow,
  title,
  body,
  hideCopy,
  hideActions,
  media,
  children,
  primaryLabel,
  primaryAction,
  primaryDisabled,
  secondaryLabel,
  secondaryAction,
  trustLine,
  subTrustLine,
}: {
  eyebrow: string
  title: string
  body: string
  hideCopy?: boolean
  hideActions?: boolean
  media: ReactNode
  children?: ReactNode
  primaryLabel?: string
  primaryAction?: () => void
  primaryDisabled?: boolean
  secondaryLabel?: string
  secondaryAction?: () => void
  trustLine?: string
  subTrustLine?: string
}) {
  return (
    <section className={styles.screen} data-hide-copy={hideCopy}>
      {!hideCopy && (title || body) && (
        <div className={styles.copy}>
          {title && <h1>{title}</h1>}
          {body && <p>{body}</p>}
        </div>
      )}
      {media && <div className={styles.mediaStage}>{media}</div>}
      {children && <div className={styles.content}>{children}</div>}
      {(trustLine || subTrustLine) && (
        <div className={styles.trustLines}>
          {trustLine && <span>{trustLine}</span>}
          {subTrustLine && <small>{subTrustLine}</small>}
        </div>
      )}
      {!hideActions && (
        <div className={styles.bottomBar}>
          {secondaryLabel && (
            <button type="button" className={styles.secondaryButton} onClick={secondaryAction}>
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={primaryAction}
              disabled={primaryDisabled || !primaryAction}
            >
              {primaryLabel}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

function ChoiceButton({
  title,
  subtitle,
  symbol,
  selected,
  onClick,
}: {
  title: string
  subtitle: string
  symbol: string
  selected?: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={styles.choiceButton} data-symbol={symbol} data-selected={selected} onClick={onClick}>
      <span aria-hidden="true" />
      <strong>{title}</strong>
      <small>{subtitle}</small>
    </button>
  )
}

function MemoryImage({
  imageSrc,
  treatmentId,
  emptyLabel,
}: {
  imageSrc: string | null
  treatmentId?: string
  emptyLabel: string
}) {
  const treatment = getLightStyle(treatmentId)
  return (
    <div
      className={styles.memoryImage}
      style={{
        ['--memory-accent' as string]: treatment.accent,
        ['--memory-secondary' as string]: treatment.secondaryAccent,
      }}
    >
      {imageSrc ? <img src={imageSrc} alt="" style={{ filter: treatmentId ? treatment.cssFilter : undefined }} /> : <span>{emptyLabel}</span>}
    </div>
  )
}

function ProductImage({ treatmentId, imageSrc }: { treatmentId: string; imageSrc?: string | null }) {
  const treatment = getLightStyle(treatmentId)
  return (
    <div className={styles.productImage}>
      <img src={imageSrc ?? treatment.objectImageSrc} alt="" />
    </div>
  )
}

function MemoryCard({
  draft,
  imageSrc,
  treatmentId,
}: {
  draft: ToothlightCreationDraft
  imageSrc: string | null
  treatmentId?: string
}) {
  const treatment = getLightStyle(treatmentId)
  return (
    <article className={styles.memoryCard}>
      <MemoryImage imageSrc={imageSrc} treatmentId={treatment.id} emptyLabel="Toothlight" />
      <div>
        <h2>{draft.toothlightName || DEFAULT_TOOTHLIGHT_NAME}</h2>
        <p>{formatDateLabel(draft.lostToothDate)}</p>
      </div>
    </article>
  )
}

function normalizeCreationDraft(stored: Partial<ToothlightCreationDraft> | null | undefined): ToothlightCreationDraft {
  const base = createDefaultDraft()
  if (!stored) return base
  return {
    ...base,
    ...stored,
    sourceMode:
      stored.sourceMode === 'school_drawing' ||
      stored.sourceMode === 'draw_on_screen' ||
      stored.sourceMode === 'start_with_photo'
        ? stored.sourceMode
        : base.sourceMode,
    originalImageUrl: stored.originalImageUrl ?? null,
    enhancedImageUrl: stored.enhancedImageUrl ?? null,
    enhancementStyle:
      stored.enhancementStyle === 'original' ||
      stored.enhancementStyle === 'soft_glow' ||
      stored.enhancementStyle === 'storybook_magic'
        ? stored.enhancementStyle
        : null,
    parentAuthStatus: stored.parentAuthStatus === 'signed_in' ? 'signed_in' : 'anonymous',
    unlockAge:
      stored.unlockAge === 10 || stored.unlockAge === 13 || stored.unlockAge === 18 || stored.unlockAge === 'custom'
        ? stored.unlockAge
        : base.unlockAge,
    giftSelected: Boolean(stored.giftSelected),
    giftAmountUsd: typeof stored.giftAmountUsd === 'number' ? stored.giftAmountUsd : null,
    sealed: Boolean(stored.sealed),
  }
}

function needsExistingVisual(step: ToothlightCreationStep) {
  return !['start', 'add-school-drawing', 'create-source', 'draw', 'add-photo'].includes(step)
}

function isReturningFromAuth(search: string) {
  const params = new URLSearchParams(search)
  return params.get('returning') === 'auth'
}

function getSafeReturnTo(value: string | null, fallback: string) {
  if (!value) return fallback
  return Object.values(FLOW_ROUTES).includes(value) ? value : fallback
}

function getProgress(step: ToothlightCreationStep) {
  const order = [
    'start',
    'add-school-drawing',
    'create-source',
    'draw',
    'add-photo',
    'parent-check',
    'glow',
    'story',
    'preview',
    'parent-note',
    'seal',
    'saved',
  ]
  const index = Math.max(0, order.indexOf(step))
  return `${Math.min(index + 1, 10)} of 10`
}

function getTreatmentForEnhancement(enhancementStyle: EnhancementStyle | null) {
  if (enhancementStyle === 'storybook_magic') return getLightStyle('storybook-velvet')
  if (enhancementStyle === 'soft_glow') return getLightStyle('golden-locket')
  return getRecommendedLightStyle()
}

function joinPrompt(current: string | null, prompt: string) {
  const cleaned = current?.trim()
  if (!cleaned) return prompt
  return `${cleaned} ${prompt}`
}

function createStorySummary(childStoryText: string, childName: string) {
  const cleaned = childStoryText.replace(/\s+/g, ' ').trim()
  if (!cleaned) return `${childName}'s tooth memory became a small Toothlight for later.`
  const sentence = cleaned.endsWith('.') || cleaned.endsWith('!') || cleaned.endsWith('?') ? cleaned : `${cleaned}.`
  return `${childName}'s Toothlight remembers: ${sentence}`.slice(0, 220)
}

function formatDateLabel(value: string) {
  if (!value) return 'Today'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

async function normalizeImageFile(file: File) {
  const dataUrl = await readFileAsDataUrl(file)
  return normalizeImageDataUrl(dataUrl)
}

async function normalizeImageDataUrl(dataUrl: string) {
  if (typeof document === 'undefined') return dataUrl
  const image = await loadCanvasImage(dataUrl)
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
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
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
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

async function createEnhancedToothlightImage({
  originalImageUrl,
  enhancementStyle,
  treatmentId,
  title,
}: {
  originalImageUrl: string
  enhancementStyle: EnhancementStyle
  treatmentId: string
  title: string
}) {
  if (typeof document === 'undefined') return originalImageUrl
  const treatment = getLightStyle(treatmentId)
  const image = await loadCanvasImage(originalImageUrl)
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 1125
  const context = canvas.getContext('2d')
  if (!context) return originalImageUrl

  const wash = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  wash.addColorStop(0, '#fffdf4')
  wash.addColorStop(0.5, treatment.accent)
  wash.addColorStop(1, treatment.secondaryAccent)
  context.fillStyle = wash
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.save()
  context.filter =
    enhancementStyle === 'storybook_magic'
      ? 'saturate(0.72) contrast(1.2) sepia(0.34) brightness(1.04)'
      : treatment.canvasFilter
  drawCoverImage(context, image, 58, 76, canvas.width - 116, 760)
  context.restore()
  drawGlowFrame(context, treatment, enhancementStyle)
  context.fillStyle = 'rgba(255,255,255,0.9)'
  context.fillRect(58, 870, canvas.width - 116, 190)
  context.fillStyle = '#17262a'
  context.font = '700 42px Georgia, serif'
  context.fillText(title.slice(0, 24), 88, 950)
  context.fillStyle = '#516469'
  context.font = '500 25px sans-serif'
  context.fillText(enhancementStyle === 'storybook_magic' ? 'Storybook magic' : 'Soft glow', 88, 1004)
  return canvas.toDataURL('image/jpeg', IMAGE_EXPORT_QUALITY)
}

function drawGlowFrame(
  context: CanvasRenderingContext2D,
  treatment: ReturnType<typeof getLightStyle>,
  enhancementStyle: EnhancementStyle,
) {
  context.save()
  context.globalCompositeOperation = 'screen'
  context.globalAlpha = enhancementStyle === 'storybook_magic' ? 0.62 : 0.5
  context.strokeStyle = treatment.secondaryAccent
  context.lineWidth = 16
  context.strokeRect(52, 70, context.canvas.width - 104, 770)
  context.globalAlpha = 0.28
  context.fillStyle = treatment.accent
  context.fillRect(52, 70, context.canvas.width - 104, 770)
  context.restore()
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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Image file could not be read.'))
    }
    reader.onerror = () => reject(new Error('Image file could not be read.'))
    reader.readAsDataURL(file)
  })
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

async function readSaveResponse(response: Response): Promise<SaveResponse> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json()
  return { error: await response.text().catch(() => 'Save is not ready yet.') }
}

function createLocalToothlightId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `local-${crypto.randomUUID()}`
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
