import Link from 'next/link'

import {
  readLocalProductEvents,
  summarizeLocalProductEvents,
  type LocalEventSummary,
} from '@/lib/tfn-capsule/local-event-store'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function TfnDashboardPage({
  searchParams,
}: {
  searchParams?: { days?: string }
}) {
  const days = clampDays(Number(searchParams?.days ?? 7))
  const events = await readLocalProductEvents(days)
  const summary = summarizeLocalProductEvents(events, days)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Local MVP dashboard</p>
          <h1>TFN product loop</h1>
          <p>
            Certificate, capsule, share, and save signals captured from this local preview. This is the
            working readout before paid traffic or production analytics.
          </p>
        </div>
        <nav aria-label="TFN review links">
          <Link href="/">Landing</Link>
          <Link href="/launch-loop">Launch loop</Link>
          <Link href="/certificate">Certificate</Link>
          <Link href="/create">Create</Link>
        </nav>
      </header>

      <section className={styles.metrics} aria-label="Funnel totals">
        <Metric label="Events" value={summary.totals.events} />
        <Metric label="Visitors" value={summary.totals.uniqueVisitors} />
        <Metric label="Sessions" value={summary.totals.uniqueSessions} />
        <Metric label="Page views" value={summary.totals.pageViews} />
      </section>

      <section className={styles.split}>
        <FunnelTable summary={summary} />
        <aside className={styles.statusPanel}>
          <p className={styles.eyebrow}>Next proof</p>
          <h2>What I need to see</h2>
          <ul>
            <li>One parent opens the landing page.</li>
            <li>They generate and download a certificate.</li>
            <li>They start a capsule and reach the sealed link.</li>
            <li>They copy or share the capsule URL.</li>
          </ul>
          <p className={styles.muted}>
            Range: last {summary.range.days} days. Generated {formatDateTime(summary.generatedAt)}.
          </p>
        </aside>
      </section>

      <section className={styles.grid}>
        <RankedList title="Top pages" rows={summary.topPages} empty="No page views yet." />
        <RankedList title="Traffic sources" rows={summary.topSources} empty="No referrers yet." />
        <RankedList title="Visitor type" rows={summary.botBreakdown} empty="No browser data yet." />
      </section>

      <section className={styles.eventsPanel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Recent signal</p>
            <h2>Latest local events</h2>
          </div>
          <span>{summary.recentEvents.length} shown</span>
        </div>
        {summary.recentEvents.length > 0 ? (
          <div className={styles.eventList}>
            {summary.recentEvents.map((event) => (
              <article key={event.id}>
                <strong>{event.eventName}</strong>
                <span>{event.path || 'unknown path'}</span>
                <time>{formatDateTime(event.createdAt)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No local events yet.</h3>
            <p>Open the certificate or create flow from this browser to seed the funnel.</p>
            <Link href="/certificate">Make the first certificate</Link>
          </div>
        )}
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function FunnelTable({ summary }: { summary: LocalEventSummary }) {
  return (
    <section className={styles.tablePanel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Launch funnel</p>
          <h2>Where parents drop off</h2>
        </div>
        <span>{summary.range.days}d</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Events</th>
            <th>Visitors</th>
            <th>From prior</th>
          </tr>
        </thead>
        <tbody>
          {summary.funnel.map((row) => (
            <tr key={row.eventName}>
              <td>
                <span>{row.step}</span>
                {row.label}
              </td>
              <td>{row.events}</td>
              <td>{row.uniqueVisitors}</td>
              <td>{formatPercent(row.conversionFromPrevious)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function RankedList({
  title,
  rows,
  empty,
}: {
  title: string
  rows: Array<{ label: string; count: number }>
  empty: string
}) {
  return (
    <section className={styles.rankPanel}>
      <h2>{title}</h2>
      {rows.length > 0 ? (
        <ol>
          {rows.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <strong>{row.count}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  )
}

function clampDays(days: number) {
  if (!Number.isFinite(days)) return 7
  return Math.min(90, Math.max(1, Math.floor(days)))
}

function formatPercent(value: number | null) {
  if (value === null) return 'n/a'
  return `${Math.round(value * 100)}%`
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
