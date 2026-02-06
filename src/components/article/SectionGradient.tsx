'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function SectionGradient({
  children,
  tint,
  intensity = 0.03,
}: {
  children: React.ReactNode
  tint: string // hex color
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-20% 0px' })

  return (
    <div ref={ref} className="relative">
      {/* Gradient tint overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background: `radial-gradient(ellipse at center, ${tint}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
