"use client"

// ─── TFN Theme Context ───────────────────────────────────────────────────
// Single source of truth for parent/child theme mode across every
// /toothfairy/* route. Mode drives CSS custom properties that the
// ThemeTransition component crossfades between. Gold tokens stay stable
// by design — they're the visual throughline across both modes.
//
// Usage:
//   <ThemeProvider defaultMode="parent">
//     <ThemeTransition>{children}</ThemeTransition>
//   </ThemeProvider>
//
// Consumers: const { mode, setMode } = useTheme()

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type ThemeMode = "parent" | "child"

interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "parent",
  setMode: () => {},
})

export function ThemeProvider({
  children,
  defaultMode = "parent",
}: {
  children: ReactNode
  defaultMode?: ThemeMode
}) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
  }, [])

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

// ─── Palette definitions ─────────────────────────────────────────────────
// These maps power ThemeTransition's inline CSS custom properties.
// Gold keys are identical across modes on purpose — they are the anchor.

// Apr 2026 Impeccable unification — both palettes share the cream/brown/gold
// system. The parent/child distinction is now UX-only (different flows in
// /app), not a visual theme swap. Child mode picks up slightly warmer
// backing (cream-deep surface, cream-alt alt) so the storybook feel reads
// a touch cozier without departing from the Impeccable language.
export const THEME_PALETTES: Record<ThemeMode, Record<string, string>> = {
  parent: {
    "--tfn-surface": "oklch(97.5% 0.01 80)",    // cream
    "--tfn-surface-alt": "oklch(95% 0.015 75)", // cream deep
    "--tfn-ink": "#11234a",
    "--tfn-ink-soft": "#334260",
    "--tfn-ink-muted": "#6b7280",
    "--tfn-border": "oklch(88% 0.015 75)",
    "--tfn-accent-soft": "rgba(109, 69, 168, 0.09)",
    "--tfn-gold": "oklch(72% 0.145 75)",
    "--tfn-gold-hover": "oklch(62% 0.13 72)",
    "--tfn-gold-soft": "oklch(72% 0.145 75 / 0.15)",
  },
  child: {
    "--tfn-surface": "oklch(95% 0.015 75)",     // cream deep — cozier
    "--tfn-surface-alt": "oklch(91% 0.02 75)",  // cream alt
    "--tfn-ink": "#11234a",
    "--tfn-ink-soft": "#334260",
    "--tfn-ink-muted": "#6b7280",
    "--tfn-border": "oklch(86% 0.02 75)",
    "--tfn-accent-soft": "rgba(109, 69, 168, 0.1)",
    "--tfn-gold": "oklch(72% 0.145 75)",
    "--tfn-gold-hover": "oklch(62% 0.13 72)",
    "--tfn-gold-soft": "oklch(72% 0.145 75 / 0.15)",
  },
}
