'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'motion/react'
import { FAIRY_NODES } from '@/components/ui/cosmic-globe'

const CosmicGlobe = dynamic(
  () => import('@/components/ui/cosmic-globe').then((mod) => mod.CosmicGlobe),
  { ssr: false }
)

// ─── Color Palette ────────────────────────────────────────────────────────────
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

// ─── Stats Data ───────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Teeth Collected', value: '47,832', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707', color: C.aurora },
  { label: 'Active Fairies', value: '1,247', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: C.nebula },
  { label: 'NFTs Minted', value: '12,503', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: C.stardust },
  { label: 'Countries', value: '84', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: C.plasma },
]

// ─── Explore Pages ────────────────────────────────────────────────────────────
const EXPLORE_PAGES = [
  {
    href: '/toothfairy/demo-a',
    title: 'Midnight Storybook',
    description: 'A dark, enchanted storybook experience with animated fairy tales.',
    accent: C.nebula,
  },
  {
    href: '/toothfairy/demo-b',
    title: 'Cosmic Fairy Network',
    description: 'Watch the global fairy network pulse with real-time tooth arrivals.',
    accent: C.aurora,
  },
  {
    href: '/toothfairy/demo-c',
    title: 'Pastel Dreamscape',
    description: 'Soft pastel world where teeth float through cotton-candy skies.',
    accent: C.plasma,
  },
  {
    href: '/toothfairy/scroll-a',
    title: 'The Verification Journey',
    description: 'Follow a tooth from pillow to the fairy verification pipeline.',
    accent: C.stardust,
  },
  {
    href: '/toothfairy/scroll-c',
    title: 'The Data Pulse',
    description: 'Live telemetry dashboard of the tooth fairy infrastructure.',
    accent: C.aurora,
  },
  {
    href: '/toothfairy/globe',
    title: 'Globe Explorer',
    description: 'Full-screen interactive globe with all fairy network nodes.',
    accent: C.nebula,
  },
  {
    href: '/toothfairy/scroll-fairy',
    title: 'Fairy Cascade',
    description: 'Scroll through the ranks of fairy operatives across the world.',
    accent: C.plasma,
  },
  {
    href: '/toothfairy/scroll-teeth',
    title: 'Teeth Collection',
    description: 'Browse the grand archive of collected and catalogued teeth.',
    accent: C.stardust,
  },
]

// ─── Deterministic star field (no Math.random in render) ──────────────────────
function generateStars(count: number) {
  const stars: { x: number; y: number; size: number; opacity: number; delay: number }[] = []
  for (let i = 0; i < count; i++) {
    // Simple seeded pseudo-random using sine
    const seed = i * 127.1 + 311.7
    const r1 = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1
    const r2 = ((Math.sin(seed * 1.31) * 22578.1459) % 1 + 1) % 1
    const r3 = ((Math.sin(seed * 0.77) * 67891.9731) % 1 + 1) % 1
    const r4 = ((Math.sin(seed * 2.13) * 34567.2468) % 1 + 1) % 1
    const r5 = ((Math.sin(seed * 0.53) * 89012.3579) % 1 + 1) % 1
    stars.push({
      x: r1 * 100,
      y: r2 * 100,
      size: 1 + r3 * 2,
      opacity: 0.3 + r4 * 0.7,
      delay: r5 * 5,
    })
  }
  return stars
}

const STARS = generateStars(80)

// ─── Component ────────────────────────────────────────────────────────────────
export default function ToothFairyLanding() {
  const [mounted, setMounted] = useState(false)

  // Override body/html background for full-bleed dark
  useEffect(() => {
    setMounted(true)
    const prevBodyBg = document.body.style.background
    const prevHtmlBg = document.documentElement.style.background
    document.body.style.background = C.bg
    document.documentElement.style.background = C.bg
    return () => {
      document.body.style.background = prevBodyBg
      document.documentElement.style.background = prevHtmlBg
    }
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ── Star field ───────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: 'white',
              opacity: star.opacity,
              animation: `twinkle ${3 + star.delay}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Nebula glow backgrounds ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: `radial-gradient(ellipse, ${C.nebula}15 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            background: `radial-gradient(ellipse, ${C.aurora}12 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10">

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION                                                    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section className="flex flex-col items-center justify-center px-4 pt-16 pb-8 md:pt-24 md:pb-12">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-center tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${C.aurora}, ${C.nebula}, ${C.plasma})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            Tooth Fairy
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-4 md:mt-6 text-base md:text-lg text-center max-w-lg"
            style={{ color: C.muted }}
          >
            Where every lost tooth becomes part of the fairy network
          </motion.p>

          {/* Network badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
            style={{
              background: `${C.surface}cc`,
              border: `1px solid ${C.nebula}40`,
              color: C.muted,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
            />
            {FAIRY_NODES.length} fairy nodes online
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="mt-8 md:mt-12 flex items-center justify-center w-full"
          >
            {mounted && (
              <CosmicGlobe
                size={480}
                rotateSpeed={0.003}
                showLabels={true}
                simulateArrivals={true}
                arrivalInterval={3000}
                darkness={1}
              />
            )}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* QUICK STATS ROW                                                */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group rounded-2xl p-5 md:p-6 text-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${C.surface}cc, ${C.surface}99)`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${stat.color}25`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${stat.color}15, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7"
                    fill="none"
                    stroke={stat.color}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={stat.icon} />
                  </svg>
                </div>

                {/* Value */}
                <div
                  className="text-2xl md:text-3xl font-bold font-mono"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  className="mt-1 text-xs md:text-sm"
                  style={{ color: C.muted }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* EXPLORE SECTION                                                */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-14"
            >
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${C.text}, ${C.muted})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Explore the Network
              </h2>
              <p className="mt-3 text-sm md:text-base" style={{ color: C.muted }}>
                Each experience reveals a different layer of the fairy infrastructure.
              </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {EXPLORE_PAGES.map((page, i) => (
                <motion.div
                  key={page.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link href={page.href} className="block h-full">
                    <div
                      className="relative group h-full rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      style={{
                        background: `linear-gradient(145deg, ${C.surface}ee, ${C.bg}dd)`,
                        border: `1px solid ${page.accent}20`,
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${page.accent}, transparent)`,
                        }}
                      />

                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, ${page.accent}12, transparent 70%)`,
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <h3
                          className="text-base font-semibold mb-2 group-hover:translate-x-0.5 transition-transform duration-300"
                          style={{ color: page.accent }}
                        >
                          {page.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: `${C.muted}cc` }}
                        >
                          {page.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-70 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
                        style={{ color: page.accent }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* FAIRY NODES MARQUEE                                            */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section className="py-10 overflow-hidden" aria-hidden="true">
          <div
            className="flex gap-6 whitespace-nowrap"
            style={{
              animation: 'marquee 40s linear infinite',
            }}
          >
            {[...FAIRY_NODES, ...FAIRY_NODES].map((node, i) => (
              <span
                key={`${node.city}-${i}`}
                className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full flex-shrink-0"
                style={{
                  background: `${C.surface}aa`,
                  border: `1px solid ${C.nebula}20`,
                  color: C.muted,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: C.aurora, boxShadow: `0 0 4px ${C.aurora}` }}
                />
                {node.city} &mdash; {node.fairyName}
              </span>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                         */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <footer className="py-12 text-center">
          <div
            className="inline-block px-5 py-2.5 rounded-full text-xs font-mono"
            style={{
              background: `${C.surface}80`,
              border: `1px solid ${C.nebula}15`,
              color: `${C.muted}99`,
            }}
          >
            Made with love by Dad
          </div>
        </footer>
      </div>

      {/* ── Global keyframes ─────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
