import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteNav } from '@/components/SiteNav'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'

import styles from './inside-monkedao.module.css'

const canonicalUrl = 'https://sathian.ai/writings/inside-monkedao'

export const metadata: Metadata = {
  title: 'Inside MonkeDAO: A Firsthand Solana Field Report - sathian.ai',
  description:
    'A firsthand interview and field report on what an NFT community becomes after the mint.',
  authors: [{ name: 'Sathian', url: 'https://sathian.ai/about' }],
  keywords: ['MonkeDAO', 'Solana', 'community', 'NFTs', 'MonkeFoundry', 'Superteam Canada'],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Inside MonkeDAO',
    description: 'I bought an NFT to understand a community. I found a model of belonging.',
    type: 'article',
    publishedTime: '2026-08-29',
    authors: ['Sathian'],
    siteName: 'Sathian',
    url: canonicalUrl,
    images: [
      {
        url: '/inside-monkedao/opening-cover.png',
        width: 1280,
        height: 720,
        alt: 'Inside MonkeDAO — a firsthand field report from the Solana ecosystem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inside MonkeDAO',
    description: 'What does an NFT community become after the mint?',
    images: ['/inside-monkedao/opening-cover.png'],
  },
}

export default function InsideMonkeDAOPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Inside MonkeDAO',
    alternativeHeadline: 'I bought an NFT to understand a community. I found a model of belonging.',
    description: metadata.description,
    datePublished: '2026-08-29',
    author: { '@type': 'Person', '@id': SATHIAN_PERSON_SCHEMA['@id'], name: 'Sathian Srikrishnan', url: 'https://sathian.ai/about' },
    publisher: { '@type': 'Person', '@id': SATHIAN_PERSON_SCHEMA['@id'], name: 'Sathian Srikrishnan', url: 'https://sathian.ai/about' },
    mainEntityOfPage: canonicalUrl,
    image: 'https://sathian.ai/inside-monkedao/opening-cover.png',
    about: ['MonkeDAO', 'Solana', 'online communities', 'digital ownership'],
  }

  return (
    <div className={styles.page} data-theme="workshop">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.rail} aria-hidden="true" />
      <SiteNav />

      <header className={`${styles.wrap} ${styles.masthead}`}>
        <div className={styles.brand} aria-label="MonkeDAO and Solana">
          <Image src="/inside-monkedao/monkedao-logo.png" alt="MonkeDAO" width={152} height={63} priority />
          <span className={styles.slash} aria-hidden="true" />
          <Image src="/inside-monkedao/solana-mark.svg" alt="Solana" width={34} height={34} />
        </div>
        <div className={styles.issue}>
          Field report 01
          <br />
          Toronto · 2026
        </div>
      </header>

      <main>
        <section className={`${styles.wrap} ${styles.opening}`} aria-labelledby="page-title">
          <div className={styles.openingCopy}>
            <div className={styles.eyebrow}>One interview · one meetup · one newcomer</div>
            <h1 id="page-title">
              Inside
              <br />
              <span>MonkeDAO</span>
            </h1>
            <p className={styles.deck}>
              I bought an NFT to understand a community. I found a model of belonging built through contribution.
            </p>
            <div className={styles.meta}>
              <Link href="/about">By Sathian</Link>
              <span>8:40 film</span>
              <span>Under 900 words</span>
              <span>Firsthand + source-labelled</span>
            </div>
          </div>

          <div className={styles.screen}>
            <video
              controls
              playsInline
              preload="metadata"
              poster="/inside-monkedao/opening-cover.png"
              aria-label="Inside MonkeDAO edited interview with Benny"
            >
              <source src="/inside-monkedao/inside-monkedao-field-report-v1.9.0.mp4" type="video/mp4" />
              Your browser cannot play this video.
            </video>
            <div className={styles.screenNote}>
              <span>Watch the firsthand interview</span>
              <span>Edited field report · 8:40</span>
            </div>
          </div>
        </section>

        <article className={styles.story}>
          <div className={`${styles.wrap} ${styles.articleGrid}`}>
            <aside className={styles.articleKicker}>
              The question
              <strong>What does an NFT community become after the mint?</strong>
            </aside>

            <div className={styles.copy}>
              <p>I bought SMB Gen3 #13769 because I did not understand why anyone would. That was the point.</p>

              <p>
                I had been circling the Solana world: meeting people at Superteam gatherings, taking developer
                courses, entering a Colosseum hackathon, and building a product that I eventually realized was not
                very good. By then I was already in. I wanted to understand the people around the technology, not only
                the code.
              </p>

              <p>
                NFT communities were still a blank spot. So I bought a Monke, attended a meetup, and sat down with
                Benny, who works on MonkeFoundry, for a conversation that lasted close to an hour.
              </p>

              <h2>01 · The token is a door, not the room</h2>

              <p>
                <Link href="https://monkedao.io/our-story" target="_blank" rel="noopener noreferrer">
                  MonkeDAO describes itself
                </Link>{' '}
                as Solana&apos;s first community-owned and operated NFT DAO. A wallet proves that you hold a digital
                asset, and that proof can open a private community space.
              </p>

              <p>
                I assumed access was the product. Benny described something more demanding. He entered through
                volunteer work: hosting, helping with programming, and taking on more responsibility as people learned
                they could rely on him. The path was not “buy an NFT, receive authority.” It was: show up, help, become
                useful, get trusted with harder problems. <code>Interview · 00:05:54–00:06:59</code>
              </p>

              <blockquote>Ownership can open the door. Standing still has to be earned.</blockquote>

              <p>
                I could buy #13769 in one transaction. I could not buy a history of helping members, reviewing a
                founder&apos;s product, or organizing something people wanted to attend.
              </p>

              <h2>02 · Online identity becomes useful when people meet</h2>

              <p>
                The{' '}
                <Link href="https://monkedao.io/benefits" target="_blank" rel="noopener noreferrer">
                  public benefits page
                </Link>{' '}
                describes local chapters, meetups, workshops, networking events, and recurring project spotlights. The
                interview gave those nouns texture.
              </p>

              <p>
                Benny described Monday Monke Spotlight as a way to give builders attention. He talked about gatherings
                where people who recognize each other by pixelated avatars finally sit in the same room.{' '}
                <code>Interview · 00:19:57–00:22:02</code>
              </p>

              <p>
                I have attended one MonkeDAO meetup. That does not make me an insider. But I am close enough to see the
                mechanism: repeated contact turns a profile picture into a relationship.
              </p>

              <h2>03 · Community can become builder infrastructure</h2>

              <p>
                Benny described the evolution from grants toward more structured support: identify teams, sharpen a
                product, connect builders with experienced people, create feedback loops, and give them access to
                community distribution. <code>Interview · 00:24:28–00:27:56</code>
              </p>

              <p>
                <Link href="https://monkedao.io/monkefoundry" target="_blank" rel="noopener noreferrer">
                  MonkeFoundry&apos;s current page
                </Link>{' '}
                describes the same basic mechanism. I am leaving out changing program numbers where the interview and
                current page do not line up cleanly.
              </p>

              <p>
                Community cannot rescue a product nobody needs. A warm introduction is not a customer. What a good
                community can do is shorten the distance between a confused builder and a useful conversation.
              </p>

              <p>
                That is why this belongs beside{' '}
                <Link href="https://superteam.fun/earn/regions/canada" target="_blank" rel="noopener noreferrer">
                  Superteam Canada
                </Link>{' '}
                in a human map of Solana. They use different participation models, but both can help newcomers find
                people, work, feedback, and proof that they can contribute.
              </p>

              <h2>Still early, still human</h2>

              <p>
                Benny was candid that online attention rises and falls while in-person gatherings become more
                important around major events. <code>Interview · 00:27:56–00:29:44</code>
              </p>

              <p>
                The hard part of a DAO is not putting a vote on-chain. It is keeping enough people interested in the
                outcome to do something after the vote.
              </p>

              <blockquote>I came looking for a DAO. I found a model of belonging.</blockquote>

              <p>
                The Monke got me through the door. The interview showed me what the door was for. Technology can prove
                ownership in seconds. Community still has to be earned slowly—one introduction, one contribution, and
                one room at a time.
              </p>

              <p>
                We are early in learning what these networks can become. The useful test begins after the novelty is
                gone: does someone still answer, meet, help, or make the introduction? MonkeDAO has given me enough
                evidence to keep testing that question firsthand.
              </p>
            </div>

            <aside>
              <figure className={styles.sideFigure}>
                <Image
                  src="/inside-monkedao/smb-gen3-13769.png"
                  alt="Pixel-art portrait of SMB Gen3 number 13769"
                  width={328}
                  height={328}
                />
                <figcaption>SMB Gen3 #13769 · the Monke that got me through the door</figcaption>
              </figure>
              <div className={styles.path} aria-label="Participation path">
                <div className={styles.pathRow}>
                  <b>01</b>
                  <span>Profile</span>
                </div>
                <div className={styles.pathRow}>
                  <b>02</b>
                  <span>Passport</span>
                </div>
                <div className={styles.pathRow}>
                  <b>03</b>
                  <span>Participation</span>
                </div>
              </div>
            </aside>
          </div>
        </article>

        <section className={styles.method}>
          <div className={`${styles.wrap} ${styles.methodGrid}`}>
            <div>
              <div className={styles.evidenceLabel}>Method + limits</div>
              <h2>
                Close enough to see.
                <br />
                Early enough to ask.
              </h2>
            </div>
            <div>
              <p>
                This report draws on one recorded interview, one meetup, reporter participation, and official public
                pages checked August 29, 2026. It does not claim to represent every member, chapter, or founder.
              </p>
              <p>
                The interview was understood to be for public and media use. Benny is identified by first name and
                public role only. Private chats, wallet details, raw media, and disputed program figures are excluded.
              </p>
              <details>
                <summary>Sources and evidence classes</summary>
                <ul>
                  <li>Interview first-hand: recorded interview, August 17, 2026.</li>
                  <li>Reporter first-hand: SMB Gen3 #13769 purchase and one MonkeDAO meetup.</li>
                  <li>Official context: MonkeDAO Our Story, Benefits, and MonkeFoundry pages.</li>
                  <li>Comparative context: Superteam Canada public Earn page.</li>
                </ul>
              </details>
              <Link className={styles.relatedLink} href="https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/">
                Explore the related Solana Ecosystem Observatory →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <span>Published field note · Evidence checked August 29, 2026</span>
        <Link href="/writings">More writing</Link>
      </footer>
    </div>
  )
}
