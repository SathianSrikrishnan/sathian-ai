import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'

const emailHref = 'mailto:hi@sathian.ai?subject=AI%20automation%20conversation'

export const metadata: Metadata = {
  title: 'AI Automation & Private Systems - sathian.ai',
  description:
    'AI-native workflow automation, agentic reporting loops, second-brain infrastructure, and private systems by Sathian S.',
  openGraph: {
    title: 'AI Automation & Private Systems',
    description:
      'Private automation work, agentic workflows, reporting loops, and AI-native systems by Sathian S.',
    url: 'https://sathian.ai/automation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation & Private Systems',
    description:
      'AI-native workflow automation, reporting loops, second-brain infrastructure, and private systems.',
  },
}

export default function AutomationPage() {
  return (
    <div
      data-theme="dark"
      style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)', minHeight: '100dvh' }}
    >
      <SiteNav />

      <main>
        <article style={{ maxWidth: 980, margin: '0 auto', padding: '112px 24px 88px' }}>
          <p className="hub-eyebrow" style={{ color: '#06B6D4', marginBottom: 16 }}>
            AI Automation / Private Systems
          </p>
          <h1 className="hub-hero-name" style={{ fontSize: 'clamp(38px, 6vw, 64px)', marginBottom: 24, maxWidth: 760 }}>
            Build the workflow you keep doing by hand.
          </h1>
          <p style={{ ...leadStyle, color: 'var(--hub-text-primary)', maxWidth: 720 }}>
            I help shape small, useful AI-native systems: reporting agents, second-brain infrastructure,
            intake flows, research loops, agentic harnesses, and automations around messy real work.
          </p>

          <div className="hub-hero-actions" style={{ marginTop: 26, marginBottom: 28 }}>
            <a href={emailHref} className="hub-btn-primary" style={{ textDecoration: 'none' }}>
              Email hi@sathian.ai
            </a>
            <Link href="/writings/agent-allowance-lab" className="hub-btn-secondary" style={{ textDecoration: 'none' }}>
              Read a Technical Proof
            </Link>
          </div>

          <p style={{ ...bodyStyle, maxWidth: 720 }}>
            Some recent work is private at the request of clients and collaborators. I keep that separation
            deliberately. If you are serious about an AI automation problem, I can send relevant references,
            links, or examples by email.
          </p>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, margin: '44px 0' }}>
            <WorkCard
              label="Reporting Loops"
              body="Daily or weekly summaries that pull context from notes, calls, inboxes, tools, and project state."
              accent="#06B6D4"
            />
            <WorkCard
              label="Agentic Harnesses"
              body="Small agent workflows with boundaries, receipts, review steps, and clear handoffs."
              accent="#14F195"
            />
            <WorkCard
              label="Second-Brain Infrastructure"
              body="Markdown, task, memory, and project-control systems that make AI context reusable."
              accent="#A855F7"
            />
            <WorkCard
              label="Workflow Automation"
              body="Intake, triage, follow-up, document, spreadsheet, and web operations that should not stay manual."
              accent="#F7931A"
            />
          </section>

          <Divider />

          <Section title="What To Send">
            <p style={bodyStyle}>
              A useful first note does not need to be polished. Send the problem, the tools involved, how often
              the work happens, who uses the output, and what a good first version would save or unlock.
            </p>
            <ul style={listStyle}>
              <li>What repetitive workflow do you want to reduce or improve?</li>
              <li>Where does the source information live today?</li>
              <li>What output would be useful: report, draft, alert, database row, email, dashboard, or action list?</li>
              <li>What needs human approval before anything is sent, posted, changed, or spent?</li>
            </ul>
          </Section>

          <Section title="How I Think About This">
            <p style={bodyStyle}>
              The point is not to wire AI into everything. The point is to find the small operating loop where
              context, judgment, and repeated work meet. Then build a narrow system that can be tested, audited,
              and improved.
            </p>
            <p style={bodyStyle}>
              That is also why the public Solana work belongs here. Agent allowances are one version of the same
              problem: software can do more on our behalf, but it needs limits, receipts, and clear permissioning.
            </p>
          </Section>

          <div
            style={{
              background: 'var(--hub-bg-elevated)',
              border: '1px solid var(--hub-border-subtle)',
              borderLeft: '3px solid #06B6D4',
              borderRadius: 8,
              padding: 28,
              marginTop: 44,
            }}
          >
            <h2 className="hub-section-heading" style={{ fontSize: 24, marginBottom: 12 }}>
              Want to discuss a workflow?
            </h2>
            <p style={{ ...bodyStyle, marginBottom: 20 }}>
              Email the rough version. I can help clarify whether it should be a simple automation, an agentic
              workflow, a reporting loop, a dashboard, or nothing at all.
            </p>
            <a href={emailHref} className="hub-btn-primary" style={{ textDecoration: 'none' }}>
              Email hi@sathian.ai
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}

function WorkCard({ label, body, accent }: { label: string; body: string; accent: string }) {
  return (
    <div
      style={{
        background: 'var(--hub-bg-elevated)',
        border: '1px solid var(--hub-border-subtle)',
        borderTop: `3px solid ${accent}`,
        borderRadius: 8,
        padding: 22,
      }}
    >
      <h2 className="hub-card-title" style={{ color: 'var(--hub-text-primary)', marginBottom: 10, fontSize: 18 }}>
        {label}
      </h2>
      <p style={{ ...bodyStyle, fontSize: 14, marginBottom: 0 }}>{body}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 38 }}>
      <h2 className="hub-section-heading" style={{ fontSize: 26, marginBottom: 16 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Divider() {
  return <div style={{ width: 56, height: 1, background: 'var(--hub-border-subtle)', margin: '48px 0' }} />
}

const leadStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 20,
  lineHeight: 1.65,
  color: 'var(--hub-text-secondary)',
  marginBottom: 20,
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 17,
  lineHeight: 1.72,
  color: 'var(--hub-text-secondary)',
  marginBottom: 18,
}

const listStyle: React.CSSProperties = {
  ...bodyStyle,
  paddingLeft: 22,
}
