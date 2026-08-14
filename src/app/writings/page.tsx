import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { getPublishedArticles } from '@/lib/articles-db'

export const metadata: Metadata = {
  title: 'Writing | sathian.ai',
  description: 'Essays on culture, money, technology, fatherhood, and the products Sathian is learning to build.',
  openGraph: {
    title: 'Writing | sathian.ai',
    description: 'Essays on culture, money, technology, fatherhood, and the products Sathian is learning to build.',
  },
}

export const revalidate = 60

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const agentAllowanceArticle = {
  title: 'Agent Allowance Lab: Wallet-Safe Budgets for AI Agents on Solana',
  description: 'A technical build note on using Solana Native Subscriptions and Allowances as bounded spending authority for AI agents.',
  date: '2026-06-23',
  readTime: '8 min',
  domains: 'SOLANA / AI AGENTS / BUILD NOTE',
  href: '/writings/agent-allowance-lab',
  accent: '#B84E1A',
}

export default async function WritingsIndex() {
  const articles = await getPublishedArticles()
  const entries = [
    ...articles.map((article) => ({
      title: article.title,
      description: article.description,
      date: article.date,
      readTime: article.readTime,
      domains: article.domains.join(' / ').toUpperCase(),
      href: `/writings/${article.slug}`,
      accent: article.theme.accent,
    })),
    agentAllowanceArticle,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />

      <main>
        <header className="minimal-page-hero minimal-writing-page-hero minimal-container">
          <p className="minimal-kicker">FIELD NOTES / {entries.length} PUBLISHED</p>
          <h1 className="sr-only">Writing</h1>
          <p className="minimal-writing-lede">Notes on culture, money, technology, fatherhood, and the products I am learning to build.</p>
          <Link href="/#agent" className="minimal-text-link">Not sure where to start? Ask the site agent</Link>
        </header>

        <section className="minimal-writing-index minimal-container" aria-label="Published writing">
          {entries.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className={article.href === '/writings/saraswati-lakshmi-and-the-ledger'
                ? 'minimal-writing-index__featured'
                : undefined}
            >
              <div className="minimal-writing-index__meta">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span style={{ color: article.accent }}>{article.domains}</span>
              </div>
              <div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </div>
              <span className="minimal-writing-index__time">{article.readTime}</span>
            </Link>
          ))}
        </section>

        <section className="minimal-writing-cta" aria-labelledby="writing-cta-title">
          <div>
            <h2 id="writing-cta-title">Looking for something specific?</h2>
            <p>The site agent can recommend a piece or take a note.</p>
            <Link href="/#agent">Ask the site agent</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
