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
  quoteCoverageLedger: {
    demo: 'https://ontario-all-quote-agent.vercel.app',
  },
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
                <Tag>Brave AI Hackathon</Tag>
                <Tag>August 2026</Tag>
                <Tag>Solo build</Tag>
              </div>

              <p
                className="hub-mono"
                style={{ color: '#C9FF3D', fontSize: 12, marginBottom: 14 }}
              >
                001 / INSURANCE SHOPPING
              </p>
              <h2
                style={{
                  fontSize: 'clamp(36px, 6vw, 66px)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.055em',
                  marginBottom: 20,
                }}
              >
                Quote Coverage Ledger
              </h2>
              <p
                style={{
                  maxWidth: 650,
                  color: 'var(--hub-text-secondary)',
                  fontSize: 17,
                  lineHeight: 1.7,
                }}
              >
                An evidence-first personal shopping agent for Ontario auto
                insurance. It turns one private driver profile into a
                deduplicated market plan, runs visible browser routes with
                human approval gates, and records either a comparable quote or
                the exact reason a route stopped.
              </p>
            </div>

            <dl
              className="grid content-start gap-0"
              style={{ borderTop: '1px solid var(--hub-border-subtle)' }}
            >
              <Fact label="Market map" value="15 families / 16 routes" />
              <Fact label="Private intake" value="44 fields / 43 available" />
              <Fact label="Stack" value="LangGraph + Puppeteer + Zod" />
              <Fact label="Current proof" value="16 routes / 0 premiums" />
            </dl>
          </div>

          <div
            className="grid gap-px md:grid-cols-3"
            style={{ background: 'var(--hub-border-subtle)' }}
          >
            <DemoValue label="Public routes tested" value="16" />
            <DemoValue label="Live premiums returned" value="0" />
            <DemoValue label="Personal records exposed" value="0" />
          </div>

          <div className="flex flex-wrap gap-3 p-7 md:p-10">
            <ProjectLink href={links.quoteCoverageLedger.demo} primary>
              Open current dashboard
            </ProjectLink>
          </div>
        </article>

        <section
          className="mt-14 grid gap-8 md:grid-cols-3"
          aria-label="Quote Coverage Ledger summary"
        >
          <Summary
            number="01"
            title="The problem"
            body="Ontario presents dozens of brands and distribution paths, while ownership overlap and human-only routes make true comparison opaque."
          />
          <Summary
            number="02"
            title="The method"
            body="Build one private profile, deduplicate the market, pause before disclosure, and preserve an honest quote or blocker for every route."
          />
          <Summary
            number="03"
            title="The next step"
            body="Complete the first personal-data adapter, return a real comparable premium, and resume the route queue after genuine human gates."
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
              Four submissions, each carrying a lesson into the next build.
              This is a record of the work, not a list of prizes.
            </p>
          </div>

          <div className="grid gap-5">
            <PastBuild
              number="002"
              accent="#C9FF3D"
              event="Monad Blitz Toronto"
              date="July 25, 2026"
              mode="Solo build"
              title="AgentTab"
              description="A payment firewall for autonomous AI agents. A human sets the total allowance, maximum purchase, approved agent, and expiry; over-limit requests fail before payment while approved x402 purchases produce public receipts."
              facts={[
                ['Network', 'Monad Testnet'],
                ['Protocol', 'x402 payments'],
                ['Contract', 'Solidity policy + receipts'],
              ]}
              links={[
                { href: links.agentTab.presentation, label: 'Watch presentation', primary: true },
                { href: links.agentTab.demo, label: 'Open live demo' },
                { href: links.agentTab.github, label: 'GitHub' },
                { href: links.agentTab.contract, label: 'On-chain contract' },
              ]}
            />

            <PastBuild
              number="003"
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
              number="004"
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
