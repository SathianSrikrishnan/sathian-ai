'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { SparklesBackground } from '@/components/ui/sparkles-background'
import { TextGenerate } from '@/components/ui/text-generate'
import { GlareCard } from '@/components/ui/glare-card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SiteNav } from '@/components/SiteNav'
import { ChatWidget } from '@/components/ChatWidget'

const AtlasGlobeTeaser = dynamic(
  () => import('@/components/ui/atlas-globe-teaser').then((mod) => mod.AtlasGlobeTeaser),
  { ssr: false }
)

// ─── Colors ──────────────────────────────────────────────────────────────────
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

// ─── Project Data ────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'BTC Cultural Atlas',
    description: 'Live Bitcoin price mapped to 463 cultural markers — dialing codes, music, sports, history, and internet memes.',
    href: 'https://btc-atlas.vercel.app',
    tag: 'data / culture / crypto',
    accent: '#F97316',
    glare: 'rgba(249,115,22,0.2)',
    external: true,
  },
  {
    title: 'Tooth Fairy Network',
    description: 'Every lost tooth, verified on-chain. A conceptual blockchain for childhood milestones.',
    href: '/toothfairy/network',
    tag: 'web3 / storytelling',
    accent: C.nebula,
    glare: 'rgba(124,58,237,0.2)',
  },
  {
    title: 'Kai Voice',
    description: 'Real-time voice conversation with my AI assistant. Hold spacebar to talk.',
    href: '/voice',
    tag: 'AI / voice',
    accent: C.aurora,
    glare: 'rgba(6,182,212,0.2)',
  },
  {
    title: 'Bitcoin for Gen Z',
    description: 'The Bitcoin whitepaper, translated into language that actually makes sense.',
    href: '/toothfairy/network/bitcoin-genz',
    tag: 'education / crypto',
    accent: C.stardust,
    glare: 'rgba(245,158,11,0.2)',
  },
]

const WRITINGS = [
  {
    title: 'Nine Pages',
    description: 'I was around Bitcoin for years before I actually read the whitepaper. Nine pages changed everything. Here\'s what I found — and two versions so you can read it yourself.',
    href: '/writings/nine-pages',
    date: '2026-02-06',
    accent: '#F7931A',
  },
  {
    title: 'C.R.E.A.M. 2.0',
    description: 'How Wu-Tang Clan\'s journey from Staten Island to a corporate arena mirrors Bitcoin\'s path from cypherpunk whitepaper to institutional adoption.',
    href: '/writings/cream-2-point-0',
    date: '2026-10-31',
    accent: '#F59E0B',
  },
  {
    title: 'The Yellow Box',
    description: 'An Uber driver, a box of No Name spaghetti, and how the gap between what institutions promise and what people experience follows the same pattern from glasnost to grocery stores.',
    href: '/writings/the-yellow-box',
    date: '2026-02-06',
    accent: '#DC2626',
  },
]

// ─── Animation Variants ──────────────────────────────────────────────────────
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

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: C.bg }}>
      <SiteNav />

      {/* ─── Background atmosphere ──────────────────────────────────── */}
      <AuroraBackground
        colors={[C.nebula, C.aurora, C.plasma]}
        intensity="subtle"
        className="fixed inset-0 z-0"
      />
      <SparklesBackground count={30} color={C.muted} minSize={1} maxSize={2} className="fixed inset-0 z-[1]" />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Name */}
          <motion.h1
            className="font-display text-display-2xl sm:text-display-2xl text-gradient-cosmic"
            variants={fadeUp}
          >
            <TextGenerate text="Sathian" speed={60} />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-lg sm:text-xl max-w-lg"
            style={{ color: C.text }}
            variants={fadeUp}
          >
            Experiments in technology and culture.
          </motion.p>

          {/* Tagline — removed, let the work speak */}

          {/* Globe → BTC Cultural Atlas */}
          <motion.div
            className="mt-12 globe-glow-wrapper"
            variants={fadeUp}
          >
            <a
              href="https://btc-atlas.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block cursor-pointer"
            >
              <AtlasGlobeTeaser size={320} />
              {/* Overlay label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div
                  className="rounded-full px-4 py-2 text-xs font-mono"
                  style={{
                    background: 'rgba(15,15,45,0.85)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    color: '#06B6D4',
                  }}
                >
                  BTC Cultural Atlas →
                </div>
              </div>
            </a>
            <div className="mt-3 text-center">
              <a
                href="https://btc-atlas.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono transition-colors hover:text-white/60"
                style={{ color: `${C.muted}60` }}
              >
                463 cultural markers · live BTC price
              </a>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono" style={{ color: C.muted }}>scroll</span>
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

      {/* ─── Projects Section ───────────────────────────────────────── */}
      <section id="projects" className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <h2
            className="font-display text-display-md mb-4"
            style={{ color: C.text }}
          >
            Lab
          </h2>
          <p className="text-sm font-mono mb-12" style={{ color: `${C.muted}99` }}>
            Experiments and projects I&apos;m building
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => {
            const Wrapper = ('external' in project && project.external)
              ? (props: { children: React.ReactNode; className?: string }) => (
                  <a href={project.href} target="_blank" rel="noopener noreferrer" className={props.className}>{props.children}</a>
                )
              : (props: { children: React.ReactNode; className?: string }) => (
                  <Link href={project.href} className={props.className}>{props.children}</Link>
                )
            return (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <Wrapper className="block h-full">
                <GlareCard
                  className="h-full rounded-3xl"
                  glareColor={project.glare}
                >
                  <div
                    className="glass-card h-full rounded-3xl p-8 flex flex-col"
                    style={{
                      boxShadow: `0 0 40px ${project.accent}10`,
                    }}
                  >
                    {/* Tag */}
                    <span
                      className="inline-block text-[11px] font-mono uppercase tracking-widest mb-6 px-3 py-1 rounded-full w-fit"
                      style={{
                        color: project.accent,
                        background: `${project.accent}15`,
                        border: `1px solid ${project.accent}25`,
                      }}
                    >
                      {project.tag}
                    </span>

                    {/* Title */}
                    <h3
                      className="font-display text-xl tracking-tight mb-3"
                      style={{ color: C.text }}
                    >
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: `${C.muted}cc` }}
                    >
                      {project.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-6 flex items-center gap-2 text-xs font-mono" style={{ color: project.accent }}>
                      <span>Explore</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </GlareCard>
              </Wrapper>
            </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* ─── Writings Section ───────────────────────────────────────── */}
      <section id="writings" className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <h2
            className="font-display text-display-md mb-4"
            style={{ color: C.text }}
          >
            Writings
          </h2>
          <p className="text-sm font-mono mb-12" style={{ color: `${C.muted}99` }}>
            Essays and explorations
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WRITINGS.map((article, i) => (
            <ScrollReveal key={article.title} delay={i * 0.1}>
              <Link href={article.href} className="block group">
                <div
                  className="glass-card rounded-3xl p-8 transition-all duration-300 group-hover:border-white/[0.15] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px]" style={{
                    background: `linear-gradient(90deg, transparent, ${article.accent}66, transparent)`,
                  }} />
                  <span className="text-xs font-mono" style={{ color: `${C.muted}80` }}>
                    {article.date}
                  </span>
                  <h3
                    className="font-display text-xl tracking-tight mt-3 mb-3 group-hover:text-white transition-colors"
                    style={{ color: C.text }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: `${C.muted}cc` }}
                  >
                    {article.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-mono" style={{ color: C.muted }}>
                    <span>Read</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: `${C.muted}15` }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs" style={{ color: `${C.muted}60` }}>
            sathian.ai
          </span>
          <span className="font-mono text-xs" style={{ color: `${C.muted}40` }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>

      {/* ─── Chat Widget ────────────────────────────────────────────── */}
      <ChatWidget />
    </main>
  )
}
