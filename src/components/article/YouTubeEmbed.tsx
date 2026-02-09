'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

export function YouTubeEmbed({ videoId, accent }: { videoId: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      className="my-12 -mx-6 md:mx-0 md:rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
      <div
        className="h-px mt-1"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}33, transparent)` }}
      />
    </motion.div>
  )
}
