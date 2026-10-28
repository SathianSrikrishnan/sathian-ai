import type { Metadata } from 'next'

import { SiteNav } from '@/components/SiteNav'
import { WorkshopFooter } from '@/components/WorkshopFooter'

export const metadata: Metadata = {
  title: 'Privacy | Sathian',
  description: 'What sathian.ai collects, why, and how to have it removed.',
}

const sections = [
  {
    heading: 'Visits',
    body: 'Google Analytics (with IP anonymization) and Vercel Analytics count page views, device type and approximate location so I can see what people read.',
  },
  {
    heading: 'Email signups',
    body: 'If you sign up for notes, early testing or a waitlist, I keep the name and email you give. Emails are sent through Resend, and every email has an unsubscribe link.',
  },
  {
    heading: 'The site agent',
    body: 'Messages you type to the site agent are sent to an AI provider to write a reply and are kept so I can read them and improve answers. A one-way visitor code, not your raw IP address, is used to limit abuse.',
  },
  {
    heading: 'What I do not do',
    body: 'I do not sell your information or share it for advertising.',
  },
  {
    heading: 'Tooth Fairy Network',
    body: 'Purchases and family accounts happen on toothfairy.network, which has its own privacy policy.',
  },
]

export default function PrivacyPage() {
  return (
    <div data-theme="workshop" className="relaunch-shell relaunch-inner-shell">
      <SiteNav />
      <main className="relaunch-content">
        <header>
          <p className="hub-eyebrow relaunch-kicker">PRIVACY / SATHIAN.AI</p>
          <h1>Privacy.</h1>
          <p>
            To see or delete what I hold about you, email{' '}
            <a href="mailto:hi@sathian.ai">hi@sathian.ai</a>.
          </p>
        </header>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <p>
          <a href="https://toothfairy.network/privacy">Tooth Fairy Network privacy policy ↗</a>
        </p>
        <p className="hub-mono">Updated October 27, 2026</p>
      </main>
      <WorkshopFooter />
    </div>
  )
}
