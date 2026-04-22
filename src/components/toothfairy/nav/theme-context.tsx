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

export const THEME_PALETTES: Record<ThemeMode, Record<string, string>> = {
  parent: {
    "--tfn-surface": "oklch(97.5% 0.01 80)", // cream page base
    "--tfn-surface-alt": "oklch(95% 0.015 75)", // cream deep
    "--tfn-ink": "oklch(30% 0.035 65)", // warm brown
    "--tfn-ink-soft": "oklch(42% 0.03 65)",
    "--tfn-ink-muted": "oklch(58% 0.025 65)",
    "--tfn-border": "oklch(88% 0.015 75)",
    "--tfn-accent-soft": "oklch(72% 0.145 75 / 0.1)",
    // Gold is the throughline — identical in both modes
    "--tfn-gold": "oklch(72% 0.145 75)",
    "--tfn-gold-hover": "oklch(62% 0.13 72)",
    "--tfn-gold-soft": "oklch(72% 0.145 75 / 0.15)",
  },
  child: {
    "--tfn-surface": "oklch(12% 0.04 270)", // deep indigo
    "--tfn-surface-alt": "oklch(16% 0.045 270)",
    "--tfn-ink": "oklch(93% 0.01 80)", // pearl
    "--tfn-ink-soft": "oklch(82% 0.015 80)",
    "--tfn-ink-muted": "oklch(65% 0.02 80)",
    "--tfn-border": "oklch(30% 0.04 270)",
    "--tfn-accent-soft": "oklch(72% 0.145 75 / 0.15)",
    // Gold — identical anchor
    "--tfn-gold": "oklch(72% 0.145 75)",
    "--tfn-gold-hover": "oklch(62% 0.13 72)",
    "--tfn-gold-soft": "oklch(72% 0.145 75 / 0.15)",
  },
}
