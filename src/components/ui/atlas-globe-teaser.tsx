"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import createGlobe, { type COBEOptions, type Marker } from "cobe"
import markersData from "@/data/atlas-markers.json"

type PillarType = "music" | "dialing" | "sports" | "history" | "internet"

interface AtlasMarker {
  number: string
  label: string
  pillars: PillarType[]
  coordinates: { lat: number; lng: number }
  region: string
}

export const PILLAR_COLORS: Record<PillarType, string> = {
  music: "#A855F7",
  dialing: "#3B82F6",
  sports: "#F97316",
  history: "#EAB308",
  internet: "#22C55E",
}

export const PILLAR_LABELS: Record<PillarType, string> = {
  music: "Music",
  dialing: "Area Codes",
  sports: "Sports",
  history: "History",
  internet: "Internet",
}

export const PILLARS: PillarType[] = ["music", "dialing", "sports", "history", "internet"]

const allMarkers = markersData as AtlasMarker[]

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

// Pre-compute per-marker color (based on primary pillar)
const markerColors: [number, number, number][] = allMarkers.map(m => {
  const primaryPillar = m.pillars[0]
  return hexToRgb01(PILLAR_COLORS[primaryPillar] || "#A78BFA")
})

// ─── Filter hook (externalized for Phase 3) ────────────────────────────────

export function useAtlasFilters() {
  const [activeFilters, setActiveFilters] = useState<Set<PillarType>>(new Set(PILLARS))

  const allActive = activeFilters.size === PILLARS.length
  const noneActive = activeFilters.size === 0

  const toggleFilter = useCallback((pillar: PillarType) => {
    setActiveFilters(prev => {
      if (prev.size === PILLARS.length) {
        return new Set([pillar])
      }
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }, [])

  const setAll = useCallback(() => setActiveFilters(new Set(PILLARS)), [])
  const setNone = useCallback(() => setActiveFilters(new Set()), [])

  return { activeFilters, allActive, noneActive, toggleFilter, setAll, setNone }
}

// ─── Filter chips component (externalized for Phase 3) ─────────────────────

export function AtlasFilterChips({
  activeFilters,
  allActive,
  noneActive,
  toggleFilter,
  setAll,
  setNone,
  variant = "horizontal",
}: {
  activeFilters: Set<PillarType>
  allActive: boolean
  noneActive: boolean
  toggleFilter: (p: PillarType) => void
  setAll: () => void
  setNone: () => void
  variant?: "horizontal" | "vertical"
}) {
  if (variant === "vertical") {
    return (
      <div className="flex flex-col gap-1.5">
        {PILLARS.map(p => {
          const isActive = activeFilters.has(p)
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggleFilter(p)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all hover:bg-white/5"
              style={{ opacity: isActive ? 1 : 0.35 }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                style={{
                  background: isActive ? PILLAR_COLORS[p] : "rgba(255,255,255,0.25)",
                  boxShadow: isActive ? `0 0 8px ${PILLAR_COLORS[p]}80` : "none",
                }}
              />
              <span className="text-xs font-mono" style={{ color: isActive ? "white" : "rgba(255,255,255,0.35)" }}>
                {PILLAR_LABELS[p]}
              </span>
            </button>
          )
        })}
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={setAll}
            className="text-[10px] font-mono px-2 py-1 rounded-full transition-all hover:bg-white/5"
            style={{
              color: allActive ? "white" : "rgba(255,255,255,0.35)",
              background: allActive ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={setNone}
            className="text-[10px] font-mono px-2 py-1 rounded-full transition-all hover:bg-white/5"
            style={{
              color: noneActive ? "white" : "rgba(255,255,255,0.35)",
              background: noneActive ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            None
          </button>
        </div>
      </div>
    )
  }

  // Horizontal variant (original layout)
  return (
    <div
      className="rounded-xl px-3 py-2 flex flex-wrap items-center justify-center gap-1"
      style={{
        background: "rgba(15,15,45,0.75)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      <button
        type="button"
        onClick={setAll}
        className="text-[10px] font-mono px-2 py-1 rounded-full transition-all hover:bg-white/5"
        style={{
          color: allActive ? "white" : "rgba(255,255,255,0.35)",
          background: allActive ? "rgba(255,255,255,0.1)" : "transparent",
        }}
      >
        All
      </button>
      <span className="text-[8px] mx-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>|</span>

      {PILLARS.map(p => {
        const isActive = activeFilters.has(p)
        return (
          <button
            key={p}
            type="button"
            onClick={() => toggleFilter(p)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-left transition-all hover:bg-white/5"
            style={{ opacity: isActive ? 1 : 0.35 }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-all"
              style={{
                background: isActive ? PILLAR_COLORS[p] : "rgba(255,255,255,0.25)",
                boxShadow: isActive ? `0 0 8px ${PILLAR_COLORS[p]}80` : "none",
              }}
            />
            <span className="text-[10px] font-mono" style={{ color: isActive ? "white" : "rgba(255,255,255,0.35)" }}>
              {PILLAR_LABELS[p]}
            </span>
          </button>
        )
      })}

      <span className="text-[8px] mx-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
      <button
        type="button"
        onClick={setNone}
        className="text-[10px] font-mono px-2 py-1 rounded-full transition-all hover:bg-white/5"
        style={{
          color: noneActive ? "white" : "rgba(255,255,255,0.35)",
          background: noneActive ? "rgba(255,255,255,0.1)" : "transparent",
        }}
      >
        None
      </button>
    </div>
  )
}

// ─── Globe component ────────────────────────────────────────────────────────

interface AtlasGlobeTeaserProps {
  size?: number
  activeFilters?: Set<PillarType>
  hideFilters?: boolean
}

export function AtlasGlobeTeaser({
  size = 420,
  activeFilters: externalFilters,
  hideFilters = false,
}: AtlasGlobeTeaserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0.4)
  const thetaRef = useRef(0.2)
  const pointerDownRef = useRef(false)
  const pointerOrigin = useRef<[number, number]>([0, 0])
  const velocityRef = useRef<[number, number]>([0, 0])
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

  // Marker size interpolation refs (same pattern as cosmic-globe.tsx)
  const markerSizes = useRef(allMarkers.map(() => 0.06))
  const markerTargets = useRef(allMarkers.map(() => 0.06))

  // Interaction glow state
  const [glowBoost, setGlowBoost] = useState(false)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Internal filter state (used when no external filters provided)
  const internalFilters = useAtlasFilters()
  const activeFilters = externalFilters ?? internalFilters.activeFilters
  const showInternalFilters = !externalFilters && !hideFilters

  const allActive = activeFilters.size === PILLARS.length
  const noneActive = activeFilters.size === 0

  // Pre-compute filtered set for fast lookup in onRender
  const filteredSet = useMemo(() => {
    if (noneActive) return new Set<number>()
    if (allActive) return null // null = all visible
    const set = new Set<number>()
    allMarkers.forEach((m, i) => {
      if (m.pillars.some(p => activeFilters.has(p))) set.add(i)
    })
    return set
  }, [activeFilters, allActive, noneActive])

  const filteredSetRef = useRef(filteredSet)
  filteredSetRef.current = filteredSet

  // Update marker targets when filters change
  useEffect(() => {
    const isFiltered = filteredSet !== null
    const baseSize = isFiltered ? 0.08 : 0.06
    markerTargets.current = allMarkers.map((_, i) => {
      if (filteredSet === null) return baseSize // all active
      if (filteredSet.has(i)) return baseSize
      return 0 // smooth shrink to invisible
    })
  }, [filteredSet])

  // Responsive globe size
  const [globeSize, setGlobeSize] = useState(size)
  useEffect(() => {
    const updateSize = () => {
      const maxW = window.innerWidth - 32
      setGlobeSize(Math.min(size, maxW, 420))
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [size])

  // Create globe — single canvas, native markers
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
      diffuse: 3.5,
      mapSamples: 24000,
      mapBrightness: 30,
      baseColor: [0.05, 0.03, 0.12],
      markerColor: hexToRgb01("#7C3AED"),
      glowColor: [0.12, 0.08, 0.3],
      markers: [], // populated on first frame via onRender
      onRender: (state) => {
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = renderSize
        state.height = renderSize

        // Smooth size interpolation
        for (let i = 0; i < markerSizes.current.length; i++) {
          const current = markerSizes.current[i]
          const target = markerTargets.current[i]
          markerSizes.current[i] = current + (target - current) * 0.08
        }

        // Set native markers with per-marker color
        state.markers = allMarkers.map((m, i): Marker => ({
          location: [m.coordinates.lat, m.coordinates.lng],
          size: markerSizes.current[i],
          color: markerColors[i],
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

  // Pointer drag — on CANVAS directly, NO passive flag (CRITICAL for setPointerCapture)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      pointerDownRef.current = true
      velocityRef.current = [0, 0]
      canvas.setPointerCapture(e.pointerId)
      pointerOrigin.current = [e.clientX, e.clientY]

      // Glow boost on drag
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
      // Linger glow for 800ms after release
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
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Globe */}
      <div
        className="relative select-none"
        style={{ width: globeSize, height: globeSize }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ width: globeSize, height: globeSize, touchAction: "none" }}
        />
        {/* Interaction glow overlay */}
        <div
          className="absolute inset-[-10%] rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            opacity: glowBoost ? 1 : 0,
            background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.12) 30%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* Legend — only when using internal filters */}
      {showInternalFilters && (
        <AtlasFilterChips
          activeFilters={internalFilters.activeFilters}
          allActive={internalFilters.allActive}
          noneActive={internalFilters.noneActive}
          toggleFilter={internalFilters.toggleFilter}
          setAll={internalFilters.setAll}
          setNone={internalFilters.setNone}
          variant="horizontal"
        />
      )}
    </div>
  )
}
