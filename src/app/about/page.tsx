import type { Metadata } from 'next'
import Link from 'next/link'

import { OpenAgentButton } from '@/components/OpenAgentButton'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'About Sathian S. | Builder, writer, and systems student',
  description:
    'Sathian S. is a Toronto builder and writer learning in public through products, agentic workflows, and small automation systems.',
  openGraph: {
    title: 'About Sathian S.',
    description: 'A builder and student again, working across products, writing, and bounded automation.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sathian S.',
    description: 'A builder and student again, working across products, writing, and bounded automation.',
  },
}

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
            I build products, write to understand what I am seeing, and test small agentic workflows around
            real work. I am in my 40s, back in technology in a serious way, and learning in public from Toronto.
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
              Those years taught me how people make decisions and how trust is earned when the systems behind
              the work are imperfect. I am carrying that into software, AI agents, and public experiments.
            </p>
          </div>
        </section>

        <section id="automation" className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>02</span><span>AUTOMATION</span></div>
          <h2>Small systems for messy work.</h2>
          <div className="relaunch-page-prose">
            <p>
              I build assistants, routing layers, and review loops around work that gets lost between tools.
              The useful part is rarely a bigger model. It is getting the right context to the right place.
            </p>
            <p>
              My rule is boundaries before capabilities: make clear what an agent may read, what it may do,
              and when it must stop and ask a person.
            </p>
            <Link href="/writings/agent-allowance-lab" className="relaunch-text-link">
              See the bounded-authority experiment <span>→</span>
            </Link>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>03</span><span>PUBLIC CONTEXT</span></div>
          <h2>Public context. Private boundaries.</h2>
          <div className="relaunch-page-prose">
            <p>
              This site is a public workshop. People get the shorter version: projects, hackathons, and
              writing. Agents get a structured index and dated build notes they can sweep and cite.
            </p>
            <p>
              The site agent reads reviewed public material only. It cannot enter private memory, credentials,
              client work, or family records.
            </p>
            <Link href="/agents" className="relaunch-text-link">Open the agent index <span>→</span></Link>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-contact">
          <div>
            <p className="hub-eyebrow relaunch-kicker">A DIRECT DOORWAY</p>
            <h2>Start with the work.</h2>
            <p>Explore a project, read the field notes, or ask the site agent where to begin.</p>
          </div>
          <div className="relaunch-page-actions">
            <OpenAgentButton className="relaunch-page-action relaunch-page-action--primary">Ask the site agent <span>→</span></OpenAgentButton>
            <Link className="relaunch-page-action" href="/#now">See current projects <span>→</span></Link>
          </div>
        </section>
      </main>

      <footer className="relaunch-footer">
        <div className="relaunch-content">
          <div><span className="hub-mono">sathian.ai</span><span>© {new Date().getFullYear()} Sathian S.</span></div>
          <nav aria-label="Footer navigation"><Link href="/#now">Projects</Link><Link href="/hackathons">Hackathons</Link><Link href="/writings">Writing</Link><Link href="/agents">For agents</Link></nav>
        </div>
      </footer>
    </div>
  )
}
