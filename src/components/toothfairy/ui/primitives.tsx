"use client"

// ─── TFN Impeccable UI Primitives ────────────────────────────────────────
// Shared components for every /toothfairy/* route. All styling reads from
// the CSS custom properties published by ThemeTransition, so these stay
// cohesive across parent/child modes and any future theme swap.
//
// Exports: CTA, GhostLink, Card, SectionLabel, Fade, Divider
//
// Do NOT hardcode colors here. Always reference var(--tfn-*) tokens.

import { useEffect, useRef, type ReactNode, type CSSProperties, type MouseEvent } from "react"
import Link from "next/link"

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)"

// ─── CTA ─────────────────────────────────────────────────────────────────
interface CTAProps {
  href?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
  children: ReactNode
  size?: "md" | "lg"
  variant?: "solid" | "ghost"
  className?: string
  style?: CSSProperties
  disabled?: boolean
  ariaLabel?: string
}

export function CTA({
  href,
  onClick,
  children,
  size = "md",
  variant = "solid",
  className = "",
  style,
  disabled,
  ariaLabel,
}: CTAProps) {
  const dims =
    size === "lg"
      ? "px-10 py-4 text-lg"
      : "px-7 py-3.5 text-base"

  const base: CSSProperties =
    variant === "solid"
      ? {
          background: "var(--tfn-gold)",
          color: "oklch(98% 0.005 80)",
          boxShadow: "0 8px 24px oklch(72% 0.145 75 / 0.28)",
        }
      : {
          background: "transparent",
          color: "var(--tfn-gold)",
          border: "1px solid var(--tfn-gold)",
          boxShadow: "none",
        }

  const common: CSSProperties = {
    fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
    fontWeight: 600,
    transition: `background 0.2s ${SPRING}, transform 0.15s ${SPRING}, box-shadow 0.25s ${SPRING}`,
    ...base,
    ...style,
  }

  const classes = `inline-flex items-center justify-center gap-2 rounded-full active:scale-[0.98] ${dims} ${className}`

  const onEnter = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return
    if (variant === "solid") {
      ;(e.currentTarget as HTMLElement).style.background = "var(--tfn-gold-hover)"
    } else {
      ;(e.currentTarget as HTMLElement).style.background = "var(--tfn-gold-soft)"
    }
  }
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return
    if (variant === "solid") {
      ;(e.currentTarget as HTMLElement).style.background = "var(--tfn-gold)"
    } else {
      ;(e.currentTarget as HTMLElement).style.background = "transparent"
    }
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={classes}
        style={common}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      style={{ ...common, opacity: disabled ? 0.5 : 1 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </button>
  )
}

// ─── GhostLink — inline text link with arrow, matches "Enter the world" ──
export function GhostLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-base font-medium"
      style={{
        color: "var(--tfn-gold)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        transition: `gap 0.3s ${SPRING}`,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.gap = "0.75rem"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.gap = "0.5rem"
      }}
    >
      {children}
      <span aria-hidden>&rarr;</span>
    </Link>
  )
}

// ─── Card — Impeccable paper card with lift-on-hover ─────────────────────
interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  interactive?: boolean
  padded?: boolean
}

export function Card({
  children,
  className = "",
  style,
  interactive = false,
  padded = true,
}: CardProps) {
  const baseShadow = "0 4px 18px oklch(30% 0.035 65 / 0.08), 0 1px 4px oklch(30% 0.035 65 / 0.06)"
  const liftShadow = "0 12px 32px oklch(30% 0.035 65 / 0.14), 0 3px 8px oklch(30% 0.035 65 / 0.08)"

  return (
    <div
      className={`rounded-[24px] ${padded ? "p-6 md:p-8" : ""} ${className}`}
      style={{
        background: "var(--tfn-surface-alt)",
        border: "1px solid var(--tfn-border)",
        boxShadow: baseShadow,
        transition: `transform 0.4s ${SPRING}, box-shadow 0.4s ${SPRING}`,
        ...style,
      }}
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = liftShadow
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = baseShadow
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

// ─── SectionLabel — uppercase gold eyebrow used on every page ───────────
export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-xs uppercase font-medium ${className}`}
      style={{
        color: "var(--tfn-gold)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        letterSpacing: "0.28em",
      }}
    >
      {children}
    </p>
  )
}

// ─── Fade — intersection-observer driven opacity/translate entrance ──────
export function Fade({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("opacity-100", "translate-y-0")
            el.classList.remove("opacity-0", "translate-y-4")
          }, delay)
          obs.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: "50px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 ${className}`}
      style={{
        transition: `opacity 0.7s ${SPRING}, transform 0.7s ${SPRING}`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Divider — hairline rule used between sections ───────────────────────
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto ${className}`}
      style={{
        maxWidth: "56rem",
        height: 1,
        background: "var(--tfn-border)",
      }}
    />
  )
}
