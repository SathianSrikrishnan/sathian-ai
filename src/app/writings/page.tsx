import Link from 'next/link'
import type { Metadata } from 'next'

import { SiteNav } from '@/components/SiteNav'
import { getPublishedArticles } from '@/lib/articles-db'

export const metadata: Metadata = {
  title: 'Writing | sathian.ai',
  description: 'Essays on culture, money, technology, and the things Sathian is building.',
  openGraph: {
    title: 'Writing | sathian.ai',
    description: 'Essays on culture, money, technology, and the things Sathian is building.',
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
  accent: '#14F195',
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
    <div data-theme="dark" className="min-h-screen bg-[var(--hub-bg-primary)] text-[var(--hub-text-primary)]">
      <SiteNav />
      <main>
        <header className="mx-auto max-w-[1120px] px-6 pb-14 pt-36">
          <p className="hub-eyebrow mb-5 text-[#5EEAD4]">FIELD NOTES / {entries.length} PUBLISHED</p>
          <h1 className="max-w-[760px] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
            Essays from the workbench.
          </h1>
          <p className="mt-7 max-w-[620px] font-sans text-base leading-7 text-[var(--hub-text-secondary)]">
            Notes on culture, money, technology, and the products I am learning to build.
          </p>
        </header>

        <section className="mx-auto max-w-[1120px] px-6 pb-28">
          <div className="border-t border-white/10">
            {entries.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group grid gap-4 border-b border-white/10 py-9 no-underline md:grid-cols-[170px_minmax(0,1fr)_auto] md:items-start md:gap-8"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--hub-text-muted)]">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                  <span className="mt-2 block" style={{ color: article.accent }}>{article.domains}</span>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.025em] text-[var(--hub-text-primary)] transition-colors group-hover:text-white md:text-3xl">
                    {article.title}
                  </h2>
                  <p className="mt-3 max-w-[680px] font-sans text-sm leading-6 text-[var(--hub-text-secondary)]">
                    {article.description}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[var(--hub-text-muted)] md:pt-2">{article.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[var(--hub-bg-dark)] py-8">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 font-mono text-[10px] text-[var(--hub-text-muted)]">
          <Link href="/" className="text-inherit no-underline">sathian.ai</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
