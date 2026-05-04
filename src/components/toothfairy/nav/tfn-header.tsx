"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/toothfairy#how-it-works", label: "How it works" },
  { href: "/toothfairy/stories", label: "Stories" },
  { href: "/toothfairy/faq", label: "Safety" },
] as const

export function TFNHeader() {
  const pathname = usePathname() || "/toothfairy"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: scrolled
          ? "oklch(97.5% 0.01 80 / 0.9)"
          : "oklch(97.5% 0.01 80 / 0.72)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        borderBottom: `1px solid ${scrolled ? "var(--tfn-border)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href="/toothfairy" className="brand no-underline">
          <ToothLogo />
          <span className="brand-copy">
            <span className="brand-name">
              Tooth Fairy <b>Network</b>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:gap-3 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions hidden items-center gap-3 md:flex">
          <span className="solana-pill">
            <span aria-hidden />
            Parent controlled
          </span>
          <Link href="/toothfairy/app" className="header-cta">
            Make a keepsake
            <span aria-hidden className="cta-arrow" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="menu-button md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span aria-hidden className={mobileOpen ? "open" : ""} />
        </button>
      </div>

      {mobileOpen && (
        <nav className="mobile-menu mx-auto max-w-7xl px-5 pb-4 md:hidden">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-link">
              {link.label}
            </Link>
          ))}
          <Link href="/toothfairy/app" className="header-cta mt-2 justify-center">
            Make a keepsake
            <span aria-hidden className="cta-arrow" />
          </Link>
        </nav>
      )}

      <style jsx>{`
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 0.64rem;
          min-width: 0;
        }

        .brand-copy {
          display: block;
          min-width: 0;
          line-height: 1.05;
        }

        .brand-name {
          display: block;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.05rem, 1.45vw, 1.35rem);
          font-weight: 800;
          white-space: nowrap;
        }

        .brand-name b {
          color: #6d45a8;
          font-weight: 800;
        }

        .nav-link {
          border-radius: 999px;
          color: #23365f;
          padding: 0.58rem 0.68rem;
          font-size: 0.86rem;
          font-weight: 800;
          text-decoration: none;
          transition: color 160ms ease, background 160ms ease;
        }

        .nav-link:hover {
          background: oklch(100% 0 0 / 0.58);
          color: #6d45a8;
        }

        .nav-actions {
          margin-left: clamp(1.25rem, 3vw, 3rem);
        }

        .solana-pill {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          gap: 0.58rem;
          border: 1px solid var(--tfn-border);
          border-radius: 999px;
          padding: 0 0.86rem;
          color: #23365f;
          background: oklch(100% 0 0 / 0.54);
          font-size: 0.78rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .solana-pill span {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: linear-gradient(135deg, #f4cf7b 0%, #d8a43c 54%, #6d45a8 100%);
          box-shadow: 0 6px 16px oklch(37% 0.11 302 / 0.18);
        }

        .header-cta {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          gap: 0.55rem;
          border-radius: 999px;
          padding: 0 1.15rem;
          border: 1px solid oklch(74% 0.13 78 / 0.46);
          background: linear-gradient(135deg, #f4cf7b, #d8a43c);
          color: #2f2350;
          font-size: 0.84rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 12px 28px oklch(68% 0.14 76 / 0.28);
          white-space: nowrap;
        }

        .cta-arrow {
          display: inline-block;
          width: 0.46rem;
          height: 0.46rem;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: rotate(45deg);
        }

        .menu-button {
          position: relative;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid var(--tfn-border);
          border-radius: 999px;
          color: #11234a;
          background: oklch(100% 0 0 / 0.5);
        }

        .menu-button span,
        .menu-button span:before,
        .menu-button span:after {
          display: block;
          width: 18px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transition: transform 160ms ease, opacity 160ms ease;
        }

        .menu-button span {
          position: relative;
        }

        .menu-button span:before,
        .menu-button span:after {
          content: "";
          position: absolute;
          left: 0;
        }

        .menu-button span:before {
          top: -6px;
        }

        .menu-button span:after {
          top: 6px;
        }

        .menu-button span.open {
          background: transparent;
        }

        .menu-button span.open:before {
          transform: translateY(6px) rotate(45deg);
        }

        .menu-button span.open:after {
          transform: translateY(-6px) rotate(-45deg);
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .mobile-link {
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: oklch(100% 0 0 / 0.54);
          color: #23365f;
          padding: 0.9rem 1rem;
          font-size: 0.95rem;
          font-weight: 900;
          text-decoration: none;
        }
      `}</style>
    </header>
  )
}

function ToothLogo() {
  return (
    <span className="tooth-logo" aria-hidden>
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" fill="url(#coinFill)" />
        <circle cx="24" cy="24" r="17.5" stroke="#FFF6D9" strokeWidth="2" opacity="0.86" />
        <path
          d="M24 14.2c-2.2-2-5.9-2.2-8.2-.4-3.1 2.4-3.6 7-1.4 11.7 1.3 2.9 2.1 6.5 2.8 8.9.5 1.8 1.4 3.2 2.8 3.2 1.7 0 2.1-2.1 2.6-4.3.3-1.2.6-2.2 1.5-2.2s1.2 1 1.5 2.2c.5 2.2.9 4.3 2.6 4.3 1.4 0 2.3-1.4 2.8-3.2.7-2.4 1.5-6 2.8-8.9 2.2-4.7 1.7-9.3-1.4-11.7-2.5-1.8-6.1-1.6-8.4.4Z"
          fill="#FFFDF4"
          stroke="#6D45A8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M35.5 10.5v6" stroke="#FFF6D9" strokeWidth="2" strokeLinecap="round" />
        <path d="M32.5 13.5h6" stroke="#FFF6D9" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <radialGradient id="coinFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17 14) rotate(55) scale(31)">
            <stop stopColor="#FFE8A3" />
            <stop offset="0.48" stopColor="#D8A43C" />
            <stop offset="1" stopColor="#8A5CC5" />
          </radialGradient>
        </defs>
      </svg>
      <style jsx>{`
        .tooth-logo {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 999px;
          background: #fffaf1;
          box-shadow: 0 8px 22px oklch(37% 0.11 302 / 0.12);
        }

        svg {
          width: 32px;
          height: 32px;
        }
      `}</style>
    </span>
  )
}
