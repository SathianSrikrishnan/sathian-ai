"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/toothfairy#how-it-works", label: "How It Works" },
  { href: "/toothfairy/keepsake/preview", label: "Savings" },
  { href: "/toothfairy/stories", label: "Stories" },
  { href: "/toothfairy/about", label: "For Families" },
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
              Tooth <b>Fairy Network</b>
            </span>
            <span className="brand-line">Memories today. Futures tomorrow.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:gap-3 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="solana-pill">
            <span aria-hidden />
            Built on Solana
          </span>
          <Link href="/toothfairy/app" className="header-cta">
            Join the Network
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
            Mint their first memory
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

        .brand-line {
          display: none;
          margin-top: 0.22rem;
          color: var(--tfn-ink-muted);
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.04em;
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
          background: linear-gradient(135deg, #14f195 0%, #80ecff 45%, #9945ff 100%);
          box-shadow: 0 6px 16px oklch(37% 0.11 302 / 0.18);
        }

        .header-cta {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          border-radius: 999px;
          padding: 0 1.05rem;
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          font-size: 0.84rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 10px 26px oklch(37% 0.11 302 / 0.22);
          white-space: nowrap;
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

        @media (min-width: 480px) {
          .brand-line {
            display: block;
          }
        }
      `}</style>
    </header>
  )
}

function ToothLogo() {
  return (
    <span className="tooth-logo" aria-hidden>
      <svg viewBox="0 0 48 48" fill="none">
        <path
          d="M24 7.5c-3.4-3-8.7-3.3-12.2-.6C7.2 10.4 6.4 17.3 9.7 24.4c2 4.4 3.1 9.7 4.2 13.3.8 2.7 2 4.7 4.1 4.7 2.5 0 3.1-3.1 3.8-6.4.4-1.8.8-3.2 2.2-3.2s1.8 1.4 2.2 3.2c.7 3.3 1.3 6.4 3.8 6.4 2.1 0 3.3-2 4.1-4.7 1.1-3.6 2.2-8.9 4.2-13.3 3.3-7.1 2.5-14-2.1-17.5-3.5-2.7-8.8-2.4-12.2.6Z"
          stroke="url(#toothGradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M36.5 5.5v8" stroke="#D8A43C" strokeWidth="2" strokeLinecap="round" />
        <path d="M32.5 9.5h8" stroke="#D8A43C" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="toothGradient" x1="8" y1="8" x2="41" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C94BA8" />
            <stop offset="0.55" stopColor="#6D45A8" />
            <stop offset="1" stopColor="#D8A43C" />
          </linearGradient>
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
