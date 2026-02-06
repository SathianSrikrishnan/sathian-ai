'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'motion/react'

export function PixelCanvas({
  color = '#DC2626',
  secondaryColor,
  width = 800,
  height = 120,
  pixelSize = 6,
  speed = 0.5,
  density = 0.3,
  mode = 'shimmer',
}: {
  color?: string
  secondaryColor?: string
  width?: number
  height?: number
  pixelSize?: number
  speed?: number
  density?: number
  mode?: 'shimmer' | 'decay' | 'build'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-10% 0px' })
  const animFrameRef = useRef<number>(0)

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 220, g: 38, b: 38 }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isInView) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cols = Math.ceil(width / pixelSize)
    const rows = Math.ceil(height / pixelSize)
    const rgb = hexToRgb(color)
    const rgb2 = secondaryColor ? hexToRgb(secondaryColor) : rgb

    // Pixel state grid
    const pixels: number[] = new Array(cols * rows).fill(0)

    // Seed random pixels
    for (let i = 0; i < pixels.length; i++) {
      if (Math.random() < density) {
        pixels[i] = Math.random()
      }
    }

    let time = 0

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      time += speed * 0.02

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x
          let alpha = 0

          if (mode === 'shimmer') {
            // Wave pattern with noise
            const wave = Math.sin(x * 0.15 + time) * Math.cos(y * 0.2 + time * 0.7)
            alpha = pixels[idx] * (0.3 + 0.7 * (wave * 0.5 + 0.5))
          } else if (mode === 'decay') {
            // Pixels fade out from right to left over time
            const progress = (Math.sin(time * 0.5) + 1) / 2
            const threshold = progress * cols
            alpha = x < threshold ? pixels[idx] * (1 - (threshold - x) / cols) : pixels[idx]
          } else if (mode === 'build') {
            // Pixels appear from left to right
            const progress = (Math.sin(time * 0.3) + 1) / 2
            const threshold = progress * cols
            alpha = x < threshold ? pixels[idx] : 0
          }

          if (alpha > 0.05) {
            // Blend between two colors based on position
            const blend = x / cols
            const r = Math.round(rgb.r + (rgb2.r - rgb.r) * blend)
            const g = Math.round(rgb.g + (rgb2.g - rgb.g) * blend)
            const b = Math.round(rgb.b + (rgb2.b - rgb.b) * blend)

            ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.8})`
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1)
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [isInView, color, secondaryColor, width, height, pixelSize, speed, density, mode, hexToRgb])

  return (
    <motion.div
      ref={containerRef}
      className="my-14 flex justify-center"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </motion.div>
  )
}
