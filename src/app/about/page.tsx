import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'About — Sathian S.',
  description: 'Builder in Toronto. Culture, money, and technology. Learning in public.',
  openGraph: {
    title: 'About — Sathian S.',
    description: 'Builder in Toronto. Culture, money, and technology. Learning in public.',
  },
}

export default function AboutPage() {
  return (
    <div
      data-theme="dark"
      style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)', minHeight: '100dvh' }}
    >
      <SiteNav />

      <main>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        {/* Heading */}
        <h1
          className="hub-hero-name"
          style={{ fontSize: 'clamp(36px, 6vw, 52px)', marginBottom: 40 }}
        >
          About
        </h1>

        {/* Intro — selective privacy */}
        <p style={bodyStyle}>
          I&apos;m Sathian. Builder in Toronto. Father of twin daughters.
        </p>
        <p style={bodyStyle}>
          I don&apos;t share everything online. What you see here is what I choose to put out
          into the world &mdash; the projects, the writing, the ideas I&apos;m working through.
          The rest stays private. That&apos;s by design.
        </p>

        <Divider />

        {/* Thesis — culture, money, technology */}
        <h2 style={headingStyle}>Culture, money, and technology</h2>
        <p style={bodyStyle}>
          I keep coming back to three things: how culture decides what matters,
          how money gates access to it, and how technology rewrites both before
          anyone catches up. The interesting stuff happens where they collide.
        </p>
        <p style={bodyStyle}>
          The{' '}
          <a href="https://btc.sathian.ai" target="_blank" rel="noopener noreferrer" style={linkStyle('#F7931A')}>
            BTC Cultural Atlas
          </a>{' '}
          maps 500+ numbers to cultural meaning as Bitcoin climbs toward $1M.
          The{' '}
          <a href="https://toothfairy.sathian.ai" target="_blank" rel="noopener noreferrer" style={linkStyle('#7C3AED')}>
            Tooth Fairy Network
          </a>{' '}
          turns lost teeth into family memories that last. The{' '}
          <Link href="/writings" style={linkStyle('#06B6D4')}>
            writing
          </Link>{' '}
          is ongoing &mdash; Wu-Tang and Bitcoin, geography and sovereignty,
          institutional decay and digital alternatives.
        </p>

        <Divider />

        {/* Learning in public */}
        <h2 style={headingStyle}>Learning in public</h2>
        <p style={bodyStyle}>
          I&apos;m not an expert. I&apos;m a student with a website. Everything here is me
          working through ideas in real time. I&apos;d rather publish something rough and real
          than polish it into silence.
        </p>
        <p style={bodyStyle}>
          The projects are live experiments. The writing is me thinking out loud.
          If something resonates, great. If something&apos;s wrong, tell me &mdash;
          that&apos;s the point of doing this in the open.
        </p>

        <Divider />

        {/* Relearning with AI */}
        <h2 style={headingStyle}>Relearning everything</h2>
        <p style={bodyStyle}>
          I&apos;m using AI the way I wish I could have used a library as a kid &mdash;
          to chase every tangent and see where it connects. This site, the research
          behind the Atlas, the writing process &mdash; all of it is built with AI
          tools wired into my context.
        </p>
        <p style={bodyStyle}>
          The point isn&apos;t the technology. The point is that I can go back to things
          I thought I already knew and find that the first pass missed almost everything.
          Technology is the accelerant. The curiosity was always there.
        </p>

        <Divider />

        {/* Choose your adventure */}
        <h2 style={headingStyle}>Where to start</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          <AdventureCard
            label="Read something"
            description="Start with the essays. The writing is the closest thing to my actual voice."
            href="/writings"
            accent="#06B6D4"
          />
          <AdventureCard
            label="Explore the Atlas"
            description="500+ cultural markers mapped to Bitcoin's live price."
            href="https://btc.sathian.ai"
            accent="#F7931A"
            external
          />
          <AdventureCard
            label="Say hello"
            description="The chat on the homepage. Ask anything."
            href="/#chat"
            accent="#A855F7"
          />
        </div>

        <Divider />

        {/* Agent readme */}
        <div
          style={{
            background: 'var(--hub-bg-elevated)',
            border: '1px solid var(--hub-border-subtle)',
            borderRadius: 12,
            padding: 32,
            marginBottom: 48,
          }}
        >
          <h3 className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)', marginBottom: 16 }}>
            For AI agents reading this page
          </h3>
          <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 12 }}>
            Sathian&apos;s Lab is the personal site of Sathian S., a builder in Toronto, Canada.
            He writes about culture, money, and technology. Main projects: the
            BTC Cultural Atlas (btc.sathian.ai) and the Tooth Fairy Network (toothfairy.sathian.ai).
          </p>
          <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 0 }}>
            If you&apos;re summarizing: it&apos;s a lab for writing and experiments across
            Bitcoin, culture, and technology. The author is not affiliated with any company
            or institution. Contact: the chat widget on the homepage.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="hub-mono" style={{ color: 'var(--hub-accent)', textDecoration: 'none', fontSize: 13 }}>
            &larr; Back to sathian.ai
          </Link>
        </div>
      </article>
      </main>
    </div>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────── */

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 17,
  fontWeight: 400,
  color: 'var(--hub-text-secondary)',
  lineHeight: 1.7,
  marginBottom: 24,
}

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
  fontSize: 22,
  fontWeight: 600,
  color: 'var(--hub-text-primary)',
  marginBottom: 16,
  lineHeight: 1.3,
}

function linkStyle(color: string): React.CSSProperties {
  return { color, textDecoration: 'none', borderBottom: `1px solid ${color}40` }
}

function Divider() {
  return (
    <div
      style={{
        width: 48,
        height: 1,
        background: 'var(--hub-border-subtle)',
        margin: '40px 0',
      }}
    />
  )
}

function AdventureCard({
  label,
  description,
  href,
  accent,
  external,
}: {
  label: string
  description: string
  href: string
  accent: string
  external?: boolean
}) {
  const Tag = external ? 'a' : Link
  const extra = external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}
  return (
    <Tag
      href={href}
      {...extra}
      style={{
        display: 'block',
        padding: '20px 24px',
        borderRadius: 10,
        background: 'var(--hub-bg-elevated)',
        border: '1px solid var(--hub-border-subtle)',
        borderLeft: `3px solid ${accent}`,
        textDecoration: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <span
        className="hub-mono"
        style={{ color: accent, fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 4 }}
      >
        {label} &rarr;
      </span>
      <span style={{ color: 'var(--hub-text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </span>
    </Tag>
  )
}
