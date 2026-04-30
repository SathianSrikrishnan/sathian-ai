// ─── TFN IMPECCABLE Design System (Cream · Brown · Gold) ────────────────
// Single visual language for every /toothfairy/* route, including /app.
// Prior incarnations of this file ("Celestial Ledger", "Stardust Ledger")
// shipped a dark indigo surface; the April 2026 Impeccable pass unified
// everything on warm cream + brown + gold. Token KEYS are preserved so
// the existing /app page.tsx (1000+ lines) keeps compiling unchanged —
// VALUES are remapped to the Impeccable palette.

// Hex mirrors of the OKLCH tokens published by ThemeTransition as CSS
// custom properties. Keep them in sync with
// src/components/toothfairy/nav/theme-context.tsx THEME_PALETTES.child.
const _cream = "#FBF7EE"      // oklch(97.5% 0.01 80)
const _creamDeep = "#F5EFE2"  // oklch(95% 0.015 75)
const _creamAlt = "#EFE7D4"   // oklch(91% 0.02 75)
const _brown = "#4B3A20"      // oklch(30% 0.035 65)
const _brownSoft = "#6B5637"  // oklch(42% 0.03 65)
const _brownMuted = "#9A8363" // oklch(58% 0.025 65)
const _gold = "#D8A43C"       // oklch(72% 0.145 75)
const _goldDark = "#B6871F"   // oklch(62% 0.13 72)
const _goldLight = "#EFCF7C"  // oklch(82% 0.1 78)
const _border = "#E3D9C4"     // oklch(88% 0.015 75)

export const C = {
  // Surfaces — cream hierarchy replacing the old navy hierarchy
  bg: _cream,
  bgAlt: _creamDeep,
  surface: _cream,
  surfaceContainer: _creamDeep,
  surfaceHigh: _creamDeep,
  surfaceHighest: _creamAlt,
  surfaceBright: _cream,
  bgSecondary: _creamDeep,

  // Text — brown hierarchy replacing moonlight whites
  text: _brown,
  textWarm: _brown,
  muted: _brownSoft,
  dim: _brownMuted,
  softGrey: _brownMuted,

  // Primary: Fairy Gold (unchanged role, unified hex)
  gold: _gold,
  heroGold: _goldLight,
  goldLight: _goldLight,
  primaryFixed: _gold,
  goldDim: _goldDark,
  goldSoft: "rgba(216, 164, 60, 0.12)",
  goldGlow: "rgba(216, 164, 60, 0.08)",
  onGold: "#FFFFFF",

  // Secondary: remapped from Stardust Teal to a warm accent so existing
  // `C.teal` / `C.cyan` references keep rendering on-palette. In practice
  // these are now just a softer gold — the Impeccable system has no teal.
  teal: _goldLight,
  tealContainer: _goldDark,
  tealSoft: "rgba(216, 164, 60, 0.15)",
  tealGlow: "rgba(216, 164, 60, 0.08)",

  // Tertiary: warm touches
  pearl: _cream,
  blush: "#E8C09A",
  blushLight: "#F3DCBF",
  ember: "#E6B480",

  // Borders — cream-toned ghost borders
  border: _border,
  borderGold: "rgba(216, 164, 60, 0.22)",
  borderTeal: _border,

  // Error
  error: "#C4523A",
  errorContainer: "#F7E4DC",

  // Legacy aliases (existing /app page.tsx reads C.rose for the primary CTA)
  rose: _gold,
  cyan: _goldLight,
  amber: _goldLight,
  emerald: _goldDark,
}

// Gradients — all warm now
export const gradients = {
  stardust: `linear-gradient(135deg, ${_goldLight} 0%, ${_gold} 100%)`,
  stardustBg: `radial-gradient(circle at 50% 50%, ${_cream} 0%, ${_creamDeep} 100%)`,
  fairyGlow: "radial-gradient(circle at 50% 50%, rgba(216, 164, 60, 0.1) 0%, transparent 70%)",
}

// Glow effects — warmer, softer, cream-compatible
export const glow = {
  gold: "0 0 24px rgba(216, 164, 60, 0.18), 0 0 60px rgba(216, 164, 60, 0.08)",
  goldStrong: "0 0 32px rgba(216, 164, 60, 0.28), 0 0 80px rgba(216, 164, 60, 0.12)",
  goldPhoto: "0 0 24px rgba(216, 164, 60, 0.35)",
  teal: "0 0 24px rgba(216, 164, 60, 0.12), 0 0 60px rgba(216, 164, 60, 0.06)",
  tealFirefly: "0 0 16px rgba(216, 164, 60, 0.3)",
  ambient: "0 20px 40px rgba(75, 58, 32, 0.08)",
  ctaFloat: "0 10px 30px rgba(216, 164, 60, 0.25)",
}

// Glass effects — paper-ish on cream now
export const glass = {
  card: "rgba(251, 247, 238, 0.75)",
  cardBorder: _border,
  blur: "10px",
  blurHeavy: "18px",
}

// Animation presets (Framer Motion)
export const fadeUp = {
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

export const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.1 },
})

// Reusable spring rhythm
export const motionSpringFast = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
  css: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
} as const

// Interactive shadow rhythm
export const shadowKeepsake = {
  c: "0 6px 20px oklch(72% 0.145 75 / 0.14)",
  pc: "0 4px 12px oklch(72% 0.145 75 / 0.15)",
} as const

// Design system constants — fonts swapped to Impeccable (Alegreya pair)
export const ds = {
  maxWidth: "375px",
  headerHeight: "64px",
  bottomNavHeight: "80px",
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1.5rem",
    xl: "2rem",
    full: "9999px",
  },
  fonts: {
    headline: "var(--font-display), 'Alegreya', Georgia, serif",
    body: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
    story: "var(--font-display), 'Alegreya', Georgia, serif",
  },
}
