'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { StoryConfig } from '@/data/stories/types'
import { FEATURED_STORIES } from '@/data/stories'

/* ─── Color tokens (OKLCH, matching landing page) ───────────────────────── */
const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldHover:  'oklch(62% 0.13 72)',
  goldLight:  'oklch(85% 0.08 78)',
  border:     'oklch(88% 0.015 75)',
  cardBg:     'oklch(98% 0.008 80)',
}

/* ─── Easing ────────────────────────────────────────────────────────────── */
const easeOutQuart = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Character image mapping ───────────────────────────────────────────── */
const charImageMap: Record<string, string> = {
  'tanda': 'char-tanda.png',
  'hyena-story': 'char-hyena-story.png',
  'anka-story': 'char-anka.png',
  'tooth-fairy': 'char-tooth-fairy.jpg',
  'ratoncito-perez': 'char-perez.jpg',
  'finland': 'char-finish-fairy.jpg',
  'north-africa': 'char-sun-spirit.jpg',
  'jamaica': 'char-granny-jamaica.jpg',
  'korea': 'char-magpie.jpg',
  'romania': 'char-crow.jpg',
  'japan': 'char-tooth-kami.jpg',
  'ethiopia': 'char-hyena.jpg',
  'cherokee': 'char-beaver.jpg',
  'ireland': 'char-anna-bogle.jpg',
  'italy': 'char-venice-trio.jpg',
  'babylonia': 'char-tooth-worm.jpg',
}

const featuredIds = new Set(FEATURED_STORIES.map(s => s.id))

interface StorySelectorProps {
  stories: StoryConfig[]
  simple?: boolean
}

export default function StorySelector({ stories, simple = false }: StorySelectorProps) {
  const featured = simple ? [] : stories.filter(s => featuredIds.has(s.id) && s.available)
  const regular = simple
    ? stories.filter(s => s.available)
    : stories.filter(s => !featuredIds.has(s.id) && s.available)
  const comingSoon = stories.filter(s => !s.available)

  return (
    <div
      className="min-h-[100dvh]"
      style={{
        background: `linear-gradient(to bottom, ${c.cream}, ${c.creamDeep}, ${c.cream})`,
        fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
        color: c.brown,
      }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          className="max-w-[55ch] mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutQuart }}
        >
          <Link
            href="/toothfairy"
            className="inline-block text-sm font-medium mb-8 no-underline"
            style={{
              color: c.gold,
              transition: 'opacity 0.2s',
            }}
          >
            &larr; Tooth Fairy Network
          </Link>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: c.brown }}
          >
            Every culture tells the story differently.
          </h1>

          {!simple && (
            <>
              <p
                className="text-lg leading-[1.8] mb-4"
                style={{ color: c.brownSoft }}
              >
                In North America, a hummingbird fairy carries an ancient satchel.
                In Ethiopia, a hyena waits in the dark for children brave enough to come.
                In Brazil, a jaguar only appears when you stop looking.
                Pick a tradition — your child&apos;s story begins here.
              </p>

              <p
                className="text-sm font-medium"
                style={{ color: c.brownMuted }}
              >
                {stories.filter(s => s.available).length} traditions · 6 continents · Every one leads to a keepsake
              </p>
            </>
          )}
        </motion.div>

        {/* ── Featured Stories (Full-Length) ───────────────────────────── */}
        {featured.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: easeOutQuart }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-6"
              style={{ color: c.gold }}
            >
              Featured Stories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
              {featured.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: easeOutQuart }}
                >
                  <Link
                    href={`/toothfairy/story/${story.id}`}
                    className="block rounded-2xl overflow-hidden no-underline group"
                    style={{
                      background: c.cardBg,
                      boxShadow: `0 4px 20px oklch(30% 0.035 65 / 0.1)`,
                      transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 12px 40px oklch(30% 0.035 65 / 0.16)`
                      e.currentTarget.style.transform = 'translateY(-6px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 20px oklch(30% 0.035 65 / 0.1)`
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden" style={{ background: c.creamDeep }}>
                      <img
                        src={`/story-assets/characters/${charImageMap[story.id] || 'char-tooth-fairy.jpg'}`}
                        alt={story.characterName}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <p
                        className="text-lg md:text-xl font-bold leading-tight mb-1"
                        style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: c.brown }}
                      >
                        {story.title}
                      </p>
                      <p className="text-sm mb-2" style={{ color: c.brownMuted }}>
                        {story.region} · {story.characterName}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: c.brownSoft }}>
                        {story.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── More Traditions ─────────────────────────────────────────── */}
        {regular.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {!simple && (
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-6"
                style={{ color: c.brownMuted }}
              >
                More Traditions
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {regular.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.04, duration: 0.6, ease: easeOutQuart }}
                >
                  <Link
                    href={`/toothfairy/story/${story.id}`}
                    className="block rounded-2xl overflow-hidden no-underline group"
                    style={{
                      background: c.cardBg,
                      boxShadow: `0 2px 12px oklch(30% 0.035 65 / 0.06)`,
                      transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 8px 32px oklch(30% 0.035 65 / 0.12)`
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 2px 12px oklch(30% 0.035 65 / 0.06)`
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="aspect-square overflow-hidden" style={{ background: c.creamDeep }}>
                      <img
                        src={`/story-assets/characters/${charImageMap[story.id] || 'char-tooth-fairy.jpg'}`}
                        alt={story.characterName}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <p
                        className="text-sm md:text-base font-bold leading-tight mb-1"
                        style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: c.brown }}
                      >
                        {story.title}
                      </p>
                      <p className="text-xs md:text-sm" style={{ color: c.brownMuted }}>
                        {story.region}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Coming Soon ─────────────────────────────────────────────── */}
        {comingSoon.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mb-16"
          >
            <p
              className="text-xs font-medium uppercase tracking-[0.15em] mb-6"
              style={{ color: c.brownMuted }}
            >
              Coming soon
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {comingSoon.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col items-center justify-center rounded-xl p-3 text-center"
                  style={{
                    background: c.creamDeep,
                    border: `1px solid ${c.border}`,
                    minHeight: '80px',
                    opacity: 0.6,
                  }}
                >
                  <span className="text-xl mb-1">{story.emoji}</span>
                  <span
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: c.brownSoft }}
                  >
                    {story.title}
                  </span>
                  <span
                    className="text-[10px] mt-0.5"
                    style={{ color: c.brownMuted }}
                  >
                    {story.region}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <p
            className="text-lg mb-2"
            style={{
              fontFamily: "var(--font-display, 'Alegreya'), serif",
              color: c.brown,
            }}
          >
            Ready to skip ahead?
          </p>
          <p className="text-sm mb-6" style={{ color: c.brownMuted }}>
            Every story ends with a keepsake. You can make one right now.
          </p>
          <Link
            href="/toothfairy/app/draw?from=story-selector"
            className="inline-block px-8 py-3.5 text-base font-semibold rounded-full no-underline active:scale-[0.98]"
            style={{
              background: c.gold,
              color: 'oklch(98% 0.005 80)',
              boxShadow: `0 4px 24px oklch(72% 0.145 75 / 0.2)`,
              transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = c.gold }}
          >
            Make your child&apos;s first keepsake
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
