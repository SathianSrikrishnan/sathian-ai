// ─── TFN Child Theme (Impeccable-aligned) ─────────────────────────────
// Deep indigo night sky with warm gold accents
// OKLCH colors, no pure black/white, no teal as primary

export const C = {
  // Surfaces (deep indigo night — layered depth)
  bg:                    'oklch(12% 0.04 270)',    // deep indigo base
  bgAlt:                 'oklch(8% 0.03 270)',     // deepest — recessed
  surface:               'oklch(16% 0.04 270)',    // cards base
  surfaceContainer:      'oklch(18% 0.04 270)',    // standard cards
  surfaceHigh:           'oklch(22% 0.035 270)',   // interactive widgets
  surfaceHighest:        'oklch(26% 0.03 270)',    // progress tracks
  surfaceBright:         'oklch(30% 0.03 270)',    // highlighted

  // Text (warm moonlight hierarchy)
  text:                  'oklch(93% 0.01 80)',     // primary — warm off-white
  textWarm:              'oklch(96% 0.01 80)',     // high-contrast warm
  muted:                 'oklch(78% 0.02 80)',     // secondary
  dim:                   'oklch(60% 0.02 80)',     // tertiary/labels
  softGrey:              'oklch(65% 0.015 270)',   // micro-copy

  // Primary: Fairy Gold (magic — CTAs, headlines, accents)
  gold:                  'oklch(78% 0.14 80)',     // solid gold accent
  heroGold:              'oklch(85% 0.1 80)',      // shimmer text
  goldLight:             'oklch(85% 0.1 80)',      // light gold
  primaryFixed:          'oklch(75% 0.13 78)',     // secondary CTAs
  goldDim:               'oklch(75% 0.13 78)',     // dimmed gold
  goldSoft:              'oklch(78% 0.14 80 / 0.15)', // tint backgrounds
  goldGlow:              'oklch(78% 0.14 80 / 0.1)',  // glow effect
  onGold:                'oklch(20% 0.04 75)',     // text on gold buttons

  // Secondary: Stardust Teal (data — progress, active states)
  teal:                  'oklch(75% 0.12 185)',    // stardust teal
  tealContainer:         'oklch(60% 0.12 185)',    // teal buttons
  tealSoft:              'oklch(75% 0.12 185 / 0.3)',
  tealGlow:              'oklch(75% 0.12 185 / 0.1)',

  // Tertiary: Warm touches
  pearl:                 'oklch(96% 0.01 80)',     // tooth pearl
  blush:                 'oklch(78% 0.08 15)',     // blush pink
  blushLight:            'oklch(88% 0.06 15)',     // light blush
  ember:                 'oklch(82% 0.08 25)',     // warm accent

  // Borders (ghost borders)
  border:                'oklch(40% 0.03 75 / 0.15)',
  borderGold:            'oklch(78% 0.14 80 / 0.15)',
  borderTeal:            'oklch(75% 0.12 185 / 0.15)',

  // Error
  error:                 'oklch(75% 0.12 20)',
  errorContainer:        'oklch(25% 0.1 20)',

  // Legacy aliases
  rose:                  'oklch(78% 0.14 80)',
  cyan:                  'oklch(75% 0.12 185)',
  amber:                 'oklch(82% 0.08 25)',
  emerald:               'oklch(75% 0.12 185)',
  bgSecondary:           'oklch(16% 0.04 270)',
}

// Gradients
export const gradients = {
  stardust:              'oklch(78% 0.14 80)',     // solid gold — no gradient text
  stardustBg:            `radial-gradient(circle at 50% 50%, oklch(18% 0.04 270) 0%, oklch(12% 0.04 270) 100%)`,
  fairyGlow:             `radial-gradient(circle at 50% 50%, oklch(75% 0.12 185 / 0.1) 0%, transparent 70%)`,
}

// Glow effects
export const glow = {
  gold:                  '0 0 20px oklch(78% 0.14 80 / 0.1), 0 0 60px oklch(78% 0.14 80 / 0.05)',
  goldStrong:            '0 0 30px oklch(78% 0.14 80 / 0.2), 0 0 80px oklch(78% 0.14 80 / 0.1)',
  goldPhoto:             '0 0 20px oklch(78% 0.14 80 / 0.4)',
  teal:                  '0 0 20px oklch(75% 0.12 185 / 0.1), 0 0 60px oklch(75% 0.12 185 / 0.05)',
  tealFirefly:           '0 0 15px oklch(75% 0.12 185 / 0.3)',
  ambient:               '0 20px 40px oklch(12% 0.04 270 / 0.4)',
  ctaFloat:              '0 10px 30px oklch(78% 0.14 80 / 0.2)',
}

// Glass effects (minimal — avoid overuse per Impeccable)
export const glass = {
  card:                  'oklch(26% 0.03 270 / 0.4)',
  cardBorder:            'oklch(40% 0.03 75 / 0.15)',
  blur:                  '12px',
  blurHeavy:             '20px',
}

// Animation presets (exponential ease-out)
export const fadeUp = {
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

export const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.1 },
})

// Design system constants
export const ds = {
  maxWidth: '375px',
  headerHeight: '64px',
  bottomNavHeight: '80px',
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1.5rem',
    xl: '2rem',
    full: '9999px',
  },
  fonts: {
    headline: "var(--font-display, 'Alegreya'), serif",
    body: "var(--font-body, 'Alegreya Sans'), sans-serif",
    story: "var(--font-display, 'Alegreya'), serif",
  },
}
