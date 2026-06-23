import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'

const repoUrl = 'https://github.com/SathianSrikrishnan/solana-agent-allowance-demo'

export const metadata: Metadata = {
  title: 'Agent Allowance Lab: Wallet-Safe Budgets for AI Agents on Solana - sathian.ai',
  description:
    'A Superteam Canada technical deep dive on using Solana Native Subscriptions and Allowances as bounded spending authority for AI agents.',
  authors: [{ name: 'Sathian S.', url: 'https://sathian.ai' }],
  keywords: ['Solana', 'Superteam Canada', 'subscriptions', 'allowances', 'AI agents', 'devnet'],
  openGraph: {
    title: 'Agent Allowance Lab: Wallet-Safe Budgets for AI Agents on Solana',
    description:
      'A technical deep dive on fixed token allowances, agent budgets, and receipt-first automation on Solana.',
    type: 'article',
    publishedTime: '2026-06-23',
    authors: ['Sathian S.'],
    siteName: 'sathian.ai',
    url: 'https://sathian.ai/writings/agent-allowance-lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Allowance Lab',
    description: 'Wallet-safe AI agent budgets using Solana Native Subscriptions and Allowances.',
  },
}

const thesis =
  'Useful agents need spending authority, but users need limits, expiry, revocation, and receipts.'

const flow = [
  'Create a test USDC-style mint with 6 decimals.',
  'Mint 10 test tokens to a user token account.',
  'Initialize the user Subscription Authority for that mint.',
  'Create a Fixed Delegation PDA that authorizes an agent wallet for 7 test tokens.',
  'Let the agent pull 2 test tokens.',
  'Let the agent pull 5 test tokens.',
  'Attempt an 8-token pull and record the program-enforced denial.',
]

const tradeoffs = [
  'Wallet interfaces still need to explain the allowance amount, token mint, delegatee, expiry, and revocation path clearly.',
  'Allowance logic protects token movement, not off-chain judgment. An agent can still buy the wrong thing inside the allowed cap.',
  'A production version needs stronger key management, better RPC reliability, richer error decoding, monitoring, and a reviewed wallet UX.',
  'Recurring and subscription-plan flows introduce harder product questions around cancellation, puller authorization, and destination controls.',
]

const canadianExamples = [
  'Shopify-style commerce workflows could use per-app or per-agent budgets for store operations.',
  'Wealthsimple-style consumer finance products could expose explicit spending envelopes for automation instead of broad account access.',
  'Canadian AI and data-service builders could attach allowance receipts to paid tool calls, metered APIs, and research workflows.',
]

export default function AgentAllowanceLabPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Agent Allowance Lab: Wallet-Safe Budgets for AI Agents on Solana',
    description:
      'A Superteam Canada technical deep dive on Solana Native Subscriptions and Allowances as a bounded spending primitive for AI agents.',
    datePublished: '2026-06-23',
    author: { '@type': 'Person', name: 'Sathian S.', url: 'https://sathian.ai' },
    publisher: { '@type': 'Person', name: 'Sathian S.', url: 'https://sathian.ai' },
    mainEntityOfPage: 'https://sathian.ai/writings/agent-allowance-lab',
    keywords: 'Solana, Superteam Canada, subscriptions, allowances, AI agents',
  }

  return (
    <div
      data-theme="dark"
      style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)', minHeight: '100dvh' }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main>
        <article style={{ maxWidth: 820, margin: '0 auto', padding: '120px 24px 80px' }}>
          <div className="hub-eyebrow" style={{ color: '#14F195', marginBottom: 16 }}>
            Superteam Canada / Technical Deep Dive
          </div>

          <h1 className="hub-hero-name" style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 24 }}>
            Agent Allowance Lab
          </h1>

          <p style={{ ...leadStyle, color: 'var(--hub-text-primary)' }}>
            AI agents should not receive raw wallets. They should receive explicit budgets.
          </p>
          <p style={leadStyle}>
            Agent Allowance Lab is a small devnet demo and technical writeup built around Solana Native
            Subscriptions and Allowances. The demo gives an agent wallet a capped allowance, lets it complete two
            approved transfers, and then shows a larger over-budget transfer fail closed.
          </p>

          <div style={calloutStyle}>
            <span className="hub-eyebrow" style={{ color: '#14F195', display: 'block', marginBottom: 12 }}>
              Product thesis
            </span>
            <p style={{ ...bodyStyle, marginBottom: 0, color: 'var(--hub-text-primary)' }}>{thesis}</p>
          </div>

          <Link href={repoUrl} target="_blank" rel="noopener noreferrer" style={primaryLinkStyle}>
            View the public demo repo
          </Link>

          <Divider />

          <Section title="The Problem" accent="#14F195">
            <p style={bodyStyle}>
              If an AI agent is going to help with paid actions, it needs some way to pay. That could mean buying API
              credits, paying for data, renewing a service, posting a transaction, or handling a small operational
              workflow.
            </p>
            <p style={bodyStyle}>
              The naive implementation is dangerous: give the agent an API key, wallet key, or custodial account with
              broad access. That may work for a demo, but it is a poor trust model. If the agent loops, gets prompted
              badly, misprices an action, or has its environment compromised, the user has little protection.
            </p>
            <p style={bodyStyle}>
              A better model is bounded authorization: the user keeps the wallet, the agent receives only a limited
              allowance, every action creates a receipt, and over-budget actions fail by default.
            </p>
          </Section>

          <Section title="How the Primitive Works" accent="#9945FF">
            <p style={bodyStyle}>
              The normal SPL Token delegate model is too narrow for many real products because a token account can
              have only one delegate. Solana Native Subscriptions and Allowances adds a Subscription Authority PDA for
              a user and mint pair. The user approves that authority as the token delegate, but the authority cannot
              spend freely. It can transfer only when a separate delegation account permits the action.
            </p>
            <p style={bodyStyle}>The program supports three models:</p>
            <ul style={listStyle}>
              <li>Fixed delegation: a delegatee can spend up to a fixed total amount before an optional expiry.</li>
              <li>Recurring delegation: a delegatee can spend up to a per-period amount that resets each period.</li>
              <li>Subscription plan: a merchant publishes reusable terms and subscribers opt in to those terms.</li>
            </ul>
            <p style={bodyStyle}>
              Agent Allowance Lab uses fixed delegation because it maps directly to a simple agent budget.
            </p>
          </Section>

          <CodeBlock>
            {`User grants agent 7 test USDC.
Agent spends 2.
Agent spends 5.
Agent tries 8 more.
Program denies the transfer.`}
          </CodeBlock>

          <Section title="Demo Architecture" accent="#00C2FF">
            <p style={bodyStyle}>
              The TypeScript demo runs on devnet and creates disposable local keypairs: a payer wallet for fees and
              rent, a user wallet that owns the test tokens, and an agent wallet that receives bounded authority.
            </p>
            <ol style={listStyle}>
              {flow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p style={bodyStyle}>
              The script writes a JSON receipt to <code style={codeStyle}>receipts/latest.json</code>. That receipt
              includes wallet addresses, mint, PDA addresses, successful transaction links, final balances, and the
              denied action.
            </p>
          </Section>

          <Section title="Why This Is Useful" accent="#F7931A">
            <p style={bodyStyle}>
              The immediate use case is AI agent spending. A user could authorize an agent to spend a small amount on
              research tools, paid APIs, data retrieval, compute, or workflow automation without handing over the
              wallet itself.
            </p>
            <p style={bodyStyle}>
              This also composes with non-agent products. A SaaS company could use subscriptions for billing. A
              marketplace could publish plans. A data provider could accept bounded pulls. A consumer fintech app
              could let users create per-merchant or per-agent budgets.
            </p>
          </Section>

          <Section title="Tradeoffs" accent="#EAB308">
            <ul style={listStyle}>
              {tradeoffs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="Canadian Relevance" accent="#EF4444">
            <p style={bodyStyle}>
              The Superteam Canada context matters because Canadian builders are well-positioned to explore practical,
              useful automation rather than treating on-chain subscriptions as only a crypto-native billing feature.
            </p>
            <ul style={listStyle}>
              {canadianExamples.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="What I Would Build Next" accent="#22C55E">
            <p style={bodyStyle}>
              The next version should add a small browser UI for allowance state, recurring delegation support for
              weekly or monthly budgets, revocation and expiry demos, wallet-adapter integration, better error
              decoding, and adapters for paid API lookups or data purchases.
            </p>
            <p style={bodyStyle}>
              I would not start with real-money trading or production private keys. The point of the primitive is
              controlled authority, so the product should preserve that principle from the first screen.
            </p>
          </Section>

          <Divider />

          <section aria-labelledby="references">
            <h2 id="references" style={headingStyle('#14F195')}>
              References
            </h2>
            <ul style={referenceListStyle}>
              <Reference href="https://solana.com/news/subscriptions-and-allowances" label="Solana announcement" />
              <Reference href="https://github.com/solana-program/subscriptions" label="Official subscriptions repository" />
              <Reference href="https://solana.com/docs/payments/subscriptions/subscription-plan" label="Solana subscription plan docs" />
              <Reference href="https://docs.chainstack.com/docs/solana-subscriptions-and-allowances" label="Chainstack guide" />
              <Reference href={repoUrl} label="Agent Allowance Lab demo repo" />
            </ul>
          </section>

          <footer style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--hub-border-subtle)' }}>
            <Link href="/writings" className="hub-mono" style={{ color: '#14F195', textDecoration: 'none' }}>
              Back to writing
            </Link>
          </footer>
        </article>
      </main>
    </div>
  )
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={title.toLowerCase().replaceAll(' ', '-')} style={{ marginBottom: 42 }}>
      <h2 id={title.toLowerCase().replaceAll(' ', '-')} style={headingStyle(accent)}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function CodeBlock({ children }: { children: string }) {
  return <pre style={preStyle}>{children}</pre>
}

function Reference({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" style={referenceLinkStyle}>
        {label}
      </a>
    </li>
  )
}

function Divider() {
  return <div style={{ width: 56, height: 1, background: 'var(--hub-border-subtle)', margin: '44px 0' }} />
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

const referenceListStyle: React.CSSProperties = {
  ...bodyStyle,
  paddingLeft: 22,
  marginBottom: 0,
}

const calloutStyle: React.CSSProperties = {
  background: 'var(--hub-bg-elevated)',
  border: '1px solid var(--hub-border-subtle)',
  borderLeft: '3px solid #14F195',
  borderRadius: 8,
  padding: 24,
  margin: '32px 0',
}

const primaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  padding: '0 18px',
  borderRadius: 8,
  background: '#14F195',
  color: '#06100B',
  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
}

const codeStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
  color: '#E5E7EB',
}

const preStyle: React.CSSProperties = {
  ...codeStyle,
  background: 'var(--hub-bg-dark)',
  border: '1px solid var(--hub-border-subtle)',
  borderRadius: 8,
  padding: 20,
  lineHeight: 1.65,
  overflowX: 'auto',
  margin: '0 0 42px',
  whiteSpace: 'pre-wrap',
}

const referenceLinkStyle: React.CSSProperties = {
  color: '#14F195',
  textDecoration: 'none',
  borderBottom: '1px solid rgba(20, 241, 149, 0.35)',
}

function headingStyle(accent: string): React.CSSProperties {
  return {
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: 26,
    fontWeight: 650,
    lineHeight: 1.25,
    color: 'var(--hub-text-primary)',
    borderLeft: `3px solid ${accent}`,
    paddingLeft: 16,
    marginBottom: 18,
  }
}
