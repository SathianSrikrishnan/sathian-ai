import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'

import styles from './solana-observatory.module.css'

const DASHBOARD = 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/'
const REPOSITORY = 'https://github.com/SathianSrikrishnan/solana-ecosystem-dashboard'
const CANONICAL_URL = 'https://sathian.ai/projects/solana-observatory'
const WALKTHROUGH_URL = 'https://sathian.ai/projects/solana-observatory-demo.mp4'
const PROJECT_IMAGE = 'https://sathian.ai/projects/solana-ecosystem-observatory.png'

export const metadata: Metadata = {
  title: 'Solana Observatory — a source-visible ecosystem dashboard',
  description:
    'A three-minute walkthrough and public proof map for an automated Solana ecosystem dashboard built by Sathian Srikrishnan.',
  authors: [{ name: 'Sathian Srikrishnan', url: 'https://sathian.ai/about' }],
  keywords: ['Solana', 'ecosystem data', 'public data', 'source-visible dashboard', 'Sathian'],
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: 'Solana Observatory',
    description: 'Six questions. Forty-five source-carrying records. Every claim inspectable.',
    url: CANONICAL_URL,
    type: 'website',
    siteName: 'Sathian',
    images: ['/projects/solana-ecosystem-observatory.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana Observatory',
    description: 'Six questions. Forty-five source-carrying records. Every claim inspectable.',
    images: ['/projects/solana-ecosystem-observatory.png'],
  },
}

const layers = [
  ['01', 'Network', 'Is Solana working?'],
  ['02', 'Adoption', 'Are addresses and apps returning?'],
  ['03', 'Economy', 'Is useful activity growing?'],
  ['04', 'Validators', 'Is the network resilient?'],
  ['05', 'Ecosystem', 'Is Solana compounding?'],
  ['06', 'Financial rails', 'Is real infrastructure emerging?'],
] as const

export default function SolanaObservatoryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${CANONICAL_URL}#project`,
        name: 'Solana Observatory',
        description: metadata.description,
        url: CANONICAL_URL,
        image: PROJECT_IMAGE,
        datePublished: '2026-08-30',
        author: { '@id': SATHIAN_PERSON_SCHEMA['@id'] },
        mainEntityOfPage: CANONICAL_URL,
        about: ['Solana', 'ecosystem data', 'network activity', 'validator resilience'],
        sameAs: [DASHBOARD, REPOSITORY],
        hasPart: { '@id': `${CANONICAL_URL}#walkthrough` },
      },
      {
        '@type': 'VideoObject',
        '@id': `${CANONICAL_URL}#walkthrough`,
        name: 'Solana Observatory product walkthrough',
        description: 'A three-minute walkthrough of the source-visible Solana ecosystem dashboard.',
        thumbnailUrl: [PROJECT_IMAGE],
        uploadDate: '2026-08-30T00:00:00-04:00',
        duration: 'PT3M3S',
        contentUrl: WALKTHROUGH_URL,
        creator: { '@id': SATHIAN_PERSON_SCHEMA['@id'] },
        isPartOf: { '@id': `${CANONICAL_URL}#project` },
      },
    ],
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main>
        <header className={styles.hero}>
          <div className={styles.rail} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.kicker}>PUBLIC DATA PROJECT · AUGUST 2026</p>
              <h1>
                Solana
                <span>Observatory</span>
              </h1>
              <p className={styles.deck}>
                I wanted one place where a newcomer could ask how Solana is working—and inspect the evidence behind every answer.
              </p>
              <div className={styles.actions}>
                <a className={styles.primaryAction} href={DASHBOARD} target="_blank" rel="noopener noreferrer">
                  Open the live dashboard
                </a>
                <a href={REPOSITORY} target="_blank" rel="noopener noreferrer">
                  Inspect the public repository
                </a>
              </div>
            </div>

            <figure className={styles.heroImage}>
              <Image
                src="/projects/solana-ecosystem-observatory.png"
                alt="Solana Observatory source-visible dashboard"
                fill
                priority
                sizes="(max-width: 860px) 100vw, 46vw"
              />
              <figcaption>LIVE HTML · MARKDOWN · JSON</figcaption>
            </figure>
          </div>
        </header>

        <section className={styles.film} aria-labelledby="walkthrough-title">
          <div className={styles.sectionHeading}>
            <p className={styles.kicker}>03:03 · PRODUCT WALKTHROUGH</p>
            <h2 id="walkthrough-title">See the system before reading the architecture.</h2>
          </div>
          <div className={styles.playerFrame}>
            <video controls preload="metadata" poster="/projects/solana-ecosystem-observatory.png">
              <source src="/projects/solana-observatory-demo.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>
        </section>

        <section className={styles.proof} aria-labelledby="proof-title">
          <div className={styles.proofLead}>
            <p className={styles.kicker}>THE REVIEWED SNAPSHOT</p>
            <h2 id="proof-title">45 source-carrying records. Six questions. No mystery score.</h2>
            <p>
              The reviewed August 30 snapshot contained 36 current records, five visibly stale records, and four unavailable gaps. The gaps stay visible because unavailable evidence is not zero.
            </p>
          </div>
          <div className={styles.layerGrid}>
            {layers.map(([number, title, question]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{question}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.system} aria-labelledby="system-title">
          <div>
            <p className={styles.kicker}>HOW IT STAYS ALIVE</p>
            <h2 id="system-title">Collection, validation, publication.</h2>
          </div>
          <ol>
            <li>
              <b>Collect</b>
              <span>Solana RPC, DeFiLlama, CoinGecko, Dune, GitHub, and official ecosystem sources.</span>
            </li>
            <li>
              <b>Validate</b>
              <span>One normalized evidence contract preserves source, freshness, units, caveats, and failure state.</span>
            </li>
            <li>
              <b>Publish</b>
              <span>A six-hour refresh produces the interactive dashboard, human-readable Markdown, and machine-readable JSON.</span>
            </li>
          </ol>
        </section>

        <section className={styles.links} aria-labelledby="inspect-title">
          <div>
            <p className={styles.kicker}>PUBLIC PROOF</p>
            <h2 id="inspect-title">Do not take the dashboard&apos;s word for it.</h2>
          </div>
          <nav aria-label="Solana Observatory public artifacts">
            <a href={DASHBOARD} target="_blank" rel="noopener noreferrer">Interactive dashboard <span>↗</span></a>
            <a href={`${DASHBOARD}report.md`} target="_blank" rel="noopener noreferrer">Generated Markdown <span>↗</span></a>
            <a href={`${DASHBOARD}report.json`} target="_blank" rel="noopener noreferrer">Machine-readable JSON <span>↗</span></a>
            <a href={REPOSITORY} target="_blank" rel="noopener noreferrer">Code and setup instructions <span>↗</span></a>
          </nav>
        </section>

        <section className={styles.bridge}>
          <p>
            The Observatory is the system view. <Link href="/writings/inside-monkedao">Inside MonkeDAO</Link> is the human view—one community examined through direct engagement rather than aggregate data.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
