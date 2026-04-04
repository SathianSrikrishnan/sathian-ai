"use client"

import { useEffect, useRef } from "react"

interface Fairy {
  x: number; y: number; size: number; baseAlpha: number; alpha: number
  hue: number; targetX: number; targetY: number; speed: number
  pulseSpeed: number; pulsePhase: number
}

export function FairyFireflies() {
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
    window.addEventListener("resize", resize)

    const fairies: Fairy[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1.5 + Math.random() * 2,
      baseAlpha: 0.2 + Math.random() * 0.4,
      alpha: 0,
      hue: Math.random() > 0.3 ? 45 : 175,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
      speed: 0.3 + Math.random() * 0.7,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    let time = 0
    let animId: number

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1

      for (const f of fairies) {
        const dx = f.targetX - f.x
        const dy = f.targetY - f.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 20) {
          f.targetX = Math.random() * canvas.width
          f.targetY = Math.random() * canvas.height
          f.speed = 0.3 + Math.random() * 0.7
        }

        if (dist > 0) {
          f.x += (dx / dist) * f.speed
          f.y += (dy / dist) * f.speed
        }

        f.alpha = f.baseAlpha + Math.sin(time * f.pulseSpeed + f.pulsePhase) * 0.15

        // Glow
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 6)
        if (f.hue === 45) {
          gradient.addColorStop(0, `rgba(240, 196, 86, ${f.alpha})`)
          gradient.addColorStop(0.3, `rgba(240, 196, 86, ${f.alpha * 0.5})`)
          gradient.addColorStop(1, `rgba(240, 196, 86, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(79, 209, 197, ${f.alpha})`)
          gradient.addColorStop(0.3, `rgba(79, 209, 197, ${f.alpha * 0.5})`)
          gradient.addColorStop(1, `rgba(79, 209, 197, 0)`)
        }
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 6, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha * 0.8})`
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
