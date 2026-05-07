"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions, type Marker } from "cobe"

export interface TfnGlobeMarker {
  id: string
  slug: string
  lat: number
  lng: number
  active: boolean
  featured: boolean
}

interface TfnGlobeProps {
  markers: TfnGlobeMarker[]
  size?: number
}

// Marker RGB (normalized 0-1) for Cobe's WebGL renderer.
// GOLD_INK is the ink-dark gold that reads on a cream sphere — same
// family as --tfn-ink. GOLD_DIM is the unshipped variant, deliberately
// faded so the 20 not-yet-wired traditions feel written-in-light-pencil.
const GOLD_INK: [number, number, number] = [0.55, 0.40, 0.15]
const GOLD_DIM: [number, number, number] = [0.73, 0.60, 0.40]

export function TfnGlobe({ markers, size = 420 }: TfnGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0.4)
  const thetaRef = useRef(0.2)
  const pointerDownRef = useRef(false)
  const pointerOrigin = useRef<[number, number]>([0, 0])
  const velocityRef = useRef<[number, number]>([0, 0])
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

  // Per-marker metadata — assigned once per marker set. active/featured
  // pulse; inactive stays static. Random phase spread keeps pulses
  // naturally out of sync so the globe reads as "alive", not "blinking".
  const markerBaseSizes = useRef<number[]>([])
  const markerSizes = useRef<number[]>([])
  const markerColors = useRef<[number, number, number][]>([])
  const markerPulseOn = useRef<boolean[]>([])
  const markerPhase = useRef<number[]>([])

  const [glowBoost, setGlowBoost] = useState(false)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const markersRef = useRef(markers)
  markersRef.current = markers

  useEffect(() => {
    markerBaseSizes.current = markers.map((m) => {
      if (m.featured) return 0.14
      if (m.active) return 0.09
      return 0.045
    })
    markerSizes.current = markers.map(() => 0.02)
    markerColors.current = markers.map((m) => (m.active ? GOLD_INK : GOLD_DIM))
    markerPulseOn.current = markers.map((m) => m.active)
    markerPhase.current = markers.map((_, i) => (i * 137.508) % (Math.PI * 2))
  }, [markers])

  const [globeSize, setGlobeSize] = useState(size)
  useEffect(() => {
    const updateSize = () => {
      const maxW = window.innerWidth - 32
      setGlobeSize(Math.min(size, maxW))
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [size])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderSize = globeSize * 2
    const startTime = performance.now()

    // Impeccable cream globe: light-mode Cobe with warm cream sphere,
    // softly visible continents in dim brown-gold, and a warm gold halo.
    // Reads as a vellum atlas, not a cold dark planet on a cream page.
    const opts: COBEOptions = {
      devicePixelRatio: 2,
      width: renderSize,
      height: renderSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 0,
      diffuse: 1.1,
      mapSamples: 20000,
      mapBrightness: 1.4,
      baseColor: [0.96, 0.92, 0.82],
      markerColor: GOLD_INK,
      glowColor: [0.92, 0.80, 0.55],
      markers: [],
      onRender: (state) => {
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = renderSize
        state.height = renderSize

        const t = (performance.now() - startTime) / 1000
        const pulseSpeed = Math.PI

        for (let i = 0; i < markerSizes.current.length; i++) {
          const current = markerSizes.current[i]
          const base = markerBaseSizes.current[i] ?? 0.045
          const phase = markerPhase.current[i] ?? 0
          const pulse = markerPulseOn.current[i]
            ? 1 + 0.18 * Math.sin(t * pulseSpeed + phase)
            : 1
          const target = base * pulse
          markerSizes.current[i] = current + (target - current) * 0.12
        }

        const list = markersRef.current
        state.markers = list.map((m, i): Marker => ({
          location: [m.lat, m.lng],
          size: markerSizes.current[i] ?? 0.045,
          color: markerColors.current[i] ?? GOLD_INK,
        }))
      },
    }

    const globe = createGlobe(canvas, opts)
    globeRef.current = globe

    let raf = 0
    const tick = () => {
      if (!pointerDownRef.current) {
        const [vx, vy] = velocityRef.current
        if (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001) {
          phiRef.current += vx
          thetaRef.current = Math.min(1.5, Math.max(-0.5, thetaRef.current + vy))
          velocityRef.current = [vx * 0.95, vy * 0.95]
        } else {
          phiRef.current += 0.002
          velocityRef.current = [0, 0]
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      globe.destroy()
      globeRef.current = null
    }
  }, [globeSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      pointerDownRef.current = true
      velocityRef.current = [0, 0]
      canvas.setPointerCapture(e.pointerId)
      pointerOrigin.current = [e.clientX, e.clientY]

      setGlowBoost(true)
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) return
      e.preventDefault()
      const [ox, oy] = pointerOrigin.current
      const dx = e.clientX - ox
      const dy = e.clientY - oy
      pointerOrigin.current = [e.clientX, e.clientY]

      const sensitivity = 0.015
      const dphi = dx * sensitivity
      const dtheta = dy * sensitivity

      phiRef.current += dphi
      thetaRef.current = Math.min(1.5, Math.max(-0.5, thetaRef.current + dtheta))
      velocityRef.current = [dphi * 0.5, dtheta * 0.5]
    }

    const onPointerUp = () => {
      pointerDownRef.current = false
      glowTimerRef.current = setTimeout(() => setGlowBoost(false), 800)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
    }
  }, [])

  return (
    <div
      className="relative select-none"
      style={{ width: globeSize, height: globeSize }}
    >
      {/* Parchment vignette — soft radial warmth behind the globe so the
          cream sphere sits in a "reading-table" pool instead of floating.
          Pulses outward on drag. */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-18%",
          background:
            "radial-gradient(circle, oklch(82% 0.06 78 / 0.28) 0%, oklch(88% 0.03 78 / 0.10) 45%, transparent 72%)",
          filter: "blur(28px)",
          opacity: glowBoost ? 1 : 0.68,
          transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: globeSize, height: globeSize, touchAction: "pan-y" }}
        aria-label="Interactive globe of tooth-fairy traditions"
        role="img"
      />
    </div>
  )
}

export default TfnGlobe
