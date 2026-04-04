"use client"

import { useEffect, useRef } from "react"

// ─── Quiet night sky with subtle magic ──────────────────────────────
// The background is atmosphere, not spectacle.
// Content is the star. This is the calm behind it.

interface Star {
  x: number; y: number; size: number; baseAlpha: number
  pulseSpeed: number; pulsePhase: number
}

interface NetworkNode {
  x: number; y: number; radius: number
  pulsePhase: number; pulseSpeed: number
}

interface Firefly {
  x: number; y: number
  pathStart: { x: number; y: number } | null
  pathEnd: { x: number; y: number } | null
  pathControl: { x: number; y: number } | null
  pathProgress: number | null
  pathDuration: number
  pauseTimer: number
  phase: number
  trail: Array<{ x: number; y: number; life: number }>
}

export function FairyWorld({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // Parallax
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener("scroll", onScroll, { passive: true })

    // ── Stars (80-100, very subtle) ──
    const starCount = 80 + Math.floor(Math.random() * 20)
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 0.5,
      baseAlpha: 0.1 + Math.random() * 0.15,
      pulseSpeed: 0.006 + Math.random() * 0.012,
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    // ── Network (15 tiny nodes, barely visible) ──
    function createNodes(w: number): NetworkNode[] {
      const ns: NetworkNode[] = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          ns.push({
            x: (w * 0.1) + (w * 0.8 / 4) * c + (Math.random() - 0.5) * 40,
            y: 35 + r * 45 + (Math.random() - 0.5) * 18,
            radius: 1.5 + Math.random() * 0.5,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.005 + Math.random() * 0.006,
          })
        }
      }
      return ns
    }
    let nodes = createNodes(canvas.width)

    function buildEdges(ns: NetworkNode[]) {
      const e: Array<[number, number]> = []
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[j].x - ns[i].x, dy = ns[j].y - ns[i].y
          if (Math.sqrt(dx * dx + dy * dy) < 180) e.push([i, j])
        }
      }
      return e
    }
    let edges = buildEdges(nodes)

    // ── Fireflies (4-5 glowing dots, not fairy images) ──
    const fireflyCount = 4 + Math.floor(Math.random() * 2)
    const fireflies: Firefly[] = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.2 + Math.random() * canvas.height * 0.6,
      pathStart: null, pathEnd: null, pathControl: null,
      pathProgress: null,
      pathDuration: 500 + Math.random() * 400,
      pauseTimer: Math.floor(Math.random() * 100),
      phase: Math.random() * Math.PI * 2,
      trail: [],
    }))

    let time = 0
    let animId: number

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time++

      const starOff = scrollY * 0.08
      const netOff = scrollY * 0.2
      const ffOff = scrollY * 0.35

      // ── Stars ──
      for (const s of stars) {
        const a = s.baseAlpha + Math.sin(time * s.pulseSpeed + s.pulsePhase) * 0.08
        ctx.fillStyle = `rgba(240, 236, 255, ${Math.max(0.02, a)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y - starOff, s.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Network edges (gossamer, barely there) ──
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j]
        const dist = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
        const alpha = 0.02 + 0.02 * (1 - dist / 180)
        ctx.strokeStyle = `rgba(79, 209, 197, ${alpha})`
        ctx.lineWidth = 0.3
        ctx.beginPath()
        ctx.moveTo(a.x, a.y - netOff)
        ctx.quadraticCurveTo(
          (a.x + b.x) / 2, (a.y + b.y) / 2 - 8 - netOff,
          b.x, b.y - netOff
        )
        ctx.stroke()
      }

      // ── Network nodes (tiny, like brighter stars) ──
      for (const n of nodes) {
        n.pulsePhase += n.pulseSpeed
        const brightness = 0.15 + Math.sin(n.pulsePhase) * 0.08
        const ny = n.y - netOff
        const glowR = n.radius * 3.5

        // Soft glow
        const g = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, glowR)
        g.addColorStop(0, `rgba(240, 196, 86, ${brightness})`)
        g.addColorStop(0.5, `rgba(240, 196, 86, ${brightness * 0.3})`)
        g.addColorStop(1, "rgba(240, 196, 86, 0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(n.x, ny, glowR, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgba(255, 250, 235, ${brightness * 0.7})`
        ctx.beginPath()
        ctx.arc(n.x, ny, n.radius * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Fireflies (simple glowing dots with trails) ──
      for (const ff of fireflies) {
        // Movement: bezier paths with long pauses
        if (ff.pauseTimer > 0) {
          ff.pauseTimer--
          ff.x += Math.sin(time * 0.015 + ff.phase) * 0.12
          ff.y += Math.cos(time * 0.012 + ff.phase) * 0.1
        } else if (ff.pathProgress === null || ff.pathStart === null) {
          ff.pathStart = { x: ff.x, y: ff.y }
          ff.pathEnd = {
            x: Math.random() * canvas.width,
            y: canvas.height * 0.15 + Math.random() * canvas.height * 0.6,
          }
          ff.pathControl = {
            x: (ff.pathStart.x + ff.pathEnd.x) / 2 + (Math.random() - 0.5) * 150,
            y: Math.min(ff.pathStart.y, ff.pathEnd.y) - 30 - Math.random() * 80,
          }
          ff.pathProgress = 0
          ff.pathDuration = 500 + Math.random() * 400
        } else {
          ff.pathProgress++
          const t = ff.pathProgress / ff.pathDuration
          if (t >= 1) {
            ff.pathProgress = null
            ff.pathStart = null
            ff.pauseTimer = 100 + Math.floor(Math.random() * 200) // long pauses
          } else if (ff.pathStart && ff.pathEnd && ff.pathControl) {
            const mt = 1 - t
            ff.x = mt * mt * ff.pathStart.x + 2 * mt * t * ff.pathControl.x + t * t * ff.pathEnd.x
            ff.y = mt * mt * ff.pathStart.y + 2 * mt * t * ff.pathControl.y + t * t * ff.pathEnd.y
          }
        }

        const fy = ff.y - ffOff

        // Trail (tiny fading dots)
        if (time % 4 === 0) {
          ff.trail.push({ x: ff.x, y: fy, life: 1.0 })
          if (ff.trail.length > 12) ff.trail.shift()
        }
        for (const pt of ff.trail) {
          pt.life -= 0.025
          if (pt.life <= 0) continue
          ctx.fillStyle = `rgba(240, 196, 86, ${pt.life * 0.1})`
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 1 + pt.life * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ff.trail = ff.trail.filter(p => p.life > 0)

        // The firefly itself: 3-4px dot with soft 15px glow
        const pulse = 0.12 + Math.sin(time * 0.02 + ff.phase) * 0.03
        const glow = ctx.createRadialGradient(ff.x, fy, 0, ff.x, fy, 15)
        glow.addColorStop(0, `rgba(240, 196, 86, ${pulse})`)
        glow.addColorStop(0.4, `rgba(240, 196, 86, ${pulse * 0.3})`)
        glow.addColorStop(1, "rgba(240, 196, 86, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(ff.x, fy, 15, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `rgba(255, 240, 200, ${pulse * 1.5})`
        ctx.beginPath()
        ctx.arc(ff.x, fy, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resize()
      nodes = createNodes(canvas.width)
      edges = buildEdges(nodes)
      for (const s of stars) {
        s.x = Math.random() * canvas.width
        s.y = Math.random() * canvas.height
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <div
        className={`fixed inset-0 ${className}`}
        style={{
          background: [
            "radial-gradient(ellipse at 50% 0%, rgba(26,16,69,0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 12%, rgba(240,196,86,0.015) 0%, transparent 35%)",
            "radial-gradient(ellipse at 50% 100%, rgba(79,209,197,0.01) 0%, transparent 25%)",
            "linear-gradient(180deg, #060B18 0%, #0E1530 40%, #12103a 70%, #060B18 100%)",
          ].join(", "),
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  )
}
