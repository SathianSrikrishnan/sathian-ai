import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Hackathons | sathian.ai',
  description: 'Working systems built under pressure, with public demos, source code, and honest evidence.',
  openGraph: {
    title: 'Hackathons | sathian.ai',
    description: 'Working systems built under pressure, with public demos, source code, and honest evidence.',
  },
}

const links = {
  agentTab: {
    demo: 'https://agenttab.sathian.ai',
    presentation: 'https://agenttab.sathian.ai/presentation',
    github: 'https://github.com/SathianSrikrishnan/monad-blitz-toronto',
    contract: 'https://testnet.monadscan.com/address/0x9b223107e5724619cbfe06f4847eb097b46a8f16',
  },
  toothFairyNetwork: {
    story: '/writings/the-gap-between-weeks',
    github: 'https://github.com/SathianSrikrishnan/toothfairy-network',
    product: 'https://toothfairy.network',
  },
  clinicalGuard: {
    project: '/projects/clinicalguard',
    post: 'https://www.linkedin.com/posts/activity-7437509764399640577-86Rt',
    github: 'https://github.com/SathianSrikrishnan/ClinicalGuard',
  },
}

export default function HackathonsPage() {
  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />

      <main>
        <header className="minimal-page-hero minimal-container">
          <p className="minimal-kicker">FIELD BUILDS / PUBLIC PROOF</p>
          <h1>Ideas meet the clock.</h1>
          <p>
            Small, working systems built under pressure—then documented with live demos, source code, and honest notes about what comes next.
          </p>
        </header>

        <section className="minimal-section minimal-container" aria-labelledby="hackathon-submissions">
          <div className="minimal-section-heading minimal-section-heading--stacked">
            <div>
              <h2 id="hackathon-submissions">Hackathon submissions</h2>
              <p>Documented builds completed under event constraints.</p>
            </div>
          </div>

          <div className="minimal-hackathon-records">
            <PastBuild
              event="MONAD BLITZ TORONTO / JULY 25, 2026"
              title="AgentTab"
              description="A payment firewall for autonomous AI agents. A human sets the allowance and purchase boundaries; over-limit requests fail before payment while approved x402 purchases produce public receipts."
              facts={['Monad Testnet', 'x402 payments', 'Solidity policy + receipts']}
              image="/media/a-corporate-card-for-code-agenttab.png"
              imageAlt="AgentTab allowance and payment-policy dashboard"
              links={[
                { href: links.agentTab.demo, label: 'Live demo' },
                { href: links.agentTab.presentation, label: 'Presentation' },
                { href: links.agentTab.github, label: 'GitHub' },
                { href: links.agentTab.contract, label: 'On-chain contract' },
              ]}
            />

            <PastBuild
              event="COLOSSEUM FRONTIER 2026 / MAY 2026"
              title="Tooth Fairy Network"
              description="A parent-controlled Solana keepsake and Smile Fund built around a child’s lost tooth. The memory ritual comes first; compressed assets, wallets, and an Anchor escrow sit underneath it."
              facts={['Solana', 'Keepsake + Smile Fund', 'The memory is the product']}
              image="/projects/tooth-fairy-network/family-storybook-hero.webp"
              imageAlt="Tanda preserving a child\'s drawing in the Tooth Fairy Network storybook"
              links={[
                { href: links.toothFairyNetwork.story, label: 'Read the submission' },
                { href: links.toothFairyNetwork.product, label: 'Live product' },
                { href: links.toothFairyNetwork.github, label: 'Original code' },
              ]}
            />

            <PastBuild
              event="U OF T HEALTHCARE AI HACKATHON / MARCH 2026"
              title="ClinicalGuard"
              description="A five-step AI pipeline that extracts ICD-9 codes from discharge notes, checks them against laboratory and prescription evidence, and flags weak matches for human review."
              facts={['2,000 MIMIC admissions', 'LangGraph + Claude', 'Evidence before billing']}
              image="/projects/clinicalguard-dashboard.png"
              imageAlt="ClinicalGuard clinical coding validation dashboard"
              links={[
                { href: links.clinicalGuard.project, label: 'Project story' },
                { href: links.clinicalGuard.post, label: 'Read the submission' },
                { href: links.clinicalGuard.github, label: 'GitHub' },
              ]}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function PastBuild({
  event,
  title,
  description,
  facts,
  links: projectLinks,
  image,
  imageAlt,
}: {
  event: string
  title: string
  description: string
  facts: string[]
  links: { href: string; label: string }[]
  image?: string
  imageAlt?: string
}) {
  return (
    <article className="minimal-hackathon-record">
      <div className="minimal-hackathon-record__copy">
        {image && (
          <div className="minimal-hackathon-record__image">
            <Image src={image} alt={imageAlt ?? ''} fill sizes="(max-width: 760px) 100vw, 52vw" />
          </div>
        )}
        <p className="minimal-label">{event}</p>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="minimal-record-links">
          {projectLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link key={link.href} href={link.href} className="minimal-text-link">{link.label}</Link>
            ) : (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">{link.label}</a>
            )
          ))}
        </div>
      </div>
      <ul>
        {facts.map((fact) => <li key={fact}>{fact}</li>)}
      </ul>
    </article>
  )
}
