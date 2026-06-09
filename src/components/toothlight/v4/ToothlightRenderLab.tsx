'use client'

import type { ChangeEvent, PointerEvent } from 'react'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

import {
  getRenderLabMode,
  recommendedDecisionPath,
  renderLabDrawingLayer,
  renderLabGlobalRules,
  renderLabModes,
  renderLabRoadmap,
  renderLabSourceCandidates,
  renderRoundPlan,
  s24ReferenceFamilies,
  samplePhotoAsks,
  type ToothlightRenderModeId,
} from '@/lib/toothlight/render-lab'
import { callEnhance, type MagicStyleId } from '@/lib/toothfairy/enhance-client'
import styles from './ToothlightRenderLab.module.css'

type DrawingLayerProps = {
  interpreted?: boolean
}

type LocalUpload = {
  name: string
  dataUrl: string
}

type RenderStatus = {
  state: 'idle' | 'rendering' | 'done' | 'error'
  message: string
}

const providerStyleByMode: Record<ToothlightRenderModeId, MagicStyleId> = {
  'memory-polish': 'tanda-glow',
  'story-artifact': 'cartoon-3d',
  'future-glow': 'watercolor-memory',
  'smile-wish': 'storybook-ink',
}

export function ToothlightRenderLab() {
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [activeModeId, setActiveModeId] = useState(renderLabModes[1].id)
  const [activeSourceId, setActiveSourceId] = useState(renderLabSourceCandidates[0].id)
  const [localSource, setLocalSource] = useState<LocalUpload | null>(null)
  const [localDrawing, setLocalDrawing] = useState<LocalUpload | null>(null)
  const [hasCanvasInk, setHasCanvasInk] = useState(false)
  const [stagedRound, setStagedRound] = useState<string | null>(null)
  const [renderedImages, setRenderedImages] = useState<Partial<Record<ToothlightRenderModeId, string>>>({})
  const [renderStatus, setRenderStatus] = useState<RenderStatus>({
    state: 'idle',
    message: 'Choose a source, draw Input 2, then render the selected mode.',
  })
  const activeMode = useMemo(() => getRenderLabMode(activeModeId), [activeModeId])
  const activeSource = useMemo(
    () =>
      renderLabSourceCandidates.find((candidate) => candidate.id === activeSourceId) ??
      renderLabSourceCandidates[0],
    [activeSourceId],
  )
  const sourceImage = localSource?.dataUrl ?? activeSource.sourcePhoto
  const sourceLabel = localSource?.name ?? activeSource.label
  const isReadyToStage = Boolean(localSource && localDrawing)
  const isRendering = renderStatus.state === 'rendering'
  const selectedReference = s24ReferenceFamilies.find((family) =>
    activeMode.samsungReference.toLowerCase().includes(family.label.toLowerCase().split(' ')[0]),
  )

  function readLocalFile(
    event: ChangeEvent<HTMLInputElement>,
    setter: (upload: LocalUpload | null) => void,
  ) {
    const file = event.currentTarget.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter({ name: file.name, dataUrl: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  function handleLocalSourceUpload(event: ChangeEvent<HTMLInputElement>) {
    setStagedRound(null)
    readLocalFile(event, setLocalSource)
  }

  function handleLocalDrawingUpload(event: ChangeEvent<HTMLInputElement>) {
    setStagedRound(null)
    readLocalFile(event, setLocalDrawing)
  }

  function getCanvasPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = drawingCanvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  function drawCanvasLine(from: { x: number; y: number }, to: { x: number; y: number }) {
    const canvas = drawingCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    context.strokeStyle = '#d99a21'
    context.lineWidth = 14
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.stroke()
  }

  function publishCanvasDrawing() {
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    setLocalDrawing({ name: 'Live drawing layer', dataUrl: canvas.toDataURL('image/png') })
    setStagedRound(null)
  }

  function handleDrawingPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const point = getCanvasPoint(event)
    if (!point) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    isDrawingRef.current = true
    lastPointRef.current = point
    drawCanvasLine(point, point)
    setHasCanvasInk(true)
    setStagedRound(null)
  }

  function handleDrawingPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return
    const point = getCanvasPoint(event)
    const previousPoint = lastPointRef.current
    if (!point || !previousPoint) return

    event.preventDefault()
    drawCanvasLine(previousPoint, point)
    lastPointRef.current = point
  }

  function handleDrawingPointerUp(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return

    event.preventDefault()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    isDrawingRef.current = false
    lastPointRef.current = null
    publishCanvasDrawing()
  }

  function clearCanvasDrawing() {
    const canvas = drawingCanvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
    setHasCanvasInk(false)
    if (localDrawing?.name === 'Live drawing layer') {
      setLocalDrawing(null)
    }
    setStagedRound(null)
  }

  function loadImage(dataUrl: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Image could not be loaded.'))
      image.src = dataUrl
    })
  }

  async function createCompositionDataUrl(sourceDataUrl: string, drawingDataUrl: string) {
    const [source, drawing] = await Promise.all([
      loadImage(sourceDataUrl),
      loadImage(drawingDataUrl),
    ])
    const canvas = document.createElement('canvas')
    const size = 1024
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Composition canvas is unavailable.')

    context.fillStyle = '#fbf7ec'
    context.fillRect(0, 0, size, size)

    const scale = Math.max(size / source.width, size / source.height)
    const drawWidth = source.width * scale
    const drawHeight = source.height * scale
    context.drawImage(source, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight)
    context.drawImage(drawing, 0, 0, size, size)

    return canvas.toDataURL('image/jpeg', 0.88)
  }

  function stageRenderRound() {
    if (!isReadyToStage) return
    setStagedRound(`${activeMode.targetName} from ${localSource?.name} + ${localDrawing?.name}`)
  }

  async function renderSelectedMode() {
    if (!localSource || !localDrawing || isRendering) return

    setRenderStatus({
      state: 'rendering',
      message: `Rendering ${activeMode.targetName}. This can take up to a minute.`,
    })

    try {
      const compositionImageDataUrl = await createCompositionDataUrl(
        localSource.dataUrl,
        localDrawing.dataUrl
      )
      const promptOverride = [
        activeMode.prompt,
        `Hard rejection rules: ${activeMode.negativePrompt}`,
        'The output must be a real whole-image AI transformation. It must not look like the source photo with a drawing overlay.',
      ].join(' ')
      const outcome = await callEnhance({
        drawingDataUrl: compositionImageDataUrl,
        sourceImageDataUrl: localSource.dataUrl,
        drawingLayerDataUrl: localDrawing.dataUrl,
        compositionImageDataUrl,
        tradition: 'default',
        charms: ['sparkle', 'glow', 'magic'],
        style: providerStyleByMode[activeMode.id],
        promptOverride,
      })

      if (!outcome.ok) {
        setRenderStatus({
          state: 'error',
          message: outcome.detail ?? `Render failed: ${outcome.error}`,
        })
        return
      }

      setRenderedImages((current) => ({
        ...current,
        [activeMode.id]: outcome.result.enhancedImageUrl,
      }))
      setRenderStatus({
        state: 'done',
        message: `Rendered ${activeMode.targetName} in ${Math.round(outcome.result.generationMs / 1000)}s.`,
      })
    } catch (error) {
      setRenderStatus({
        state: 'error',
        message: error instanceof Error ? error.message : 'Render failed.',
      })
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/toothlight" className={styles.brand} aria-label="Back to Toothlight">
          <span aria-hidden="true">TFN</span>
          Toothlight Render Lab
        </Link>
        <nav className={styles.nav} aria-label="Render lab routes">
          <Link href="/toothlight/make">Make</Link>
          <Link href="/toothlight/filter-lab">Filter lab</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-label="Render lab overview">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Controlled render approval</p>
          <h1>Compare a plain source, a child drawing layer, and real render targets.</h1>
          <p className={styles.lede}>
            The goal is not to admire this page. The goal is to load one clean source,
            one drawing layer, pick a serious target, and get to a real render decision
            inside the hour.
          </p>
        </div>

        <div className={styles.modeSelector} aria-label="Choose render mode">
          {renderLabModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={mode.id === activeMode.id ? styles.activeMode : styles.modeButton}
              aria-pressed={mode.id === activeMode.id}
              onClick={() => setActiveModeId(mode.id)}
            >
              <span>{mode.shortLabel}</span>
              <strong>{mode.label}</strong>
              <small>{mode.targetName}</small>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.roadmapSection} aria-label="Next hour roadmap">
        <div className={styles.primaryDecision}>
          <div className={styles.roadmapKicker}>
            <span>Next hour roadmap</span>
            <strong>Start here</strong>
          </div>
          <h2>Story Artifact / 3D Toothlight Charm is the first serious test.</h2>
          <p>
            Memory Polish stays beside it as the trust control. Future Glow and Smile
            Wish are second-pass candidates unless the first two fail emotionally.
          </p>
        </div>
        <div className={styles.roadmapGrid}>
          {renderLabRoadmap.map((item) => (
            <article key={item.time} className={styles.roadmapCard}>
              <span>{item.time}</span>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>Your job</dt>
                  <dd>{item.yourJob}</dd>
                </div>
                <div>
                  <dt>My job</dt>
                  <dd>{item.myJob}</dd>
                </div>
              </dl>
              <strong>{item.output}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.usagePanel} aria-label="How to use the render lab">
        <div className={styles.usageCopy}>
          <p className={styles.eyebrow}>How to use this</p>
          <h2>You do not run prompts manually.</h2>
          <p>
            This page is the staging bench. You choose the clean photo, choose the
            drawing layer, pick the render mode, then stage the round. I run or wire the
            provider generation after that; the cards on the right are waiting slots,
            not generated finals.
          </p>
        </div>
        <div className={styles.stagePanel}>
          <div className={styles.stageChecks}>
            <span data-ready={Boolean(localSource)}>1. Source {localSource ? 'loaded' : 'needed'}</span>
            <span data-ready={Boolean(localDrawing)}>2. Drawing {localDrawing ? 'loaded' : 'needed'}</span>
            <span data-ready>3. Mode: {activeMode.targetName}</span>
          </div>
          <button
            type="button"
            className={styles.stageButton}
            disabled={!isReadyToStage}
            onClick={stageRenderRound}
          >
            Stage render round
          </button>
          <button
            type="button"
            className={styles.renderButton}
            disabled={!isReadyToStage || isRendering}
            onClick={renderSelectedMode}
          >
            {isRendering ? 'Rendering...' : 'Render selected mode'}
          </button>
          <p className={styles.stageStatus}>
            {renderStatus.state !== 'idle'
              ? renderStatus.message
              : stagedRound
              ? `Ready for Codex/provider generation: ${stagedRound}`
              : isReadyToStage
                ? 'Ready. Stage for review, or render the selected mode now.'
                : 'Load a local source photo and local drawing layer first.'}
          </p>
        </div>
      </section>

      <section className={styles.approvalFlow} aria-label="Controlled approval flow">
        {renderRoundPlan.map((step) => (
          <article key={step.step}>
            <span>{step.step}</span>
            <strong>{step.title}</strong>
            <small>{step.status}</small>
            <p>{step.decision}</p>
          </article>
        ))}
      </section>

      <section className={styles.comparisonGrid} aria-label="Render lab side-by-side comparison">
        <article className={styles.sourcePhoto} aria-label="Source photo">
          <PanelHeading kicker="Input 1" title="Source photo" />
          <div className={styles.sourceSelector} aria-label="Choose source candidate">
            {renderLabSourceCandidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                className={candidate.id === activeSource.id ? styles.activeSource : styles.sourceButton}
                aria-pressed={candidate.id === activeSource.id}
                onClick={() => {
                  setActiveSourceId(candidate.id)
                  setLocalSource(null)
                }}
              >
                <span>{candidate.shortLabel}</span>
                <strong>{candidate.label}</strong>
              </button>
            ))}
          </div>
          <label className={styles.uploadControl}>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLocalSourceUpload} />
            <span>Local plain JPG</span>
            <strong>{localSource ? localSource.name : 'Choose source'}</strong>
          </label>
          <div className={styles.photoFrame}>
            <img src={sourceImage} alt={localSource ? 'Local plain source preview' : activeSource.sourceAlt} />
          </div>
          <dl className={styles.metaList}>
            <div>
              <dt>{localSource ? 'Local source' : activeSource.plainSource ? 'Plain source' : 'Source status'}</dt>
              <dd>{localSource ? 'Loaded in this browser only. It is not saved or attached to the Make flow.' : activeSource.sourceStatus}</dd>
            </div>
            <div>
              <dt>Must keep</dt>
              <dd>{activeSource.mustKeep}</dd>
            </div>
            <div>
              <dt>Photo ask</dt>
              <dd>{activeSource.replacementAsk}</dd>
            </div>
          </dl>
        </article>

        <article className={styles.drawingLayer} aria-label="Drawing layer">
          <PanelHeading kicker="Input 2" title="Drawing layer" />
          <div className={styles.drawPad}>
            <div>
              <strong>Draw directly here</strong>
              <p>Use your finger, mouse, or stylus. This becomes Input 2.</p>
            </div>
            <canvas
              ref={drawingCanvasRef}
              className={styles.drawCanvas}
              width={900}
              height={900}
              aria-label="Live drawing layer canvas"
              onPointerDown={handleDrawingPointerDown}
              onPointerMove={handleDrawingPointerMove}
              onPointerUp={handleDrawingPointerUp}
              onPointerCancel={handleDrawingPointerUp}
              onPointerLeave={handleDrawingPointerUp}
            />
            <div className={styles.drawActions}>
              <button type="button" className={styles.drawButton} disabled={!hasCanvasInk} onClick={publishCanvasDrawing}>
                Use this drawing
              </button>
              <button type="button" className={styles.clearButton} onClick={clearCanvasDrawing}>
                Clear drawing
              </button>
            </div>
          </div>
          <label className={styles.uploadControl}>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLocalDrawingUpload} />
            <span>Local drawing layer upload</span>
            <strong>{localDrawing ? localDrawing.name : 'Choose saved drawing'}</strong>
          </label>
          <div className={styles.drawingFrame}>
            {localDrawing ? (
              <img className={styles.drawingUpload} src={localDrawing.dataUrl} alt="Local drawing layer preview" />
            ) : (
              <ChildDrawingLayer />
            )}
          </div>
          <p>{localDrawing ? localDrawing.name : renderLabDrawingLayer.drawingName}</p>
          <small>{renderLabDrawingLayer.sourceRule}</small>
          <small>{activeMode.drawingRead}</small>
        </article>

        <article className={styles.promptPanel} aria-label="Render prompt">
          <PanelHeading kicker={activeMode.label} title={activeMode.targetName} />
          <p className={styles.intent}>{activeMode.intent}</p>
          <div className={styles.modeFacts}>
            <span>{activeMode.samsungReference}</span>
            <span>Identity risk: {activeMode.identityRisk}</span>
          </div>
          <div className={styles.promptContract}>
            <strong>Material target</strong>
            <p>{activeMode.materialChangeTarget}</p>
          </div>
          <details className={styles.promptDetails}>
            <summary>Full prompt and rejection rules</summary>
            <div className={styles.promptBox}>{activeMode.prompt}</div>
            <div className={styles.rejectBox}>
              <strong>Reject</strong>
              <p>{activeMode.negativePrompt}</p>
            </div>
          </details>
        </article>

        <article className={styles.finalPanel} aria-label="Final image">
          <PanelHeading kicker="Output" title="Generate real round" />
          <div className={styles.cssWarning}>
            <strong>No final image yet</strong>
            <p>
              Current CSS mock: rejected. These are waiting slots for the real render
              round. Click a slot to pick the mode; do not judge it as an output image.
            </p>
          </div>
          <div className={styles.renderModeOutputGrid}>
            {renderLabModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={styles.outputOption}
                aria-pressed={mode.id === activeMode.id}
                onClick={() => setActiveModeId(mode.id)}
              >
                <span className={styles.finalImage} data-mode={mode.id}>
                  {renderedImages[mode.id] ? (
                    <img
                      className={styles.renderResultImage}
                      src={renderedImages[mode.id]}
                      alt={`Rendered ${mode.label} result`}
                    />
                  ) : (
                    <span className={styles.queueSlot}>
                      <span>No final image yet</span>
                      <strong>Waiting for real render</strong>
                      <small>{mode.providerStyleHint}</small>
                    </span>
                  )}
                  <span className={styles.notFinalBadge}>
                    {renderedImages[mode.id] ? 'Rendered' : 'Queued'}
                  </span>
                </span>
                <strong>{mode.targetName}</strong>
                <small>{mode.label}</small>
              </button>
            ))}
          </div>
          <dl className={styles.metaList}>
            <div>
              <dt>Selected source</dt>
              <dd>{sourceLabel}</dd>
            </div>
            <div>
              <dt>Selected transform</dt>
              <dd className={styles.transformSignature}>{activeMode.transformSignature}</dd>
            </div>
            <div>
              <dt>Approval question</dt>
              <dd>{activeMode.approvalQuestion}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className={styles.referenceBoard} aria-label="Samsung S24 reference families">
        <div className={styles.reviewIntro}>
          <p className={styles.eyebrow}>S24 benchmark</p>
          <h2>Use these as transformation families, not as pasted style labels.</h2>
        </div>
        <div className={styles.referenceGrid}>
          {s24ReferenceFamilies.map((family) => (
            <article
              key={family.id}
              className={
                selectedReference?.id === family.id ? styles.activeReferenceCard : styles.referenceCard
              }
            >
              <span>{family.samsungStyles}</span>
              <h3>{family.label}</h3>
              <p>{family.observedPattern}</p>
              <strong>Toothlight use</strong>
              <p>{family.toothlightUse}</p>
              <small>{family.rejectIf}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.recommendationBand} aria-label="Current recommendation">
        <div className={styles.reviewIntro}>
          <p className={styles.eyebrow}>Current recommendation</p>
          <h2>Start with Story Artifact, then use Memory Polish as the trust/control lane.</h2>
        </div>
        <div className={styles.recommendationGrid}>
          {recommendedDecisionPath.map((item) => (
            <article key={item.title} className={styles.recommendationCard}>
              <span>{item.verdict}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.approvalRound} aria-label="Photo set for approval round">
        <div className={styles.reviewIntro}>
          <p className={styles.eyebrow}>Input set</p>
          <h2>Three or four plain originals are enough for the next real pass.</h2>
        </div>
        <div className={styles.photoAskGrid}>
          {samplePhotoAsks.map((ask) => (
            <article key={ask.id} className={styles.photoAskCard}>
              <h3>{ask.label}</h3>
              <p>{ask.why}</p>
              <small>{ask.requirements}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reviewBand} aria-label="Mode review">
        <div className={styles.reviewIntro}>
          <p className={styles.eyebrow}>Mode design</p>
          <h2>{activeMode.visualThesis}</h2>
        </div>
        <div className={styles.checkColumns}>
          <Checklist title="Preserve" items={activeMode.preservationRules} />
          <Checklist title="Evaluate" items={activeMode.evaluationChecks} />
          <Checklist title="Reject when" items={[activeMode.failureState]} />
          <Checklist title="Global rules" items={renderLabGlobalRules} />
        </div>
      </section>
    </main>
  )
}

function PanelHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className={styles.panelHeading}>
      <p>{kicker}</p>
      <h2>{title}</h2>
    </div>
  )
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <article className={styles.checklist}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function ChildDrawingLayer({ interpreted = false }: DrawingLayerProps) {
  return (
    <svg
      className={interpreted ? styles.interpretedMarks : styles.rawMarks}
      viewBox="0 0 420 420"
      role="img"
      aria-label={interpreted ? 'Interpreted drawing marks' : 'Transparent child drawing layer'}
    >
      <path className={styles.markSun} d="M70 78c26-20 63 2 58 34-5 30-48 39-68 15-12-15-7-38 10-49Z" />
      <path className={styles.markSunRay} d="M57 54 38 32M112 48l13-25M139 82l30-12M133 134l25 17M78 150l-14 31M40 111l-28 2" />
      <path className={styles.markCloud} d="M190 84c24-22 53-3 54 18 24-9 46 7 43 30-3 26-37 32-59 20-18 15-55 13-70-6-18-23 1-51 32-62Z" />
      <path className={styles.markHeart} d="M84 242c-21-30 21-60 47-27 27-35 72 0 45 33-19 23-45 43-45 43s-30-20-47-49Z" />
      <path className={styles.markRoof} d="M270 242 333 194l56 48M292 238v72h72v-72M319 310v-38h22v38" />
      <path className={styles.markTree} d="M314 112c23 17 34 35 27 54-8 22-39 18-53 10-16 12-46 6-51-15-5-22 22-45 47-55 8-3 19-2 30 6ZM288 178v68M286 209l-33 22M291 214l35 24" />
      <path className={styles.markTooth} d="M202 240c-3-41 70-43 71 0 1 25-14 38-18 62-4 22-15 41-27 14-11 27-24 8-28-14-5-23-16-38 2-62Z" />
    </svg>
  )
}
