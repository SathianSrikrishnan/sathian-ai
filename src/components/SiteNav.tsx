'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`hub-nav ${scrolled ? 'hub-nav-solid' : ''}`}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="hub-mono"
          style={{ color: 'var(--hub-text-primary)', textDecoration: 'none' }}
        >
          sathian.ai
        </Link>
        <div className="flex items-center gap-8">
          <a
            href="https://btc.sathian.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors"
            style={{ color: 'var(--hub-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
          >
            Atlas
          </a>
          <a
            href="#projects"
            className="text-sm transition-colors"
            style={{ color: 'var(--hub-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
          >
            Projects
          </a>
          <Link
            href="/writings"
            className="text-sm transition-colors"
            style={{ color: 'var(--hub-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
          >
            Writing
          </Link>
          <a
            href="#about"
            className="text-sm transition-colors"
            style={{ color: 'var(--hub-text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
          >
            About
          </a>
        </div>
      </div>
    </nav>
  )
}
