'use client'
import { useRef, useState } from 'react'

export function GlareCard({
  children,
  className = '',
  glareColor = 'rgba(255,255,255,0.15)',
}: {
  children: React.ReactNode
  className?: string
  glareColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -20
    const rotateY = (x - 0.5) * 20
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`)
    setGlarePos({ x: x * 100, y: y * 100 })
  }

  const handleLeave = () => {
    setTransform('perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)')
    setGlarePos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor} 0%, transparent 60%)`,
        }}
      />
    </div>
  )
}
