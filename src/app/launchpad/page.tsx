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

const signals = ['20 primary teeth', 'Families worldwide', 'Parent-led by design']

export default function LaunchpadApplicationPage() {
  return (
    <div className={`${styles.page} minimal-site`} data-theme="workshop">
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          sathian.ai
        </Link>
        <span>Stan Launchpad / September 2026</span>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="launchpad-title">
          <div className={styles.intro}>
            <p className="minimal-kicker">Founder application</p>
            <h1 id="launchpad-title">Tooth Fairy Network</h1>
            <p className={styles.thesis}>A new global ritual for losing a tooth.</p>
            <p className={styles.origin}>
              I&apos;m Sathian Srikrishnan—a divorced dad of two and the solo founder.
              I built it first for my own children.
            </p>
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
            <figcaption>One take · Toronto · 02:27</figcaption>
          </figure>
        </section>

        <section className={styles.section} aria-labelledby="current-test-title">
          <p className={styles.number}>01 / Now</p>
          <div>
            <h2 id="current-test-title">The version I&apos;m testing now.</h2>
            <p>
              A toll-free call to Tanda starts the experience. A parent and child talk
              through the moment. The parent decides whether that memory stays private,
              becomes a physical keepsake, or opens a guardian-owned digital wallet for
              the child.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="market-title">
          <p className={styles.number}>02 / Market</p>
          <div>
            <h2 id="market-title">An old ritual, rebuilt for now.</h2>
            <ul className={styles.signals} aria-label="Tooth Fairy Network market signals">
              {signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
            <p>
              Tooth loss is the first ritual. The larger idea is a series of things
              parents and children do together—memory, confidence, creativity, and early
              financial learning. The wallet is infrastructure, not the pitch.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.lastSection}`} aria-labelledby="launchpad-why-title">
          <p className={styles.number}>03 / Launchpad</p>
          <div>
            <h2 id="launchpad-why-title">Two weeks to find the truth.</h2>
            <p>
              I want two weeks to stop polishing in private: talk to parents, test the
              ritual, ship the first physical version, and find paying families.
            </p>
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
