'use client'

import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TFNGlowingToothLogo } from '@/components/toothfairy/brand/tfn-glowing-tooth-logo'

export interface HomeWriting {
  title: string
  description: string
  href: string
  date: string
  readTime: string
  accent: string
}

interface HomeClientProps {
  writings: HomeWriting[]
}

const FEATURED_PROJECTS = [
  {
    name: 'Tooth Fairy Network',
    label: 'FLAGSHIP / BUILDING',
    description:
      'A private time capsule for childhood masterpieces, built around a lost-tooth ritual and powered by Solana.',
    href: 'https://toothfairy.network',
    cta: 'Visit Tooth Fairy Network',
    image: '/toothfairy/animation/tfn-tanda-hero-integrated-poster-v34.webp',
    alt: 'Official Tooth Fairy Network artwork featuring Tanda and a glowing memory network',
  },
  {
    name: 'AutoQuote Automator',
    label: 'RECENT HACKATHON / ACTIVE BUILD',
    description:
      'An evidence-first personal shopping agent for Ontario auto insurance, with private intake, human approval gates, and an honest result for every route.',
    href: 'https://ontario-all-quote-agent.vercel.app',
    cta: 'Open the current dashboard',
    image: '/projects/autoquote-automator-dashboard.png',
    alt: 'The public AutoQuote Automator evidence dashboard',
  },
]

const SOLANA_PROJECT = {
  name: 'Solana Ecosystem Observatory',
  image: '/projects/solana-ecosystem-observatory.png',
  href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/SathianSrikrishnan/solana-ecosystem-dashboard/main/output/index.html',
}

const MORE_PROJECTS = [
  {
    name: 'Lex Rooftop Garden',
    label: 'COMMUNITY / HOBBY PROJECT',
    href: 'https://garden.sathian.ai',
    image: '/projects/lex-rooftop-aerial.jpg',
  },
  {
    name: 'BTC Cultural Atlas',
    label: 'CULTURE / HOBBY PROJECT',
    href: 'https://btc.sathian.ai',
    image: '/projects/btc-cultural-atlas-hero.png',
  },
  {
    name: 'AgentTab',
    label: 'PRIOR HACKATHON',
    href: 'https://agenttab.sathian.ai',
    image: null,
  },
  {
    name: 'ClinicalGuard',
    label: 'PRIOR HACKATHON',
    href: 'https://github.com/SathianSrikrishnan/ClinicalGuard',
    image: null,
  },
]

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function HomeClient({ writings }: HomeClientProps) {
  return (
    <div className="relaunch-shell minimal-site" data-theme="workshop">
      <SiteNav />

      <main>
        <header className="minimal-home-hero minimal-container">
          <p className="minimal-kicker">SATHIAN S. / AGENT MANAGER + ORCHESTRATOR / TORONTO</p>
          <h1>The fastest way to reach me is to ask.</h1>
          <p className="minimal-lede">Ask anything about the work, or leave me a note. This is the fastest way to reach me.</p>
        </header>

        <section id="agent" className="minimal-agent-section minimal-container" aria-label="Ask Sathian's site agent">
          <div className="minimal-agent-frame relaunch-agent-host">
            <div id="home-agent-slot" />
          </div>
          <p className="minimal-agent-note">
            Answers come from reviewed public context. Notes can be routed to Sathian. Please do not send secrets.
          </p>
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="featured-work">
          <h2 id="featured-work">Featured work</h2>

          <div className="minimal-featured-list">
            {FEATURED_PROJECTS.map((project, index) => (
              <article key={project.name} className={`minimal-featured-project minimal-featured-project--${index + 1}`}>
                <div className="minimal-project-copy">
                  {index === 0 && (
                    <div className="minimal-tfn-title">
                      <TFNGlowingToothLogo size={54} />
                      <h3>{project.name}</h3>
                    </div>
                  )}
                  {index !== 0 && <h3>{project.name}</h3>}
                  <p className="minimal-label">{project.label}</p>
                  <p>{project.description}</p>
                  <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
                    {project.cta}
                  </a>
                </div>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-project-media" aria-label={project.cta}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="minimal-section minimal-container minimal-solana" aria-labelledby="new-to-solana">
          <div className="minimal-project-copy">
            <p className="minimal-kicker">PUBLIC DATA PROJECT</p>
            <h2 id="new-to-solana">New to Solana?</h2>
            <p>
              Learn the ecosystem visually, see what the network is doing now, and understand why Solana fits Tooth Fairy Network.
            </p>
            <p className="minimal-label">LIVE FOUNDATION / DIRECT RPC / SOURCE-VISIBLE</p>
            <a href={SOLANA_PROJECT.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
              Open the current public snapshot
            </a>
          </div>
          <a href={SOLANA_PROJECT.href} target="_blank" rel="noopener noreferrer" className="minimal-project-media" aria-label={`Open ${SOLANA_PROJECT.name}`}>
            <Image src={SOLANA_PROJECT.image} alt="The source-visible Solana Ecosystem Observatory dashboard" fill sizes="(max-width: 760px) 100vw, 58vw" />
          </a>
        </section>

        {writings.length > 0 && (
          <section className="minimal-section minimal-container" aria-labelledby="home-writing">
            <div className="minimal-section-heading">
              <h2 id="home-writing">Writing</h2>
              <Link href="/writings" className="minimal-text-link">All writing</Link>
            </div>
            <div className="minimal-writing-preview">
              {writings.slice(0, 3).map((article) => (
                <Link key={article.href} href={article.href}>
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                  <div>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                  </div>
                  <span>{article.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="minimal-section minimal-container minimal-more" aria-labelledby="more-projects">
          <h2 id="more-projects">More projects &amp; curiosities</h2>
          <div className="minimal-more-list">
            {MORE_PROJECTS.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer">
                <span className="minimal-more-thumb">
                  {project.image ? <Image src={project.image} alt="" fill sizes="136px" /> : <span aria-hidden="true" />}
                </span>
                <strong>{project.name}</strong>
                <span className="minimal-label">{project.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
