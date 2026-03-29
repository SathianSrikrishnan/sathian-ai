'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { StoryConfig } from '@/data/stories/types'

interface StorySelectorProps {
  stories: StoryConfig[]
}

// Network constellation background
function NetworkBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-15">
      <svg width="100%" height="100%">
        {Array.from({ length: 20 }).map((_, i) => {
          const x1 = Math.random() * 100
          const y1 = Math.random() * 100
          const x2 = x1 + (Math.random() - 0.5) * 30
          const y2 = y1 + (Math.random() - 0.5) * 30
          return (
            <g key={i}>
              <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="#4FD1C5" strokeWidth="0.5" opacity="0.3" />
              <circle cx={`${x1}%`} cy={`${y1}%`} r="2" fill="#4FD1C5" opacity="0.4" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Floating particles
function Particles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 2}px`,
            height: `${2 + Math.random() * 2}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-5%`,
            backgroundColor: '#F0C456',
          }}
          animate={{
            y: [0, -1200],
            opacity: [0, 0.5, 0.3, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export default function StorySelector({ stories }: StorySelectorProps) {
  const available = stories.filter(s => s.available)
  const comingSoon = stories.filter(s => !s.available)

  return (
    <div
      className="min-h-[100dvh] relative overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0B1026 0%, #0F1A3E 40%, #1A0E2E 70%, #0B1026 100%)',
        fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
      }}
    >
      <NetworkBg />
      <Particles />

      <div className="relative z-20 max-w-xl mx-auto px-5 py-12">
        {/* Hero */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{
              color: '#F0C456',
              textShadow: '0 0 40px rgba(240, 196, 86, 0.3)',
            }}
          >
            Tooth Fairy Network
          </h1>

          <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: '#F5F0FFe6' }}>
            Create your child&apos;s first digital keepsake — from the very first tooth they lose.
          </p>

          <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: '#F5F0FFaa' }}>
            Thousands of years ago, Viking warriors paid children for their first lost tooth — calling it <em style={{ color: '#F0C456' }}>tand-fé</em>, the tooth fee. They wore the teeth on necklaces into battle for luck. That was the first Network. Today, <strong style={{ color: '#4FD1C5' }}>105 cultures</strong> continue the tradition — each in their own way.
          </p>

          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(79, 209, 197, 0.1)',
              border: '1px solid rgba(79, 209, 197, 0.2)',
              color: '#4FD1C5',
            }}
          >
            13 traditions · 13 characters · 5 continents
          </div>
        </motion.div>

        {/* Section: Pick Your Tradition */}
        <motion.p
          className="text-center text-xs mb-4 font-medium"
          style={{ color: '#F5F0FF80' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Pick a tradition to begin
        </motion.p>

        {/* Available Stories Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {available.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
            >
              <Link
                href={`/toothfairy/story/${story.id}`}
                className="block rounded-2xl overflow-hidden no-underline group"
                style={{
                  background: 'rgba(11, 16, 38, 0.7)',
                  border: `1px solid ${story.color}30`,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Character portrait */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`/story-assets/characters/char-${story.id === 'tooth-fairy' ? 'tooth-fairy' :
                      story.id === 'ratoncito-perez' ? 'perez' :
                      story.id === 'finland' ? 'finish-fairy' :
                      story.id === 'north-africa' ? 'sun-spirit' :
                      story.id === 'jamaica' ? 'granny-jamaica' :
                      story.id === 'korea' ? 'magpie' :
                      story.id === 'romania' ? 'crow' :
                      story.id === 'japan' ? 'tooth-kami' :
                      story.id === 'ethiopia' ? 'hyena' :
                      story.id === 'cherokee' ? 'beaver' :
                      story.id === 'ireland' ? 'anna-bogle' :
                      story.id === 'italy' ? 'venice-trio' :
                      story.id === 'babylonia' ? 'tooth-worm' :
                      'tooth-fairy'}.jpg`}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-2 text-center">
                  <p className="text-xs font-bold leading-tight" style={{ color: story.color }}>
                    {story.title}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#F5F0FF60' }}>
                    {story.region}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p
              className="text-center text-[10px] mb-3 font-semibold uppercase tracking-widest"
              style={{ color: '#F5F0FF40' }}
            >
              Coming Soon
            </p>
            <div className="grid grid-cols-3 gap-2">
              {comingSoon.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 1.3 + i * 0.04 }}
                  className="flex flex-col items-center justify-center rounded-xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    minHeight: '70px',
                  }}
                >
                  <span className="text-xl mb-1" style={{ filter: 'grayscale(0.5)' }}>{story.emoji}</span>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: '#F5F0FF' }}>
                    {story.title}
                  </span>
                  <span className="text-[9px] mt-0.5" style={{ color: '#4FD1C5' }}>
                    {story.region}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-[11px]" style={{ color: '#F5F0FF' }}>
            Every story ends with a keepsake on the Solana blockchain
          </p>
          <p className="text-[10px] mt-1" style={{ color: '#F5F0FF80' }}>
            Free to create · Permanent · Shareable with family
          </p>
        </motion.div>
      </div>
    </div>
  )
}
