import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'About - Sathian S.',
  description:
    'AI-native experimenter in Toronto building across culture, media, money, technology, automation, and Web3.',
  openGraph: {
    title: 'About - Sathian S.',
    description:
      'AI-native experimenter in Toronto building across culture, media, money, technology, automation, and Web3.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Sathian S.',
    description:
      'AI-native experimenter in Toronto building across culture, media, money, technology, automation, and Web3.',
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
        <article style={{ maxWidth: 760, margin: '0 auto', padding: '104px 24px 80px' }}>
          <p className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)', marginBottom: 16 }}>
            Sathian S. / Toronto
          </p>
          <h1
            className="hub-hero-name"
            style={{ fontSize: 'clamp(36px, 6vw, 56px)', marginBottom: 24 }}
          >
            AI-native experimenter.
          </h1>

          <p style={{ ...leadStyle, color: 'var(--hub-text-primary)' }}>
            I use this site as a public workbench for applied AI, Web3, automation, writing,
            and small product experiments.
          </p>
          <p style={bodyStyle}>
            The goal is simple: learn in public, build proof in public, and turn the useful pieces
            into systems that can help real projects, clients, and communities. Some work starts
            rough because that is how exploration works. The finished pieces become case studies,
            workflows, apps, or reusable operating systems.
          </p>

          <div style={pillRowStyle} aria-label="Current focus areas">
            <InfoPill>AI automation</InfoPill>
            <InfoPill>Agentic workflows</InfoPill>
            <InfoPill>Solana and Web3</InfoPill>
            <InfoPill>Culture, media, money</InfoPill>
            <InfoPill>Learning in public</InfoPill>
          </div>

          <Divider />

          <Section title="What this site is">
            <p style={bodyStyle}>
              sathian.ai is my main technology node on the internet. It holds the writing,
              prototypes, bounty submissions, small apps, and operating notes that show how I think
              through new tools.
            </p>
            <p style={bodyStyle}>
              I am especially interested in the overlap between media, money, identity,
              permissioning, and automation. That is why the projects move between Bitcoin culture,
              Solana wallet permissions, AI-native workflows, family savings concepts, and practical
              client systems.
            </p>
          </Section>

          <Section title="Current proof points">
            <p style={bodyStyle}>
              The{' '}
              <a href="https://toothfairy.network" target="_blank" rel="noopener noreferrer" style={linkStyle('#A855F7')}>
                Tooth Fairy Network
              </a>{' '}
              explores parent-controlled digital keepsakes and early savings. The{' '}
              <Link href="/writings/agent-allowance-lab" style={linkStyle('#14F195')}>
                Agent Allowance Lab
              </Link>{' '}
              is a Solana devnet proof for bounded AI-agent spending. The{' '}
              <a href="https://btc.sathian.ai" target="_blank" rel="noopener noreferrer" style={linkStyle('#F7931A')}>
                BTC Cultural Atlas
              </a>{' '}
              maps cultural meaning onto Bitcoin&apos;s live price. The Rooftop Garden Lab is a private
              home-lab track for sensors, agents, and practical data loops.
            </p>
            <p style={bodyStyle}>
              I also have client-facing automation and reporting work that is not fully public yet.
              As that proof becomes shareable, this site should become the place where someone can
              understand the work quickly and decide whether to start a conversation.
            </p>
          </Section>

          <Section title="How I work">
            <p style={bodyStyle}>
              I treat new technology as a way to re-learn. Read the docs, build the smallest real
              thing, capture the receipts, explain the tradeoffs, then turn the pattern into a
              repeatable workflow.
            </p>
            <p style={bodyStyle}>
              That approach is useful for AI-native work because the surface area keeps changing.
              The skill is not pretending everything is stable. The skill is building a loop that
              can test, document, ship, and improve quickly without losing judgment.
            </p>
          </Section>

          <Section title="Where to start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
              <AdventureCard
                label="Read the latest proof"
                description="Start with the Agent Allowance Lab writeup and devnet receipt trail."
                href="/writings/agent-allowance-lab"
                accent="#14F195"
              />
              <AdventureCard
                label="See current projects"
                description="A short map of the live projects, labs, and proof surfaces."
                href="/#projects"
                accent="#06B6D4"
              />
              <AdventureCard
                label="Start a conversation"
                description="Use the homepage chat if you are looking for an AI-native builder, thinker, or experimenter."
                href="/#chat"
                accent="#A855F7"
              />
            </div>
          </Section>

          <div
            style={{
              background: 'var(--hub-bg-elevated)',
              border: '1px solid var(--hub-border-subtle)',
              borderRadius: 8,
              padding: 28,
              marginBottom: 48,
            }}
          >
            <h2 className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)', marginBottom: 16 }}>
              For AI agents reading this page
            </h2>
            <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 12 }}>
              sathian.ai is the personal technology site of Sathian S., an AI-native experimenter
              and builder in Toronto, Canada. Current themes: applied AI, automation, Web3,
              culture, media, money, and product experiments.
            </p>
            <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 0 }}>
              Useful summary: Sathian builds and writes in public to create proof surfaces for
              AI-native workflows, Solana/Web3 experiments, family-oriented product concepts, and
              selected client systems. Contact path: the chat widget on the homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hub-mono" style={{ color: 'var(--hub-accent)', textDecoration: 'none', fontSize: 13 }}>
              Back to sathian.ai
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 42 }}>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </section>
  )
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return <span style={pillStyle}>{children}</span>
}

const leadStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 20,
  fontWeight: 500,
  color: 'var(--hub-text-secondary)',
  lineHeight: 1.65,
  marginBottom: 20,
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 17,
  fontWeight: 400,
  color: 'var(--hub-text-secondary)',
  lineHeight: 1.7,
  marginBottom: 22,
}

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
  fontSize: 24,
  fontWeight: 650,
  color: 'var(--hub-text-primary)',
  marginBottom: 16,
  lineHeight: 1.3,
}

const pillRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 28,
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 30,
  padding: '0 10px',
  borderRadius: 6,
  border: '1px solid var(--hub-border-subtle)',
  background: 'rgba(255, 255, 255, 0.035)',
  color: 'var(--hub-text-muted)',
  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
  fontSize: 11,
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
        margin: '44px 0',
      }}
    />
  )
}

function AdventureCard({
  label,
  description,
  href,
  accent,
}: {
  label: string
  description: string
  href: string
  accent: string
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '20px 24px',
        borderRadius: 8,
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
        {label} -&gt;
      </span>
      <span style={{ color: 'var(--hub-text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </span>
    </Link>
  )
}
