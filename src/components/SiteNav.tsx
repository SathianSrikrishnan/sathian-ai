'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SocialLink } from '@/components/SocialLink'
import { personalSocialLinks } from '@/lib/social-links'

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change / escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { label: 'Projects', href: '/#now', external: false },
    { label: 'Automation', href: '/automation', external: false },
    { label: 'Writing', href: '/writings', external: false },
    { label: 'About', href: '/about', external: false },
    { label: 'Email', href: 'mailto:hi@sathian.ai', external: false },
  ]

  return (
    <>
      <nav className={`hub-nav ${scrolled ? 'hub-nav-solid' : ''}`}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="hub-mono"
            style={{ color: 'var(--hub-text-primary)', textDecoration: 'none' }}
          >
            sathian.ai
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--hub-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
                >
                  {link.label}
                </a>
              ) : link.href.startsWith('#') || link.href.startsWith('mailto:') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--hub-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--hub-text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--hub-text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--hub-text-secondary)')}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="sm:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              aria-hidden="true"
              className="block w-5 h-[1.5px] transition-all duration-200"
              style={{
                background: 'var(--hub-text-primary)',
                transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
              }}
            />
            <span
              aria-hidden="true"
              className="block w-5 h-[1.5px] transition-all duration-200"
              style={{
                background: 'var(--hub-text-primary)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              aria-hidden="true"
              className="block w-5 h-[1.5px] transition-all duration-200"
              style={{
                background: 'var(--hub-text-primary)',
                transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          id="mobile-site-menu"
          className="fixed inset-0 z-40 sm:hidden"
          style={{ background: 'var(--hub-bg-primary)', paddingTop: '80px' }}
        >
          <div className="flex flex-col items-center gap-8 pt-12">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium"
                  style={{ color: 'var(--hub-text-primary)', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : link.href.startsWith('#') || link.href.startsWith('mailto:') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium"
                  style={{ color: 'var(--hub-text-primary)', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium"
                  style={{ color: 'var(--hub-text-primary)', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="site-nav-mobile-socials" aria-label="Social profiles">
              {personalSocialLinks.map((link) => (
                <SocialLink
                  key={link.label}
                  {...link}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
