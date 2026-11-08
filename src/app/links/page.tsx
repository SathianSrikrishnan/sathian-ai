import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteNav } from '@/components/SiteNav'
import { WorkshopFooter } from '@/components/WorkshopFooter'
import { SATH_CALENDAR_HREF, personalSocialLinks, toothFairySocialLinks } from '@/lib/social-links'
import styles from './links.module.css'

export const metadata: Metadata = {
  title: 'Links | Sathian',
  description: "Sathian's maintained profiles, projects, writing, events, and public channels in one place.",
  alternates: { canonical: '/links' },
  openGraph: {
    title: 'Tech Talk with Sath | Find Sathian online',
    description: 'Toronto events, ideas, and good people. Follow my picks and come say hi.',
    url: 'https://sathian.ai/links',
    images: [{ url: '/tech-talk/social-preview.png', width: 1200, height: 628, alt: 'Tech Talk with Sath - follow on lu.ma/sath' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Talk with Sath | Find Sathian online',
    description: 'Toronto events, ideas, and good people. Follow my picks and come say hi.',
    images: ['/tech-talk/social-preview.png'],
  },
}

const workLinks = [
  { label: 'Farcaster setup', note: 'My server, setup and short explanations', href: '/farcaster' },
  { label: 'Tooth Fairy Network', note: 'The live product', href: 'https://toothfairy.network' },
  { label: 'Writing', note: 'Essays and field notes', href: '/writings' },
  { label: 'For agents', note: 'Public context and build record', href: '/agents' },
]

const channelDetails: Record<string, { mark: string; note: string }> = {
  Farcaster: { mark: 'FC', note: 'Conversations & experiments' },
  Instagram: { mark: 'IG', note: 'Photos & work in progress' },
  X: { mark: 'X', note: '@Sathian' },
  Luma: { mark: 'Lu', note: 'Tech Talk with Sath' },
  LinkedIn: { mark: 'in', note: 'Work & professional updates' },
  YouTube: { mark: 'YT', note: 'Films & conversations' },
  Substack: { mark: 'Su', note: 'Essays in your inbox' },
  GitHub: { mark: 'GH', note: 'Code & open projects' },
  Facebook: { mark: 'f', note: 'Tooth Fairy Network' },
}

export default function LinksPage() {
  return (
    <div data-theme="workshop" className="relaunch-shell minimal-site">
      <SiteNav />
      <main className={`minimal-container ${styles.main}`}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>LINKS / SATHIAN</p>
            <h1>Come say hi.</h1>
            <p className={styles.intro}>Current projects, writing, and the places where I share work in progress. Pick the one that feels like you.</p>
            <Link href="/about" prefetch={false} className={styles.aboutLink}>A little about me <span aria-hidden="true">↗</span></Link>
          </div>
          <figure className={styles.heroPhoto}>
            <span>
              <Image src="/media/sathian-yellow-box.jpg" alt="Sathian in front of yellow pasta boxes at a grocery store" fill sizes="(max-width: 600px) 88vw, 420px" quality={70} priority />
            </span>
            <figcaption>Everyday questions become things I write about.</figcaption>
          </figure>
        </header>

        <section className={styles.features} aria-label="Events, writing and films">
          <div className={styles.events} id="follow">
            <div>
              <h2>Tech Talk with Sath</h2>
              <p>Tech, ideas, and good people. These are my event picks around Toronto. Come say hi.</p>
              <a href={SATH_CALENDAR_HREF} className={styles.eventButton}>Follow on Luma <span aria-hidden="true">↗</span></a>
              <p className={styles.address}>lu.ma/sath</p>
            </div>
            <a href={SATH_CALENDAR_HREF} className={styles.qr} aria-label="Open Tech Talk with Sath on Luma">
              <Image src="/tech-talk/qr-mark.svg" alt="Tech Talk with Sath QR code for lu.ma/sath" width={600} height={600} unoptimized />
            </a>
          </div>
          <Link href="/writings" prefetch={false} className={styles.feature}>
            <span className={styles.featureImage}>
              <Image src="/media/wutang-concert-selfie.jpg" alt="Sathian and friends at a Wu-Tang concert in Toronto" fill sizes="(max-width: 600px) 88vw, 540px" quality={70} style={{ objectPosition: '60% 65%' }} />
            </span>
            <span className={styles.featureCopy}>
              <strong>Read what I&apos;m thinking</strong>
              <span>Essays and field notes on culture, money, technology, and what I&apos;m learning.</span>
              <span className={styles.featureCta}>Explore the writing <span aria-hidden="true">↗</span></span>
            </span>
          </Link>
          <Link href="/writings/inside-monkedao" prefetch={false} className={styles.feature}>
            <span className={styles.featureImage}>
              <Image src="/inside-monkedao/inside-monkedao-interview-two-shot.png" alt="Sathian in a firsthand conversation about MonkeDAO" fill sizes="(max-width: 600px) 88vw, 540px" quality={70} />
            </span>
            <span className={styles.featureCopy}>
              <strong>Watch a conversation</strong>
              <span>Inside MonkeDAO: a firsthand interview and field report from the Solana ecosystem.</span>
              <span className={styles.featureCta}>Watch and read <span aria-hidden="true">↗</span></span>
            </span>
          </Link>
        </section>

        <section className={styles.section} aria-labelledby="personal-links">
          <h2 id="personal-links">Find me online</h2>
          <div className={styles.channels}>
            {personalSocialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="me noopener noreferrer" className={styles.channel} aria-label={`${link.label} (opens in a new tab)`}>
                <span className={styles.channelMark} aria-hidden="true">{channelDetails[link.label].mark}</span>
                <span><span className={styles.channelName}>{link.label}</span><span className={styles.channelNote}>{channelDetails[link.label].note}</span></span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="work-links">
          <h2 id="work-links">Explore the work</h2>
          <div className={styles.workLinks}>
            {workLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                <span><strong>{link.label}</strong><small>{link.note}</small></span><span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tfn-links">
          <h2 id="tfn-links">Tooth Fairy Network</h2>
          <div className={styles.channels}>
            {toothFairySocialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.channel} aria-label={`Tooth Fairy Network on ${link.label} (opens in a new tab)`}>
                <span className={styles.channelMark} aria-hidden="true">{channelDetails[link.label].mark}</span>
                <span><span className={styles.channelName}>{link.label}</span><span className={styles.channelNote}>Tooth Fairy Network</span></span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <WorkshopFooter />
    </div>
  )
}
