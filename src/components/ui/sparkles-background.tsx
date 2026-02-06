'use client'
import { useEffect, useRef } from 'react'

interface Sparkle {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  phase: number
}

export function SparklesBackground({
  count = 50,
  color = '#B794F6',
  minSize = 1,
  maxSize = 3,
  className = '',
}: {
  count?: number
  color?: string
  minSize?: number
  maxSize?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const sparkles: Sparkle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random(),
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }))

    let frame: number
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      for (const s of sparkles) {
        const twinkle = Math.sin(time * 0.001 * s.speed + s.phase) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = s.opacity * twinkle
        ctx.fill()

        // Cross sparkle shape
        if (s.size > 2) {
          ctx.beginPath()
          const len = s.size * 2 * twinkle
          ctx.moveTo(s.x - len, s.y)
          ctx.lineTo(s.x + len, s.y)
          ctx.moveTo(s.x, s.y - len)
          ctx.lineTo(s.x, s.y + len)
          ctx.strokeStyle = color
          ctx.globalAlpha = s.opacity * twinkle * 0.5
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [count, color, minSize, maxSize])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
