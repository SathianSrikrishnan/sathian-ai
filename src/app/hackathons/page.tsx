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
  demo: 'https://agenttab.sathian.ai',
  presentation: 'https://agenttab.sathian.ai/presentation',
  github: 'https://github.com/SathianSrikrishnan/agenttab-monad',
  contract:
    'https://testnet.monadscan.com/address/0x9b223107e5724619cbfe06f4847eb097b46a8f16',
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
            <ProjectLink href={links.presentation} primary>
              Watch presentation
            </ProjectLink>
            <ProjectLink href={links.demo}>Open live demo</ProjectLink>
            <ProjectLink href={links.github}>GitHub</ProjectLink>
            <ProjectLink href={links.contract}>On-chain contract</ProjectLink>
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
      </main>
    </div>
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
  children,
}: {
  href: string
  primary?: boolean
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
        border: primary
          ? '1px solid #C9FF3D'
          : '1px solid var(--hub-border-subtle)',
        borderRadius: 6,
        background: primary ? '#C9FF3D' : 'transparent',
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
