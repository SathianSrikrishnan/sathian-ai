import type { Metadata } from 'next'
import Link from 'next/link'

import { OpenAgentButton } from '@/components/OpenAgentButton'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Small AI systems for messy work | sathian.ai',
  description:
    'Small assistants, routing layers, private context systems, and review loops built around real work by Sathian S.',
  openGraph: {
    title: 'Small AI systems for messy work',
    description: 'Assistants, routing layers, private context systems, and review loops built around real work.',
    url: 'https://sathian.ai/automation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small AI systems for messy work',
    description: 'Assistants, routing layers, private context systems, and review loops built around real work.',
  },
}

const systems = [
  {
    number: '01',
    title: 'Intake and routing',
    body: 'Turn a note, message, document, or voice dump into the right task, owner, context, and receipt.',
    status: 'CAPTURE / ROUTE',
  },
  {
    number: '02',
    title: 'Private context',
    body: 'Give an assistant the smallest useful slice of memory without handing it an unrestricted personal archive.',
    status: 'MEMORY / BOUNDARIES',
  },
  {
    number: '03',
    title: 'Review loops',
    body: 'Make decisions, failures, approvals, and handoffs visible so an automation can improve without becoming mysterious.',
    status: 'PROOF / REVIEW',
  },
  {
    number: '04',
    title: 'Public agents',
    body: 'Create a useful front door that can answer from approved facts, accept a note, and stop before it reaches private systems.',
    status: 'PUBLIC / GATED',
  },
]

export default function AutomationPage() {
  return (
    <div data-theme="dark" className="relaunch-shell relaunch-inner-shell">
      <SiteNav />

      <main className="relaunch-page">
        <div className="relaunch-page-atmosphere relaunch-page-atmosphere--cyan" aria-hidden="true">
          <span />
          <span />
        </div>

        <header className="relaunch-content relaunch-page-header">
          <div className="relaunch-page-code"><span>02</span><span>SYSTEMS</span></div>
          <div className="relaunch-page-title">
            <p className="hub-eyebrow relaunch-kicker">AI PRACTICE / PRIVATE BY DEFAULT</p>
            <h1>Small systems<br /><span>for messy work.</span></h1>
          </div>
          <p className="relaunch-page-lead">
            I build assistants, routing layers, and review loops around real work. The useful part is rarely
            a bigger model. It is getting the right context to the right place with a boundary someone can inspect.
          </p>
        </header>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>01</span><span>THE PROBLEM</span></div>
          <h2>Good work disappears between tools.</h2>
          <div className="relaunch-page-prose">
            <p>
              A call ends, a note lands in the wrong inbox, a useful decision lives in somebody&apos;s head, and
              the same question gets answered again next week. Most automation problems begin there.
            </p>
            <p>
              I look for the smallest operating loop that can preserve the context, route the next action,
              and leave evidence that a person can review. Sometimes that becomes an agent. Sometimes it is
              a better form, a scheduled report, or a simpler handoff.
            </p>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section relaunch-page-section--stacked">
          <div className="relaunch-page-section-code"><span>02</span><span>THE WORK</span></div>
          <h2>Four systems I keep returning to.</h2>
          <div className="relaunch-systems-list">
            {systems.map((system) => (
              <article key={system.title}>
                <div className="relaunch-page-list-meta"><span>{system.number}</span><span>{system.status}</span></div>
                <h3>{system.title}</h3>
                <p>{system.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relaunch-content relaunch-page-section">
          <div className="relaunch-page-section-code"><span>03</span><span>THE RULE</span></div>
          <h2>Boundaries before capabilities.</h2>
          <div className="relaunch-page-prose">
            <p>
              My Solana allowance work and this public site agent are versions of the same question: what can
              software do on someone&apos;s behalf, and how can that authority stay visible and limited?
            </p>
            <p>
              A useful system should make three things clear. What may it read? What may it do? When must it
              ask a person? If those answers are fuzzy, more tools only make the risk harder to see.
            </p>
            <Link href="/writings/agent-allowance-lab" className="relaunch-text-link">Read the Agent Allowance Lab proof <span>→</span></Link>
          </div>
        </section>

        <section className="relaunch-content relaunch-page-contact">
          <div>
            <p className="hub-eyebrow relaunch-kicker">BRING THE ROUGH VERSION</p>
            <h2>Show me where the work gets lost.</h2>
            <p>A messy description is enough. The first job is deciding whether this needs an agent at all.</p>
          </div>
          <div className="relaunch-page-actions">
            <OpenAgentButton
              className="relaunch-page-action relaunch-page-action--primary"
              prompt="I have a workflow problem. Here is where the work keeps getting lost:"
            >
              Tell the site agent <span>→</span>
            </OpenAgentButton>
            <a className="relaunch-page-action" href="mailto:hi@sathian.ai?subject=AI%20systems%20conversation">Email the rough version <span>→</span></a>
          </div>
        </section>
      </main>

      <footer className="relaunch-footer">
        <div className="relaunch-content">
          <div><span className="hub-mono">sathian.ai</span><span>© {new Date().getFullYear()} Sathian S.</span></div>
          <nav aria-label="Footer navigation"><Link href="/#now">Projects</Link><Link href="/writings">Writing</Link><Link href="/about">About</Link></nav>
        </div>
      </footer>
    </div>
  )
}
