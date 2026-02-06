'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { getArticle } from '@/lib/articles'
import { ReadingProgress } from '@/components/article/ReadingProgress'
import { PullQuote } from '@/components/article/PullQuote'
import { BackgroundBeams } from '@/components/article/BackgroundBeams'
import { ShareBar } from '@/components/article/ShareBar'

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
      className="mb-7 leading-[1.85] text-[#B8C0CC]"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </motion.p>
  )
}

function DropCap({ children }: { children: string }) {
  if (!children || children.length < 2) return <span>{children}</span>
  const first = children[0]
  const rest = children.slice(1)
  return (
    <>
      <span className="float-left text-[3.5rem] leading-[0.85] font-serif font-bold text-[#E6EDF3] mr-3 mt-1">
        {first}
      </span>
      {rest}
    </>
  )
}

function renderBody(
  body: string,
  pullQuotes: string[],
  accent: string,
  articleUrl: string
) {
  const sections = body.split('\n---\n')
  const elements: React.ReactNode[] = []
  let pullQuoteIndex = 0

  sections.forEach((section, sectionIdx) => {
    const paragraphs = section.trim().split('\n\n')

    if (sectionIdx > 0) {
      // Section divider
      elements.push(
        <div key={`divider-${sectionIdx}`} className="my-14 flex justify-center items-center gap-3">
          <div className="h-px w-12 bg-gray-800" />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
          />
          <div className="h-px w-12 bg-gray-800" />
        </div>
      )
    }

    paragraphs.forEach((p, pIdx) => {
      // Handle italic text
      const parts = p.split(/(\*[^*]+\*)/g)
      const rendered = parts.map((part, k) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={k} className="text-[#C9D1D9] not-italic" style={{ borderBottom: `1px solid ${accent}33` }}>{part.slice(1, -1)}</em>
        }
        return <span key={k}>{part}</span>
      })

      const isFirstParagraph = sectionIdx === 0 && pIdx === 0
      const key = `p-${sectionIdx}-${pIdx}`

      elements.push(
        <AnimatedParagraph key={key} delay={isFirstParagraph ? 0.2 : 0}>
          {isFirstParagraph ? <DropCap>{p.replace(/\*[^*]+\*/g, (m) => m.slice(1, -1))}</DropCap> : rendered}
        </AnimatedParagraph>
      )

      // Insert pull quote after specific paragraphs
      if (pullQuoteIndex < pullQuotes.length) {
        const totalParagraphs = sections.reduce((sum, s) => sum + s.trim().split('\n\n').length, 0)
        const insertEvery = Math.floor(totalParagraphs / (pullQuotes.length + 1))
        const globalPIdx = sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.trim().split('\n\n').length, 0) + pIdx

        if (globalPIdx > 0 && (globalPIdx + 1) % insertEvery === 0 && pullQuoteIndex < pullQuotes.length) {
          elements.push(
            <PullQuote
              key={`pq-${pullQuoteIndex}`}
              accent={accent}
              articleUrl={articleUrl}
            >
              {pullQuotes[pullQuoteIndex]}
            </PullQuote>
          )
          pullQuoteIndex++
        }
      }
    })
  })

  // Add any remaining pull quotes at the end
  while (pullQuoteIndex < pullQuotes.length) {
    elements.push(
      <PullQuote
        key={`pq-${pullQuoteIndex}`}
        accent={accent}
        articleUrl={articleUrl}
      >
        {pullQuotes[pullQuoteIndex]}
      </PullQuote>
    )
    pullQuoteIndex++
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

  return (
    <main className="min-h-screen bg-[#0A0A12] text-[#C9D1D9]">
      <ReadingProgress color={article.theme.accent} />
      <BackgroundBeams color={article.theme.accent} />

      {/* Hero */}
      <header className="relative min-h-[70vh] flex flex-col justify-end pb-16 px-6">
        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-300 transition-colors text-sm font-mono"
          >
            sathian.ai
          </button>
          <span className="text-gray-700 text-xs font-mono">{minutes} min read</span>
        </div>

        <div className="max-w-2xl mx-auto w-full">
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
                className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{
                  color: article.theme.accent,
                  borderColor: `${article.theme.accent}33`,
                }}
              >
                {domain}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F0F6FC] mb-6 leading-[1.05] tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
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
                          background: `linear-gradient(transparent 60%, ${article.theme.accent}33 60%)`,
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
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${article.theme.accent}22, transparent)`,
        }} />
      </header>

      {/* Article body */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-[1.125rem]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {renderBody(article.body, article.pullQuotes, article.theme.accent, articleUrl)}
        </div>

        {/* Hidden signal */}
        {article.hiddenSignal && (
          <div className="mt-20 pt-8 border-t border-gray-800/50">
            <details className="text-sm group">
              <summary className="text-gray-700 cursor-pointer hover:text-gray-400 transition-colors font-mono text-xs tracking-wider uppercase">
                Hidden Signal
              </summary>
              <p className="mt-4 text-gray-600 italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
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
      </article>

      <ShareBar title={article.title} url={articleUrl} />
    </main>
  )
}
