import type { Metadata } from 'next'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Hackathons - Sathian S.',
  description:
    'Rapid technical experiments built and presented at hackathons by Sathian S.',
  openGraph: {
    title: 'Hackathons - Sathian S.',
    description:
      'Rapid technical experiments built and presented at hackathons by Sathian S.',
  },
}

const links = {
  agentTab: {
    demo: 'https://agenttab.sathian.ai',
    presentation: 'https://agenttab.sathian.ai/presentation',
    github: 'https://github.com/SathianSrikrishnan/monad-blitz-toronto',
    contract:
      'https://testnet.monadscan.com/address/0x9b223107e5724619cbfe06f4847eb097b46a8f16',
  },
  toothFairyNetwork: {
    story: '/writings/the-gap-between-weeks',
    github: 'https://github.com/SathianSrikrishnan/toothfairy-network',
    product: 'https://toothfairy.network',
  },
  clinicalGuard: {
    post: 'https://www.linkedin.com/posts/activity-7437509764399640577-86Rt',
    github: 'https://github.com/SathianSrikrishnan/ClinicalGuard',
  },
}

export default function HackathonsPage() {
  return (
    <div
      data-theme="dark"
      style={{
        minHeight: '100dvh',
        background: 'var(--hub-bg-primary)',
        color: 'var(--hub-text-primary)',
      }}
    >
      <SiteNav />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-28">
        <header className="max-w-[820px] pb-14">
          <p
            className="hub-eyebrow"
            style={{ color: 'var(--hub-text-muted)', marginBottom: 18 }}
          >
            Field builds / public proof
          </p>
          <h1
            className="hub-hero-name"
            style={{
              fontSize: 'clamp(42px, 8vw, 88px)',
              lineHeight: 0.96,
              letterSpacing: '-0.055em',
              marginBottom: 28,
            }}
          >
            Hackathons are where ideas meet the clock.
          </h1>
          <p
            style={{
              maxWidth: 700,
              color: 'var(--hub-text-secondary)',
              fontSize: 19,
              lineHeight: 1.65,
            }}
          >
            Small, working systems built under pressure—then documented with
            live demos, source code, and honest notes about what comes next.
          </p>
        </header>

        <article
          style={{
            overflow: 'hidden',
            border: '1px solid var(--hub-border-subtle)',
            borderRadius: 12,
            background: 'var(--hub-bg-elevated)',
          }}
        >
          <div
            className="grid gap-8 p-7 md:grid-cols-[1.1fr_0.9fr] md:p-10"
            style={{ borderBottom: '1px solid var(--hub-border-subtle)' }}
          >
            <div>
              <div className="mb-7 flex flex-wrap gap-2">
                <Tag>Monad Blitz Toronto</Tag>
                <Tag>July 25, 2026</Tag>
                <Tag>Solo build</Tag>
              </div>

              <p
                className="hub-mono"
                style={{ color: '#C9FF3D', fontSize: 12, marginBottom: 14 }}
              >
                001 / AGENT PAYMENTS
              </p>
              <h2
                style={{
                  fontSize: 'clamp(36px, 6vw, 66px)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.055em',
                  marginBottom: 20,
                }}
              >
                AgentTab
              </h2>
              <p
                style={{
                  maxWidth: 650,
                  color: 'var(--hub-text-secondary)',
                  fontSize: 17,
                  lineHeight: 1.7,
                }}
              >
                A payment firewall for autonomous AI agents. A human sets the
                total allowance, maximum purchase, approved agent, and expiry.
                Four API requests launch together: three approved x402
                purchases proceed, while one over-limit purchase is blocked
                before payment.
              </p>
            </div>

            <dl
              className="grid content-start gap-0"
              style={{ borderTop: '1px solid var(--hub-border-subtle)' }}
            >
              <Fact label="Network" value="Monad Testnet" />
              <Fact label="Protocol" value="x402 payments" />
              <Fact label="Contract" value="Solidity policy + receipts" />
              <Fact label="Build window" value="One day" />
            </dl>
          </div>

          <div
            className="grid gap-px md:grid-cols-3"
            style={{ background: 'var(--hub-border-subtle)' }}
          >
            <DemoValue label="Total allowance" value="0.030 USDC" />
            <DemoValue label="Maximum purchase" value="0.002 USDC" />
            <DemoValue label="Presentation" value="2:49" />
          </div>

          <div className="flex flex-wrap gap-3 p-7 md:p-10">
            <ProjectLink href={links.agentTab.presentation} primary>
              Watch presentation
            </ProjectLink>
            <ProjectLink href={links.agentTab.demo}>Open live demo</ProjectLink>
            <ProjectLink href={links.agentTab.github}>GitHub</ProjectLink>
            <ProjectLink href={links.agentTab.contract}>On-chain contract</ProjectLink>
          </div>
        </article>

        <section
          className="mt-14 grid gap-8 md:grid-cols-3"
          aria-label="AgentTab summary"
        >
          <Summary
            number="01"
            title="The problem"
            body="Agents need to purchase data and services, but an unlimited wallet is an unacceptable security model."
          />
          <Summary
            number="02"
            title="The primitive"
            body="A public budget policy, a fail-closed payment check, and a cryptographic receipt for the completed batch."
          />
          <Summary
            number="03"
            title="The next step"
            body="Move custody into a smart-account vault so the on-chain policy directly controls the funds."
          />
        </section>

        <section className="mt-24" aria-labelledby="earlier-submissions">
          <div
            className="mb-9 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-end md:justify-between"
            style={{ borderColor: 'var(--hub-border-subtle)' }}
          >
            <div>
              <p className="hub-eyebrow" style={{ color: 'var(--hub-text-muted)' }}>
                Earlier submissions
              </p>
              <h2
                id="earlier-submissions"
                style={{
                  marginTop: 14,
                  fontSize: 'clamp(30px, 5vw, 54px)',
                  letterSpacing: '-0.045em',
                  lineHeight: 1,
                }}
              >
                The build record behind this one.
              </h2>
            </div>
            <p
              style={{
                maxWidth: 430,
                color: 'var(--hub-text-secondary)',
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Three submissions, each carrying a lesson into the next build.
              This is a record of the work, not a list of prizes.
            </p>
          </div>

          <div className="grid gap-5">
            <PastBuild
              number="002"
              accent="#B794F6"
              event="Colosseum Frontier 2026"
              date="May 2026"
              mode="Solo product build"
              title="Tooth Fairy Network"
              description="A parent-controlled Solana keepsake and Smile Fund built around a child’s lost tooth. Compressed assets, permanent metadata, wallet flows, and an Anchor escrow sat beneath a family memory ritual."
              facts={[
                ['Network', 'Solana'],
                ['Product', 'Keepsake + Smile Fund'],
                ['Lesson', 'The memory is the product'],
              ]}
              links={[
                { href: links.toothFairyNetwork.story, label: 'Read The Gap Between Weeks', primary: true },
                { href: links.toothFairyNetwork.product, label: 'Open current product' },
                { href: links.toothFairyNetwork.github, label: 'Original submission code' },
              ]}
            />

            <PastBuild
              number="003"
              accent="#5EEAD4"
              event="U of T Healthcare AI Hackathon"
              date="March 2026"
              mode="AI workflow"
              title="ClinicalGuard"
              description="A five-step AI pipeline that extracts ICD-9 codes from discharge notes, checks them against laboratory and prescription evidence, and flags weak matches for human review."
              facts={[
                ['Data', '2,000 MIMIC admissions'],
                ['Stack', 'LangGraph + Claude'],
                ['Role', 'Evidence before billing'],
              ]}
              links={[
                { href: links.clinicalGuard.post, label: 'Read the submission post', primary: true },
                { href: links.clinicalGuard.github, label: 'GitHub' },
              ]}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function PastBuild({
  number,
  accent,
  event,
  date,
  mode,
  title,
  description,
  facts,
  links: projectLinks,
}: {
  number: string
  accent: string
  event: string
  date: string
  mode: string
  title: string
  description: string
  facts: [string, string][]
  links: { href: string; label: string; primary?: boolean }[]
}) {
  return (
    <article
      style={{
        overflow: 'hidden',
        border: '1px solid var(--hub-border-subtle)',
        borderRadius: 12,
        background: 'var(--hub-bg-elevated)',
      }}
    >
      <div className="grid gap-8 p-7 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            <Tag>{event}</Tag>
            <Tag>{date}</Tag>
            <Tag>{mode}</Tag>
          </div>
          <p className="hub-mono" style={{ color: accent, fontSize: 12, marginBottom: 14 }}>
            {number} / SUBMITTED
          </p>
          <h3
            style={{
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 0.98,
              letterSpacing: '-0.05em',
              marginBottom: 20,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              maxWidth: 660,
              color: 'var(--hub-text-secondary)',
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            {description}
          </p>
        </div>

        <dl className="grid content-start gap-0" style={{ borderTop: '1px solid var(--hub-border-subtle)' }}>
          {facts.map(([label, value]) => <Fact key={label} label={label} value={value} />)}
        </dl>
      </div>

      <div
        className="flex flex-wrap gap-3 border-t p-7 md:px-10"
        style={{ borderColor: 'var(--hub-border-subtle)' }}
      >
        {projectLinks.map((link) => (
          <ProjectLink key={link.href} href={link.href} primary={link.primary} accent={accent}>
            {link.label}
          </ProjectLink>
        ))}
      </div>
    </article>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="hub-mono"
      style={{
        padding: '7px 9px',
        border: '1px solid var(--hub-border-subtle)',
        borderRadius: 5,
        color: 'var(--hub-text-muted)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </span>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between gap-5 py-4"
      style={{ borderBottom: '1px solid var(--hub-border-subtle)' }}
    >
      <dt
        className="hub-mono"
        style={{ color: 'var(--hub-text-muted)', fontSize: 10 }}
      >
        {label}
      </dt>
      <dd style={{ color: 'var(--hub-text-primary)', fontSize: 14 }}>
        {value}
      </dd>
    </div>
  )
}

function DemoValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 28, background: '#07070B' }}>
      <span
        className="hub-mono"
        style={{
          display: 'block',
          color: 'var(--hub-text-muted)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {label}
      </span>
      <strong style={{ color: '#C9FF3D', fontSize: 25 }}>{value}</strong>
    </div>
  )
}

function ProjectLink({
  href,
  primary = false,
  accent = '#C9FF3D',
  children,
}: {
  href: string
  primary?: boolean
  accent?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hub-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 44,
        padding: '0 15px',
        border: primary ? `1px solid ${accent}` : '1px solid var(--hub-border-subtle)',
        borderRadius: 6,
        background: primary ? accent : 'transparent',
        color: primary ? '#0A0A0F' : 'var(--hub-text-secondary)',
        fontSize: 11,
        fontWeight: 700,
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {children} <span aria-hidden="true" style={{ marginLeft: 9 }}>↗</span>
    </a>
  )
}

function Summary({
  number,
  title,
  body,
}: {
  number: string
  title: string
  body: string
}) {
  return (
    <article
      style={{
        paddingTop: 22,
        borderTop: '1px solid var(--hub-border-subtle)',
      }}
    >
      <span
        className="hub-mono"
        style={{ color: '#7C6EFF', fontSize: 11 }}
      >
        {number}
      </span>
      <h3 style={{ fontSize: 22, margin: '30px 0 10px' }}>{title}</h3>
      <p
        style={{
          color: 'var(--hub-text-secondary)',
          fontSize: 14,
          lineHeight: 1.65,
        }}
      >
        {body}
      </p>
    </article>
  )
}
