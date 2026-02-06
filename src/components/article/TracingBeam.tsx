'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

export function TracingBeam({
  children,
  color = '#F59E0B',
}: {
  children: React.ReactNode
  color?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.1', 'end 0.9'],
  })

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, contentHeight]), {
    stiffness: 500,
    damping: 90,
  })

  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, contentHeight - 200]),
    { stiffness: 500, damping: 90 }
  )

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      {/* The beam */}
      <div className="absolute left-[-40px] top-0 hidden md:block" style={{ height: contentHeight }}>
        {/* Static track */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px h-full"
          style={{ background: `${color}15` }}
        />

        {/* Animated dot at the top */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}88`,
            top: y1,
          }}
        />

        {/* SVG gradient line */}
        <svg
          viewBox={`0 0 2 ${contentHeight}`}
          width="2"
          height={contentHeight}
          className="absolute left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`beam-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.line
            x1="1"
            x2="1"
            y1={y2}
            y2={y1}
            stroke={`url(#beam-gradient-${color.replace('#', '')})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
