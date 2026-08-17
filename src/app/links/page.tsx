import type { Metadata } from 'next'

import { SiteNav } from '@/components/SiteNav'
import { WorkshopFooter } from '@/components/WorkshopFooter'
import { personalSocialLinks, toothFairySocialLinks } from '@/lib/social-links'

export const metadata: Metadata = {
  title: 'Links | Sathian S.',
  description: 'Links and profiles for Sathian S.',
}

const workLinks = [
  { label: 'Tooth Fairy Network', note: 'The live product', href: 'https://toothfairy.network' },
  { label: 'Writing', note: 'Essays and field notes', href: '/writings' },
  { label: 'Substack', note: 'Subscribe to new essays', href: 'https://sathians.substack.com' },
  { label: 'For agents', note: 'Public context and build record', href: '/agents' },
  { label: 'GitHub', note: 'Public code', href: 'https://github.com/sathiandev' },
]

export default function LinksPage() {
  return (
    <div data-theme="workshop" className="relaunch-shell relaunch-inner-shell workshop-links-page">
      <SiteNav />
      <main className="relaunch-content workshop-links-main">
        <header>
          <p className="hub-eyebrow relaunch-kicker">LINKS / SATHIAN S.</p>
          <h1>A few ways in.</h1>
          <p>Current projects, writing, and the channels where I share work in progress.</p>
        </header>

        <section aria-labelledby="personal-links">
          <h2 id="personal-links">Sathian</h2>
          <div className="workshop-links-grid">
            {personalSocialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                <span>{link.label}</span><span>Personal channel ↗</span>
              </a>
            ))}
            {workLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                <span>{link.label}</span><span>{link.note} ↗</span>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="tfn-links">
          <h2 id="tfn-links">Tooth Fairy Network</h2>
          <div className="workshop-links-grid">
            {toothFairySocialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                <span>{link.label}</span><span>TFN channel ↗</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <WorkshopFooter />
    </div>
  )
}
