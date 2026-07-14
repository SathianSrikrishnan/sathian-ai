'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  LoadState,
  StatusPill,
  StudioPage,
  StudioPageHeader,
  formatStudioDate,
} from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { StudioOverview } from '@/lib/studio/data'

interface ArticleSummary {
  id: string
  title: string
  slug: string
  date: string
  status: 'draft' | 'published'
  readTime: string
}

const WORK_AREAS = [
  { number: '01', title: 'Writing', description: 'Draft and publish long-form work.', href: '#writing', count: 'writing' },
  { number: '02', title: 'Build notes', description: 'Record what changed, what you learned, and what comes next.', href: '/studio/build-notes', count: 'buildNotes' },
  { number: '03', title: 'Homepage', description: 'Order and edit the approved homepage sections.', href: '/studio/homepage', count: 'homepageSections' },
  { number: '04', title: 'Public memory', description: 'Review exactly what the public agent is allowed to know.', href: '/studio/memory', count: 'publicMemory' },
  { number: '05', title: 'Inbox', description: 'Inspect receipts, delivery, retention, and quarantined files.', href: '/studio/inbox', count: 'inbox' },
] as const

export default function StudioDashboard() {
  const [overview, setOverview] = useState<StudioOverview | null>(null)
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/studio/overview').then((response) => response.ok ? response.json() : Promise.reject()),
      fetch('/api/studio/articles').then((response) => response.ok ? response.json() : Promise.reject()),
    ])
      .then(([nextOverview, nextArticles]) => {
        setOverview(nextOverview)
        setArticles(Array.isArray(nextArticles) ? nextArticles : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Private control room"
        title="One place to run the public site."
        description="Writing, build notes, homepage structure, reviewed public memory, and visitor intake all use named records with an audit trail."
      />

      <section className={styles.operations} aria-labelledby="agent-operations-heading">
        <div className={styles.operationsIntro}>
          <p className={styles.sectionLabel}>Quiet signals</p>
          <h2 id="agent-operations-heading">Agent operations</h2>
          <p>Counts only. No visitor text is included.</p>
        </div>
        <dl className={styles.operationMetric}>
          <dt>Model errors (24h)</dt>
          <dd data-testid="model-errors-24h">{overview?.operations.modelErrors24h ?? '—'}</dd>
        </dl>
        <dl className={styles.operationMetric}>
          <dt>Delivery backlog</dt>
          <dd data-testid="delivery-backlog">{overview?.operations.deliveryBacklog ?? '—'}</dd>
        </dl>
        <dl className={styles.operationMetric}>
          <dt>Blocked uploads</dt>
          <dd data-testid="blocked-uploads">{overview?.operations.blockedUploads ?? '—'}</dd>
        </dl>
      </section>

      <div className={styles.resourceGrid} aria-label="Studio work areas">
        {WORK_AREAS.map((area) => (
          <Link key={area.title} href={area.href} className={styles.resourceLink}>
            <span className={styles.resourceNumber}>{area.number}</span>
            <h2>{area.title}</h2>
            <p>{area.description}</p>
            <strong className={styles.resourceCount}>{overview?.[area.count] ?? '—'}</strong>
          </Link>
        ))}
      </div>

      <section id="writing" className={styles.section} aria-labelledby="writing-heading">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionLabel}>Writing desk</p>
            <h2 id="writing-heading">Recent articles</h2>
          </div>
          <p>{articles.filter((article) => article.status === 'draft').length} drafts</p>
        </div>

        {loading && <LoadState>Loading the control room…</LoadState>}
        {error && <LoadState>The records are not available locally until the control-room migration is applied.</LoadState>}
        {!loading && !error && articles.length === 0 && <LoadState>No articles yet. Start with one clear idea.</LoadState>}
        {!loading && articles.length > 0 && (
          <div className={styles.rows}>
            {articles.slice(0, 8).map((article) => (
              <Link key={article.id} href={`/studio/${article.slug}`} className={styles.rowLink}>
                <div>
                  <h3>{article.title}</h3>
                  <div className={styles.meta}>
                    <span>{formatStudioDate(article.date)}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <StatusPill value={article.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </StudioPage>
  )
}
