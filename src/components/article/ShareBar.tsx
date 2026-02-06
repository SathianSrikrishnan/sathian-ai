'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function ShareBar({ title, url }: { title: string; url: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
            flex items-center gap-3 px-5 py-2.5
            bg-[#0D1117]/90 backdrop-blur-md
            border border-gray-800 rounded-full
            shadow-lg shadow-black/30"
        >
          <button
            onClick={() => {
              const text = encodeURIComponent(`${title} — sathian.ai`)
              window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank')
            }}
            className="text-xs font-mono text-gray-500 hover:text-white transition-colors px-2 py-1"
          >
            tweet
          </button>
          <div className="w-px h-4 bg-gray-800" />
          <button
            onClick={() => {
              const text = encodeURIComponent(`${title} by Sathian`)
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
            }}
            className="text-xs font-mono text-gray-500 hover:text-white transition-colors px-2 py-1"
          >
            linkedin
          </button>
          <div className="w-px h-4 bg-gray-800" />
          <button
            onClick={() => {
              navigator.clipboard.writeText(url)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="text-xs font-mono text-gray-500 hover:text-white transition-colors px-2 py-1"
          >
            {copied ? 'copied' : 'link'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
