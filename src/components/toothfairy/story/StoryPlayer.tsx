'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StoryConfig } from '@/data/stories/types'
import Link from 'next/link'

// Firefly particles — static glowing dots scattered across the screen
function Fireflies() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = 2 + Math.random() * 2
        const left = Math.random() * 100
        const top = Math.random() * 100
        const isGold = Math.random() > 0.4
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: isGold ? '#F0C456' : '#4FD1C5',
              boxShadow: isGold
                ? '0 0 6px 2px rgba(240, 196, 86, 0.4)'
                : '0 0 6px 2px rgba(79, 209, 197, 0.3)',
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

// Sparkle divider — decorative separator after story text
function SparkleDivider() {
  return (
    <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#F0C456]" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#F0C456" opacity="0.6" />
      </svg>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#F0C456]" />
    </div>
  )
}

// Instagram-style story progress bars
function ProgressBars({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1 w-full px-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #F0C456, #D4A843)' }}
            initial={false}
            animate={{
              width: i < current ? '100%' : i === current ? '50%' : '0%',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      ))}
    </div>
  )
}

// Typewriter text effect
function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    let index = 0

    intervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsComplete(true)
        onComplete()
      }
    }, 28)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text])

  const skipToEnd = useCallback(() => {
    if (!isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayText(text)
      setIsComplete(true)
      onComplete()
    }
  }, [isComplete, text, onComplete])

  return (
    <span onClick={skipToEnd} className="cursor-pointer">
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block ml-0.5"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

interface StoryPlayerProps {
  story: StoryConfig
  nextStory?: { id: string; title: string; region: string } | null
}

export default function StoryPlayer({ story, nextStory }: StoryPlayerProps) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [prevBackground, setPrevBackground] = useState('')

  const hasScenes = !!(story?.scenes && story.scenes.length > 0)
  const scene = hasScenes ? story.scenes[sceneIndex] : null
  const prevScene = hasScenes && sceneIndex > 0 ? story.scenes[sceneIndex - 1] : null
  const isNewBackground = !prevScene || (scene && prevScene?.background !== scene.background)

  const advance = useCallback(() => {
    if (!typewriterDone || !scene) return
    if (scene.isChoice) return // CTA scene — don't advance on tap

    if (sceneIndex < story.scenes.length - 1) {
      setPrevBackground(scene.background)
      setSceneIndex(sceneIndex + 1)
      setTypewriterDone(false)
    }
  }, [sceneIndex, story?.scenes?.length, typewriterDone, scene])

  const goBack = useCallback(() => {
    if (sceneIndex > 0) {
      setSceneIndex(sceneIndex - 1)
      setTypewriterDone(false)
    }
  }, [sceneIndex])

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        advance()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [advance, goBack])

  if (!hasScenes || !scene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1228] text-white">
        <p className="text-lg opacity-60">This story is coming soon.</p>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[480px] mx-auto overflow-hidden select-none"
      style={{
        background: '#0d1228',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)',
      }}
    >
      {/* Full-bleed background image with Ken Burns zoom + crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={scene.background}
          className="absolute inset-0 z-[2]"
          initial={isNewBackground ? { opacity: 0, scale: 1.03 } : false}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.img
            src={scene.background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
            animate={{ scale: [1.0, 1.04] }}
            transition={{ duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          />
          {/* Bottom gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(13, 18, 40, 0.95) 0%, rgba(13, 18, 40, 0.6) 50%, rgba(13, 18, 40, 0) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Firefly particles */}
      <Fireflies />

      {/* Corner vignette overlay */}
      <div
        className="absolute inset-0 z-[11] pointer-events-none"
        style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)' }}
      />

      {/* Top HUD: Progress bars + page counter + close button */}
      <div className="absolute top-0 left-0 right-0 z-40 pt-[env(safe-area-inset-top,12px)] px-2">
        {/* Progress bars */}
        <div className="pt-3 pb-2">
          <ProgressBars total={story.scenes.length} current={sceneIndex} />
        </div>

        {/* Page counter (glass pill) + Close button */}
        <div className="flex items-center justify-between px-2 pb-1">
          <div
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(221, 225, 255, 0.7)',
              fontFamily: 'var(--font-body), Manrope, sans-serif',
            }}
          >
            Page {sceneIndex + 1} of {story.scenes.length}
          </div>

          <Link
            href="/app"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-9 h-9 rounded-full no-underline"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(221, 225, 255, 0.7)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Character sprite with float animation */}
      <AnimatePresence mode="wait">
        {scene.character && (
          <motion.div
            key={`char-${scene.id}`}
            className="absolute z-20"
            style={{
              left: scene.character.position === 'left' ? '5%' :
                    scene.character.position === 'right' ? '55%' : '15%',
              top: '10%',
              width: scene.character.position === 'center' ? '70%' : '40%',
              maxHeight: '45%',
            }}
            initial={{
              x: scene.character.enter === 'left' ? '-100%' :
                 scene.character.enter === 'right' ? '100%' : 0,
              y: scene.character.enter === 'top' ? '-100%' :
                 scene.character.enter === 'bottom' ? '100%' : 0,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              x: scene.character.exit === 'left' ? '-100%' :
                 scene.character.exit === 'right' ? '100%' : 0,
              y: scene.character.exit === 'top' ? '-80%' :
                 scene.character.exit === 'bottom' ? '80%' : 0,
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              mass: 1,
            }}
          >
            {/* Float animation wrapper */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            >
              <img
                src={scene.character.image}
                alt=""
                className="w-full h-auto rounded-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(79, 209, 197, 0.4))',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap zones: left 1/3 = back, right 2/3 = forward (invisible) */}
      {/* Hidden on choice scenes so CTA buttons are clickable */}
      {!scene.isChoice && (
        <div className="absolute inset-0 z-[35] flex">
          <div
            className="w-1/3 h-full"
            onClick={(e) => { e.stopPropagation(); goBack() }}
          />
          <div
            className="w-2/3 h-full"
            onClick={(e) => { e.stopPropagation(); advance() }}
          />
        </div>
      )}

      {/* Bottom content area — story text over gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-5 pb-8">
        {scene.isChoice ? (
          /* CTA Button */
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href={scene.choiceHref || '/toothfairy/app'}
              onClick={(e) => e.stopPropagation()}
              className="relative z-[40] px-8 py-4 rounded-full font-bold text-lg no-underline"
              style={{
                background: `linear-gradient(135deg, ${story.color} 0%, ${story.color}cc 100%)`,
                color: '#0d1228',
                boxShadow: `0 0 30px ${story.color}40, 0 4px 20px rgba(0,0,0,0.3)`,
                fontFamily: "var(--font-headline), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              {scene.choiceText || 'Start Your Keepsake'}
            </Link>
            <p
              className="text-xs"
              style={{
                color: 'rgba(221, 225, 255, 0.4)',
                fontFamily: "var(--font-body), Manrope, sans-serif",
              }}
            >
              Free to create · Permanent · Shareable with family
            </p>

            {/* Story navigation */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link
                href="/story"
                onClick={(e) => e.stopPropagation()}
                className="text-xs no-underline hover:underline"
                style={{ color: 'rgba(221, 225, 255, 0.5)' }}
              >
                ← All stories
              </Link>
              {nextStory && (
                <Link
                  href={`/story/${nextStory.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs no-underline hover:underline"
                  style={{ color: '#4FD1C5' }}
                >
                  Next: {nextStory.title} →
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          /* Immersive story text — no card, just text over gradient */
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: isNewBackground ? 0.4 : 0.1 }}
          >
            {/* Tanda mascot floating bottom-left */}
            <motion.div
              className="mb-3"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
            >
              <div
                className="w-[80px] h-[80px] rounded-full overflow-hidden"
                style={{
                  boxShadow: '0 0 24px 8px rgba(79, 209, 197, 0.25)',
                  border: '2px solid rgba(79, 209, 197, 0.2)',
                }}
              >
                <img
                  src="/toothfairy/tanda.png"
                  alt="Tanda"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Speaker name / story title in gold */}
            {scene.dialogue.speaker && (
              <motion.p
                className="text-lg font-bold mb-2"
                style={{
                  color: '#F0C456',
                  fontFamily: "var(--font-headline), 'Plus Jakarta Sans', sans-serif",
                  textShadow: '0 0 20px rgba(240, 196, 86, 0.3)',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {scene.dialogue.speaker}
              </motion.p>
            )}

            {/* Story text — Lora serif italic */}
            <p
              className="text-2xl leading-relaxed italic"
              style={{
                color: 'rgba(245, 240, 255, 0.92)',
                fontFamily: "var(--font-story), Lora, Georgia, serif",
                minHeight: '3rem',
              }}
            >
              <TypewriterText
                key={scene.id}
                text={scene.dialogue.text}
                onComplete={() => setTypewriterDone(true)}
              />
            </p>

            {/* Sparkle divider */}
            {typewriterDone && <SparkleDivider />}
          </motion.div>
        )}
      </div>
    </div>
  )
}
