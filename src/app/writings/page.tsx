import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedArticles } from '@/lib/articles-db'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Writing — sathian.ai',
  description: 'Essays on culture, money, and technology by Sathian S.',
  openGraph: {
    title: 'Writing — sathian.ai',
    description: 'Essays on culture, money, and technology by Sathian S.',
  },
}

export const revalidate = 60

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const agentAllowanceArticle = {
  title: 'Agent Allowance Lab: Wallet-Safe Budgets for AI Agents on Solana',
  description:
    'A Superteam Canada technical deep dive on using Solana Native Subscriptions and Allowances as bounded spending authority for AI agents.',
  date: '2026-06-23',
  readTime: '8 min read',
  domains: 'SOLANA / SUPERTEAM CANADA / AI AGENTS',
  href: '/writings/agent-allowance-lab',
  accent: '#14F195',
}

export default async function WritingsIndex() {
  const articles = await getPublishedArticles()

  return (
    <div data-theme="dark" style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)', minHeight: '100vh' }}>
      <SiteNav />
      <main>
      {/* Header */}
      <header style={{ padding: '120px 0 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Writing
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 16,
              color: 'var(--hub-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            Essays on culture, money, and technology. Not expert commentary — a student&apos;s notes.
          </p>
        </div>
      </header>

      {/* Articles list */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link
              href={agentAllowanceArticle.href}
              className="writing-card-link"
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: '32px 0',
                borderTop: `1px solid ${agentAllowanceArticle.accent}33`,
                borderBottom: '1px solid var(--hub-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 12,
                    color: 'var(--hub-text-muted)',
                  }}
                >
                  {formatDate(agentAllowanceArticle.date)}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 12,
                    color: 'var(--hub-text-muted)',
                  }}
                >
                  {agentAllowanceArticle.readTime}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 11,
                    color: agentAllowanceArticle.accent,
                    opacity: 0.85,
                  }}
                >
                  {agentAllowanceArticle.domains}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: 'var(--hub-text-primary)',
                  marginBottom: 8,
                }}
              >
                {agentAllowanceArticle.title}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-sans), sans-serif',
                  fontSize: 15,
                  color: 'var(--hub-text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: 720,
                }}
              >
                {agentAllowanceArticle.description}
              </p>
            </Link>
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/writings/${article.slug}`}
                className="writing-card-link"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  padding: '32px 0',
                  borderBottom: '1px solid var(--hub-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 12,
                      color: 'var(--hub-text-muted)',
                    }}
                  >
                    {formatDate(article.date)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 12,
                      color: 'var(--hub-text-muted)',
                    }}
                  >
                    {article.readTime}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 11,
                      color: article.theme.accent,
                      opacity: 0.8,
                    }}
                  >
                    {article.domains.join(' · ')}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontSize: 24,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: 'var(--hub-text-primary)',
                    marginBottom: 8,
                  }}
                >
                  {article.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: 15,
                    color: 'var(--hub-text-secondary)',
                    lineHeight: 1.6,
                    maxWidth: 640,
                  }}
                >
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 0',
          borderTop: '1px solid var(--hub-border-subtle)',
          background: 'var(--hub-bg-dark)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 13,
                color: 'var(--hub-text-muted)',
                textDecoration: 'none',
              }}
            >
              sathian.ai
            </Link>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 12,
                color: 'var(--hub-text-muted)',
              }}
            >
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
      </main>
    </div>
  )
}
