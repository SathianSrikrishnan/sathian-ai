'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { PROOF } from '@/content/proof'
import { trackSiteEvent } from '@/lib/site-analytics'

const navLinks = [
  { label: 'Home', href: '/', external: false },
  { label: 'About', href: '/about', external: false },
  { label: 'Proof', href: PROOF.href, external: true },
  { label: 'Learn', href: '/learn', external: false },
  { label: 'Writing', href: '/writings', external: false },
]

type NavLink = (typeof navLinks)[number]

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  if (link.external) {
    return (
      <a href={link.href} onClick={() => trackSiteEvent('proof_opened', { placement: 'nav' })}>
        {link.label}
      </a>
    )
  }
  return (
    <Link href={link.href} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
      {link.label}
    </Link>
  )
}

export function SiteNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(href))

  return (
    <>
      <nav className={`minimal-site-nav ${scrolled ? 'minimal-site-nav--solid' : ''}`} aria-label="Primary navigation">
        <div className="minimal-site-nav__inner">
          <Link href="/" className="minimal-site-nav__brand">sathian.ai</Link>

          <div className="minimal-site-nav__desktop">
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </div>

          <button
            type="button"
            className="minimal-site-nav__toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="minimal-mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="minimal-mobile-menu" className="minimal-mobile-menu">
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
