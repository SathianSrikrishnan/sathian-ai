"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import createGlobe from "cobe"
import { cn } from "@/lib/utils"

// ─── Fairy Network Locations ─────────────────────────────────────────────────
export type NetworkType = "child" | "animal" | "collective"

export interface FairyNode {
  city: string
  fairyName: string
  location: [number, number]
  size: number
  networkType: NetworkType
}

export const FAIRY_NODES: FairyNode[] = [
  // ─── Major Hubs ────────────────────────────────────────────
  { city: "Tokyo", fairyName: "Moonpetal Station", location: [35.6762, 139.6503], size: 0.06, networkType: "child" },
  { city: "London", fairyName: "Starfall Keep", location: [51.5074, -0.1278], size: 0.06, networkType: "child" },
  { city: "Toronto", fairyName: "Frostbloom Citadel", location: [43.6532, -79.3832], size: 0.07, networkType: "child" },
  { city: "São Paulo", fairyName: "Sunvine Hollow", location: [-23.5505, -46.6333], size: 0.05, networkType: "animal" },
  { city: "Mumbai", fairyName: "Spicedust Spire", location: [19.076, 72.8777], size: 0.06, networkType: "child" },
  { city: "Sydney", fairyName: "Coralwing Bay", location: [-33.8688, 151.2093], size: 0.05, networkType: "animal" },
  { city: "Cairo", fairyName: "Sandwhisper Gate", location: [30.0444, 31.2357], size: 0.04, networkType: "collective" },
  { city: "Nairobi", fairyName: "Thornbloom Rift", location: [-1.2921, 36.8219], size: 0.04, networkType: "animal" },
  { city: "Berlin", fairyName: "Ironpetal Forge", location: [52.52, 13.405], size: 0.05, networkType: "child" },
  { city: "Seoul", fairyName: "Jadewing Nexus", location: [37.5665, 126.978], size: 0.06, networkType: "child" },
  { city: "Mexico City", fairyName: "Obsidian Flutter", location: [19.4326, -99.1332], size: 0.05, networkType: "child" },
  { city: "Lagos", fairyName: "Goldtide Watch", location: [6.5244, 3.3792], size: 0.04, networkType: "collective" },
  { city: "Dubai", fairyName: "Miragespark Oasis", location: [25.2048, 55.2708], size: 0.05, networkType: "child" },
  { city: "Singapore", fairyName: "Dewdrop Vault", location: [1.3521, 103.8198], size: 0.05, networkType: "child" },
  { city: "Reykjavik", fairyName: "Aurorafrost Spire", location: [64.1466, -21.9426], size: 0.03, networkType: "animal" },
  { city: "Buenos Aires", fairyName: "Tangomist Haven", location: [-34.6037, -58.3816], size: 0.04, networkType: "child" },
  // ─── Expanded Network ──────────────────────────────────────
  { city: "New York", fairyName: "Starbridge Tower", location: [40.7128, -74.006], size: 0.07, networkType: "child" },
  { city: "Los Angeles", fairyName: "Sunwing Pier", location: [34.0522, -118.2437], size: 0.05, networkType: "child" },
  { city: "Paris", fairyName: "Lumière Hollow", location: [48.8566, 2.3522], size: 0.05, networkType: "child" },
  { city: "Bangkok", fairyName: "Lotuspetal Reef", location: [13.7563, 100.5018], size: 0.05, networkType: "animal" },
  { city: "Istanbul", fairyName: "Crescentwing Gate", location: [41.0082, 28.9784], size: 0.04, networkType: "collective" },
  { city: "Moscow", fairyName: "Frostfire Dome", location: [55.7558, 37.6173], size: 0.04, networkType: "child" },
  { city: "Jakarta", fairyName: "Tidewing Haven", location: [-6.2088, 106.8456], size: 0.05, networkType: "animal" },
  { city: "Lima", fairyName: "Cloudpeak Spire", location: [-12.0464, -77.0428], size: 0.04, networkType: "child" },
  { city: "Johannesburg", fairyName: "Goldvein Rift", location: [-26.2041, 28.0473], size: 0.04, networkType: "collective" },
  { city: "Shanghai", fairyName: "Jademist Harbor", location: [31.2304, 121.4737], size: 0.06, networkType: "child" },
  { city: "Manila", fairyName: "Pearlwing Cove", location: [14.5995, 120.9842], size: 0.04, networkType: "animal" },
  { city: "Bogotá", fairyName: "Emeraldglow Perch", location: [4.711, -74.0721], size: 0.04, networkType: "child" },
  { city: "Amsterdam", fairyName: "Tulipwing Canal", location: [52.3676, 4.9041], size: 0.04, networkType: "child" },
  { city: "Taipei", fairyName: "Bamboolight Nest", location: [25.033, 121.5654], size: 0.05, networkType: "child" },
  { city: "Cape Town", fairyName: "Stormwing Point", location: [-33.9249, 18.4241], size: 0.04, networkType: "animal" },
  { city: "Delhi", fairyName: "Saffronbloom Gate", location: [28.6139, 77.209], size: 0.05, networkType: "child" },
  { city: "Osaka", fairyName: "Cherrydust Arch", location: [34.6937, 135.5023], size: 0.04, networkType: "child" },
  { city: "Casablanca", fairyName: "Sandrose Beacon", location: [33.5731, -7.5898], size: 0.03, networkType: "collective" },
  { city: "Auckland", fairyName: "Fernwhisper Isle", location: [-36.8485, 174.7633], size: 0.04, networkType: "animal" },
  { city: "Accra", fairyName: "Cocoa Shimmer Post", location: [5.6037, -0.187], size: 0.03, networkType: "collective" },
  // ─── Card Character Cities ───────────────────────────────────
  { city: "Tehran", fairyName: "Persepolis Gate", location: [35.6892, 51.389], size: 0.05, networkType: "collective" },
  { city: "Johor Bahru", fairyName: "Straitspark Dock", location: [1.4927, 103.7414], size: 0.04, networkType: "child" },
  { city: "Usulampatti", fairyName: "Tamarind Wisp", location: [9.9675, 77.7847], size: 0.03, networkType: "child" },
  { city: "Starbase", fairyName: "Launchpad Shimmer", location: [25.9971, -97.156], size: 0.04, networkType: "collective" },
  { city: "Georgetown", fairyName: "Demerara Glow", location: [6.8013, -58.1551], size: 0.03, networkType: "child" },
  { city: "Rio de Janeiro", fairyName: "Sugarloaf Beacon", location: [-22.9068, -43.1729], size: 0.05, networkType: "child" },
  { city: "Warsaw", fairyName: "Amber Wing Post", location: [52.2297, 21.0122], size: 0.04, networkType: "child" },
  { city: "Abu Dhabi", fairyName: "Oasis Prism Tower", location: [24.4539, 54.3773], size: 0.04, networkType: "collective" },
  { city: "Boulder", fairyName: "Flatiron Spark", location: [40.015, -105.2705], size: 0.03, networkType: "child" },
  { city: "Palo Alto", fairyName: "Sequoia Circuit", location: [37.4419, -122.143], size: 0.04, networkType: "child" },
]

// ─── Network type colors for arc overlay ────────────────────────────────────
export const NETWORK_COLORS: Record<NetworkType, string> = {
  child: "#EC4899",    // warm pink
  animal: "#06B6D4",   // cool cyan
  collective: "#F59E0B", // gold
}

// ─── Predefined arc connections (pairs of node indices) ─────────────────────
// Only arcs between the 12 card character cities
const HUB_SET = new Set([2, 14, 21, 30, 36, 37, 38, 39, 40, 41, 42, 43])
const ARC_CONNECTIONS: [number, number][] = [
  // ─── Hub-to-hub connections (12 card cities interconnected) ─────
  [2, 14],  // Toronto ↔ Reykjavik
  [2, 42],  // Toronto ↔ Warsaw
  [14, 21], // Reykjavik ↔ Moscow
  [21, 42], // Moscow ↔ Warsaw
  [42, 36], // Warsaw ↔ Tehran
  [36, 43], // Tehran ↔ Abu Dhabi
  [43, 38], // Abu Dhabi ↔ Usulampatti
  [38, 37], // Usulampatti ↔ Johor Bahru
  [37, 30], // Johor Bahru ↔ Cape Town
  [30, 41], // Cape Town ↔ Rio
  [41, 40], // Rio ↔ Georgetown
  [40, 39], // Georgetown ↔ Starbase
  [39, 2],  // Starbase ↔ Toronto
  // Cross-connections for global mesh
  [36, 38], // Tehran ↔ Usulampatti
  [21, 36], // Moscow ↔ Tehran
  [30, 43], // Cape Town ↔ Abu Dhabi
  [39, 41], // Starbase ↔ Rio
  [14, 42], // Reykjavik ↔ Warsaw
]

// ─── Colors ──────────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#050510",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  plasma: "#EC4899",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

function hexToGl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

// ─── Easing ──────────────────────────────────────────────────────────────────
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ─── Spherical to 2D projection ─────────────────────────────────────────────
function projectToScreen(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  radius: number,
  cx: number,
  cy: number
): { x: number; y: number; visible: boolean } {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180

  const x = Math.cos(latRad) * Math.sin(lngRad - phi)
  const y =
    Math.sin(latRad) * Math.cos(theta) -
    Math.cos(latRad) * Math.sin(theta) * Math.cos(lngRad - phi)
  const z =
    Math.sin(latRad) * Math.sin(theta) +
    Math.cos(latRad) * Math.cos(theta) * Math.cos(lngRad - phi)

  return {
    x: cx + radius * x,
    y: cy - radius * y,
    visible: z > 0.05, // slight threshold to hide markers near the edge
  }
}

// ─── Key hub indices (card character cities) ─────────────────────────────────
export const KEY_HUB_INDICES = [2, 14, 21, 30, 36, 37, 38, 39, 40, 41, 42, 43]

// ─── Globe Component ─────────────────────────────────────────────────────────
export interface CosmicGlobeProps {
  className?: string
  size?: number
  rotateSpeed?: number
  showLabels?: boolean
  simulateArrivals?: boolean
  arrivalInterval?: number
  darkness?: number
  showArcs?: boolean
  onNodeClick?: (nodeIndex: number, city: string) => void
}

export function CosmicGlobe({
  className,
  size = 600,
  rotateSpeed = 0.003,
  showLabels = true,
  simulateArrivals = true,
  arrivalInterval = 3000,
  darkness = 1,
  showArcs = true,
  onNodeClick,
}: CosmicGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const arcCanvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

  // ─── Interaction state (refs for RAF-safe access) ──────────────────────
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const dragStartPhi = useRef(0)
  const dragStartTheta = useRef(0)
  const dragStartPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const recentDeltas = useRef<{ dphi: number; dtheta: number; time: number }[]>([])
  const phiRef = useRef(0)
  const thetaRef = useRef(0.15)
  const autoRotateBlend = useRef(1) // 0 = fully manual, 1 = fully auto
  const framesSinceRelease = useRef(0)

  // ─── Marker pulse animation state ──────────────────────────────────────
  const markerSizes = useRef(FAIRY_NODES.map((n) => n.size))
  const markerTargets = useRef(FAIRY_NODES.map((n) => n.size))

  const [activeNode, setActiveNode] = useState<FairyNode | null>(null)
  const [toothCount, setToothCount] = useState(47832)

  const pixelSize = size * 2

  // ─── Arc overlay rendering ────────────────────────────────────────────
  const arcDashOffset = useRef(0)
  const rippleTime = useRef(0)
  // Projected hub positions for click detection
  const hubProjections = useRef<{ x: number; y: number; visible: boolean; idx: number }[]>([])

  // Key hubs for ripple ring effect — the 12 card character cities
  // Exported as static array for data mapping
  const KEY_HUBS = KEY_HUB_INDICES

  const drawArcs = useCallback(() => {
    const canvas = arcCanvasRef.current
    if (!canvas || !showArcs) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = 2
    const cx = (size * dpr) / 2
    const cy = (size * dpr) / 2
    const radius = (size * dpr) / 2 - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    arcDashOffset.current += 0.3
    rippleTime.current += 1 / 60 // ~60fps frame time

    // ─── Draw concentric ripple rings at key hub nodes ─────────────
    const maxRingRadius = radius * 0.07 // tighter rings, clearly centered on cities
    const ringCount = 2 // fewer rings, cleaner look
    const cycleDuration = 3 // seconds per ring cycle
    const projections: { x: number; y: number; visible: boolean; idx: number }[] = []

    for (const hubIdx of KEY_HUBS) {
      const node = FAIRY_NODES[hubIdx]
      if (!node) continue

      const p = projectToScreen(
        node.location[0], node.location[1],
        phiRef.current, thetaRef.current,
        radius, cx, cy
      )
      projections.push({ x: p.x, y: p.y, visible: p.visible, idx: hubIdx })
      if (!p.visible) continue

      const color = NETWORK_COLORS[node.networkType]
      const cR = parseInt(color.slice(1, 3), 16)
      const cG = parseInt(color.slice(3, 5), 16)
      const cB = parseInt(color.slice(5, 7), 16)

      // Central glow (radial gradient — makes hubs pop)
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, maxRingRadius * 0.5)
      glow.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, 0.25)`)
      glow.addColorStop(1, `rgba(${cR}, ${cG}, ${cB}, 0)`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, maxRingRadius * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Draw 3 concentric expanding rings per hub (staggered phase)
      for (let r = 0; r < ringCount; r++) {
        // Each ring has a different phase offset so they stagger
        const phase = (rippleTime.current / cycleDuration + r / ringCount) % 1
        const ringRadius = phase * maxRingRadius
        const alpha = (1 - phase) * 0.65 // brighter, fades as it expands

        ctx.beginPath()
        ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${cR}, ${cG}, ${cB}, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Core dot at center (bright, solid, prominent)
      ctx.beginPath()
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${cR}, ${cG}, ${cB}, 0.95)`
      ctx.fill()

      // White hot center
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
    }

    hubProjections.current = projections

    // ─── Draw arcs (only between visible nodes, slightly subtler) ────
    for (const [i, j] of ARC_CONNECTIONS) {
      const a = FAIRY_NODES[i]
      const b = FAIRY_NODES[j]

      const pa = projectToScreen(
        a.location[0], a.location[1],
        phiRef.current, thetaRef.current,
        radius, cx, cy
      )
      const pb = projectToScreen(
        b.location[0], b.location[1],
        phiRef.current, thetaRef.current,
        radius, cx, cy
      )

      if (!pa.visible || !pb.visible) continue

      const arcColor = NETWORK_COLORS[a.networkType]
      const hexR = parseInt(arcColor.slice(1, 3), 16)
      const hexG = parseInt(arcColor.slice(3, 5), 16)
      const hexB = parseInt(arcColor.slice(5, 7), 16)

      const dx = pb.x - pa.x
      const dy = pb.y - pa.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const arcHeight = dist * 0.3

      const midX = (pa.x + pb.x) / 2
      const midY = (pa.y + pb.y) / 2 - arcHeight

      // Subtle dashed arc
      ctx.beginPath()
      ctx.moveTo(pa.x, pa.y)
      ctx.quadraticCurveTo(midX, midY, pb.x, pb.y)
      ctx.setLineDash([4, 8])
      ctx.lineDashOffset = -arcDashOffset.current
      ctx.strokeStyle = `rgba(${hexR}, ${hexG}, ${hexB}, 0.2)`
      ctx.lineWidth = 1
      ctx.stroke()

      // Soft glow pass
      ctx.beginPath()
      ctx.moveTo(pa.x, pa.y)
      ctx.quadraticCurveTo(midX, midY, pb.x, pb.y)
      ctx.setLineDash([])
      ctx.strokeStyle = `rgba(${hexR}, ${hexG}, ${hexB}, 0.05)`
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }, [size, showArcs])

  // ─── Create Globe ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: pixelSize,
      height: pixelSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: darkness,
      diffuse: 1.8,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor: hexToGl("#0a0a2e"),
      markerColor: hexToGl(COLORS.aurora),
      glowColor: hexToGl("#1e1e5a"),
      scale: 1,
      offset: [0, 0],
      // Only show markers for the 12 card cities (hub nodes)
      markers: FAIRY_NODES.map((n, i) => ({ location: n.location, size: HUB_SET.has(i) ? n.size : 0 })),
      onRender: (state) => {
        const FRICTION = 0.92
        const THETA_CLAMP = 0.8

        // ─── Smooth marker size interpolation ──────────────────
        for (let i = 0; i < markerSizes.current.length; i++) {
          const current = markerSizes.current[i]
          const target = markerTargets.current[i]
          markerSizes.current[i] = current + (target - current) * 0.08
        }
        state.markers = FAIRY_NODES.map((n, i) => ({
          location: n.location,
          size: HUB_SET.has(i) ? markerSizes.current[i] : 0,
        }))

        if (isDragging.current) {
          // During drag: direct 1:1 cursor tracking (no velocity lag)
          // phi and theta are set directly in handlePointerMove
          autoRotateBlend.current = 0
          framesSinceRelease.current = 0
        } else {
          // After release: apply decaying velocity (momentum)
          velocity.current.phi *= FRICTION
          velocity.current.theta *= FRICTION

          framesSinceRelease.current++

          // Gradually resume auto-rotation over ~120 frames (~2 sec)
          const t = Math.min(framesSinceRelease.current / 120, 1)
          autoRotateBlend.current = easeOutCubic(t)

          // Blend between momentum and auto-rotate
          const momentumPhi = velocity.current.phi
          const autoPhi = rotateSpeed
          const blendedPhi =
            momentumPhi * (1 - autoRotateBlend.current) +
            autoPhi * autoRotateBlend.current

          phiRef.current += blendedPhi
          thetaRef.current += velocity.current.theta

          // Gently return theta toward resting position
          if (autoRotateBlend.current > 0.5) {
            const restTheta = 0.15
            const thetaDiff = restTheta - thetaRef.current
            thetaRef.current += thetaDiff * 0.01 * autoRotateBlend.current
          }
        }

        // Clamp theta to prevent flipping
        thetaRef.current = Math.max(-THETA_CLAMP, Math.min(THETA_CLAMP, thetaRef.current))

        state.phi = phiRef.current
        state.theta = thetaRef.current

        // Draw arcs overlay
        drawArcs()
      },
    })

    globeRef.current = globe
    return () => { globe.destroy() }
  }, [pixelSize, darkness, rotateSpeed, drawArcs])

  // ─── Simulate tooth arrivals with smooth marker pulses ────────────────
  useEffect(() => {
    if (!simulateArrivals) return

    // Use a seeded sequence for deterministic arrivals (avoid Math.random in React)
    let seed = 42
    const seededRandom = () => {
      seed = (seed * 16807 + 0) % 2147483647
      return (seed - 1) / 2147483646
    }

    const interval = setInterval(() => {
      // Only pulse hub nodes (the 12 card cities)
      const hubArray = Array.from(HUB_SET)
      const idx = hubArray[Math.floor(seededRandom() * hubArray.length)]
      const node = FAIRY_NODES[idx]

      // Subtle pulse on the selected hub node
      markerTargets.current = FAIRY_NODES.map((n, i) =>
        i === idx ? n.size + 0.04 : (HUB_SET.has(i) ? n.size : 0)
      )

      // Return to base size smoothly after delay
      setTimeout(() => {
        markerTargets.current = FAIRY_NODES.map((n) => n.size)
      }, 1200)

      setToothCount((c) => c + 1)
      setActiveNode(node)

      setTimeout(() => {
        setActiveNode((current) => (current === node ? null : current))
      }, 2500)
    }, arrivalInterval)

    return () => clearInterval(interval)
  }, [simulateArrivals, arrivalInterval])

  // ─── Pointer handlers with velocity tracking ──────────────────────────
  // ─── Sensitivity: radians per pixel for 1:1 feel ───────────────────────
  const sensitivity = Math.PI / size // half-rotation across the globe width

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    dragStartPointer.current = { x: e.clientX, y: e.clientY }
    dragStartPhi.current = phiRef.current
    dragStartTheta.current = thetaRef.current
    lastPointer.current = { x: e.clientX, y: e.clientY }
    recentDeltas.current = []
    velocity.current = { phi: 0, theta: 0 }
    // Capture pointer so drag works even when cursor leaves the canvas
    if (canvasRef.current) {
      canvasRef.current.setPointerCapture(e.pointerId)
      canvasRef.current.style.cursor = "grabbing"
    }
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false
    // Calculate release velocity from recent deltas for momentum
    const deltas = recentDeltas.current
    if (deltas.length >= 2) {
      const recent = deltas.slice(-5)
      let totalPhi = 0, totalTheta = 0
      for (const d of recent) { totalPhi += d.dphi; totalTheta += d.dtheta }
      velocity.current.phi = totalPhi / recent.length
      velocity.current.theta = totalTheta / recent.length
    }
    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(e.pointerId)
      canvasRef.current.style.cursor = "grab"
    }

    // Click detection: if pointer barely moved, treat as a click on a hub node
    if (onNodeClick && canvasRef.current) {
      const dx = e.clientX - dragStartPointer.current.x
      const dy = e.clientY - dragStartPointer.current.y
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        const rect = canvasRef.current.getBoundingClientRect()
        const dpr = 2
        const clickX = (e.clientX - rect.left) * dpr
        const clickY = (e.clientY - rect.top) * dpr
        const hitRadius = 30 * dpr
        let nearest: { dist: number; idx: number } | null = null
        for (const proj of hubProjections.current) {
          if (!proj.visible) continue
          const pdx = proj.x - clickX, pdy = proj.y - clickY
          const dist = Math.sqrt(pdx * pdx + pdy * pdy)
          if (dist < hitRadius && (!nearest || dist < nearest.dist)) {
            nearest = { dist, idx: proj.idx }
          }
        }
        if (nearest) {
          onNodeClick(nearest.idx, FAIRY_NODES[nearest.idx].city)
        }
      }
    }
  }, [onNodeClick])

  const handlePointerOut = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false
      const deltas = recentDeltas.current
      if (deltas.length >= 2) {
        const recent = deltas.slice(-5)
        let totalPhi = 0, totalTheta = 0
        for (const d of recent) { totalPhi += d.dphi; totalTheta += d.dtheta }
        velocity.current.phi = totalPhi / recent.length
        velocity.current.theta = totalTheta / recent.length
      }
    }
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return

    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y

    // Direct 1:1 position update — globe follows cursor exactly
    const dphi = dx * sensitivity
    const dtheta = -dy * sensitivity
    phiRef.current += dphi
    thetaRef.current += dtheta

    // Track recent deltas for momentum on release
    recentDeltas.current.push({ dphi, dtheta, time: Date.now() })
    if (recentDeltas.current.length > 10) recentDeltas.current.shift()

    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [sensitivity])

  // ─── Touch handlers for mobile ────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    isDragging.current = true
    dragStartPointer.current = { x: touch.clientX, y: touch.clientY }
    dragStartPhi.current = phiRef.current
    dragStartTheta.current = thetaRef.current
    lastPointer.current = { x: touch.clientX, y: touch.clientY }
    recentDeltas.current = []
    velocity.current = { phi: 0, theta: 0 }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return
    e.preventDefault()
    const touch = e.touches[0]
    const dx = touch.clientX - lastPointer.current.x
    const dy = touch.clientY - lastPointer.current.y

    const dphi = dx * sensitivity
    const dtheta = -dy * sensitivity
    phiRef.current += dphi
    thetaRef.current += dtheta

    recentDeltas.current.push({ dphi, dtheta, time: Date.now() })
    if (recentDeltas.current.length > 10) recentDeltas.current.shift()

    lastPointer.current = { x: touch.clientX, y: touch.clientY }
  }, [sensitivity])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    const deltas = recentDeltas.current
    if (deltas.length >= 2) {
      const recent = deltas.slice(-5)
      let totalPhi = 0, totalTheta = 0
      for (const d of recent) { totalPhi += d.dphi; totalTheta += d.dtheta }
      velocity.current.phi = totalPhi / recent.length
      velocity.current.theta = totalTheta / recent.length
    }
  }, [])

  return (
    <div className={cn("relative", className)}>
      {/* Outer atmospheric glow — layered for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.08) 25%, rgba(236,72,153,0.03) 45%, transparent 60%)",
          filter: "blur(50px)",
          transform: "scale(1.4)",
        }}
      />
      {/* Secondary inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(6,182,212,0.1) 0%, transparent 40%)",
          filter: "blur(30px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Globe canvas — cobe renders here */}
      <canvas
        ref={canvasRef}
        width={pixelSize}
        height={pixelSize}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onLostPointerCapture={handlePointerOut}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: size,
          height: size,
          maxWidth: "100%",
          aspectRatio: "1",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        className="relative z-10"
      />

      {/* Arc connections overlay canvas — pointer-events-none so globe drag works */}
      {showArcs && (
        <canvas
          ref={arcCanvasRef}
          width={pixelSize}
          height={pixelSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            maxWidth: "100%",
            aspectRatio: "1",
            pointerEvents: "none",
          }}
          className="z-20"
        />
      )}

      {/* Active node notification label */}
      {showLabels && activeNode && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            animation: "cosmicFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <div
            className="relative px-5 py-3 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,15,45,0.9), rgba(15,15,45,0.65))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: `0 0 24px rgba(6,182,212,0.2), 0 0 48px rgba(124,58,237,0.1), 0 8px 32px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Pulse indicator */}
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{
                background: COLORS.stardust,
                boxShadow: `0 0 12px ${COLORS.stardust}`,
                animation: "cosmicPulseRing 1.5s ease-out infinite",
              }}
            />
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: COLORS.aurora,
                  boxShadow: `0 0 10px ${COLORS.aurora}, 0 0 20px ${COLORS.aurora}40`,
                  animation: "cosmicGlow 2s ease-in-out infinite alternate",
                }}
              />
              <div>
                <div
                  className="text-sm font-display font-semibold"
                  style={{ color: COLORS.text }}
                >
                  {activeNode.city}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: COLORS.muted }}
                >
                  {activeNode.fairyName}
                </div>
              </div>
              <div
                className="text-[10px] font-mono px-2.5 py-1 rounded-full ml-2"
                style={{
                  background: `${COLORS.aurora}15`,
                  color: COLORS.aurora,
                  border: `1px solid ${COLORS.aurora}25`,
                  boxShadow: `0 0 8px ${COLORS.aurora}10`,
                }}
              >
                NEW TOOTH
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live counter pill */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{ bottom: "8%", left: "50%", transform: "translateX(-50%)" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(15,15,45,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div className="relative">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}
            />
            <div
              className="absolute inset-0 w-2 h-2 rounded-full"
              style={{
                background: "#22c55e",
                animation: "cosmicPulseRing 2s ease-out infinite",
              }}
            />
          </div>
          <span className="text-xs font-mono" style={{ color: COLORS.muted }}>
            {toothCount.toLocaleString()} teeth collected
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes cosmicPulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes cosmicFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes cosmicGlow {
          from { box-shadow: 0 0 8px rgba(6,182,212,0.6), 0 0 16px rgba(6,182,212,0.3); }
          to { box-shadow: 0 0 12px rgba(6,182,212,0.8), 0 0 24px rgba(6,182,212,0.4); }
        }
      `}</style>
    </div>
  )
}
