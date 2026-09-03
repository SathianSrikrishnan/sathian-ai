import type { Metadata } from 'next'
import Link from 'next/link'

import styles from './launchpad.module.css'

export const metadata: Metadata = {
  title: 'Launchpad Application | Sathian',
  description:
    'Sathian Srikrishnan’s founder application for Tooth Fairy Network and Stan Launchpad.',
  alternates: { canonical: '/launchpad' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Tooth Fairy Network — Launchpad Application',
    description: 'A raw founder video and the current Tooth Fairy Network test.',
    url: 'https://sathian.ai/launchpad',
    siteName: 'Sathian',
    type: 'website',
  },
}

export default function LaunchpadApplicationPage() {
  return (
    <div className={`${styles.page} minimal-site`} data-theme="workshop">
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          sathian.ai
        </Link>
        <span>Stan Launchpad / October 4–19, 2026</span>
      </header>

      <nav className={styles.proofBar} aria-label="Product proof">
        <a
          className={`${styles.proofLink} ${styles.productLink}`}
          href="https://toothfairy.network"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit toothfairy.network"
        >
          <span>Live product</span>
          <strong>toothfairy.network ↗</strong>
        </a>
        <a
          className={styles.proofLink}
          href="https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Verify Solana program"
        >
          <span>Solana mainnet</span>
          <strong>Verify Solana program ↗</strong>
        </a>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="launchpad-title">
          <div className={styles.intro}>
            <p className="minimal-kicker">Founder application</p>
            <h1 id="launchpad-title">Tooth Fairy Network</h1>
            <p className={styles.thesis}>A family ritual, built to travel.</p>
          </div>

          <figure className={styles.videoFigure}>
            <div className={styles.videoFrame}>
              <video
                controls
                playsInline
                preload="metadata"
                poster="/media/launchpad/sathian-launchpad-poster.jpg"
                aria-label="Sathian’s Stan Launchpad founder application"
              >
                <source
                  src="/media/launchpad/sathian-launchpad-application.mp4"
                  type="video/mp4"
                />
                <track
                  default
                  kind="captions"
                  src="/media/launchpad/sathian-launchpad-application.en.vtt"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support embedded video.
              </video>
            </div>
          </figure>
        </section>

        <section className={styles.prospectus} aria-labelledby="prospectus-title">
          <div className={styles.prospectusHeading}>
            <p className={styles.number}>Founder prospectus</p>
            <h2 id="prospectus-title">The case for Tooth Fairy Network.</h2>
          </div>

          <dl className={styles.brief}>
            <div className={styles.briefItem}>
              <dt>Who</dt>
              <dd>
                <p>Sathian Srikrishnan, 43. Solo founder in Toronto. Divorced father of two.</p>
              </dd>
            </div>

            <div className={styles.briefItem}>
              <dt>What</dt>
              <dd>
                <p>
                  A working web application, a deployed Solana mainnet program, and real
                  deposits for my family and a small circle of friends.
                </p>
              </dd>
            </div>

            <div className={styles.briefItem}>
              <dt>Where</dt>
              <dd>
                <p>
                  Built in Toronto. Applying to spend October 4–19 at Camp Timberlake, just
                  outside New York, turning a family experiment into a global tradition.
                </p>
              </dd>
            </div>

            <div className={styles.briefItem}>
              <dt>When</dt>
              <dd>
                <p>
                  Submitted to Colosseum’s Frontier Hackathon in May 2026. I kept building,
                  stripped back the technology and started learning in public.
                </p>
                <Link href="/hackathons">See the build history →</Link>
              </dd>
            </div>

            <div className={styles.briefItem}>
              <dt>Why</dt>
              <dd>
                <p>
                  I built it for my own children after my divorce. I had missed the middle
                  of a small moment and wanted a way to stay part of the memory.
                </p>
                <Link href="/writings/the-gap-between-weeks">Read The Gap Between Weeks →</Link>
              </dd>
            </div>

            <div className={styles.briefItem}>
              <dt>How</dt>
              <dd>
                <p>
                  Call one toll-free number. Tanda preserves the child’s version of what
                  happened. We mail a physical keepsake, and an adult can add a
                  parent-controlled future gift.
                </p>
              </dd>
            </div>
          </dl>

          <div className={styles.market} aria-label="Market opportunity">
            <p className={styles.number}>Market</p>
            <p>Every child. Twenty primary teeth. One ritual families already understand.</p>
          </div>

          <div className={styles.ask}>
            <p className={styles.number}>The fourteen days</p>
            <p>Talk to parents every day. Ship the physical offer. Find the first paying families.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Sathian Srikrishnan · Toronto</span>
        <a href="https://toothfairy.network" target="_blank" rel="noopener noreferrer">
          Tooth Fairy Network ↗
        </a>
      </footer>
    </div>
  )
}
