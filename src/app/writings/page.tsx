import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Writing — sathian.ai',
  description: 'Essays on culture, money, and technology by Sathian Srikrishnan.',
  openGraph: {
    title: 'Writing — sathian.ai',
    description: 'Essays on culture, money, and technology by Sathian Srikrishnan.',
  },
}

function estimateReadTime(body: string): string {
  const words = body.split(/\s+/).length
  const minutes = Math.ceil(words / 250)
  return `${minutes} min read`
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function WritingsIndex() {
  const articles = getAllArticles().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div data-theme="dark" style={{ background: 'var(--hub-bg-primary)', color: 'var(--hub-text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '120px 0 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 13,
              color: 'var(--hub-text-muted)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 32,
            }}
          >
            &larr; sathian.ai
          </Link>
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
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/writings/${article.slug}`}
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
                    {estimateReadTime(article.body)}
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
    </div>
  )
}
