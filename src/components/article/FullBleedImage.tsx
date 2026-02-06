'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'

export function FullBleedImage({
  src,
  alt,
  caption,
  accent,
  priority = false,
}: {
  src: string
  alt: string
  caption?: string
  accent?: string
  priority?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <motion.div
      ref={containerRef}
      className="relative my-16 -mx-6 md:-mx-16 lg:-mx-32 overflow-hidden rounded-lg"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image with parallax */}
      <div className="relative aspect-[21/9] overflow-hidden">
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-[110%] object-cover"
          style={{ y }}
          loading={priority ? 'eager' : 'lazy'}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12]/80 via-transparent to-[#0A0A12]/30" />
      </div>

      {/* Caption */}
      {caption && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xs font-mono text-gray-400" style={accent ? { color: `${accent}99` } : {}}>
            {caption}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export function InlineImage({
  src,
  alt,
  caption,
  accent,
  side = 'right',
}: {
  src: string
  alt: string
  caption?: string
  accent?: string
  side?: 'left' | 'right'
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.figure
      ref={ref}
      className={`my-8 ${side === 'right' ? 'md:float-right md:ml-8' : 'md:float-left md:mr-8'} md:w-[280px] w-full`}
      initial={{ opacity: 0, x: side === 'right' ? 30 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: side === 'right' ? 30 : -30 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        {/* Subtle border glow */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: accent ? `inset 0 0 0 1px ${accent}20` : 'inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-[11px] font-mono leading-relaxed"
          style={{ color: accent ? `${accent}88` : '#6B7280' }}
        >
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
