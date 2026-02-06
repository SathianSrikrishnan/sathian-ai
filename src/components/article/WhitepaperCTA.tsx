'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import Link from 'next/link'

interface WhitepaperCardProps {
  title: string
  subtitle: string
  description: string
  href: string
  accent: string
  external?: boolean
  delay?: number
}

function WhitepaperCard({ title, subtitle, description, href, accent, external, delay = 0 }: WhitepaperCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const content = (
    <motion.div
      ref={ref}
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${accent}20`,
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Top accent bar */}
      <div className="h-[2px] w-full" style={{
        background: `linear-gradient(90deg, ${accent}, ${accent}40)`,
      }} />

      <div className="p-6 flex flex-col h-full">
        {/* Icon area */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{
            background: `${accent}12`,
            border: `1px solid ${accent}25`,
          }}
        >
          {external ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-display font-bold mb-1 group-hover:text-white transition-colors"
          style={{ color: '#F0F6FC' }}
        >
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-[11px] font-mono mb-3" style={{ color: `${accent}99` }}>
          {subtitle}
        </p>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#B8C0CC' }}>
          {description}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono" style={{ color: accent }}>
          <span>{external ? 'Read original' : 'Read translation'}</span>
          <motion.svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
          {external && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          boxShadow: `inset 0 0 40px ${accent}08, 0 0 30px ${accent}08`,
        }}
      />
    </motion.div>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  )
}

export function WhitepaperCTA({ accent = '#F7931A' }: { accent?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className="my-16">
      {/* Section label */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: `${accent}60` }}>
          Read the source material
        </p>
        <div className="h-px w-24 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${accent}30, transparent)` }} />
      </motion.div>

      {/* Two cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WhitepaperCard
          title="The Original"
          subtitle="9 pages · October 31, 2008"
          description="The Bitcoin whitepaper by Satoshi Nakamoto. The document that started it all. Read the primary source."
          href="https://bitcoin.org/bitcoin.pdf"
          accent={accent}
          external
          delay={0.1}
        />
        <WhitepaperCard
          title="The Translation"
          subtitle="9 pages · Gen Z edition"
          description="Same ideas, different language. The full whitepaper translated into language that actually makes sense."
          href="/toothfairy/network/bitcoin-genz"
          accent="#06B6D4"
          delay={0.2}
        />
      </div>
    </div>
  )
}
