import type { Metadata } from 'next'
import Image from 'next/image'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedLink } from '@/components/TrackedLink'
import { LATEST_WRITING } from '@/content/latest-writing'
import { PROOF } from '@/content/proof'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'
import { personalSocialLinks } from '@/lib/social-links'

const GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=about'

export const metadata: Metadata = {
  title: { absolute: 'About Sathian Srikrishnan | Founder, Tooth Fairy Network' },
  description:
    'Sathian Srikrishnan is a founder and dad in Toronto building Tooth Fairy Network: a child’s first digital wallet and a personalized Vault Book, given by the people who love them.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Sathian Srikrishnan',
    description:
      'Founder and dad in Toronto, building products people love, starting with the ones his own children need.',
    type: 'profile',
    url: 'https://sathian.ai/about',
    siteName: 'Sathian',
  },
}

const START_HERE = [
  {
    kicker: 'THE STORY',
    title: 'Watch Proof',
    text: 'Why I’m building Tooth Fairy Network, in seven short chapters.',
    href: PROOF.href,
    event: 'proof_opened',
    image: '/proof-assets/product-samples-20261028/sample-front.webp',
    alt: 'A crayon sketch of Tanda the tooth fairy dropping a coin into a piggy bank',
  },
  {
    kicker: 'FOR FAMILIES',
    title: 'Learn with Tanda',
    text: 'Free stories and short lessons on money and the internet.',
    href: '/learn',
    event: 'learn_opened',
    image: '/learn-art/classroom-master.webp',
    alt: 'Tanda teaching a family about saving and digital money',
  },
  {
    kicker: 'THE WRITING',
    title: LATEST_WRITING.title,
    text: 'Essays on what I’m learning, what works and what doesn’t.',
    href: '/writings',
    event: 'writing_opened',
    image: LATEST_WRITING.feature.image,
    alt: LATEST_WRITING.feature.alt,
  },
] as const

export default function AboutPage() {
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://sathian.ai/about#profile',
    url: 'https://sathian.ai/about',
    name: 'About Sathian',
    mainEntity: { '@id': SATHIAN_PERSON_SCHEMA['@id'] },
  }

  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([profilePage, SATHIAN_PERSON_SCHEMA]),
        }}
      />
      <SiteNav />

      <main className="about-page">
        <header className="about-hero minimal-container">
          <div className="about-hero__copy">
            <p className="minimal-kicker">SATHIAN SRIKRISHNAN / FOUNDER + DAD / TORONTO</p>
            <h1>Hi, I&apos;m Sathian.</h1>
            <p className="about-lead">
              I build the things I want for my own children, and make them good enough
              for every family. Right now that&apos;s a first wallet for kids.
            </p>
            <div className="about-actions">
              <TrackedLink href={GIFT_HREF} event="gift_cta_clicked" placement="about_hero" className="about-button about-button--primary">
                Give a child their first wallet
              </TrackedLink>
              <TrackedLink href={PROOF.href} event="proof_opened" placement="about_hero" className="about-button">
                Watch Proof
              </TrackedLink>
            </div>
          </div>
          <Image
            className="about-hero__portrait"
            src="/sathian-portrait.webp"
            alt="Pencil portrait of Sathian Srikrishnan"
            width={720}
            height={720}
            sizes="(max-width: 760px) 160px, 340px"
            priority
          />
        </header>

        <section className="minimal-section minimal-container" aria-labelledby="about-building">
          <h2 id="about-building">What I&apos;m building</h2>
          <article className="minimal-featured-project">
            <div className="minimal-project-copy">
              <h3>Tooth Fairy Network</h3>
              <p className="minimal-label">PRIMARY BUILD / LIVE</p>
              <p>
                A child&apos;s first digital wallet, and a personalized Vault Book to keep.
                Grandparents, aunts and uncles give it as a gift. The parent holds the key.
              </p>
              <TrackedLink href={GIFT_HREF} event="gift_cta_clicked" placement="about_tfn" className="minimal-text-link">
                See the gift
              </TrackedLink>
            </div>
            <TrackedLink href={GIFT_HREF} event="gift_cta_clicked" placement="about_tfn_image" className="minimal-project-media">
              <Image
                src="/projects/tooth-fairy-network/family-storybook-hero.webp"
                alt="Tanda the tooth fairy beside a glowing Vault Book"
                fill
                sizes="(max-width: 760px) 100vw, 58vw"
              />
            </TrackedLink>
          </article>
        </section>

        <section className="minimal-section minimal-container about-story" aria-labelledby="about-story">
          <h2 id="about-story">How I got here</h2>
          <p>
            For ten years I led a startup I co-founded. In 2025 I stepped away to learn again:
            AI, crypto, and building software with my own hands.
          </p>
          <p>
            Tooth Fairy Network started at home, with one question. What if the coin under the
            pillow was the start of something a child could keep? I write about what works and
            what doesn&apos;t along the way.
          </p>
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="about-start">
          <h2 id="about-start">Start here</h2>
          <div className="about-cards">
            {START_HERE.map((card) => (
              <TrackedLink key={card.title} href={card.href} event={card.event} placement="about_start_here" className="about-card">
                <span className="about-card__media">
                  <Image src={card.image} alt={card.alt} fill sizes="(max-width: 760px) 100vw, 360px" />
                </span>
                <span className="minimal-kicker">{card.kicker}</span>
                <strong>{card.title}</strong>
                <span className="about-card__text">{card.text}</span>
              </TrackedLink>
            ))}
          </div>
        </section>

        <section className="minimal-container about-find" aria-labelledby="about-find">
          <h2 id="about-find" className="minimal-kicker">FIND ME</h2>
          <nav className="about-socials" aria-label="Sathian profiles">
            {personalSocialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="me noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
