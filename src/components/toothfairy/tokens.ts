// ─── TFN CELESTIAL LEDGER Design System ──────────────────────────────────────
// "Linear meets Bedtime Story" — extreme technical polish wrapped in dreamlike atmosphere
// Powered by Google Stitch "Stardust Ledger" export

// === Surface Hierarchy (stacked frosted glass layers) ===
// Base: surface (#0d1228) → Low: (#151a31) → Container: (#191e35) → High: (#242940) → Highest: (#2f334b)

export const C = {
  // Surfaces (the sky — layered depth)
  bg: "#0d1228",                      // deepest navy — base layer
  bgAlt: "#080d22",                   // surface-container-lowest — recessed elements
  surface: "#151a31",                 // surface-container-low — parent sections
  surfaceContainer: "#191e35",        // surface-container — standard cards
  surfaceHigh: "#242940",             // surface-container-high — interactive widgets
  surfaceHighest: "#2f334b",          // surface-container-highest — progress tracks, borders
  surfaceBright: "#333850",           // surface-bright — highlighted sections

  // Text (moonlight hierarchy)
  text: "#dde1ff",                    // on-surface — primary text
  textWarm: "#FFF8F0",               // pearl white — high-contrast warm text
  muted: "#d1c5b0",                  // on-surface-variant — secondary text
  dim: "#9a907c",                    // outline — tertiary/label text
  softGrey: "#9ca3af",              // soft grey — micro-copy

  // Primary: Fairy Gold (the magic — CTAs, headlines, accents)
  gold: "#f0c456",                   // primary-container — solid gold accent
  heroGold: "#ffe3a5",              // hero gold — shimmer text effects
  goldLight: "#ffe3a5",              // primary — light gold for text
  primaryFixed: "#edc153",           // primary-fixed — secondary CTAs
  goldDim: "#edc153",                // primary-fixed-dim — dimmed gold
  goldSoft: "rgba(240, 196, 86, 0.15)",  // gold tint backgrounds
  goldGlow: "rgba(240, 196, 86, 0.1)",   // gold glow effect
  onGold: "#3e2e00",                 // on-primary — text on gold buttons

  // Secondary: Stardust Teal (the data — progress, active states, firefly glow)
  teal: "#5adace",                   // secondary — stardust teal
  tealContainer: "#01a89d",          // secondary-container — teal buttons
  tealSoft: "rgba(90, 218, 206, 0.3)",
  tealGlow: "rgba(90, 218, 206, 0.1)",

  // Tertiary: Warm touches (the human)
  pearl: "#FFF8F0",                  // tooth pearl — warm white
  blush: "#fbb5b5",                  // tertiary-fixed-dim — blush pink
  blushLight: "#ffdede",             // tertiary — light blush
  ember: "#ffb8b8",                  // tertiary-container — warm accents

  // Borders & outlines (ghost borders — never solid 1px)
  border: "rgba(78, 70, 54, 0.15)",  // outline-variant at 15% — ghost border
  borderGold: "rgba(240, 196, 86, 0.15)", // gold-tinted ghost border
  borderTeal: "rgba(90, 218, 206, 0.15)", // teal ghost border

  // Error
  error: "#ffb4ab",
  errorContainer: "#93000a",

  // Legacy aliases (backward compat with existing code)
  rose: "#f0c456",
  cyan: "#5adace",
  amber: "#ffb8b8",
  emerald: "#5adace",
  bgSecondary: "#151a31",
}

// Gradients
export const gradients = {
  stardust: "linear-gradient(135deg, #ffe3a5 0%, #f0c456 100%)",   // gold CTA gradient
  stardustBg: "radial-gradient(circle at 50% 50%, #191e35 0%, #0d1228 100%)",  // background radial
  fairyGlow: "radial-gradient(circle at 50% 50%, rgba(90, 218, 206, 0.1) 0%, transparent 70%)",
}

// Glow effects
export const glow = {
  gold: "0 0 20px rgba(240, 196, 86, 0.1), 0 0 60px rgba(240, 196, 86, 0.05)",
  goldStrong: "0 0 30px rgba(240, 196, 86, 0.2), 0 0 80px rgba(240, 196, 86, 0.1)",
  goldPhoto: "0 0 20px rgba(240, 196, 86, 0.4)",
  teal: "0 0 20px rgba(90, 218, 206, 0.1), 0 0 60px rgba(90, 218, 206, 0.05)",
  tealFirefly: "0 0 15px rgba(90, 218, 206, 0.3)",
  ambient: "0 20px 40px rgba(0, 0, 0, 0.4)",   // ambient shadow (never pure black)
  ctaFloat: "0 10px 30px rgba(240, 196, 86, 0.2)",  // CTA button float
}

// Glass effects
export const glass = {
  card: "rgba(47, 51, 75, 0.4)",     // surface-variant at 40% — glassmorphism
  cardBorder: "rgba(78, 70, 54, 0.15)",
  blur: "12px",
  blurHeavy: "20px",
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

// Design system constants
export const ds = {
  maxWidth: "375px",                  // mobile-first focal width
  headerHeight: "64px",              // h-16
  bottomNavHeight: "80px",           // pb-6 pt-3 + content
  borderRadius: {
    sm: "0.5rem",                    // rounded-lg
    md: "0.75rem",                   // rounded-xl
    lg: "1.5rem",                    // rounded-2xl — cards, buttons
    xl: "2rem",                      // rounded-[2rem] — feature sections
    full: "9999px",
  },
  fonts: {
    headline: "'Plus Jakarta Sans', sans-serif",
    body: "'Manrope', sans-serif",
    story: "'Lora', serif",
  },
}
