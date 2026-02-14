'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRef, useMemo } from 'react'
import { motion, useInView } from 'motion/react'
import { getArticle, type Article } from '@/lib/articles'
import { ReadingProgress } from '@/components/article/ReadingProgress'
import { BackgroundBeams } from '@/components/article/BackgroundBeams'
import { ShareBar } from '@/components/article/ShareBar'
import { TracingBeam } from '@/components/article/TracingBeam'
import { FullBleedImage, InlineImage } from '@/components/article/FullBleedImage'
import { TextRevealEffect, GradualReveal } from '@/components/article/TextRevealEffect'
import { PixelCanvas } from '@/components/article/PixelCanvas'
import { PriceCounter } from '@/components/article/PriceCounter'
import { ScrambleQuote } from '@/components/article/ScrambleQuote'
import { SectionHeading } from '@/components/article/SectionHeading'
import { ScrollPin } from '@/components/article/ScrollPin'
import { SectionGradient } from '@/components/article/SectionGradient'
import { NinePageStack } from '@/components/article/NinePageStack'
import { WhitepaperCTA } from '@/components/article/WhitepaperCTA'
import { YouTubeEmbed } from '@/components/article/YouTubeEmbed'

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function AnimatedParagraph({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.p
      ref={ref}
      className="mb-7 leading-[1.85] text-[#B8C0CC] font-article"
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </motion.p>
  )
}

function applyHighlights(
  text: string,
  highlights?: { text: string; color: string; link?: string }[]
): React.ReactNode[] {
  if (!highlights || highlights.length === 0) return [text]

  let remaining = text
  const result: React.ReactNode[] = []
  let keyIdx = 0

  // Sort highlights by first occurrence position
  const sorted = [...highlights].sort((a, b) => {
    const posA = remaining.toLowerCase().indexOf(a.text.toLowerCase())
    const posB = remaining.toLowerCase().indexOf(b.text.toLowerCase())
    return posA - posB
  })

  for (const hl of sorted) {
    const lowerRemaining = remaining.toLowerCase()
    const lowerSearch = hl.text.toLowerCase()
    const idx = lowerRemaining.indexOf(lowerSearch)
    if (idx === -1) continue

    if (idx > 0) {
      result.push(<span key={`t-${keyIdx++}`}>{remaining.slice(0, idx)}</span>)
    }
    const matchedText = remaining.slice(idx, idx + hl.text.length)
    const highlightStyle = {
      color: hl.color,
      textShadow: `0 0 20px ${hl.color}33`,
    }

    if (hl.link) {
      result.push(
        <a
          key={`hl-${keyIdx++}`}
          href={hl.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...highlightStyle,
            textDecoration: 'none',
            borderBottom: `1px solid ${hl.color}44`,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.borderBottomColor = hl.color }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.borderBottomColor = `${hl.color}44` }}
        >
          {matchedText}
        </a>
      )
    } else {
      result.push(
        <span key={`hl-${keyIdx++}`} style={highlightStyle}>
          {matchedText}
        </span>
      )
    }
    remaining = remaining.slice(idx + hl.text.length)
  }

  if (remaining) {
    result.push(<span key={`t-${keyIdx++}`}>{remaining}</span>)
  }

  return result
}

function renderBody(article: Article, articleUrl: string) {
  const {
    body,
    pullQuotes,
    theme,
    media,
    sectionHeadings,
    sectionTints,
    specialElements,
    textHighlights,
  } = article
  const accent = theme.accent
  const mood = theme.mood
  const sections = body.split('\n---\n')
  const elements: React.ReactNode[] = []
  let pullQuoteIndex = 0

  sections.forEach((section, sectionIdx) => {
    const paragraphs = section.trim().split('\n\n')

    if (sectionIdx > 0) {
      // Check for special elements between sections
      const specialAfterPrev = specialElements?.filter(
        (s) => s.afterSection === sectionIdx - 1
      )
      if (specialAfterPrev) {
        for (const special of specialAfterPrev) {
          if (special.type === 'price-counter') {
            elements.push(
              <PriceCounter
                key={`special-price-${sectionIdx}`}
                startPrice={special.data?.startPrice as number}
                endPrice={special.data?.endPrice as number}
                startYear={special.data?.startYear as number}
                endYear={special.data?.endYear as number}
                accent={accent}
              />
            )
          }
          if (special.type === 'youtube-embed') {
            elements.push(
              <YouTubeEmbed
                key={`special-youtube-${sectionIdx}`}
                videoId={special.data?.videoId as string}
                accent={accent}
              />
            )
          }
        }
      }

      // Full-bleed image at section break
      const sectionImage = media?.find(
        (m) => m.placement === 'full-bleed' && m.afterSection === sectionIdx - 1
      )
      if (sectionImage) {
        elements.push(
          <FullBleedImage
            key={`img-fb-${sectionIdx}`}
            src={sectionImage.src}
            alt={sectionImage.alt}
            caption={sectionImage.caption}
            accent={accent}
          />
        )
      }

      // Section divider
      if (mood === 'contemplative') {
        elements.push(
          <div key={`divider-${sectionIdx}`} className="my-16 flex justify-center">
            <div
              className="w-full max-w-md h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${sectionTints?.[sectionIdx] || accent}33, transparent)`,
              }}
            />
          </div>
        )
      } else {
        elements.push(
          <div key={`divider-${sectionIdx}`} className="my-16 flex justify-center items-center">
            <svg width="200" height="24" viewBox="0 0 200 24" className="opacity-40">
              {[...Array(20)].map((_, i) => (
                <motion.rect
                  key={i}
                  x={i * 10}
                  width="4"
                  rx="2"
                  fill={sectionTints?.[sectionIdx] || accent}
                  initial={{ height: 4, y: 10 }}
                  animate={{
                    height: [4, 8 + Math.sin(i * 0.8) * 12, 4],
                    y: [10, 8 - Math.sin(i * 0.8) * 6, 10],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                />
              ))}
            </svg>
          </div>
        )
      }
    }

    // Section heading
    if (sectionHeadings?.[sectionIdx]) {
      elements.push(
        <SectionHeading
          key={`heading-${sectionIdx}`}
          accent={sectionTints?.[sectionIdx] || accent}
          index={sectionIdx}
        >
          {sectionHeadings[sectionIdx]}
        </SectionHeading>
      )
    }

    // Find inline images for this section
    const inlineImages = media?.filter(
      (m) => (m.placement === 'inline-left' || m.placement === 'inline-right') && m.afterSection === sectionIdx
    ) || []

    // Start section gradient wrapper
    const sectionTint = sectionTints?.[sectionIdx]
    const sectionContent: React.ReactNode[] = []

    paragraphs.forEach((p, pIdx) => {
      // Handle italic text and highlights
      const parts = p.split(/(\*[^*]+\*)/g)
      const rendered = parts.map((part, k) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          const innerText = part.slice(1, -1)
          const highlighted = applyHighlights(innerText, textHighlights)
          return (
            <em key={k} className="text-[#C9D1D9] not-italic" style={{ borderBottom: `1px solid ${accent}33` }}>
              {highlighted}
            </em>
          )
        }
        // Apply text highlights
        const highlighted = applyHighlights(part, textHighlights)
        return <span key={k}>{highlighted}</span>
      })

      const isFirstParagraph = sectionIdx === 0 && pIdx === 0
      const isLastParagraph = sectionIdx === sections.length - 1 && pIdx === paragraphs.length - 1
      const key = `p-${sectionIdx}-${pIdx}`

      // Insert first inline image before paragraph 2
      if (pIdx === 1 && inlineImages.length > 0) {
        sectionContent.push(
          <InlineImage
            key={`img-inline-${sectionIdx}-0`}
            src={inlineImages[0].src}
            alt={inlineImages[0].alt}
            caption={inlineImages[0].caption}
            accent={accent}
            side={inlineImages[0].placement === 'inline-left' ? 'left' : 'right'}
          />
        )
      }

      // Insert second inline image before paragraph 4 (if exists)
      if (pIdx === 3 && inlineImages.length > 1) {
        sectionContent.push(
          <InlineImage
            key={`img-inline-${sectionIdx}-1`}
            src={inlineImages[1].src}
            alt={inlineImages[1].alt}
            caption={inlineImages[1].caption}
            accent={accent}
            side={inlineImages[1].placement === 'inline-left' ? 'left' : 'right'}
          />
        )
      }

      if (isFirstParagraph) {
        const plainText = p.replace(/\*[^*]+\*/g, (m) => m.slice(1, -1))
        sectionContent.push(
          <TextRevealEffect key={key} text={plainText} accent={accent} className="mb-7 font-article" />
        )
      } else if (mood === 'contemplative' && isLastParagraph) {
        const plainText = p.replace(/\*[^*]+\*/g, (m) => m.slice(1, -1))
        sectionContent.push(
          <GradualReveal key={key} text={plainText} accent={accent} />
        )
      } else {
        sectionContent.push(
          <AnimatedParagraph key={key}>{rendered}</AnimatedParagraph>
        )
      }

      // Pull quotes — scramble effect
      if (pullQuoteIndex < pullQuotes.length) {
        const totalParagraphs = sections.reduce((sum, s) => sum + s.trim().split('\n\n').length, 0)
        const insertEvery = Math.floor(totalParagraphs / (pullQuotes.length + 1))
        const globalPIdx = sections.slice(0, sectionIdx).reduce(
          (sum, s) => sum + s.trim().split('\n\n').length, 0
        ) + pIdx

        if (globalPIdx > 0 && (globalPIdx + 1) % insertEvery === 0) {
          // Check if this pull quote should be pinned (scroll-pin special element)
          const shouldPin = specialElements?.some(
            (s) => s.type === 'scroll-pin' && s.afterSection === sectionIdx
          ) && pullQuoteIndex === 1

          const quoteElement = (
            <ScrambleQuote
              key={`pq-${pullQuoteIndex}`}
              accent={sectionTints?.[sectionIdx] || accent}
              articleUrl={articleUrl}
            >
              {pullQuotes[pullQuoteIndex]}
            </ScrambleQuote>
          )

          if (shouldPin) {
            sectionContent.push(
              <ScrollPin key={`pin-${pullQuoteIndex}`} accent={accent} duration={1.5}>
                {quoteElement}
              </ScrollPin>
            )
          } else {
            sectionContent.push(quoteElement)
          }
          pullQuoteIndex++
        }
      }
    })

    // Wrap section in gradient tint
    if (sectionTint) {
      elements.push(
        <SectionGradient key={`section-${sectionIdx}`} tint={sectionTint} intensity={0.04}>
          {sectionContent}
        </SectionGradient>
      )
    } else {
      elements.push(...sectionContent)
    }
  })

  // Remaining pull quotes
  while (pullQuoteIndex < pullQuotes.length) {
    elements.push(
      <ScrambleQuote
        key={`pq-${pullQuoteIndex}`}
        accent={accent}
        articleUrl={articleUrl}
      >
        {pullQuotes[pullQuoteIndex]}
      </ScrambleQuote>
    )
    pullQuoteIndex++
  }

  // Whitepaper CTA (after last section)
  const whitepaperCta = specialElements?.find(s => s.type === 'whitepaper-cta')
  if (whitepaperCta) {
    elements.push(<WhitepaperCTA key="whitepaper-cta" accent={accent} />)
  }

  return elements
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const article = getArticle(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-[#0A0A12] text-[#F0F6FC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Article not found.</p>
          <button
            onClick={() => router.push('/')}
            className="text-sm font-mono text-gray-500 hover:text-white transition-colors"
          >
            sathian.ai
          </button>
        </div>
      </main>
    )
  }

  const minutes = readingTime(article.body)
  const articleUrl = `https://sathian.ai/writings/${article.slug}`
  const heroImage = article.media?.find((m) => m.placement === 'hero')
  const hasStackedPages = article.specialElements?.some(s => s.type === 'stacked-pages')

  return (
    <main
      className="min-h-screen bg-[#0A0A12] text-[#C9D1D9] article-accent-selection"
      style={{
        ['--article-accent-selection' as string]: `${article.theme.accent}44`,
      }}
    >
      <ReadingProgress color={article.theme.accent} />
      <BackgroundBeams color={article.theme.accent} />

      {/* Hero */}
      <header className="relative min-h-[75vh] flex flex-col justify-end pb-16 px-6 overflow-hidden">
        {/* Blurry portrait background behind stacked pages */}
        {heroImage && hasStackedPages && (
          <div className="absolute inset-0 z-0">
            <motion.img
              src={heroImage.src}
              alt={heroImage.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(8px) saturate(0.35) brightness(0.45)', objectPosition: 'center 20%' }}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 0.45 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <div
              className="absolute inset-0 mix-blend-color opacity-15"
              style={{ background: article.theme.accent }}
            />
          </div>
        )}

        {/* Stacked pages hero (Linear-style) — ghosted in front of portrait */}
        {hasStackedPages && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: heroImage ? 0.55 : 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ filter: heroImage ? 'blur(1.5px)' : 'none' }}
            >
              <NinePageStack accent={article.theme.accent} />
            </motion.div>
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/40 to-[#0A0A12]/20" />
          </div>
        )}

        {/* Hero background image (standalone, no stacked pages) */}
        {heroImage && !hasStackedPages && (
          <div className="absolute inset-0 z-0">
            <motion.img
              src={heroImage.src}
              alt={heroImage.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'saturate(0.55) brightness(0.65)' }}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/60 to-[#0A0A12]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A12]/50 via-transparent to-[#0A0A12]/50" />
            {/* Accent color wash */}
            <div
              className="absolute inset-0 mix-blend-color opacity-30"
              style={{ background: article.theme.accent }}
            />
          </div>
        )}

        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 px-6 py-5 flex items-center justify-between z-10">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-300 transition-colors text-sm font-mono"
          >
            sathian.ai
          </button>
          <span className="text-gray-700 text-xs font-mono">{minutes} min read</span>
        </div>

        <div className="max-w-2xl mx-auto w-full relative z-10">
          {/* Domains */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {article.domains.map((domain, i) => (
              <span
                key={i}
                className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-sm"
                style={{
                  color: article.theme.accent,
                  borderColor: `${article.theme.accent}33`,
                  background: `${article.theme.accent}08`,
                }}
              >
                {domain}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F0F6FC] mb-6 leading-[1.05] tracking-tight font-article"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {article.titleHighlight
              ? article.title.split(article.titleHighlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        className="relative inline-block"
                        style={{
                          background: `linear-gradient(transparent 55%, ${article.theme.accent}40 55%)`,
                        }}
                      >
                        {article.titleHighlight}
                      </span>
                    )}
                  </span>
                ))
              : article.title
            }
          </motion.h1>

          {/* Subtitle / hero caption */}
          {heroImage?.caption && (
            <motion.p
              className="text-sm italic mb-6 font-article"
              style={{ color: `${article.theme.accent}99` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {heroImage.caption}
            </motion.p>
          )}

          {/* Meta */}
          <motion.div
            className="flex items-center gap-3 text-sm text-gray-600 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-gray-400">{article.author}</span>
            <span className="text-gray-800">/</span>
            <span>{formatDate(article.date)}</span>
          </motion.div>
        </div>

        {/* Hero fade line */}
        <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{
          background: `linear-gradient(90deg, transparent, ${article.theme.accent}33, transparent)`,
        }} />
      </header>

      {/* Article body with tracing beam */}
      <article className="px-6 py-16">
        <TracingBeam color={article.theme.accent}>
          <div className="text-[1.125rem] max-w-2xl mx-auto font-article">
            {renderBody(article, articleUrl)}
          </div>
        </TracingBeam>

        {/* Hidden signal */}
        <div className="max-w-2xl mx-auto">
          {article.hiddenSignal && (
            <div className="mt-20 pt-8 border-t border-gray-800/50">
              <details className="text-sm group">
                <summary className="text-gray-700 cursor-pointer hover:text-gray-400 transition-colors font-mono text-xs tracking-wider uppercase">
                  Hidden Signal
                </summary>
                <p className="mt-4 text-gray-600 italic leading-relaxed font-article">
                  {article.hiddenSignal}
                </p>
              </details>
            </div>
          )}

          {/* Footer */}
          <div className="mt-20 pt-8 border-t border-gray-800/50 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-300 transition-colors text-sm font-mono"
            >
              sathian.ai
            </button>
            <span className="text-gray-800 text-xs font-mono">{formatDate(article.date)}</span>
          </div>
        </div>
      </article>

      <ShareBar title={article.title} url={articleUrl} />
    </main>
  )
}
