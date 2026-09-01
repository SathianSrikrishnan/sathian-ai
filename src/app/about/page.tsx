import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'
import { personalSocialLinks } from '@/lib/social-links'

export const metadata: Metadata = {
  title: 'About Sathian',
  description:
    'Sathian Srikrishnan is a Toronto-based agent manager and orchestrator building public experiments across AI, technology, money, culture, and family products.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Sathian',
    description:
      'A profile of Sathian Srikrishnan, his public work, writing, and experiments.',
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
          <p className="minimal-kicker">ABOUT / TORONTO</p>
          <h1>Sathian</h1>
          <p>
            I&apos;m Sathian Srikrishnan, an agent manager and orchestrator in Toronto.
            I build small public experiments to understand where AI, technology,
            money, culture, and family products meet real life.
          </p>
        </header>

        <section className="minimal-section minimal-container" aria-labelledby="about-work">
          <div className="minimal-project-copy">
            <p className="minimal-kicker">THE WORK</p>
            <h2 id="about-work">Learning by building, then showing the receipts.</h2>
            <p>
              My current work includes bounded AI agents, public data tools,
              consumer experiments, and Tooth Fairy Network. I write about what
              worked, what failed, and how the underlying ideas change once they
              become something a person can use.
            </p>
            <p>
              This site is the canonical home for that work. The writing is mine;
              the site agent answers from reviewed public context and can route a
              note, but it is not an authority or a substitute for my judgment.
            </p>
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
