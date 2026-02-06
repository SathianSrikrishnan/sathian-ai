'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function PullQuote({
  children,
  accent,
  articleUrl,
}: {
  children: string
  accent: string
  articleUrl?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <aside ref={ref} className="my-16 mx-auto max-w-xl relative pl-8">
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
        style={{ background: accent }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
      />
      <motion.blockquote
        className="text-xl md:text-2xl font-serif text-[#E6EDF3] leading-relaxed italic"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        &ldquo;{children}&rdquo;
      </motion.blockquote>
      {articleUrl && (
        <motion.div
          className="mt-4 flex gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <button
            onClick={() => {
              const text = encodeURIComponent(`"${children}" — sathian.ai`)
              window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(articleUrl)}`, '_blank')
            }}
            className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors"
          >
            share
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`"${children}" — sathian.ai`)
            }}
            className="text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors"
          >
            copy
          </button>
        </motion.div>
      )}
    </aside>
  )
}
