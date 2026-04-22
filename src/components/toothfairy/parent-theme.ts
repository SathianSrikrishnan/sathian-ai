// ─── TFN Parent Theme (Impeccable-aligned) ────────────────────────────
// Warm, trustworthy, earned — matches the landing page cream palette
// OKLCH colors, no pure black/white, amber-tinted neutrals

export const PC = {
  // Surfaces (warm cream, amber-tinted)
  bg:                    'oklch(97.5% 0.01 80)',   // warm cream base
  bgAlt:                 'oklch(98.5% 0.008 80)',  // lightest
  surface:               'oklch(97.5% 0.01 80)',   // matches bg
  surfaceContainerLow:   'oklch(96% 0.012 78)',    // subtle depth
  surfaceContainer:      'oklch(95% 0.015 75)',    // cards
  surfaceHigh:           'oklch(93% 0.012 78)',    // interactive
  surfaceHighest:        'oklch(91% 0.01 78)',     // borders, tracks

  // Text (warm brown hierarchy)
  text:                  'oklch(30% 0.035 65)',    // primary — warm near-black
  textWarm:              'oklch(25% 0.04 65)',     // headlines
  muted:                 'oklch(42% 0.03 65)',     // secondary
  dim:                   'oklch(58% 0.025 65)',    // tertiary/labels

  // Accents (amber gold)
  gold:                  'oklch(72% 0.145 75)',    // CTA, badges
  goldDark:              'oklch(45% 0.1 70)',      // gold text on light bg
  goldLight:             'oklch(82% 0.1 78)',      // subtle accent
  goldSoft:              'oklch(72% 0.145 75 / 0.1)', // tint backgrounds
  teal:                  'oklch(45% 0.1 175)',     // institutional accent
  tealSoft:              'oklch(45% 0.1 175 / 0.1)',

  // Borders
  border:                'oklch(88% 0.015 75)',    // warm dividers
  borderGold:            'oklch(72% 0.145 75 / 0.2)',

  // On-gold
  onGold:                'oklch(98% 0.005 80)',    // warm white on gold

  // Error
  error:                 'oklch(55% 0.2 25)',
  errorContainer:        'oklch(95% 0.03 25)',
}

export const parentGlass = {
  card:                  'oklch(97.5% 0.01 80 / 0.9)',
  cardBorder:            'oklch(88% 0.015 75)',
  blur:                  '12px',
}

export const parentGlow = {
  gold:                  '0 2px 12px oklch(72% 0.145 75 / 0.15)',
  ctaFloat:              '0 4px 24px oklch(72% 0.145 75 / 0.2)',
}

export const parentGradients = {
  stardust:              'oklch(72% 0.145 75)',    // solid gold — no gradient
}
