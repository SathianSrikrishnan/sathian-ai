'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useInView } from 'motion/react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function ScrambleQuote({
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
  const [displayText, setDisplayText] = useState('')
  const [revealed, setRevealed] = useState(false)

  const scramble = useCallback(() => {
    const text = children
    const totalFrames = text.length * 2
    let frame = 0

    const interval = setInterval(() => {
      frame++
      const revealedCount = Math.floor((frame / totalFrames) * text.length)

      let result = ''
      for (let i = 0; i < text.length; i++) {
        if (i < revealedCount) {
          result += text[i]
        } else if (text[i] === ' ') {
          result += ' '
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }

      setDisplayText(result)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(text)
        setRevealed(true)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [children])

  useEffect(() => {
    if (isInView && !revealed) {
      return scramble()
    }
  }, [isInView, revealed, scramble])

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
        className="text-xl md:text-2xl font-article text-[#E6EDF3] leading-relaxed italic scramble-text"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        &ldquo;{displayText || children}&rdquo;
      </motion.blockquote>
      {articleUrl && revealed && (
        <motion.div
          className="mt-4 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
