'use client'

import { useRef, useState, type ChangeEvent } from 'react'

import DrawingCanvasV2, {
  type LayeredDrawingExport,
} from '@/components/toothfairy/app/drawing-canvas-v2'
import type { VisualTreatment } from '@/lib/toothlight/visual-treatments'
import styles from './ToothlightMemoryEditor.module.css'

type PhotoSource = 'library' | 'camera'

type ToothlightMemoryEditorProps = {
  photoImageSrc: string | null
  artworkImageSrc: string | null
  selectedTreatment: VisualTreatment
  onPhotoFile: (file: File, source: PhotoSource) => void
  onArtworkReady: (dataUrl: string, layers?: LayeredDrawingExport) => void
  onStudioOpened: () => void
}

export function ToothlightMemoryEditor({
  photoImageSrc,
  artworkImageSrc,
  selectedTreatment,
  onPhotoFile,
  onArtworkReady,
  onStudioOpened,
}: ToothlightMemoryEditorProps) {
  const libraryInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [studioOpen, setStudioOpen] = useState(false)
  const displayImageSrc = artworkImageSrc ?? photoImageSrc
  const drawingBackground = photoImageSrc ?? artworkImageSrc

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>, source: PhotoSource) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    onPhotoFile(file, source)
  }

  function openStudio() {
    setStudioOpen(true)
    onStudioOpened()
  }

  const photoActionButtons = (
    <div className={styles.photoActions}>
      <button type="button" onClick={() => libraryInputRef.current?.click()}>
        Choose photo
      </button>
      <button type="button" onClick={() => cameraInputRef.current?.click()}>
        Camera
      </button>
    </div>
  )

  return (
    <div
      className={styles.editor}
      style={{
        ['--editor-accent' as string]: selectedTreatment.brushAccent,
        ['--editor-secondary' as string]: selectedTreatment.brushSecondaryAccent,
      }}
    >
      <input
        ref={libraryInputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        onChange={(event) => handlePhotoChange(event, 'library')}
      />
      <input
        ref={cameraInputRef}
        className={styles.hiddenInput}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => handlePhotoChange(event, 'camera')}
      />

      <div className={styles.intro}>
        <p>
          Start with a photo of your tooth, your smile, or anything you want to create.
          Draw on it, make it your own, then enhance it with an AI filter.
        </p>
      </div>

      <div className={styles.stage}>
        <div className={styles.media} data-symbol={selectedTreatment.storySymbol}>
          {displayImageSrc ? (
            <img
              src={displayImageSrc}
              alt=""
              style={{ filter: selectedTreatment.cssFilter }}
            />
          ) : (
            <div className={styles.placeholder}>
              Add photo
            </div>
          )}
          <div className={styles.styleAura} aria-hidden="true" />
          <div className={styles.symbolCue} aria-hidden="true" />
        </div>

        <div className={styles.controls}>
          {photoActionButtons}
          <div className={styles.studioActions}>
            <button type="button" onClick={openStudio}>
              {displayImageSrc ? 'Draw on the photo' : 'Open the drawing studio'}
            </button>
          </div>
          <div className={styles.brushSet} aria-label={`${selectedTreatment.label} brush set`}>
            <span className={styles.srOnly}>{selectedTreatment.label} brush set</span>
            <div className={styles.swatches} aria-hidden="true">
              <i style={{ background: selectedTreatment.brushAccent }} />
              <i style={{ background: selectedTreatment.brushSecondaryAccent }} />
              <i style={{ background: selectedTreatment.accent }} />
            </div>
          </div>
        </div>
      </div>

      {studioOpen && (
        <DrawingCanvasV2
          initialBackground={drawingBackground}
          styleAccent={selectedTreatment.brushAccent}
          styleSecondaryAccent={selectedTreatment.brushSecondaryAccent}
          styleName={selectedTreatment.label}
          onBack={() => setStudioOpen(false)}
          onDone={(dataUrl, layers) => {
            onArtworkReady(dataUrl, layers)
            setStudioOpen(false)
          }}
          topAction={photoActionButtons}
        />
      )}
    </div>
  )
}
