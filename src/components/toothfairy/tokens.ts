// ─── TFN Design Tokens ───────────────────────────────────────────────────────
// Single source of truth for colors and animation presets across all TFN pages

export const C = {
  bg: "#030712",
  surface: "rgba(255,255,255,0.02)",
  text: "#f9fafb",
  muted: "#9ca3af",
  dim: "#4b5563",
  border: "rgba(255,255,255,0.06)",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  emerald: "#10b981",
}

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
