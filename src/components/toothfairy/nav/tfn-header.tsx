"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/toothfairy#how-it-works", label: "How It Works" },
  { href: "/toothfairy#cultural-tales", label: "Cultural Tales" },
  { href: "/toothfairy/stories", label: "Stories" },
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
          ? "oklch(97.5% 0.01 80 / 0.88)"
          : "oklch(97.5% 0.01 80 / 0.68)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        borderBottom: `1px solid ${scrolled ? "var(--tfn-border)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/toothfairy" className="flex items-center gap-3 no-underline">
          <span className="logo-mark" aria-hidden>
            T
          </span>
          <span className="leading-tight">
            <span
              className="block text-lg font-extrabold"
              style={{
                color: "var(--tfn-ink)",
                fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
              }}
            >
              Tooth Fairy Network
            </span>
            <span
              className="hidden text-[11px] font-bold uppercase tracking-[0.16em] sm:block"
              style={{ color: "var(--tfn-ink-muted)" }}
            >
              Memories today. Futures tomorrow.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-bold transition-opacity hover:opacity-75"
              style={{
                color: "var(--tfn-ink-soft)",
                fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="solana-pill">Built on Solana</span>
          <Link href="/toothfairy/app" className="header-cta">
            Start
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          style={{
            border: "1px solid var(--tfn-border)",
            color: "var(--tfn-ink)",
            background: "oklch(100% 0 0 / 0.4)",
          }}
        >
          <span aria-hidden>{mobileOpen ? "x" : "="}</span>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-4 md:hidden"
          style={{
            fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-sm font-bold"
              style={{ color: "var(--tfn-ink-soft)", background: "var(--tfn-surface-alt)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/toothfairy/app" className="header-cta mt-2 justify-center">
            Mint their first memory
          </Link>
        </nav>
      )}

      <style jsx>{`
        .logo-mark {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 2px solid #6d45a8;
          border-radius: 999px;
          color: #6d45a8;
          background: #fffaf1;
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-weight: 900;
          box-shadow: 0 8px 22px oklch(37% 0.11 302 / 0.12);
        }

        .solana-pill {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          border: 1px solid var(--tfn-border);
          border-radius: 999px;
          padding: 0 1rem;
          color: var(--tfn-ink-soft);
          background: oklch(100% 0 0 / 0.45);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .header-cta {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          border-radius: 999px;
          padding: 0 1.2rem;
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          font-size: 0.88rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 10px 26px oklch(37% 0.11 302 / 0.22);
        }
      `}</style>
    </header>
  )
}
