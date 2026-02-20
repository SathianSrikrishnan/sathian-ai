'use client'

import { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { articles } from '@/lib/articles'
import { CHAT_SUGGESTIONS } from '@/lib/constants'

const AtlasGlobeTeaser = dynamic(
  () => import('@/components/ui/atlas-globe-teaser').then((mod) => mod.AtlasGlobeTeaser),
  { ssr: false }
)

// ─── Articles data (canonical source: src/lib/articles.ts) ──────────────────
const WRITINGS = [...articles]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(a => ({
    title: a.title,
    description: a.description,
    href: `/writings/${a.slug}`,
    date: a.date,
    readTime: a.readTime,
    accent: a.theme.accent,
  }))

// ─── Featured markers — one per pillar for interest diversity ────────────────
const FEATURED_MARKERS = [
  { number: '808', label: 'TR-808 Drum Machine', pillar: 'Music', color: '#A855F7', href: 'https://btc.sathian.ai/atlas/808', lat: 21.3, lng: -157.8 },
  { number: '404', label: 'Page Not Found / Atlanta', pillar: 'Internet', color: '#22C55E', href: 'https://btc.sathian.ai/atlas/404', lat: 33.7, lng: -84.4 },
  { number: '234', label: 'Nigeria', pillar: 'Area Codes', color: '#3B82F6', href: 'https://btc.sathian.ai/atlas/234', lat: 9.1, lng: 7.5 },
  { number: '989', label: 'Berlin Wall 1989', pillar: 'History', color: '#EAB308', href: 'https://btc.sathian.ai/atlas/989', lat: 52.5, lng: 13.4 },
  { number: '899', label: 'FC Barcelona 1899', pillar: 'Sports', color: '#F97316', href: 'https://btc.sathian.ai/atlas/899', lat: 41.4, lng: 2.2 },
]

// ─── Live BTC Price Hook ────────────────────────────────────────────────────
function useBtcPrice() {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://btc.sathian.ai/api/btc-price')
        if (res.ok) {
          const data = await res.json()
          if (active) setPrice(data.price ?? data.USD ?? null)
        }
      } catch { /* price is decorative */ }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 10000)
    return () => { active = false; clearInterval(interval) }
  }, [])

  return price
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Corner Dots ────────────────────────────────────────────────────────────
function CornerDots({ color }: { color: string }) {
  return (
    <>
      <div className="absolute top-0 left-6 w-2 h-2 -translate-y-1/2" style={{ background: color }} />
      <div className="absolute top-0 right-6 w-2 h-2 -translate-y-1/2" style={{ background: color }} />
    </>
  )
}

// ─── Arrow icon ─────────────────────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

// ─── Newsletter form ────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || status === 'loading') return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="hub-mono" style={{ color: '#22C55E', fontSize: 14 }}>
        You&apos;re in. I&apos;ll let you know when something new ships.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input
        type="email"
        placeholder="your@email.com"
        className="hub-email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="hub-btn-primary"
        disabled={status === 'loading'}
        style={status === 'loading' ? { opacity: 0.6 } : undefined}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="hub-mono w-full" style={{ color: '#EF4444', fontSize: 12 }}>
          Something went wrong. Try again.
        </p>
      )}
    </form>
  )
}

// ─── Chat prompts (shared from constants) ───────────────────────────────────
const CHAT_PROMPTS = CHAT_SUGGESTIONS

// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const btcPrice = useBtcPrice()
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  const handlePromptClick = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { message: prompt } }))
  }

  return (
    <div data-theme="dark" style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)' }}>
      <SiteNav />
      <main>

      {/* ═══ Zone 2: Hero ═══════════════════════════════════════════════════ */}
      <section className="zone-primary relative" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="absolute inset-0 pointer-events-none hub-hero-glow-deep" />
        <div className="max-w-[1200px] mx-auto px-6 relative" style={{ zIndex: 1 }}>
          <div className="hub-hero-split">
            {/* Portrait */}
            <div className="hub-hero-portrait">
              <div className="hub-hero-portrait-frame">
                <Image
                  src="/sathian-profile.png"
                  alt="Sathian S. — sketch portrait"
                  width={340}
                  height={340}
                  priority
                  className="hub-hero-portrait-img"
                />
              </div>
            </div>

            {/* Text */}
            <div className="hub-hero-copy">
              <h1 className="hub-hero-name mb-4">
                What a time to be alive!
              </h1>
              <p className="hub-body mb-8" style={{ color: 'var(--hub-text-secondary)', maxWidth: 460 }}>
                Essays and experiments on the collision of human and digital systems.
              </p>
              {btcPrice && (
                <span className="hub-price-badge">
                  <span style={{ fontSize: 11, opacity: 0.7 }}>&#x20BF;</span>
                  {formatPrice(btcPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Zone 3: Projects ═══════════════════════════════════════════════ */}
      <ScrollReveal>
      <section id="projects" className="zone-alt hub-section relative">
        <CornerDots color="#F7931A" />
        <div className="absolute inset-0 pointer-events-none hub-projects-glow" />
        <div className="hub-container relative" style={{ zIndex: 1 }}>
          <div className="span-full mb-6">
            <div className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)' }}>Projects</div>
          </div>

          {/* BTC Atlas — Hero card */}
          <a
            href="https://btc.sathian.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="span-8 hub-card hub-card-glow-orange block"
            style={{ textDecoration: 'none', borderLeft: '3px solid #F7931A' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="hub-eyebrow px-2.5 py-1 rounded"
                style={{
                  color: '#F7931A',
                  background: 'rgba(247,147,26,0.1)',
                  border: '1px solid rgba(247,147,26,0.15)',
                  letterSpacing: '0.08em',
                }}
              >
                Live
              </span>
              {btcPrice && (
                <span className="hub-price-badge ml-auto" style={{ fontSize: 12 }}>
                  <span style={{ fontSize: 9 }}>&#x20BF;</span>
                  {formatPrice(btcPrice)}
                </span>
              )}
            </div>
            <h3 className="hub-card-title mb-3" style={{ color: 'var(--hub-text-primary)', fontSize: 22 }}>
              BTC Cultural Atlas
            </h3>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)', fontSize: 14 }}>
              500+ cultural markers mapped to Bitcoin&apos;s price as it climbs toward $1M.
              Area codes, drum machines, error pages, history, and sports — every number decoded.
            </p>
            <div className="flex items-center gap-2 hub-mono" style={{ color: '#F7931A' }}>
              btc.sathian.ai <ArrowRight />
            </div>
          </a>

          {/* Tooth Fairy Network — Observatory style */}
          <a
            href="https://toothfairy.sathian.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="span-4 hub-card hub-card-glow-purple block"
            style={{ textDecoration: 'none', borderLeft: '3px solid #7C3AED' }}
          >
            <div className="mb-5">
              <span
                className="hub-eyebrow px-2.5 py-1 rounded"
                style={{
                  color: '#7C3AED',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  letterSpacing: '0.08em',
                }}
              >
                Concept
              </span>
            </div>
            <h3 className="hub-card-title mb-2" style={{ color: 'var(--hub-text-primary)' }}>
              Tooth Fairy Network
            </h3>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)', fontSize: 14 }}>
              Turn lost teeth into digital keepsakes and a child&apos;s first real savings.
            </p>
            <div className="flex items-center gap-2 hub-mono" style={{ color: '#7C3AED' }}>
              toothfairy.sathian.ai <ArrowRight />
            </div>
          </a>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 4: Writing ════════════════════════════════════════════════ */}
      <ScrollReveal>
      <section className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-writing-glow" />
        <div className="hub-container">
          <div className="span-full mb-6">
            <div className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)' }}>Writing</div>
          </div>

          {/* Featured article — large with accent bar */}
          <Link
            href={WRITINGS[0].href}
            className="span-full hub-card hub-card-glow-cyan block"
            style={{ textDecoration: 'none', borderLeft: `3px solid ${WRITINGS[0].accent}` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span
                className="hub-eyebrow px-2.5 py-1 rounded"
                style={{
                  color: WRITINGS[0].accent,
                  background: `${WRITINGS[0].accent}15`,
                  border: `1px solid ${WRITINGS[0].accent}25`,
                }}
              >
                Latest
              </span>
              <span className="hub-mono" style={{ color: 'var(--hub-text-muted)', fontSize: 12 }}>
                {formatDate(WRITINGS[0].date)}
              </span>
              <span className="hub-mono" style={{ color: 'var(--hub-text-muted)', fontSize: 12 }}>
                {WRITINGS[0].readTime}
              </span>
            </div>
            <h3 className="hub-card-title mb-3" style={{ color: 'var(--hub-text-primary)', fontSize: 24 }}>
              {WRITINGS[0].title}
            </h3>
            <p className="hub-body" style={{ color: 'var(--hub-text-secondary)', maxWidth: 640 }}>
              {WRITINGS[0].description}
            </p>
          </Link>

          {/* Older articles — compact cards */}
          {WRITINGS.slice(1).map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="span-4 hub-card block"
              style={{ textDecoration: 'none', borderTop: `2px solid ${article.accent}40` }}
            >
              <span className="hub-mono block mb-3" style={{ color: 'var(--hub-text-muted)', fontSize: 12 }}>
                {formatDate(article.date)} &middot; {article.readTime}
              </span>
              <h3 className="hub-card-title mb-2" style={{ color: 'var(--hub-text-primary)' }}>
                {article.title}
              </h3>
              <p className="hub-body" style={{ color: 'var(--hub-text-secondary)', fontSize: 14 }}>
                {article.description}
              </p>
            </Link>
          ))}

          <div className="span-full mt-2">
            <Link href="/writings" className="hub-mono flex items-center gap-2" style={{ color: 'var(--hub-accent)' }}>
              All writing <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 5: Globe — The Observatory ════════════════════════════════ */}
      <ScrollReveal>
      <section className="zone-alt hub-section relative">
        <CornerDots color="#3B82F6" />
        <div className="absolute inset-0 pointer-events-none hub-globe-glow" />
        <div className="max-w-[1200px] mx-auto px-6 relative" style={{ zIndex: 1 }}>
          <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Cultural Atlas</div>
          <h2 className="hub-section-heading mb-10">
            Every number has a story.
          </h2>

          <div className="hub-globe-layout">
            {/* Left: Globe */}
            <div className="flex justify-center">
              <div className="globe-glow-wrapper" style={{ width: '100%', maxWidth: 420 }}>
                <AtlasGlobeTeaser size={420} hideFilters highlightNumber={hoveredMarker} />
              </div>
            </div>

            {/* Right: Description + marker cards + CTA */}
            <div>
              <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)', maxWidth: 460 }}>
                A drum machine. A country code. An error page that became a city&apos;s identity.
                Five pillars of culture, all tied to one live price.
              </p>

              {/* Marker preview cards — with hover interaction */}
              <div className="hub-marker-grid mb-8">
                {FEATURED_MARKERS.map((m) => (
                  <a
                    key={m.number}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-marker-card"
                    style={{
                      '--marker-accent': m.color,
                      boxShadow: hoveredMarker === m.number
                        ? `0 4px 24px ${m.color}30, 0 0 0 1px ${m.color}40`
                        : undefined,
                      borderColor: hoveredMarker === m.number
                        ? `${m.color}60`
                        : undefined,
                      transform: hoveredMarker === m.number
                        ? 'translateY(-3px)'
                        : undefined,
                    } as React.CSSProperties}
                    onMouseEnter={() => setHoveredMarker(m.number)}
                    onMouseLeave={() => setHoveredMarker(null)}
                  >
                    <span className="hub-marker-number">{m.number}</span>
                    <span className="hub-marker-label">{m.label}</span>
                    <span className="hub-marker-pillar">
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                      {m.pillar}
                    </span>
                  </a>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://btc.sathian.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hub-btn-explore"
              >
                Explore the Atlas <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 6: About — teaser linking to /about ═════════════════════ */}
      <ScrollReveal>
      <section id="about" className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-about-glow" />
        <div className="hub-container">
          <div className="span-full max-w-2xl">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>About</div>
            <h2 className="hub-section-heading mb-6">A lab for relearning</h2>
            <p className="hub-body mb-8" style={{ color: 'var(--hub-text-secondary)' }}>
              Re-examining things I thought I understood &mdash; money, culture,
              sovereignty &mdash; through writing and code. Not expert commentary.
              A student&apos;s notes.
            </p>
            <Link href="/about" className="hub-mono flex items-center gap-2" style={{ color: 'var(--hub-accent)' }}>
              More about me <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 7: Newsletter — real subscribe ═════════════════════════ */}
      <ScrollReveal>
      <section className="zone-alt hub-section relative">
        <CornerDots color="#EAB308" />
        <div className="absolute inset-0 pointer-events-none hub-newsletter-glow" />
        <div className="hub-container relative" style={{ zIndex: 1 }}>
          <div className="span-full max-w-lg">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Newsletter</div>
            <h2 className="hub-section-heading mb-3">Get notified when I publish</h2>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)' }}>
              New essays and project updates. Nothing else.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 8: Chat Teaser ════════════════════════════════════════════ */}
      <ScrollReveal>
      <section id="chat" className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-chat-glow" />
        <div className="hub-container">
          <div className="span-full max-w-lg">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Chat</div>
            <h2 className="hub-section-heading mb-3">Ask me anything</h2>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)' }}>
              The projects, the writing, whatever. Try one of these or type your own.
            </p>
            <div className="flex flex-wrap gap-3">
              {CHAT_PROMPTS.map((prompt) => (
                <button key={prompt} onClick={() => handlePromptClick(prompt)} className="hub-prompt-chip">
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ Zone 9: Footer ═════════════════════════════════════════════════ */}
      <footer className="zone-dark zone-dark-edge" style={{ padding: '56px 0 40px' }}>
        <div className="hub-container">
          <div className="span-full">
            <div className="flex flex-wrap items-start justify-between gap-10">
              <div>
                <span className="hub-mono block mb-3" style={{ color: 'var(--hub-text-primary)', fontSize: 14 }}>
                  sathian.ai
                </span>
                <p style={{ color: 'var(--hub-text-muted)', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                  &copy; {new Date().getFullYear()} Sathian S.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                <div className="flex flex-col gap-2.5">
                  <span className="hub-eyebrow mb-1" style={{ color: 'var(--hub-text-muted)', fontSize: 10 }}>Site</span>
                  <Link href="/writings" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Writing</Link>
                  <a href="#projects" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Projects</a>
                  <Link href="/about" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>About</Link>
                  <Link href="/voice" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Voice</Link>
                  <Link href="/studio" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Studio</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="hub-eyebrow mb-1" style={{ color: 'var(--hub-text-muted)', fontSize: 10 }}>Projects</span>
                  <a href="https://btc.sathian.ai" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: '#F7931A', textDecoration: 'none' }}>btc.sathian.ai</a>
                  <a href="https://toothfairy.sathian.ai" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: '#7C3AED', textDecoration: 'none' }}>toothfairy.sathian.ai</a>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="hub-eyebrow mb-1" style={{ color: 'var(--hub-text-muted)', fontSize: 10 }}>Social</span>
                  <a href="https://x.com/saboristry" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>X</a>
                  <a href="https://instagram.com/sathian.ai" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  )
}
