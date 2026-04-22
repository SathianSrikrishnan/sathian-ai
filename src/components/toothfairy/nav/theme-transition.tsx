"use client"

// ─── TFN Theme Transition ────────────────────────────────────────────────
// Wraps children in a root div that sets CSS custom properties from the
// active theme palette and crossfades them over 400ms when `mode` changes.
// Gold tokens are in both palettes but share the same value, so they
// anchor-stabilize across the transition (no flicker).
//
// Consumer pages read these via `var(--tfn-surface)`, `var(--tfn-ink)`,
// `var(--tfn-gold)`, etc. Existing pages can opt-in gradually — the
// component is passive until those vars are referenced in style.

import { type ReactNode } from "react"
import { useTheme, THEME_PALETTES } from "./theme-context"

// "Like turning a page" — ease-in-out cubic, 400ms. NOT spring.
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)"
const DURATION = "400ms"

export function ThemeTransition({ children }: { children: ReactNode }) {
  const { mode } = useTheme()
  const palette = THEME_PALETTES[mode]

  // Build a transition string that animates every custom-property-derived
  // color on this subtree. We transition background-color and color on the
  // wrapper, and any child reading var(--tfn-*) will follow because CSS
  // custom properties themselves are re-resolved when the value object
  // (style) swaps — browsers animate the resulting computed color.
  const transition = `background-color ${DURATION} ${EASE}, color ${DURATION} ${EASE}, border-color ${DURATION} ${EASE}`

  return (
    <div
      data-tfn-theme={mode}
      style={{
        ...(palette as React.CSSProperties),
        backgroundColor: "var(--tfn-surface)",
        color: "var(--tfn-ink)",
        transition,
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  )
}
