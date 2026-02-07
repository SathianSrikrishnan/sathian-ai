"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import markersData from "@/data/atlas-markers.json"

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
  dialing: "Area Codes",
  sports: "Sports",
  history: "History",
  internet: "Internet",
}

const PILLARS: PillarType[] = ["music", "dialing", "sports", "history", "internet"]

const allMarkers = markersData as AtlasMarker[]

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function projectPoint(
  lat: number, lng: number, phi: number, theta: number, size: number
): { x: number; y: number; z: number } | null {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const px = Math.cos(latRad) * Math.sin(lngRad)
  const py = -Math.sin(latRad)
  const pz = Math.cos(latRad) * Math.cos(lngRad)
  const rx = px * Math.cos(phi) + pz * Math.sin(phi)
  const ry = py
  const rz = -px * Math.sin(phi) + pz * Math.cos(phi)
  const fx = rx
  const fy = ry * Math.cos(theta) - rz * Math.sin(theta)
  const fz = ry * Math.sin(theta) + rz * Math.cos(theta)
  if (fz < -0.1) return null
  const radius = size * 0.43
  return { x: size / 2 + fx * radius, y: size / 2 + fy * radius, z: fz }
}

export function AtlasGlobeTeaser({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(1.8) // Start facing North America
  const thetaRef = useRef(0.3)
  const pointerDownRef = useRef(false)
  const pointerOrigin = useRef<[number, number]>([0, 0])
  const velocityRef = useRef<[number, number]>([0, 0])
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

  // Default: all 5 pillars active = all markers lit
  const [activeFilters, setActiveFilters] = useState<Set<PillarType>>(new Set(PILLARS))

  const allActive = activeFilters.size === PILLARS.length
  const noneActive = activeFilters.size === 0

  const filteredMarkers = useMemo(() => {
    if (noneActive) return []
    if (allActive) return allMarkers
    return allMarkers.filter(m => m.pillars.some(p => activeFilters.has(p)))
  }, [activeFilters, allActive, noneActive])

  const filteredRef = useRef(filteredMarkers)
  filteredRef.current = filteredMarkers
  const filtersRef = useRef(activeFilters)
  filtersRef.current = activeFilters

  const toggleFilter = useCallback((pillar: PillarType) => {
    setActiveFilters(prev => {
      // If all 5 are active, clicking one = isolate to just that one
      if (prev.size === PILLARS.length) {
        return new Set([pillar])
      }
      // Otherwise toggle
      const next = new Set(prev)
      if (next.has(pillar)) next.delete(pillar)
      else next.add(pillar)
      return next
    })
  }, [])

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

  // Create globe
  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const renderSize = globeSize * 2
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
      mapBrightness: 3,
      baseColor: [0.04, 0.02, 0.1],
      markerColor: hexToRgb01("#7C3AED"),
      glowColor: [0.06, 0.03, 0.18],
      markers: [],
      onRender: (state) => {
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = renderSize
        state.height = renderSize

        if (!overlayCtx) return
        overlayCtx.clearRect(0, 0, renderSize, renderSize)

        const markers = filteredRef.current
        const isFiltered = filtersRef.current.size > 0 && filtersRef.current.size < PILLARS.length

        for (const m of markers) {
          const pt = projectPoint(
            m.coordinates.lat, m.coordinates.lng,
            phiRef.current, thetaRef.current, renderSize
          )
          if (!pt) continue

          const primaryPillar = m.pillars[0]
          const color = PILLAR_COLORS[primaryPillar] || "#A78BFA"
          const depthAlpha = 0.3 + pt.z * 0.7
          const dotSize = isFiltered ? (3 + pt.z * 3) : (2 + pt.z * 2)
          const brightness = isFiltered ? 0.95 : 0.7

          // Outer glow
          if (pt.z > 0.2) {
            overlayCtx.beginPath()
            overlayCtx.arc(pt.x, pt.y, dotSize * (isFiltered ? 3 : 2), 0, Math.PI * 2)
            overlayCtx.fillStyle = color
            overlayCtx.globalAlpha = depthAlpha * (isFiltered ? 0.15 : 0.06)
            overlayCtx.fill()
          }

          // Core dot
          overlayCtx.beginPath()
          overlayCtx.arc(pt.x, pt.y, dotSize, 0, Math.PI * 2)
          overlayCtx.fillStyle = color
          overlayCtx.globalAlpha = depthAlpha * brightness
          overlayCtx.fill()

          overlayCtx.globalAlpha = 1
        }
      },
    }

    const globe = createGlobe(canvas, opts)
    globeRef.current = globe

    let raf = 0
    const tick = () => {
      if (!pointerDownRef.current) {
        // Apply momentum decay
        const [vx, vy] = velocityRef.current
        if (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001) {
          phiRef.current += vx
          thetaRef.current = Math.min(1.5, Math.max(-0.5, thetaRef.current + vy))
          velocityRef.current = [vx * 0.95, vy * 0.95]
        } else {
          // Gentle auto-rotate when no momentum
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

  // Pointer drag — on CANVAS directly, NO passive flag
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault() // Prevent browser drag/selection behavior
      pointerDownRef.current = true
      velocityRef.current = [0, 0]
      canvas.setPointerCapture(e.pointerId)
      pointerOrigin.current = [e.clientX, e.clientY]
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

      // Track velocity for momentum
      velocityRef.current = [dphi * 0.5, dtheta * 0.5]
    }

    const onPointerUp = () => {
      pointerDownRef.current = false
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
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
        <canvas
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: globeSize, height: globeSize }}
        />
      </div>

      {/* Legend */}
      <div
        className="rounded-xl px-3 py-2 flex flex-wrap items-center justify-center gap-1"
        style={{
          background: "rgba(15,15,45,0.75)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* All / None controls */}
        <button
          type="button"
          onClick={() => setActiveFilters(new Set(PILLARS))}
          className="text-[10px] font-mono px-2 py-1 rounded-full transition-all hover:bg-white/5"
          style={{
            color: allActive ? "white" : "rgba(255,255,255,0.35)",
            background: allActive ? "rgba(255,255,255,0.1)" : "transparent",
          }}
        >
          All
        </button>
        <span className="text-[8px] mx-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>|</span>

        {/* Pillar buttons */}
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
          onClick={() => setActiveFilters(new Set())}
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
