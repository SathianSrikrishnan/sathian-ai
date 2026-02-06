'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-cosmic-text hover:text-white transition-colors"
        >
          sathian.ai
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#projects"
            className="text-sm text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            Projects
          </a>
          <a
            href="#writings"
            className="text-sm text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            Writings
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
