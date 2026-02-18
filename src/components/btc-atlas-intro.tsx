'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesBackground } from '@/components/ui/sparkles-background'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SiteNav } from '@/components/SiteNav'

const AtlasGlobeTeaser = dynamic(
  () => import('@/components/ui/atlas-globe-teaser').then((mod) => mod.AtlasGlobeTeaser),
  { ssr: false }
)

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#050510',
  surface: '#0F0F2D',
  nebula: '#7C3AED',
  aurora: '#06B6D4',
  stardust: '#F59E0B',
  plasma: '#EC4899',
  text: '#F1F5F9',
  muted: '#A78BFA',
}

const PILLAR_COLORS: Record<string, string> = {
  music: '#A855F7',
  dialing: '#3B82F6',
  sports: '#F97316',
  history: '#EAB308',
  internet: '#22C55E',
}

// ─── Hero marker stories ────────────────────────────────────────────────────
const HERO_STORIES = [
  {
    number: '404',
    label: 'Atlanta, GA',
    pillars: ['music', 'dialing', 'internet'] as const,
    story:
      "When Bitcoin hits $404,000, it lands on Atlanta\u2019s area code \u2014 the birthplace of trap music, OutKast\u2019s hometown, AND the internet\u2019s most famous error code. Three pillars. One number.",
  },
  {
    number: '808',
    label: 'TR-808 Drum Machine',
    pillars: ['music', 'internet'] as const,
    story:
      "The Roland TR-808 didn\u2019t just make beats \u2014 it invented an entire genre. When Bitcoin crosses $808,000, it passes through the sound that built hip-hop, from Kanye to Travis Scott to the entire SoundCloud generation.",
  },
  {
    number: '212',
    label: 'Manhattan, NY',
    pillars: ['music', 'dialing'] as const,
    story:
      "Manhattan. The center of the world. An area code that Biggie rapped over and Azealia Banks turned into a global hit. +212 is also Morocco\u2019s country code \u2014 culture doesn\u2019t stay in one place.",
  },
]

// ─── Pillar data ────────────────────────────────────────────────────────────
const PILLARS = [
  {
    key: 'music',
    label: 'Music',
    tagline: 'Area codes became anthems.',
    examples: '212 NYC \u00b7 404 Atlanta \u00b7 313 Detroit \u00b7 305 Miami',
    count: 150,
  },
  {
    key: 'dialing',
    label: 'Area Codes',
    tagline: 'Every country has a code.',
    examples: '+44 London \u00b7 +81 Tokyo \u00b7 +234 Lagos \u00b7 +91 Mumbai',
    count: 300,
  },
  {
    key: 'sports',
    label: 'Sports',
    tagline: 'Jersey numbers, retired legends.',
    examples: '23 Jordan \u00b7 99 Gretzky \u00b7 10 Pel\u00e9 \u00b7 24 Kobe',
    count: 100,
  },
  {
    key: 'history',
    label: 'History',
    tagline: 'Years that bent civilization.',
    examples: '776 Independence \u00b7 969 Moon landing \u00b7 008 Satoshi',
    count: 200,
  },
  {
    key: 'internet',
    label: 'Internet',
    tagline: 'Meme culture. Protocol numbers.',
    examples: '404 Not Found \u00b7 420 Universal \u00b7 069 Nice \u00b7 200 OK',
    count: 50,
  },
]

// ─── Animation variants ─────────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function BtcAtlasIntro() {
  return (
    <main className="relative min-h-screen" style={{ background: C.bg }}>
      <SiteNav />

      {/* ─── Background atmosphere ──────────────────────────────────── */}
      <AuroraBackground
        colors={[C.nebula, C.aurora, C.plasma]}
        intensity="subtle"
        className="fixed inset-0 z-0"
      />
      <SparklesBackground count={20} color={C.muted} minSize={1} maxSize={2} className="fixed inset-0 z-[1]" />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION A — HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          className="flex flex-col items-center text-center max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Label */}
          <motion.span
            className="font-mono text-[11px] uppercase tracking-[0.2em] mb-6"
            style={{ color: `${C.muted}80` }}
            variants={fadeUp}
          >
            BTC Cultural Atlas
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="font-display text-display-lg sm:text-display-2xl text-gradient-cosmic leading-tight"
            variants={fadeUp}
          >
            Every Number Tells a Story
          </motion.h1>

          {/* Subhead */}
          <motion.p
            className="mt-6 text-lg sm:text-xl max-w-xl leading-relaxed"
            style={{ color: `${C.text}cc` }}
            variants={fadeUp}
          >
            Bitcoin&apos;s price is an accidental tour guide through world culture.
          </motion.p>

          {/* Globe */}
          <motion.div
            className="mt-10 sm:mt-14 globe-glow-wrapper w-full"
            variants={fadeUp}
          >
            <AtlasGlobeTeaser size={400} />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono" style={{ color: C.muted }}>the thesis</span>
              <motion.div
                className="w-px h-8"
                style={{ background: `linear-gradient(to bottom, ${C.muted}40, transparent)` }}
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION B — THE THESIS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-28">
        <ScrollReveal>
          <p
            className="font-display text-2xl sm:text-3xl leading-relaxed"
            style={{ color: `${C.text}dd` }}
          >
            <span className="text-gradient-cosmic font-semibold">808</span> is a drum machine
            that invented a genre. <span style={{ color: PILLAR_COLORS.internet }}>404</span> is the
            internet&apos;s most famous error AND Atlanta&apos;s calling card.{' '}
            <span style={{ color: PILLAR_COLORS.music }}>212</span> is Manhattan&apos;s soul, a Biggie lyric,
            and an Azealia Banks anthem.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p
            className="mt-10 text-base sm:text-lg leading-relaxed"
            style={{ color: `${C.text}99` }}
          >
            As Bitcoin&apos;s price moves through $1,000 increments, each three-digit number it passes
            through carries weight &mdash; area codes that people tattoo on their arms, HTTP codes
            developers mutter in their sleep, jersey numbers retired league-wide, meme numbers
            that need no explanation in any language.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p
            className="mt-8 text-base sm:text-lg leading-relaxed"
            style={{ color: `${C.text}99` }}
          >
            The Cultural Atlas maps what&apos;s on the other side. 463 markers across 5 cultural
            pillars &mdash; music, dialing codes, sports, history, and internet culture &mdash;
            updating in real-time as the price moves.
          </p>
        </ScrollReveal>

        {/* How it works diagram */}
        <ScrollReveal delay={0.35}>
          <div
            className="mt-14 rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(15, 15, 45, 0.55)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: `${C.muted}60` }}>
              How it works
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Price */}
              <div className="text-center">
                <div className="font-display tabular-nums text-2xl sm:text-3xl font-bold" style={{ color: C.text }}>
                  $404,000
                </div>
                <div className="font-mono mt-1.5 text-[10px]" style={{ color: `${C.muted}60` }}>BTC Price</div>
              </div>

              {/* Arrow */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: `${C.muted}40` }} className="rotate-90 sm:rotate-0 shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>

              {/* Number */}
              <div className="text-center">
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold" style={{ color: C.aurora }}>
                  404
                </div>
                <div className="font-mono mt-1.5 text-[10px]" style={{ color: `${C.muted}60` }}>3-digit code</div>
              </div>

              {/* Arrow */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: `${C.muted}40` }} className="rotate-90 sm:rotate-0 shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>

              {/* Culture */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  {Object.values(PILLAR_COLORS).map((color) => (
                    <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  ))}
                </div>
                <div className="font-mono mt-1 text-[10px]" style={{ color: `${C.muted}60` }}>Cultural markers</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION C — HERO MARKERS (mini stories)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: `${C.muted}60` }}>
            Featured markers
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-14" style={{ color: C.text }}>
            The numbers tell stories.
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-8">
          {HERO_STORIES.map((marker, i) => {
            const primaryColor = PILLAR_COLORS[marker.pillars[0]]
            return (
              <ScrollReveal key={marker.number} delay={i * 0.12}>
                <div
                  className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}08, rgba(15,15,45,0.55))`,
                    border: `1px solid ${primaryColor}20`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Large number background */}
                  <div
                    className="absolute -right-4 -top-6 font-mono text-[140px] sm:text-[200px] font-bold leading-none select-none pointer-events-none"
                    style={{ color: `${primaryColor}06` }}
                  >
                    {marker.number}
                  </div>

                  <div className="relative z-10">
                    {/* Number + label */}
                    <div className="flex items-baseline gap-4 mb-4">
                      <span
                        className="font-mono text-5xl sm:text-6xl font-bold tabular-nums"
                        style={{
                          color: primaryColor,
                          textShadow: `0 0 40px ${primaryColor}30`,
                        }}
                      >
                        {marker.number}
                      </span>
                      <span
                        className="font-display text-lg sm:text-xl font-semibold"
                        style={{ color: `${C.text}cc` }}
                      >
                        {marker.label}
                      </span>
                    </div>

                    {/* Story */}
                    <p
                      className="text-base sm:text-lg leading-relaxed max-w-2xl"
                      style={{ color: `${C.text}99` }}
                    >
                      {marker.story}
                    </p>

                    {/* Pillar indicators */}
                    <div className="mt-5 flex items-center gap-3">
                      {marker.pillars.map((p) => (
                        <span key={p} className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              background: PILLAR_COLORS[p],
                              boxShadow: `0 0 6px ${PILLAR_COLORS[p]}60`,
                            }}
                          />
                          <span
                            className="font-mono text-[10px] uppercase tracking-wider"
                            style={{ color: `${PILLAR_COLORS[p]}cc` }}
                          >
                            {p === 'dialing' ? 'Area Code' : p}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION D — THE FIVE PILLARS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <ScrollReveal>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: `${C.muted}60` }}>
            Five lenses
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4" style={{ color: C.text }}>
            The cultural pillars.
          </h2>
          <p className="max-w-lg text-sm leading-relaxed mb-12" style={{ color: `${C.text}66` }}>
            Every marker belongs to one or more pillars &mdash; the cultural DNA that gives numbers their meaning.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const color = PILLAR_COLORS[pillar.key]
            return (
              <ScrollReveal key={pillar.key} delay={i * 0.08}>
                <div
                  className="glass-card rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${color}06, rgba(15,15,45,0.55))`,
                    borderColor: `${color}15`,
                  }}
                >
                  <div className="mb-4 h-[2px] w-12" style={{ background: color }} />

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: color,
                        boxShadow: `0 0 8px ${color}60`,
                      }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
                      {pillar.label}
                    </span>
                    <span className="font-mono text-[9px] ml-auto" style={{ color: `${color}60` }}>
                      ~{pillar.count}+
                    </span>
                  </div>

                  <h3 className="font-display text-base font-semibold mb-3" style={{ color: `${C.text}dd` }}>
                    {pillar.tagline}
                  </h3>

                  <p className="font-mono text-xs leading-relaxed" style={{ color: `${C.text}44` }}>
                    {pillar.examples}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}

          {/* Explore All card */}
          <ScrollReveal delay={0.4}>
            <a
              href="https://btc.sathian.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card rounded-2xl p-6 block h-full transition-all"
              style={{
                background: `linear-gradient(135deg, ${C.nebula}08, ${C.aurora}05)`,
              }}
            >
              <div
                className="mb-4 h-[2px] w-12"
                style={{ background: `linear-gradient(90deg, ${C.nebula}, ${C.aurora})` }}
              />
              <h3 className="font-display text-base font-semibold mb-3" style={{ color: `${C.text}dd` }}>
                Explore the full atlas
              </h3>
              <p className="font-mono text-xs mb-4" style={{ color: `${C.text}44` }}>
                463 markers across all pillars. Globe view, map view, live price.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-gradient-cosmic">
                <span>Launch Atlas</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: C.aurora }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION E — THE INVITATION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
        <ScrollReveal>
          <p
            className="font-display text-2xl sm:text-3xl leading-relaxed mb-12"
            style={{ color: `${C.text}bb` }}
          >
            The price moves. The stories change.
            <br />
            <span className="text-gradient-cosmic font-semibold">The atlas grows.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://btc.sathian.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display rounded-xl px-10 py-4 text-sm font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
              style={{
                color: C.bg,
                background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})`,
              }}
            >
              Explore the Atlas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="https://btc.sathian.ai/about"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display rounded-xl px-10 py-4 text-sm font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
              style={{
                color: C.aurora,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Read the Manifesto
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 font-mono text-xs" style={{ color: `${C.muted}50` }}>
            463 markers &middot; 5 cultural pillars &middot; 7 regions &middot; Real-time price tracking
          </div>

          {/* Credit */}
          <div className="mt-16 font-mono text-xs" style={{ color: `${C.muted}30` }}>
            Built by{' '}
            <Link href="/" className="transition-colors hover:text-white/60" style={{ color: `${C.muted}50` }}>
              Sathian
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
