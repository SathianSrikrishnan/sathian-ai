import type { Metadata } from 'next'
import Link from 'next/link'

import { OpenAgentButton } from '@/components/OpenAgentButton'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'About Sathian S. | Builder and student in Toronto',
  description:
    'Sathian S. is a builder, father, and student again in his 40s, learning in public across AI, Solana, and Toronto technology.',
  openGraph: {
    title: 'About Sathian S.',
    description: 'A builder and student again in his 40s, learning in public from Toronto.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sathian S.',
    description: 'A builder and student again in his 40s, learning in public from Toronto.',
  },
}

const currentWork = [
  {
    number: '01',
    title: 'Tooth Fairy Network',
    body: 'A family memory ritual built around drawings, stories, lost teeth, and the words children attach to those moments.',
    href: 'https://toothfairy.network',
    label: 'FLAGSHIP / BUILDING',
  },
  {
    number: '02',
    title: 'The site agent',
    body: 'A public doorway that answers from reviewed context, helps people find the right part of my work, and accepts a note with a receipt.',
    href: '/#agent',
    label: 'PUBLIC AGENT / TESTING',
  },
  {
    number: '03',
    title: 'Solana and private AI systems',
    body: 'Small experiments in bounded authority, useful automation, personal context, and infrastructure people can actually inspect.',
    href: '/automation',
    label: 'SYSTEMS / LEARNING',
  },
]

export default function AboutPage() {
  return (
    <div data-theme="workshop" className="relaunch-shell relaunch-inner-shell">
      <SiteNav />

      <main className="relaunch-page">
        <div className="relaunch-page-atmosphere" aria-hidden="true">
          <span />
          <span />
        </div>

        <header className="relaunch-content relaunch-page-header">
          <div className="relaunch-page-code">
            <span>01</span>
            <span>ABOUT</span>
          </div>
          <div className="relaunch-page-title">
            <p className="hub-eyebrow relaunch-kicker">SATHIAN S. / TORONTO / CURRENT CHAPTER</p>
            <h1>Student again,<br /><span>in public.</span></h1>
          </div>
          <p className="relaunch-page-lead">
            I spent years building businesses and relationships before coming back to technology in a
            serious way. Now I am in my 40s, active in Toronto&apos;s tech community, and learning from
            people who are often closer to my children&apos;s age than mine.
          </p>
        </header>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>01</span><span>THE LONG ROUTE BACK</span></div>
          <h2>A career that did not move in a straight line.</h2>
          <div className="relaunch-page-prose">
            <p>
              My first close view of startup-building came around Waterloo&apos;s entrepreneurship community
              as a university co-op student in the mid-2000s. I later worked in recruiting, built King &amp;
              Bay Custom Clothing, and became its CEO.
            </p>
            <p>
              Each chapter taught me something about how people make decisions, how trust is earned, and
              what a business looks like when the systems behind it are imperfect. I am carrying those
              lessons into a new chapter built around software, AI agents, Solana, and public experiments.
            </p>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section relaunch-page-section--stacked">
          <div className="relaunch-page-section-code"><span>02</span><span>CURRENT WORK</span></div>
          <h2>Three live threads.</h2>
          <div className="relaunch-page-list">
            {currentWork.map((item) => {
              const content = (
                <>
                  <div className="relaunch-page-list-meta"><span>{item.number}</span><span>{item.label}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <span className="relaunch-page-list-arrow" aria-hidden="true">↗</span>
                </>
              )

              return item.href.startsWith('http') ? (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
              ) : (
                <Link key={item.title} href={item.href}>{content}</Link>
              )
            })}
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>03</span><span>HUMANS + AGENTS</span></div>
          <h2>Readable by people and agents.</h2>
          <div className="relaunch-page-prose">
            <p>
              This site is my public context layer. The pages are written for people, but they are also
              crawlable, attributable, and structured so another agent can understand what is public.
            </p>
            <p>
              The site agent reads only reviewed public material. It cannot enter my private memory,
              credentials, client work, or family records. A direct agent API is not public yet. I will add
              one only when its capabilities, rate limits, and receipts are as clear as the website boundary.
            </p>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-contact">
          <div>
            <p className="hub-eyebrow relaunch-kicker">A DIRECT DOORWAY</p>
            <h2>The fastest route is the agent.</h2>
            <p>Ask about a project, tell me what you are building, or leave a note that should reach me.</p>
          </div>
          <div className="relaunch-page-actions">
            <OpenAgentButton className="relaunch-page-action relaunch-page-action--primary">Ask the site agent <span>→</span></OpenAgentButton>
            <a className="relaunch-page-action" href="mailto:hi@sathian.ai">Email hi@sathian.ai <span>→</span></a>
          </div>
        </section>
      </main>

      <footer className="relaunch-footer">
        <div className="relaunch-content">
          <div><span className="hub-mono">sathian.ai</span><span>© {new Date().getFullYear()} Sathian S.</span></div>
          <nav aria-label="Footer navigation"><Link href="/#now">Projects</Link><Link href="/automation">Automation</Link><Link href="/writings">Writing</Link></nav>
        </div>
      </footer>
    </div>
  )
}
