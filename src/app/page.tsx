'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'
import { ChatWidget } from '@/components/ChatWidget'

const AtlasGlobeTeaser = dynamic(
  () => import('@/components/ui/atlas-globe-teaser').then((mod) => mod.AtlasGlobeTeaser),
  { ssr: false }
)

// ─── Articles data ──────────────────────────────────────────────────────────
const WRITINGS = [
  {
    title: 'Yakko\u2019s World Was Already Wrong',
    description: '1993 was a hinge. A cartoon taught geography. A cypherpunk wrote about electronic money. The web went free. The old world was ending and the new one was being coded into existence.',
    href: '/writings/yakkos-world',
    date: '2026-02-06',
    readTime: '12 min',
    accent: '#06B6D4',
  },
  {
    title: 'The Yellow Box',
    description: 'An Uber driver, a box of No Name spaghetti, and how the gap between what institutions promise and what people experience follows the same pattern.',
    href: '/writings/the-yellow-box',
    date: '2025-12-25',
    readTime: '8 min',
    accent: '#DC2626',
  },
  {
    title: 'C.R.E.A.M. 2.0',
    description: 'How Wu-Tang Clan\u2019s journey from Staten Island mirrors Bitcoin\u2019s path from cypherpunk whitepaper to institutional adoption.',
    href: '/writings/cream-2-point-0',
    date: '2025-10-31',
    readTime: '7 min',
    accent: '#F59E0B',
  },
  {
    title: 'Nine Pages',
    description: 'I was around Bitcoin for years before I actually read the whitepaper. Nine pages changed everything.',
    href: '/writings/nine-pages',
    date: '2025-07-01',
    readTime: '9 min',
    accent: '#F7931A',
  },
]

// ─── Pillar data for globe tiles ────────────────────────────────────────────
const PILLARS = [
  { name: 'Music', color: '#A855F7', example: '808' },
  { name: 'Area Codes', color: '#3B82F6', example: '416' },
  { name: 'Sports', color: '#F97316', example: '023' },
  { name: 'History', color: '#EAB308', example: '1776' },
  { name: 'Internet', color: '#22C55E', example: '404' },
]

// ─── Featured markers — one per pillar for interest diversity ────────────────
const FEATURED_MARKERS = [
  { number: '808', label: 'TR-808 Drum Machine', pillar: 'Music', color: '#A855F7', href: 'https://btc.sathian.ai/atlas/808' },
  { number: '404', label: 'Page Not Found / Atlanta', pillar: 'Internet', color: '#22C55E', href: 'https://btc.sathian.ai/atlas/404' },
  { number: '234', label: 'Nigeria', pillar: 'Area Codes', color: '#3B82F6', href: 'https://btc.sathian.ai/atlas/234' },
  { number: '989', label: 'Berlin Wall 1989', pillar: 'History', color: '#EAB308', href: 'https://btc.sathian.ai/atlas/989' },
  { number: '899', label: 'FC Barcelona 1899', pillar: 'Sports', color: '#F97316', href: 'https://btc.sathian.ai/atlas/899' },
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

// ─── Chat prompts ───────────────────────────────────────────────────────────
const CHAT_PROMPTS = [
  "What's 404?",
  'Tell me about Tooth Fairy',
  'What are you building?',
]

// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const btcPrice = useBtcPrice()
  const [chatOpen, setChatOpen] = useState(false)
  const [prefillMsg, setPrefillMsg] = useState('')

  const handlePromptClick = useCallback((prompt: string) => {
    setPrefillMsg(prompt)
    setChatOpen(true)
  }, [])

  return (
    <div data-theme="dark" style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)' }}>
      <SiteNav />

      {/* ═══ Zone 2: Hero ═══════════════════════════════════════════════════ */}
      <section className="zone-primary relative" style={{ paddingTop: 160, paddingBottom: 100 }}>
        <div className="absolute inset-0 pointer-events-none hub-hero-glow-deep" />
        <div className="hub-container relative">
          <div className="span-full text-center">
            <div className="hub-eyebrow mb-6" style={{ color: 'var(--hub-text-muted)' }}>
              sathian.ai
            </div>
            <h1 className="hub-hero-name mb-6" style={{ position: 'relative' }}>
              Sathian S.
            </h1>
            <p className="hub-body max-w-xl mx-auto mb-10" style={{ color: 'var(--hub-text-secondary)', fontSize: 17 }}>
              Builder in Toronto, Canada. Exploring the intersection of culture, money, and technology.
            </p>
            {btcPrice && (
              <div className="flex justify-center">
                <span className="hub-price-badge">
                  <span style={{ fontSize: 11, opacity: 0.7 }}>&#x20BF;</span>
                  {formatPrice(btcPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Zone 3: Projects ═══════════════════════════════════════════════ */}
      <section id="projects" className="zone-alt hub-section relative">
        <CornerDots color="#F7931A" />
        <div className="hub-container relative" style={{ zIndex: 1 }}>
          <div className="span-full mb-4">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Projects</div>
            <h2 className="hub-section-heading">What I&apos;m building</h2>
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
            <h3 className="hub-card-title mb-2" style={{ color: 'var(--hub-text-primary)', fontSize: 22 }}>
              BTC Cultural Atlas
            </h3>
            <p
              className="hub-body mb-2"
              style={{ color: 'var(--hub-text-primary)', fontSize: 17, fontWeight: 500 }}
            >
              Every number tells a story
            </p>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)', fontSize: 14 }}>
              500+ cultural markers mapped to Bitcoin&apos;s price, tracking the journey to $1M.
              Area codes, music, sports, history, and internet culture. Updated every 10 seconds.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="hub-eyebrow px-2 py-0.5 rounded"
                style={{
                  color: 'var(--hub-text-muted)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 10,
                }}
              >
                Work in progress
              </span>
            </div>
            <div className="flex items-center gap-2 hub-mono" style={{ color: '#F7931A' }}>
              btc.sathian.ai <ArrowRight />
            </div>
          </a>

          {/* Tooth Fairy Network */}
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
              Making childhood magical, on-chain. A smart contract for family milestones.
            </p>
            <div className="flex items-center gap-2 hub-mono" style={{ color: '#7C3AED' }}>
              toothfairy.sathian.ai <ArrowRight />
            </div>
          </a>
        </div>
      </section>

      {/* ═══ Zone 4: Writing ════════════════════════════════════════════════ */}
      <section className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-writing-glow" />
        <div className="hub-container">
          <div className="span-full mb-4">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Writing</div>
            <h2 className="hub-section-heading">Essays on culture, money, and technology</h2>
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

      {/* ═══ Zone 5: Globe — The Observatory ════════════════════════════════ */}
      <section className="zone-alt hub-section relative">
        <CornerDots color="#3B82F6" />
        <div className="max-w-[1200px] mx-auto px-6 relative" style={{ zIndex: 1 }}>
          <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Cultural Atlas</div>
          <h2 className="hub-section-heading mb-10">
            Every number has a story. Five pillars. One globe.
          </h2>

          <div className="hub-globe-layout">
            {/* Left: Globe */}
            <div className="flex justify-center">
              <div className="globe-glow-wrapper" style={{ width: '100%', maxWidth: 420 }}>
                <AtlasGlobeTeaser size={420} hideFilters />
              </div>
            </div>

            {/* Right: Description + marker cards + CTA */}
            <div>
              <p className="hub-body mb-4" style={{ color: 'var(--hub-text-secondary)', maxWidth: 460 }}>
                Every three-digit number has a cultural story. A drum machine.
                A country code. An error page that became a city&apos;s identity.
                We&apos;re mapping 500+ of them to Bitcoin&apos;s live price as it climbs toward $1M.
              </p>

              <p className="hub-mono mb-6" style={{ color: 'var(--hub-text-muted)', fontSize: 12 }}>
                500+ markers &middot; 5 pillars &middot; updated every 10s
              </p>

              {/* Marker preview cards */}
              <div className="hub-marker-grid mb-8">
                {FEATURED_MARKERS.map((m) => (
                  <a
                    key={m.number}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-marker-card"
                    style={{ '--marker-accent': m.color } as React.CSSProperties}
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

      {/* ═══ Zone 6: About ══════════════════════════════════════════════════ */}
      <section id="about" className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-about-glow" />
        <div className="hub-container">
          <div className="span-full max-w-2xl">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>About</div>
            <h2 className="hub-section-heading mb-6">Building in public</h2>
            <p className="hub-body mb-4" style={{ color: 'var(--hub-text-secondary)' }}>
              I&apos;m a builder in Toronto, Canada. Father of twins. Exploring the intersection
              of culture, money, and technology.
            </p>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)' }}>
              The BTC Cultural Atlas maps 500+ numbers to cultural meaning as Bitcoin starts
              its climb to $1 million plus. The Tooth Fairy Network is an experiment in on-chain
              family memory. The writing is ongoing.
            </p>
            <Link href="/toothfairy/network/about" className="hub-mono flex items-center gap-2" style={{ color: 'var(--hub-accent)' }}>
              More about me <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Zone 7: Newsletter ═════════════════════════════════════════════ */}
      <section className="zone-alt hub-section relative">
        <CornerDots color="#EAB308" />
        <div className="hub-container relative" style={{ zIndex: 1 }}>
          <div className="span-full max-w-lg">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Newsletter</div>
            <h2 className="hub-section-heading mb-3">Stay in touch</h2>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)' }}>
              Occasional updates on new writing, projects, and ideas. No spam. Unsubscribe anytime.
            </p>
            <div className="flex flex-wrap gap-3">
              <input type="email" placeholder="your@email.com" className="hub-email-input" readOnly />
              <button className="hub-btn-primary" style={{ opacity: 0.6, cursor: 'default' }}>
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Zone 8: Chat Teaser ════════════════════════════════════════════ */}
      <section className="zone-primary hub-section relative">
        <div className="absolute inset-0 pointer-events-none hub-chat-glow" />
        <div className="hub-container">
          <div className="span-full max-w-lg">
            <div className="hub-eyebrow mb-3" style={{ color: 'var(--hub-text-muted)' }}>Chat</div>
            <h2 className="hub-section-heading mb-3">Ask me anything</h2>
            <p className="hub-body mb-6" style={{ color: 'var(--hub-text-secondary)' }}>
              Kai is my personal AI assistant. Ask about my projects, writing, or just say hello.
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
              <div className="flex gap-12">
                <div className="flex flex-col gap-2.5">
                  <span className="hub-eyebrow mb-1" style={{ color: 'var(--hub-text-muted)', fontSize: 10 }}>Site</span>
                  <a href="#projects" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Projects</a>
                  <Link href="/writings" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>Writing</Link>
                  <a href="#about" className="text-sm" style={{ color: 'var(--hub-text-secondary)', textDecoration: 'none' }}>About</a>
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

      {/* ═══ Zone 10: Chat Widget ═══════════════════════════════════════════ */}
      <ChatWidget externalOpen={chatOpen} onExternalClose={() => setChatOpen(false)} prefillMessage={prefillMsg} />
    </div>
  )
}
