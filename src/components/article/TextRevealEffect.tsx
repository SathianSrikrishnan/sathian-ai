'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function TextRevealEffect({
  text,
  accent,
  className = '',
}: {
  text: string
  accent?: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const words = text.split(' ')

  return (
    <p ref={ref} className={`leading-[1.85] text-[#B8C0CC] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0.08, y: 6, filter: 'blur(2px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0.08, y: 6, filter: 'blur(2px)' }
          }
          transition={{
            duration: 0.4,
            delay: 0.02 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={
            i === 0
              ? {
                  fontSize: '3.5rem',
                  lineHeight: '0.85',
                  fontWeight: 700,
                  color: '#E6EDF3',
                  float: 'left' as const,
                  marginRight: '0.75rem',
                  marginTop: '0.25rem',
                }
              : {}
          }
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export function GradualReveal({
  text,
  accent,
}: {
  text: string
  accent?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })
  const words = text.split(' ')

  // "Gradually then suddenly" — starts slow, accelerates
  const getDelay = (i: number, total: number) => {
    const progress = i / total
    // Exponential: slow at start, fast at end
    if (progress < 0.5) return 0.08 * i // Slow: 80ms per word
    if (progress < 0.8) return 0.08 * (total * 0.5) + 0.03 * (i - total * 0.5) // Medium
    return 0.08 * (total * 0.5) + 0.03 * (total * 0.3) + 0.005 * (i - total * 0.8) // Fast
  }

  return (
    <p ref={ref} className="leading-[1.85] text-[#B8C0CC] mb-7">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.15,
            delay: getDelay(i, words.length),
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
