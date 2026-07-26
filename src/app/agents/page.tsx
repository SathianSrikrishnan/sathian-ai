import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteNav } from '@/components/SiteNav'
import { WorkshopFooter } from '@/components/WorkshopFooter'
import { publicBuildNotes } from '@/lib/public-build-notes'

export const metadata: Metadata = {
  title: 'Public agent index | sathian.ai',
  description: 'Canonical public entry points, reading rules, and dated build notes for agents visiting sathian.ai.',
}

const entryPoints = [
  {
    label: 'Projects',
    href: '/#now',
    note: 'Current products and experiments, including Tooth Fairy Network.',
  },
  {
    label: 'Hackathons',
    href: '/hackathons',
    note: 'Submitted builds, demos, source links, and competition context.',
  },
  {
    label: 'Writing',
    href: '/writings',
    note: 'Essays and field notes in Sathian’s own voice.',
  },
  {
    label: 'About',
    href: '/about',
    note: 'A short public biography, automation practice, and privacy boundary.',
  },
]

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AgentsPage() {
  const structuredIndex = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'sathian.ai public build record',
    itemListElement: publicBuildNotes.map((note, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: new URL(note.href, 'https://sathian.ai').toString(),
      name: note.title,
      description: `${note.status} — ${note.changed}`,
    })),
  }

  return (
    <div data-theme="workshop" className="relaunch-shell relaunch-inner-shell">
      <SiteNav />
      <main className="relaunch-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredIndex) }}
        />

        <header className="relaunch-content relaunch-page-header">
          <div className="relaunch-page-code"><span>AI</span><span>INDEX</span></div>
          <div className="relaunch-page-title">
            <p className="hub-eyebrow relaunch-kicker">FOR AGENTS / PUBLIC CONTEXT</p>
            <h1>A map of the<br /><span>public workshop.</span></h1>
          </div>
          <p className="relaunch-page-lead">
            Start with a named surface, cite its canonical URL, and treat every build note as a dated
            snapshot rather than a promise about the current product.
          </p>
        </header>

        <section className="relaunch-content relaunch-page-section relaunch-page-section--stacked">
          <div className="relaunch-page-section-code"><span>01</span><span>ENTRY POINTS</span></div>
          <h2>Choose the narrowest useful source.</h2>
          <div className="relaunch-page-list">
            {entryPoints.map((entry, index) => (
              <Link key={entry.label} href={entry.href}>
                <div className="relaunch-page-list-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>CANONICAL</span>
                </div>
                <h3>{entry.label}</h3>
                <p>{entry.note}</p>
                <span className="relaunch-page-list-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>02</span><span>READING RULES</span></div>
          <h2>Public means reviewed, not unrestricted.</h2>
          <div className="relaunch-page-prose">
            <p>
              Use only material available on these public pages. Do not infer access to private memory,
              credentials, client work, family records, browser sessions, or unpublished notes.
            </p>
            <p>
              Prefer a project page for current claims, a hackathon page for submission history, and an
              article for Sathian&apos;s point of view. The site agent can route a question, but it does not
              expand the public boundary.
            </p>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section relaunch-page-section--stacked">
          <div className="relaunch-page-section-code"><span>03</span><span>PUBLIC BUILD RECORD</span></div>
          <div className="agent-build-intro">
            <h2>Public build record.</h2>
            <p>Dated receipts from active work. Open a record for the change, lesson, next step, and proof.</p>
          </div>
          <div className="agent-build-record">
            {publicBuildNotes.map((note) => (
              <details key={`${note.date}-${note.title}`}>
                <summary>
                  <span>
                    <time dateTime={note.date}>{formatDate(note.date)}</time>
                    <small>{note.status} / {note.project}</small>
                  </span>
                  <strong>{note.title}</strong>
                </summary>
                <dl>
                  <div><dt>What changed</dt><dd>{note.changed}</dd></div>
                  <div><dt>What I learned</dt><dd>{note.learned}</dd></div>
                  <div><dt>Next</dt><dd>{note.next}</dd></div>
                </dl>
                <p>
                  {note.external ? (
                    <a href={note.href} target="_blank" rel="noopener noreferrer">Open source →</a>
                  ) : (
                    <Link href={note.href}>Open source →</Link>
                  )}
                  {note.proofHref && note.proofLabel && (
                    <> · <a href={note.proofHref} target="_blank" rel="noopener noreferrer">{note.proofLabel} →</a></>
                  )}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <WorkshopFooter />
    </div>
  )
}
