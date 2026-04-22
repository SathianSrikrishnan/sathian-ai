'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'

/* ─── Color tokens (OKLCH-informed, no pure black/white) ─── */
const colors = {
  night: '#0B1026',
  nightDeep: '#060810',
  ice: '#7CC6FE',
  iceSoft: 'oklch(0.82 0.08 230)',
  gold: '#F0C456',
  goldDim: 'oklch(0.78 0.12 85)',
  troll: '#8B3A62',
  trollGlow: 'oklch(0.45 0.15 350)',
  snow: '#E8EFF8',
  text: '#DDE1FF',
  textSoft: 'oklch(0.85 0.02 280 / 0.7)',
}

/* ─── Spacing scale (4pt base) ─── */
const sp = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
}

/* ─── Easing: exponential ease-out (no linear, no ease) ─── */
const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  outBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 300, damping: 24, mass: 0.8 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 18, mass: 0.6 },
  springGentle: { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 },
}

/* ─── Story pages ─── */
const pages = [
  {
    id: 'cover',
    bg: '/story-assets/finland/fi-01-bedroom.jpg',
    layout: 'cover' as const,
    title: 'Hammaskeiju\nvs.\nHammaspeikko',
    subtitle: 'A Finnish Tooth Fairy Tale',
  },
  {
    id: 'p1',
    bg: '/story-assets/finland/fi-01-bedroom.jpg',
    layout: 'narrative' as const,
    text: 'Deep in Finland, where the northern lights paint the sky in ribbons of green and violet, a child wiggles a tooth one last time...',
    accent: 'aurora',
  },
  {
    id: 'p2',
    bg: '/story-assets/finland/fi-01-bedroom.jpg',
    layout: 'narrative' as const,
    text: 'Pop! Under the pillow it goes.\n\nBut in Finland, it\'s not just ONE visitor who comes tonight.\n\nIt\'s TWO.\n\nAnd they\'re racing.',
    accent: 'sparkle',
  },
  {
    id: 'p3',
    bg: '/story-assets/finland/fi-02-troll-forest.jpg',
    layout: 'character' as const,
    character: '/story-assets/characters/char-finnish-troll.jpg',
    charSide: 'left' as const,
    speaker: 'Hammaspeikko',
    speakerColor: colors.troll,
    text: '"Heheheh... I smell a fresh tooth!"',
    subtext: 'The Tooth Troll. He LOVES dirty teeth. The dirtier, the better. If he gets there first, he\'ll drill little holes in the next one.',
  },
  {
    id: 'p4',
    bg: '/story-assets/finland/fi-03-fairy-aurora.jpg',
    layout: 'character' as const,
    character: '/story-assets/characters/char-finish-fairy.jpg',
    charSide: 'right' as const,
    speaker: 'Hammaskeiju',
    speakerColor: colors.ice,
    text: '"Not tonight, Troll."',
    subtext: 'The Tooth Fairy of Finland! She\'s fast, she\'s brave, and she NEVER lets the Troll win.',
  },
  {
    id: 'p5',
    bg: '/story-assets/finland/fi-04-the-race.jpg',
    layout: 'dramatic' as const,
    text: 'They race across the frozen sky — over pine trees, under the northern lights...',
    trollLine: '"Catch me if you can, Fairy!"',
    fairyLine: '"This child brushed every single night. That tooth is MINE."',
  },
  {
    id: 'p6',
    bg: '/story-assets/finland/fi-05-fairy-wins.jpg',
    layout: 'victory' as const,
    text: 'The Fairy reaches the pillow first!',
    fairyLine: '"Got it! A perfect, clean tooth."',
    trollLine: '"Grrrr... FINE. But tell that child — if they ever SKIP brushing..."',
    fairyReply: '"They won\'t. Because children who brush always win."',
  },
  {
    id: 'p7',
    bg: '/story-assets/shared/shared-network-station.jpg',
    layout: 'narrative' as const,
    text: 'The Fairy carries the tooth to the Tooth Fairy Network — safe from trolls forever.\n\nYour tooth becomes a keepsake.\nThe Troll can never reach it here.',
    accent: 'network',
  },
  {
    id: 'cta',
    bg: '/story-assets/finland/fi-05-fairy-wins.jpg',
    layout: 'cta' as const,
    text: 'Ready? Let the Fairy carry YOUR tooth to the Network!',
  },
]

/* ─── Snowflakes ─── */
function Snowflakes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {Array.from({ length: 40 }).map((_, i) => {
        const size = 2 + Math.random() * 4
        const x = Math.random() * 100
        const dur = 5 + Math.random() * 8
        const delay = Math.random() * 10
        const drift = (Math.random() - 0.5) * 60
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              left: `${x}%`, top: -10,
              background: `radial-gradient(circle, ${colors.snow} 0%, transparent 70%)`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
            animate={{
              y: [0, typeof window !== 'undefined' ? window.innerHeight + 20 : 900],
              x: [0, drift],
              rotate: [0, 360],
            }}
            transition={{
              duration: dur, repeat: Infinity, delay,
              ease: 'linear',
              x: { duration: dur * 0.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
          />
        )
      })}
    </div>
  )
}

/* ─── Aurora shimmer ─── */
function Aurora() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[40%] overflow-hidden pointer-events-none z-[3]">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute w-[200%] h-[120px]"
          style={{
            top: `${10 + i * 15}%`,
            left: '-50%',
            background: `linear-gradient(90deg,
              transparent 0%,
              oklch(0.6 0.12 160 / 0.15) 20%,
              oklch(0.65 0.1 200 / 0.2) 40%,
              oklch(0.55 0.15 280 / 0.15) 60%,
              oklch(0.6 0.1 160 / 0.1) 80%,
              transparent 100%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            opacity: [0.4, 0.7, 0.4],
            scaleY: [1, 1.3, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Sparkle burst ─── */
function Sparkles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none z-[6]">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const dist = 60 + Math.random() * 80
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '50%',
              width: 6, height: 6,
            }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
            }}
            transition={{ duration: 0.8, delay: i * 0.04, ease: ease.out }}
          >
            <svg width="8" height="8" viewBox="0 0 16 16" fill={colors.gold}>
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── Page indicator dots ─── */
function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            background: i === current ? colors.gold : `oklch(0.6 0.02 230 / 0.3)`,
          }}
          animate={{
            width: i === current ? 24 : 6,
            height: 6,
            opacity: i === current ? 1 : 0.4,
          }}
          transition={ease.spring}
        />
      ))}
    </div>
  )
}

/* ─── Page layouts ─── */

function CoverPage({ page }: { page: typeof pages[0] }) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...ease.springGentle, delay: 0.2 }}
      >
        {/* Snowflake ornament */}
        <motion.div
          className="mx-auto mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={colors.ice} strokeWidth="1.5" opacity="0.6">
            <line x1="24" y1="0" x2="24" y2="48" />
            <line x1="0" y1="24" x2="48" y2="24" />
            <line x1="6" y1="6" x2="42" y2="42" />
            <line x1="42" y1="6" x2="6" y2="42" />
            <circle cx="24" cy="24" r="8" />
          </svg>
        </motion.div>

        <h1
          className="text-4xl sm:text-5xl font-bold leading-[1.15] whitespace-pre-line"
          style={{
            color: colors.ice,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            textShadow: `0 0 60px oklch(0.7 0.12 230 / 0.4)`,
          }}
        >
          {page.title}
        </h1>

        <motion.p
          className="mt-6 text-base tracking-wide"
          style={{ color: colors.textSoft, fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: ease.out }}
        >
          {page.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex items-center gap-2"
          style={{ color: `oklch(0.8 0.05 230 / 0.5)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase">Tap to begin</span>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            &rarr;
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}

function NarrativePage({ page }: { page: typeof pages[1] }) {
  return (
    <div className="relative z-20 flex flex-col justify-end h-full px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.3 }}
      >
        <p
          className="text-xl sm:text-2xl leading-relaxed whitespace-pre-line"
          style={{
            color: `oklch(0.92 0.02 280)`,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            fontStyle: 'italic',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          {page.text}
        </p>
      </motion.div>
    </div>
  )
}

function CharacterPage({ page }: { page: typeof pages[3] }) {
  const isLeft = page.charSide === 'left'
  return (
    <div className="relative z-20 flex flex-col h-full">
      {/* Character image */}
      <div className={`flex-1 flex items-center ${isLeft ? 'justify-start pl-4' : 'justify-end pr-4'} pt-16`}>
        <motion.div
          className="relative"
          style={{ width: '55%', maxWidth: 240 }}
          initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.8, rotate: isLeft ? -5 : 5 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          transition={ease.springBouncy}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          >
            <img
              src={page.character}
              alt={page.speaker || ''}
              className="w-full h-auto rounded-3xl"
              style={{
                boxShadow: `0 8px 40px oklch(0.3 0.1 ${isLeft ? '350' : '230'} / 0.5)`,
                border: `2px solid ${page.speakerColor}40`,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Dialogue */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: ease.out }}
        >
          {page.speaker && (
            <p
              className="text-sm font-bold uppercase tracking-widest mb-2"
              style={{ color: page.speakerColor }}
            >
              {page.speaker}
            </p>
          )}
          <p
            className="text-2xl sm:text-3xl font-bold leading-snug"
            style={{
              color: colors.text,
              fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {page.text}
          </p>
          {page.subtext && (
            <motion.p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: colors.textSoft }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {page.subtext}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function DramaticPage({ page }: { page: typeof pages[5] }) {
  return (
    <div className="relative z-20 flex flex-col justify-center h-full px-6">
      <motion.p
        className="text-2xl sm:text-3xl leading-relaxed text-center"
        style={{
          color: colors.text,
          fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
          fontStyle: 'italic',
          textShadow: '0 2px 30px rgba(0,0,0,0.6)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: ease.out }}
      >
        {page.text}
      </motion.p>

      <div className="mt-8 flex flex-col gap-4">
        <motion.div
          className="self-start rounded-2xl px-4 py-3 max-w-[75%]"
          style={{ background: `${colors.troll}30`, border: `1px solid ${colors.troll}40` }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, ...ease.spring }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.troll }}>Troll</p>
          <p className="text-base" style={{ color: colors.text }}>{page.trollLine}</p>
        </motion.div>

        <motion.div
          className="self-end rounded-2xl px-4 py-3 max-w-[75%]"
          style={{ background: `${colors.ice}15`, border: `1px solid ${colors.ice}30` }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, ...ease.spring }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.ice }}>Fairy</p>
          <p className="text-base" style={{ color: colors.text }}>{page.fairyLine}</p>
        </motion.div>
      </div>
    </div>
  )
}

function VictoryPage({ page }: { page: typeof pages[6] }) {
  return (
    <div className="relative z-20 flex flex-col justify-center h-full px-6">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-8"
        style={{
          color: colors.gold,
          fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
          textShadow: `0 0 40px oklch(0.8 0.12 85 / 0.4)`,
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={ease.springBouncy}
      >
        {page.text}
      </motion.h2>

      <div className="flex flex-col gap-3">
        <motion.div
          className="self-end rounded-2xl px-4 py-3 max-w-[80%]"
          style={{ background: `${colors.ice}15`, border: `1px solid ${colors.ice}30` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ease: ease.out }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: colors.ice }}>Fairy</p>
          <p className="text-base" style={{ color: colors.text }}>{page.fairyLine}</p>
        </motion.div>

        <motion.div
          className="self-start rounded-2xl px-4 py-3 max-w-[80%]"
          style={{ background: `${colors.troll}20`, border: `1px solid ${colors.troll}30` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, ease: ease.out }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: colors.troll }}>Troll</p>
          <p className="text-base" style={{ color: colors.text }}>{page.trollLine}</p>
        </motion.div>

        <motion.div
          className="self-end rounded-2xl px-4 py-3 max-w-[80%]"
          style={{ background: `${colors.ice}15`, border: `1px solid ${colors.ice}30` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, ease: ease.out }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: colors.ice }}>Fairy</p>
          <p className="text-base font-semibold" style={{ color: colors.text }}>{page.fairyReply}</p>
        </motion.div>
      </div>
    </div>
  )
}

function CtaPage() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out }}
      >
        <motion.div
          className="mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="56" height="56" viewBox="0 0 16 16" fill={colors.gold}>
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
          </svg>
        </motion.div>

        <p
          className="text-xl sm:text-2xl leading-relaxed mb-8"
          style={{
            color: colors.text,
            fontFamily: "var(--font-display, 'Alegreya'), Georgia, serif",
            fontStyle: 'italic',
          }}
        >
          Ready? Let the Fairy carry YOUR tooth to the Network!
        </p>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg no-underline"
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, oklch(0.75 0.14 70))`,
              color: colors.nightDeep,
              boxShadow: `0 4px 30px oklch(0.8 0.12 85 / 0.3), 0 0 60px oklch(0.8 0.12 85 / 0.15)`,
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={colors.nightDeep}>
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </svg>
            Create Your Keepsake
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/story" className="text-xs no-underline" style={{ color: colors.textSoft }}>
            &larr; All stories
          </Link>
          <Link href="/story/north-africa" className="text-xs no-underline" style={{ color: colors.ice }}>
            Next: Sun Spirit &rarr;
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Main storybook component ─── */
export default function FinlandStorybook() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goNext = useCallback(() => {
    if (current < pages.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
    }
  }, [current])

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent(c => c - 1)
    }
  }, [current])

  // Keyboard
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [goNext, goPrev])

  const page = pages[current]

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-30%' : '30%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  function renderPage(p: typeof pages[number]) {
    switch (p.layout) {
      case 'cover': return <CoverPage page={p as typeof pages[0]} />
      case 'narrative': return <NarrativePage page={p as typeof pages[1]} />
      case 'character': return <CharacterPage page={p as typeof pages[3]} />
      case 'dramatic': return <DramaticPage page={p as typeof pages[5]} />
      case 'victory': return <VictoryPage page={p as typeof pages[6]} />
      case 'cta': return <CtaPage />
      default: return null
    }
  }

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[480px] mx-auto overflow-hidden select-none"
      style={{ background: colors.nightDeep }}
    >
      {/* Ambient layers */}
      <Aurora />
      <Snowflakes />
      <Sparkles active={page.layout === 'victory'} />

      {/* Background image with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={page.bg}
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <img
            src={page.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          {/* Gradient overlay — heavier at bottom for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top,
                ${colors.nightDeep}f5 0%,
                ${colors.nightDeep}cc 30%,
                ${colors.nightDeep}66 60%,
                ${colors.nightDeep}33 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Page content with slide animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={page.id}
          className="absolute inset-0 z-20"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: ease.out }}
        >
          {renderPage(page)}
        </motion.div>
      </AnimatePresence>

      {/* Tap zones */}
      {page.layout !== 'cta' && (
        <div className="absolute inset-0 z-[35] flex">
          <div className="w-1/3 h-full" onClick={goPrev} />
          <div className="w-2/3 h-full" onClick={goNext} />
        </div>
      )}

      {/* Bottom: page dots + page number */}
      <div className="absolute bottom-0 left-0 right-0 z-40 pb-6 flex flex-col items-center gap-2">
        <PageDots total={pages.length} current={current} />
        <p className="text-[10px] tracking-wider" style={{ color: `oklch(0.7 0.02 230 / 0.4)` }}>
          {current + 1} / {pages.length}
        </p>
      </div>

      {/* Corner vignette */}
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{ boxShadow: `inset 0 0 120px ${colors.nightDeep}` }}
      />
    </div>
  )
}
