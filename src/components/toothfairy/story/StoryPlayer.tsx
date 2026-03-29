'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StoryConfig } from '@/data/stories/types'
import Link from 'next/link'

// Particle component — golden dots floating upward
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-5%`,
            backgroundColor: '#F0C456',
          }}
          animate={{
            y: [0, -1200],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Network constellation background — subtle teal lines
function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] opacity-20">
      <svg width="100%" height="100%" className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => {
          const x1 = Math.random() * 100
          const y1 = Math.random() * 100
          const x2 = x1 + (Math.random() - 0.5) * 40
          const y2 = y1 + (Math.random() - 0.5) * 40
          return (
            <g key={i}>
              <line
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke="#4FD1C5"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <circle cx={`${x1}%`} cy={`${y1}%`} r="2" fill="#4FD1C5" opacity="0.4" />
              <circle cx={`${x2}%`} cy={`${y2}%`} r="1.5" fill="#4FD1C5" opacity="0.3" />
            </g>
          )
        })}
      </svg>
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
}

export default function StoryPlayer({ story }: StoryPlayerProps) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [prevBackground, setPrevBackground] = useState('')
  const scene = story.scenes[sceneIndex]
  const prevScene = sceneIndex > 0 ? story.scenes[sceneIndex - 1] : null
  const isNewBackground = !prevScene || prevScene.background !== scene.background

  const advance = useCallback(() => {
    if (!typewriterDone) return // let typewriter finish first
    if (scene.isChoice) return // CTA scene — don't advance on tap

    if (sceneIndex < story.scenes.length - 1) {
      setPrevBackground(scene.background)
      setSceneIndex(sceneIndex + 1)
      setTypewriterDone(false)
    }
  }, [sceneIndex, story.scenes.length, typewriterDone, scene])

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

  return (
    <div
      className="relative w-full h-[100dvh] max-w-[480px] mx-auto overflow-hidden select-none"
      style={{ background: '#0B1026' }}
      onClick={advance}
    >
      {/* Network constellation background */}
      <NetworkBackground />

      {/* Background image with Ken Burns zoom + crossfade */}
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
            animate={{ scale: [1.0, 1.04] }}
            transition={{ duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-[#0B1026]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Particles */}
      <Particles />

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
                  filter: 'drop-shadow(0 0 20px rgba(240, 196, 86, 0.3))',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue box */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-6">
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
              className="px-8 py-4 rounded-full font-bold text-lg no-underline"
              style={{
                background: `linear-gradient(135deg, ${story.color} 0%, ${story.color}cc 100%)`,
                color: '#0B1026',
                boxShadow: `0 0 30px ${story.color}40, 0 4px 20px rgba(0,0,0,0.3)`,
                fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
              }}
            >
              {scene.choiceText || 'Start Your Keepsake'}
            </Link>
            <p className="text-white/40 text-xs" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Free to create · Permanent · Shareable with family
            </p>
          </motion.div>
        ) : (
          /* Dialogue card */
          <motion.div
            key={scene.id}
            className="rounded-2xl p-4 backdrop-blur-xl"
            style={{
              background: 'rgba(11, 16, 38, 0.85)',
              border: '1px solid rgba(240, 196, 86, 0.1)',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: isNewBackground ? 0.4 : 0.1 }}
          >
            {/* Speaker name */}
            {scene.dialogue.speaker && (
              <motion.p
                className="text-sm font-bold mb-1"
                style={{
                  color: scene.dialogue.speakerColor || story.color,
                  fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {scene.dialogue.speaker}
              </motion.p>
            )}

            {/* Dialogue text with typewriter */}
            <p
              className="text-base leading-relaxed"
              style={{
                color: '#F5F0FF',
                fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                minHeight: '3rem',
              }}
            >
              <TypewriterText
                key={scene.id}
                text={scene.dialogue.text}
                onComplete={() => setTypewriterDone(true)}
              />
            </p>

            {/* Tap indicator */}
            {typewriterDone && !scene.isChoice && (
              <motion.div
                className="flex justify-end mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="text-xs"
                  style={{ color: '#F5F0FF', fontFamily: "'Quicksand', sans-serif" }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  tap ▸
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Scene counter + back button */}
        <div className="flex justify-between items-center mt-2 px-1">
          <button
            onClick={(e) => { e.stopPropagation(); goBack() }}
            className="text-xs px-2 py-1 rounded"
            style={{
              color: sceneIndex > 0 ? '#F5F0FF80' : 'transparent',
              fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
              background: 'transparent',
              border: 'none',
              cursor: sceneIndex > 0 ? 'pointer' : 'default',
              pointerEvents: sceneIndex > 0 ? 'auto' : 'none',
            }}
          >
            ← Back
          </button>
          <span
            className="text-xs"
            style={{ color: '#F5F0FF30', fontFamily: "'Quicksand', sans-serif" }}
          >
            {sceneIndex + 1} / {story.scenes.length}
          </span>
        </div>
      </div>
    </div>
  )
}
