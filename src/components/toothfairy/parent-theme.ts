// ─── TFN Parent Theme (Impeccable Aligned) ─────────────────────────────
// Apr 2026 unification: parent theme now matches the Impeccable landing
// palette exactly. Keys preserved so existing /app code reading PC.gold
// / PC.goldDark / etc. keeps compiling. Values remapped to OKLCH-derived
// hex mirrors of the cream/brown/gold system.

const _cream = "#FBF7EE"       // oklch(97.5% 0.01 80)
const _creamDeep = "#F5EFE2"   // oklch(95% 0.015 75)
const _creamAlt = "#EFE7D4"    // oklch(91% 0.02 75)
const _brown = "#4B3A20"       // oklch(30% 0.035 65)
const _brownSoft = "#6B5637"   // oklch(42% 0.03 65)
const _brownMuted = "#9A8363"  // oklch(58% 0.025 65)
const _gold = "#D8A43C"        // oklch(72% 0.145 75)
const _goldDark = "#B6871F"    // oklch(62% 0.13 72)
const _goldLight = "#EFCF7C"   // oklch(82% 0.1 78)
const _border = "#E3D9C4"      // oklch(88% 0.015 75)

export const PC = {
  // Surfaces
  bg: _cream,
  bgAlt: _creamDeep,
  surface: _cream,
  surfaceContainerLow: _creamDeep,
  surfaceContainer: _creamDeep,
  surfaceHigh: _creamAlt,
  surfaceHighest: _creamAlt,

  // Text — warm brown hierarchy
  text: _brown,
  textWarm: _brown,
  muted: _brownSoft,
  dim: _brownMuted,

  // Accents — matches landing gold exactly now
  gold: _gold,
  goldDark: _goldDark,
  goldLight: _goldLight,
  goldSoft: "rgba(216, 164, 60, 0.12)",
  // The old parent theme had an institutional teal; Impeccable has no teal.
  // Mapped to a soft gold so existing references still render on-palette.
  teal: _goldDark,
  tealSoft: "rgba(216, 164, 60, 0.15)",

  // Borders
  border: _border,
  borderGold: "rgba(216, 164, 60, 0.22)",

  // On-gold text (for buttons with gold background)
  onGold: "#FFFFFF",

  // Error
  error: "#C4523A",
  errorContainer: "#F7E4DC",
}

export const parentGlass = {
  card: "rgba(251, 247, 238, 0.82)",
  cardBorder: _border,
  blur: "10px",
}

export const parentGlow = {
  gold: "0 2px 10px rgba(216, 164, 60, 0.2)",
  ctaFloat: "0 6px 18px rgba(216, 164, 60, 0.28)",
}

export const parentGradients = {
  stardust: `linear-gradient(135deg, ${_gold} 0%, ${_goldLight} 100%)`,
}
