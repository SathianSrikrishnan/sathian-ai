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

// RGB tuples (normalized 0-1) for Cobe's WebGL marker rendering.
// Cobe's API requires RGB-normalized, not hex/oklch — these mirror C.gold
// (#f0c456) and a dimmed variant. Keep in visual sync if C.gold shifts.
const GOLD: [number, number, number] = [0.94, 0.77, 0.34]
const GOLD_DIM: [number, number, number] = [0.55, 0.45, 0.2]

export function TfnGlobe({ markers, size = 420 }: TfnGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0.4)
  const thetaRef = useRef(0.2)
  const pointerDownRef = useRef(false)
  const pointerOrigin = useRef<[number, number]>([0, 0])
  const velocityRef = useRef<[number, number]>([0, 0])
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

  // Marker size targets — assigned once based on marker.active/featured
  const markerTargets = useRef<number[]>([])
  const markerSizes = useRef<number[]>([])
  const markerColors = useRef<[number, number, number][]>([])

  // Drag glow state
  const [glowBoost, setGlowBoost] = useState(false)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Markers ref so we can access in onRender
  const markersRef = useRef(markers)
  markersRef.current = markers

  // Compute target size + color per marker
  useEffect(() => {
    markerTargets.current = markers.map((m) => {
      if (m.featured) return 0.12
      if (m.active) return 0.08
      return 0.04
    })
    markerSizes.current = markers.map(() => 0.02) // grow in
    markerColors.current = markers.map((m) => (m.active ? GOLD : GOLD_DIM))
  }, [markers])

  // Responsive globe size
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

  // Create globe
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderSize = globeSize * 2

    const opts: COBEOptions = {
      devicePixelRatio: 2,
      width: renderSize,
      height: renderSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 3,
      mapSamples: 20000,
      mapBrightness: 6,
      baseColor: [0.05, 0.03, 0.10],
      markerColor: GOLD,
      glowColor: [0.08, 0.06, 0.18],
      markers: [],
      onRender: (state) => {
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = renderSize
        state.height = renderSize

        // Smooth size interpolation
        for (let i = 0; i < markerSizes.current.length; i++) {
          const current = markerSizes.current[i]
          const target = markerTargets.current[i] ?? 0.04
          markerSizes.current[i] = current + (target - current) * 0.08
        }

        const list = markersRef.current
        state.markers = list.map((m, i): Marker => ({
          location: [m.lat, m.lng],
          size: markerSizes.current[i] ?? 0.04,
          color: markerColors.current[i] ?? GOLD,
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

  // Pointer drag for rotation
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
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: globeSize, height: globeSize, touchAction: "pan-y" }}
        aria-label="Interactive globe of tooth-fairy traditions"
        role="img"
      />
      {/* Drag glow */}
      <div
        className="absolute inset-[-10%] rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          opacity: glowBoost ? 1 : 0,
          background:
            "radial-gradient(circle, oklch(78% 0.14 80 / 0.18) 0%, oklch(75% 0.12 185 / 0.08) 35%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  )
}

export default TfnGlobe
