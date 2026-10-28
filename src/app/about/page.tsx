import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'
import { personalSocialLinks } from '@/lib/social-links'

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

      <main>
        <header className="minimal-page-hero minimal-container">
          <p className="minimal-kicker">FOUNDER + DAD / TORONTO</p>
          <h1>Sathian</h1>
          <p>
            I&apos;m Sathian Srikrishnan. I build products people love, starting with the
            ones my own children need, for children and parents everywhere.
          </p>
        </header>

        <section className="minimal-section minimal-container" aria-labelledby="about-work">
          <div className="minimal-project-copy">
            <p className="minimal-kicker">WHAT I&apos;M BUILDING</p>
            <h2 id="about-work">Tooth Fairy Network.</h2>
            <p>
              A child&apos;s first digital wallet and a personalized Vault Book, given by the
              people who love them. The child is the hero: they start saving early, and every
              grandparent, aunt and uncle can add to it.
            </p>
            <p>
              After ten years leading a startup I co-founded, I stepped away in 2025 to learn
              and build again. I write about what worked and what didn&apos;t.
            </p>
            <nav className="minimal-writing-links" aria-label="Start here">
              <a href="https://proof.sathian.ai/" className="minimal-text-link">Watch Proof: why I&apos;m building it</a>
              <a href="https://toothfairy.money/?utm_source=sathian.ai&amp;utm_medium=referral&amp;utm_campaign=about" className="minimal-text-link">Give a child their first wallet</a>
              <Link href="/learn" className="minimal-text-link">Learn with Tanda</Link>
            </nav>
            <nav className="minimal-writing-links" aria-label="About Sathian links">
              <Link href="/writings" className="minimal-text-link">Read the writing</Link>
              <Link href="/hackathons" className="minimal-text-link">See the builds</Link>
              <Link href="/#agent" className="minimal-text-link">Ask the site agent</Link>
            </nav>
          </div>
          <Image
            src="/sathian-profile.png"
            alt="Portrait of Sathian"
            width={512}
            height={512}
            priority
            style={{
              width: 'min(100%, 360px)',
              height: 'auto',
              borderRadius: '18px',
              border: '1px solid var(--minimal-rule)',
            }}
          />
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="about-find">
          <p className="minimal-kicker">FIND ME</p>
          <h2 id="about-find">One identity, across the places I maintain.</h2>
          <nav className="minimal-writing-links" aria-label="Sathian profiles">
            {personalSocialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="minimal-text-link"
                target="_blank"
                rel="me noopener noreferrer"
              >
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
