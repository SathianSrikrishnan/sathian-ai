"use client"

// ─── TFN Unified Header ──────────────────────────────────────────────────
// Theme-adaptive sticky header rendered on every /toothfairy/* route.
// - Logo (Alegreya display wordmark) left
// - Nav links (Alegreya Sans) center, with gold underline on active route
// - Mobile: collapses to hamburger + slide-down panel
// - Sticky with backdrop-blur over the active theme's surface
// - Gold stays identical across theme swap (throughline)

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "./theme-context"

const LINKS = [
  { href: "/toothfairy", label: "Home" },
  { href: "/toothfairy/stories", label: "Stories" },
  { href: "/toothfairy/app", label: "App" },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/toothfairy") return pathname === "/toothfairy"
  return pathname === href || pathname.startsWith(href + "/")
}

export function TFNHeader() {
  const { mode } = useTheme()
  const pathname = usePathname() || "/toothfairy"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Surface tint that sits over var(--tfn-surface). Slightly transparent so
  // the blur reads as actual frosted glass, not a flat bar.
  const bgTint =
    mode === "parent"
      ? scrolled
        ? "oklch(97.5% 0.01 80 / 0.82)"
        : "oklch(97.5% 0.01 80 / 0.55)"
      : scrolled
        ? "oklch(12% 0.04 270 / 0.82)"
        : "oklch(12% 0.04 270 / 0.55)"

  const borderColor = scrolled ? "var(--tfn-border)" : "transparent"

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: bgTint,
        backdropFilter: "blur(10px) saturate(160%)",
        WebkitBackdropFilter: "blur(10px) saturate(160%)",
        borderBottom: `1px solid ${borderColor}`,
        transition:
          "background-color 400ms cubic-bezier(0.4, 0, 0.2, 1), border-color 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-6">
        {/* Logo / wordmark (Alegreya display) */}
        <Link
          href="/toothfairy"
          className="relative shrink-0 text-base font-semibold tracking-tight sm:text-lg"
          style={{
            fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
            color: "var(--tfn-ink)",
          }}
        >
          <span className="hidden sm:inline">Tooth Fairy Network</span>
          <span className="sm:hidden">Tooth Fairy</span>
        </Link>

        {/* Center links — desktop */}
        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm transition-opacity hover:opacity-100"
                style={{
                  fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                  color: "var(--tfn-ink)",
                  opacity: active ? 1 : 0.72,
                }}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: "var(--tfn-gold)" }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            color: "var(--tfn-ink)",
          }}
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
              <path
                d="M1 1h16M1 7h16M1 13h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile slide-down panel */}
      {mobileOpen && (
        <div
          className="sm:hidden"
          style={{
            backgroundColor: bgTint,
            backdropFilter: "blur(14px) saturate(160%)",
            WebkitBackdropFilter: "blur(14px) saturate(160%)",
            borderBottom: `1px solid var(--tfn-border)`,
          }}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base"
                  style={{
                    fontFamily:
                      "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                    color: "var(--tfn-ink)",
                    opacity: active ? 1 : 0.78,
                    backgroundColor: active
                      ? "var(--tfn-accent-soft)"
                      : "transparent",
                  }}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--tfn-gold)" }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
