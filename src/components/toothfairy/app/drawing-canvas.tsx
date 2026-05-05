"use client"

import { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from "react"
import { useViewMode } from "../view-mode-context"
import { C, ds, glass } from "../tokens"
import { PC } from "../parent-theme"
import { callEnhance } from "@/lib/toothfairy/enhance-client"
import { createChangedPixelOverlay } from "@/lib/toothfairy/canvas-overlay"

const MAGIC_POLISH_ENABLED = process.env.NEXT_PUBLIC_TFN_ENABLE_AI_ENHANCE !== "false"

// ─── Types ──────────────────────────────────────────────────────────
export interface DrawingCanvasRef {
  toDataURL: () => string | null
  clear: () => void
}

interface DrawingCanvasProps {
  photo?: string | null
  onImageReady?: (dataUrl: string) => void
}

// ─── Component ──────────────────────────────────────────────────────
const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  function DrawingCanvas({ photo, onImageReady }, ref) {
    const { isChild, isParent } = useViewMode()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawingRef = useRef(false)
    const lastPosRef = useRef({ x: 0, y: 0 })
    const undoStackRef = useRef<ImageData[]>([])
    const baseCanvasSnapshotRef = useRef<ImageData | null>(null)

    const [brushColor, setBrushColor] = useState(isParent ? PC.text : "#f0e6ff")
    const [brushSize, setBrushSize] = useState(4)
    const [eraserMode, setEraserMode] = useState(false)
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [enhanceRemaining, setEnhanceRemaining] = useState(3)
    const [enhanceError, setEnhanceError] = useState<string | null>(null)
    // Whether the canvas still shows only background (no strokes / photo / enhance).
    // Placeholder is a DOM overlay, NOT drawn to the canvas — keeps export clean.
    const [isPristine, setIsPristine] = useState(true)

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? null,
      clear: () => initCanvas(canvasRef.current),
    }))

    // ── Canvas init ──
    const bgColor = isParent ? "#ffffff" : "#0f0b1e"
    const placeholderColor = isParent ? PC.muted : "#a78bfa"
    const subColor = isParent ? PC.dim : "#6b7280"

    const initCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
      if (!canvas) return
      canvasRef.current = canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      canvas.width = 512; canvas.height = 512
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, 512, 512)
      baseCanvasSnapshotRef.current = ctx.getImageData(0, 0, 512, 512)
      // IMPORTANT: do NOT render placeholder text to the canvas. The canvas is
      // the export surface — anything drawn here ends up baked into the keepsake
      // via toDataURL(). The "Draw the tooth!" hint lives as a DOM overlay below.
      setIsPristine(true)
      undoStackRef.current = []
    }, [bgColor])

    // Redraw photo onto canvas when photo changes
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas || !photo) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const img = new Image()
      img.onload = () => {
        ctx.fillStyle = bgColor; ctx.fillRect(0, 0, 512, 512)
        const scale = Math.max(512 / img.width, 512 / img.height)
        const w = img.width * scale, h = img.height * scale
        ctx.drawImage(img, (512 - w) / 2, (512 - h) / 2, w, h)
        baseCanvasSnapshotRef.current = ctx.getImageData(0, 0, 512, 512)
        setIsPristine(false)
      }
      img.src = photo
    }, [photo, bgColor])

    // ── Drawing logic ──
    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const rect = canvas.getBoundingClientRect()
      const sx = canvas.width / rect.width, sy = canvas.height / rect.height
      if ("touches" in e) {
        const t = e.touches[0]
        return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy }
      }
      return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy }
    }

    const saveUndoSnapshot = () => {
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx || !canvasRef.current) return
      const snapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      undoStackRef.current = [...undoStackRef.current.slice(-19), snapshot]
    }

    const handleUndo = () => {
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx || undoStackRef.current.length === 0) return
      const prev = undoStackRef.current.pop()
      if (prev) ctx.putImageData(prev, 0, 0)
    }

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      saveUndoSnapshot()
      isDrawingRef.current = true
      lastPosRef.current = getPos(e)
      if (isPristine) setIsPristine(false)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault(); if (!isDrawingRef.current) return
      const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return
      const pos = getPos(e)
      ctx.beginPath(); ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
      ctx.lineTo(pos.x, pos.y)
      if (eraserMode) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.strokeStyle = "rgba(0,0,0,1)"
        ctx.lineWidth = brushSize * 4
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = brushColor
        ctx.lineWidth = brushSize
      }
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke()
      ctx.globalCompositeOperation = "source-over"
      lastPosRef.current = pos
    }

    const endDraw = () => { isDrawingRef.current = false }

    const enhanceLabel = isEnhancing
      ? "Polishing..."
      : enhanceRemaining <= 0
        ? "Original artwork saved"
        : "Magic polish"

    // ── Optional magic polish ──
    const handleEnhance = async () => {
      if (!canvasRef.current || isEnhancing) return
      setIsEnhancing(true)
      setEnhanceError(null)
      try {
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return
        saveUndoSnapshot()
        const currentSnapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        const baseSnapshot = baseCanvasSnapshotRef.current
        const preservedOverlay = baseSnapshot
          ? createChangedPixelOverlay(baseSnapshot, currentSnapshot)
          : null
        const drawingDataUrl = canvasRef.current.toDataURL("image/png")
        const outcome = await callEnhance({
          drawingDataUrl,
          tradition: "default",
          charms: [],
        })
        if (!outcome.ok) {
          if (outcome.error === "rate_limit") {
            setEnhanceError(outcome.detail || "Magic polish is cooling down. Try again in a moment.")
          } else if (outcome.error === "moderation_block") {
            setEnhanceError("Magic polish skipped this drawing. Continue with the original artwork.")
          } else if (outcome.error === "provider_unconfigured") {
            setEnhanceRemaining(0)
            setEnhanceError(
              outcome.detail ||
                "Magic polish is not connected yet. Continue with the original artwork."
            )
          } else if (outcome.error === "invalid_input") {
            setEnhanceError(outcome.detail || "This image could not be polished. Continue with the original artwork.")
          } else {
            setEnhanceError("Magic polish is unavailable right now. Continue with the original artwork.")
          }
          setIsEnhancing(false)
          return
        }
        setEnhanceRemaining(outcome.result.remaining ?? 0)

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const ctx = canvasRef.current?.getContext("2d")
          if (!ctx || !canvasRef.current) return
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          const scale = Math.max(canvasRef.current.width / img.width, canvasRef.current.height / img.height)
          const w = img.width * scale, h = img.height * scale
          ctx.drawImage(img, (canvasRef.current.width - w) / 2, (canvasRef.current.height - h) / 2, w, h)
          let enhancedBaseSnapshot: ImageData | null = null
          try {
            enhancedBaseSnapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
          } catch {
            enhancedBaseSnapshot = null
          }
          if (preservedOverlay) {
            const manualOverlay = document.createElement("canvas")
            manualOverlay.width = canvasRef.current.width
            manualOverlay.height = canvasRef.current.height
            manualOverlay.getContext("2d")?.putImageData(preservedOverlay, 0, 0)
            ctx.drawImage(manualOverlay, 0, 0)
          }
          baseCanvasSnapshotRef.current = enhancedBaseSnapshot
          setIsPristine(false)
          setIsEnhancing(false)
        }
        img.onerror = () => { setEnhanceError("Magic polish could not load. Continue with the original artwork."); setIsEnhancing(false) }
        img.src = outcome.result.enhancedImageUrl
      } catch (err: any) {
        setEnhanceError(
          err?.message === "Unauthorized" || err?.message?.startsWith("HTTP")
            ? "Magic polish is unavailable on this deployment. Continue with the original artwork."
            : err?.message || "Magic polish is unavailable right now. Continue with the original artwork."
        )
        setIsEnhancing(false)
      }
    }

    // ── Theme-aware palettes ──
    const childColors = ["#FFFFFF", "#f0c456", "#5adace", "#fbb5b5", "#9b87f5", "#60a5fa", "#34d399", "#fb923c"]
    const parentColors = [PC.text, "#f5c84c", "#22a06b", "#ef476f", "#3b82f6", "#8b5cc8", "#795900", "#ea580c"]
    const parentColorNames = ["navy", "yellow", "green", "pink", "blue", "purple", "brown", "orange"]
    const colors = isParent ? parentColors : childColors

    const brushSizes = [
      { size: 2, px: 6 },
      { size: 4, px: 10 },
      { size: 8, px: 16 },
    ]

    // ── Render ──
    if (isParent) {
      return (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: `1px solid ${PC.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: PC.surfaceContainerLow }}
          >
            <span
              className="flex items-center gap-2 text-sm font-bold"
              style={{ color: PC.goldDark, fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              Draw the tooth!
            </span>
            <div className="flex gap-1">
              <button
                onClick={handleUndo}
                className="p-2 rounded-lg transition-all"
                style={{ background: "transparent", border: `1px solid ${PC.border}`, cursor: "pointer", color: PC.muted }}
                title="Undo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
                </svg>
              </button>
              <button
                onClick={() => initCanvas(canvasRef.current)}
                className="p-2 rounded-lg transition-all"
                style={{ background: "transparent", border: `1px solid ${PC.border}`, cursor: "pointer", color: PC.muted }}
                title="Clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Canvas + DOM placeholder overlay (NEVER drawn to canvas) */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
            <canvas
              ref={initCanvas}
              className="touch-none"
              style={{ width: "100%", aspectRatio: "1", display: "block" }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            />
            {isPristine && !photo && (
              <div
                aria-hidden
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                  color: placeholderColor,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1.2 }}>Draw the tooth!</span>
                <span style={{ fontSize: 14, color: subColor, marginTop: 6 }}>
                  Use your finger or mouse
                </span>
              </div>
            )}
          </div>

          {/* Color tray + brush sizes */}
          <div
            className="flex items-center justify-center gap-4 py-3 px-4"
            style={{ borderTop: `1px solid ${PC.border}` }}
          >
            <div className="flex gap-2 p-1 rounded-full" style={{ background: PC.surfaceContainerLow }}>
              {colors.map((color, i) => (
                <button
                  key={i}
                  aria-label={`Use ${isParent ? parentColorNames[i] : "color"} marker`}
                  title={isParent ? parentColorNames[i] : "Color"}
                  onClick={() => { setBrushColor(color); setEraserMode(false) }}
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    borderRadius: "50%",
                    background: color,
                    border: brushColor === color && !eraserMode ? `2px solid ${PC.goldDark}` : "2px solid #fff",
                    boxShadow: brushColor === color && !eraserMode ? `0 0 6px ${color}40` : "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transform: brushColor === color && !eraserMode ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </div>

            <div style={{ height: "2rem", width: "1px", background: PC.border }} />

            <div className="flex gap-3 items-center">
              {brushSizes.map(({ size, px }) => (
                <button
                  key={size}
                  onClick={() => { setBrushSize(size); setEraserMode(false) }}
                  style={{
                    width: px,
                    height: px,
                    borderRadius: "50%",
                    background: brushSize === size && !eraserMode ? PC.goldDark : PC.muted,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </div>

            <div style={{ height: "2rem", width: "1px", background: PC.border }} />

            {/* Eraser */}
            <button
              onClick={() => setEraserMode(!eraserMode)}
              className="p-2 rounded-lg transition-all"
              style={{
                background: eraserMode ? "rgba(220,53,69,0.08)" : "transparent",
                border: `1px solid ${eraserMode ? "rgba(220,53,69,0.3)" : PC.border}`,
                cursor: "pointer",
              }}
              title="Eraser"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={eraserMode ? PC.error : PC.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8L14.6 1.6c.8-.8 2-.8 2.8 0L21.4 5.6c.8.8.8 2 0 2.8L10 20" />
              </svg>
            </button>
          </div>

          {/* Optional magic polish bar */}
          {MAGIC_POLISH_ENABLED && (
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${PC.border}` }}>
            <button
              onClick={handleEnhance}
              disabled={isEnhancing || enhanceRemaining <= 0}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
              style={{
                background: PC.tealSoft,
                border: `1px solid rgba(0,106,99,0.2)`,
                color: PC.teal,
                opacity: enhanceRemaining <= 0 ? 0.4 : 1,
                cursor: enhanceRemaining <= 0 ? "not-allowed" : "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {enhanceLabel}
            </button>
          </div>
          )}

          {enhanceError && (
            <p className="text-xs px-4 pb-2" style={{ color: PC.error }}>{enhanceError}</p>
          )}
        </div>
      )
    }

    // ── Child theme render ──
    return (
      <div>
        <div className="rounded-2xl p-3" style={{ background: C.bgAlt, border: `1px dashed ${C.borderGold}` }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
            <canvas
              ref={initCanvas}
              className="rounded-xl touch-none"
              style={{ width: "100%", aspectRatio: "1" }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            />
            {isPristine && !photo && (
              <div
                aria-hidden
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                  color: placeholderColor,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1.2 }}>Draw the tooth!</span>
                <span style={{ fontSize: 14, color: subColor, marginTop: 6 }}>
                  Use your finger or mouse
                </span>
              </div>
            )}
          </div>

          {/* Drawing tools */}
          <div className="mt-3 space-y-2">
            {/* Color palette */}
            <div className="flex items-center justify-center gap-2">
              {colors.map((color, i) => (
                <button
                  key={color}
                  aria-label={`Use ${isParent ? parentColorNames[i] : "color"} marker`}
                  title={isParent ? parentColorNames[i] : "Color"}
                  onClick={() => { setBrushColor(color); setEraserMode(false) }}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    background: color,
                    border: brushColor === color && !eraserMode ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: brushColor === color && !eraserMode ? `0 0 8px ${color}60` : 'none',
                    transform: brushColor === color && !eraserMode ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {/* Brush size + eraser + undo */}
            <div className="flex items-center justify-center gap-3">
              {brushSizes.map(({ size, px }) => (
                <button
                  key={size}
                  onClick={() => { setBrushSize(size); setEraserMode(false) }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                  style={{
                    background: brushSize === size && !eraserMode ? 'rgba(240,196,86,0.15)' : 'transparent',
                    border: `1px solid ${brushSize === size && !eraserMode ? 'rgba(240,196,86,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <div className="rounded-full" style={{ width: px, height: px, background: brushSize === size && !eraserMode ? C.gold : C.dim }} />
                </button>
              ))}

              <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {/* Eraser */}
              <button
                onClick={() => setEraserMode(!eraserMode)}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={{
                  background: eraserMode ? 'rgba(255,180,171,0.15)' : 'transparent',
                  border: `1px solid ${eraserMode ? 'rgba(255,180,171,0.3)' : 'rgba(255,255,255,0.1)'}`,
                }}
                title="Eraser"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={eraserMode ? C.ember : C.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8L14.6 1.6c.8-.8 2-.8 2.8 0L21.4 5.6c.8.8.8 2 0 2.8L10 20" />
                </svg>
              </button>

              {/* Undo */}
              <button
                onClick={handleUndo}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                title="Undo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action bar below canvas */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => initCanvas(canvasRef.current)}
            className="px-4 py-2.5 rounded-xl text-xs transition-all"
            style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}`, color: C.muted }}
          >
            Clear
          </button>
          {MAGIC_POLISH_ENABLED && (
            <button
              onClick={handleEnhance}
              disabled={isEnhancing || enhanceRemaining <= 0}
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex-1"
              style={{
                background: C.tealGlow,
                border: `1px solid ${C.borderTeal}`,
                color: C.teal,
                opacity: enhanceRemaining <= 0 ? 0.4 : 1,
              }}
            >
              {enhanceLabel}
            </button>
          )}
        </div>

        {enhanceError && (
          <p className="text-xs mt-2" style={{ color: C.error }}>{enhanceError}</p>
        )}
      </div>
    )
  }
)

export default DrawingCanvas
