"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import markersData from "@/data/atlas-markers.json"
import { motion, AnimatePresence } from "motion/react"

type PillarType = "music" | "dialing" | "sports" | "history" | "internet"

interface AtlasMarker {
  number: string
  label: string
  pillars: PillarType[]
  coordinates: { lat: number; lng: number }
  region: string
}

const PILLAR_COLORS: Record<PillarType, string> = {
  music: "#A855F7",
  dialing: "#3B82F6",
  sports: "#F97316",
  history: "#EAB308",
  internet: "#22C55E",
}

const PILLAR_LABELS: Record<PillarType, string> = {
  music: "Music",
  dialing: "Area Code",
  sports: "Sports",
  history: "History",
  internet: "Internet",
}

const PILLARS: PillarType[] = ["music", "dialing", "sports", "history", "internet"]

const markers = markersData as AtlasMarker[]

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function projectPoint(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  size: number
): { x: number; y: number; z: number } | null {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180

  // Point on unit sphere
  const px = Math.cos(latRad) * Math.sin(lngRad)
  const py = -Math.sin(latRad)
  const pz = Math.cos(latRad) * Math.cos(lngRad)

  // Rotate by phi (globe's horizontal rotation)
  const rx = px * Math.cos(phi) + pz * Math.sin(phi)
  const ry = py
  const rz = -px * Math.sin(phi) + pz * Math.cos(phi)

  // Rotate by theta (globe's vertical tilt)
  const fx = rx
  const fy = ry * Math.cos(theta) - rz * Math.sin(theta)
  const fz = ry * Math.sin(theta) + rz * Math.cos(theta)

  // Only visible if facing camera
  if (fz < -0.1) return null

  const radius = size * 0.43 // globe visual radius within canvas
  const cx = size / 2
  const cy = size / 2

  return {
    x: cx + fx * radius,
    y: cy + fy * radius,
    z: fz,
  }
}

export function AtlasGlobeTeaser({ size = 320 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const thetaRef = useRef(0.3)
  const pointerDownRef = useRef(false)
  const pointerOrigin = useRef<[number, number]>([0, 0])
  const [legendOpen, setLegendOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<PillarType>>(new Set())

  const filteredMarkers = useMemo(() => {
    if (activeFilters.size === 0) return markers
    return markers.filter(m => m.pillars.some(p => activeFilters.has(p)))
  }, [activeFilters])

  const toggleFilter = useCallback((pillar: PillarType) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const renderSize = size * 2
    overlay.width = renderSize
    overlay.height = renderSize
    const overlayCtx = overlay.getContext("2d")

    const opts: COBEOptions = {
      devicePixelRatio: 2,
      width: renderSize,
      height: renderSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.03, 0.12],
      markerColor: hexToRgb01("#7C3AED"),
      glowColor: [0.08, 0.04, 0.2],
      markers: [], // We draw our own colored markers
      onRender: (state) => {
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = renderSize
        state.height = renderSize

        // Draw colored markers on overlay
        if (!overlayCtx) return
        overlayCtx.clearRect(0, 0, renderSize, renderSize)

        for (const m of filteredMarkers) {
          const pt = projectPoint(
            m.coordinates.lat,
            m.coordinates.lng,
            phiRef.current,
            thetaRef.current,
            renderSize
          )
          if (!pt) continue

          const primaryPillar = m.pillars[0]
          const color = PILLAR_COLORS[primaryPillar] || "#A78BFA"

          // Depth-based sizing and opacity
          const depthAlpha = 0.3 + pt.z * 0.7
          const dotSize = 2 + pt.z * 2

          overlayCtx.beginPath()
          overlayCtx.arc(pt.x, pt.y, dotSize, 0, Math.PI * 2)
          overlayCtx.fillStyle = color
          overlayCtx.globalAlpha = depthAlpha * 0.85
          overlayCtx.fill()

          // Glow for front-facing dots
          if (pt.z > 0.3) {
            overlayCtx.beginPath()
            overlayCtx.arc(pt.x, pt.y, dotSize * 2.5, 0, Math.PI * 2)
            overlayCtx.fillStyle = color
            overlayCtx.globalAlpha = depthAlpha * 0.12
            overlayCtx.fill()
          }

          overlayCtx.globalAlpha = 1
        }
      },
    }

    const globe = createGlobe(canvas, opts)

    let raf = 0
    const tick = () => {
      if (!pointerDownRef.current) {
        phiRef.current += 0.003
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      globe.destroy()
    }
  }, [size, filteredMarkers])

  // Pointer drag
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onDown = (e: PointerEvent) => {
      pointerDownRef.current = true
      canvas.setPointerCapture(e.pointerId)
      pointerOrigin.current = [e.clientX, e.clientY]
    }
    const onMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) return
      const [ox, oy] = pointerOrigin.current
      phiRef.current += (e.clientX - ox) * 0.005
      thetaRef.current = Math.min(1.2, Math.max(0.05, thetaRef.current + (e.clientY - oy) * 0.005))
      pointerOrigin.current = [e.clientX, e.clientY]
    }
    const onUp = () => { pointerDownRef.current = false }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  const allActive = activeFilters.size === 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Cobe base globe */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size, touchAction: "none" }}
      />
      {/* Colored marker overlay */}
      <canvas
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: size, height: size }}
      />

      {/* Compact legend toggle */}
      <div className="absolute bottom-2 right-2 z-20">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLegendOpen(!legendOpen) }}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-mono transition-all hover:bg-white/10"
          style={{
            background: "rgba(15,15,45,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {/* 5 colored dots */}
          <span className="flex gap-0.5">
            {PILLARS.map(p => (
              <span
                key={p}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: PILLAR_COLORS[p], opacity: allActive || activeFilters.has(p) ? 1 : 0.3 }}
              />
            ))}
          </span>
          <span>{filteredMarkers.length}</span>
        </button>

        <AnimatePresence>
          {legendOpen && (
            <motion.div
              className="absolute bottom-full right-0 mb-1 rounded-xl overflow-hidden"
              style={{
                background: "rgba(15,15,45,0.92)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
              }}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <div className="px-3 py-2 flex flex-col gap-1">
                {PILLARS.map(p => {
                  const isActive = allActive || activeFilters.has(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFilter(p) }}
                      className="flex items-center gap-2 rounded-md px-2 py-0.5 text-[10px] font-mono transition-all hover:bg-white/5 whitespace-nowrap"
                      style={{ opacity: isActive ? 1 : 0.35 }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: PILLAR_COLORS[p],
                          boxShadow: isActive ? `0 0 6px ${PILLAR_COLORS[p]}60` : "none",
                        }}
                      />
                      <span style={{ color: isActive ? "white" : "rgba(255,255,255,0.5)" }}>
                        {PILLAR_LABELS[p]}
                      </span>
                    </button>
                  )
                })}
                {!allActive && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveFilters(new Set()) }}
                    className="text-[9px] font-mono text-white/40 hover:text-white/60 mt-0.5 text-center"
                  >
                    Show all
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
