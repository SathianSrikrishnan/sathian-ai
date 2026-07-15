'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { SiteNav } from '@/components/SiteNav'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { TxOddsCampaign } from '@/lib/campaigns/txodds'

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
  campaign: TxOddsCampaign | null
}

interface BuildNote {
  date: string
  status: string
  project: string
  title: string
  changed: string
  learned: string
  next: string
  href: string
  accent: string
  external?: boolean
  proofHref?: string
  proofLabel?: string
}

const BUILD_NOTES: BuildNote[] = [
  {
    date: '2026-07-15',
    status: 'PROVEN',
    project: 'TOOTH FAIRY NETWORK',
    title: 'Making a childhood memory ownable without making it public',
    changed: 'Minted one synthetic private-provenance Toothlight on Solana devnet to a disposable guardian wallet. Metaplex DAS independently verified the asset, owner, tree, and metadata. No production or mainnet configuration changed.',
    learned: 'A guardian-owned digital keepsake can provide verifiable ownership and provenance while the child\'s artwork and the parent\'s future letter remain private.',
    next: 'Build the parent-facing wallet experience and compare the current Bubblegum V1 proof with the recommended V2 path before choosing a production standard.',
    href: 'https://toothfairy.network',
    accent: '#B794F6',
    external: true,
    proofHref: 'https://explorer.solana.com/tx/2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke?cluster=devnet',
    proofLabel: 'Inspect the devnet transaction',
  },
  {
    date: '2026-07-14',
    status: 'BUILDING',
    project: 'SITE AGENT',
    title: 'The chatbot becomes a doorway',
    changed: 'Closed the Studio cookie gap, removed duplicate prompts, retired Notion logging, and made message forwarding visible.',
    learned: 'A useful agent needs clearer boundaries before it needs more tools.',
    next: 'Reviewed public memory, durable receipts, and one-way Telegram delivery.',
    href: '#agent',
    accent: '#5EEAD4',
  },
  {
    date: '2026-07-11',
    status: 'ITERATING',
    project: 'TOOTH FAIRY NETWORK',
    title: 'Back to the ritual',
    changed: 'Moved the product away from technical spectacle and toward drawings, stories, and the words children attach to them.',
    learned: 'The memory is the product. The technical rails should stay underneath it.',
    next: 'Find the first hundred families willing to tell me what feels meaningful and what should disappear.',
    href: '/writings/the-gap-between-weeks',
    accent: '#B794F6',
  },
  {
    date: '2026-07-02',
    status: 'SHIPPED',
    project: 'AGENT ALLOWANCE LAB',
    title: 'Bounded budgets for agents',
    changed: 'Shipped a small Solana demo and a receipt-backed technical write-up for agent spending limits.',
    learned: 'A useful agent wallet starts with explicit authority, not a bigger balance.',
    next: 'Carry the same bounded-authority idea into the public site agent.',
    href: '/writings/agent-allowance-lab',
    accent: '#14F195',
  },
]

const PROJECTS = [
  {
    number: '01',
    name: 'Tooth Fairy Network',
    label: 'FLAGSHIP / BUILDING',
    description: 'A family memory ritual built from drawings, stories, and the moments around a lost tooth.',
    proof: 'Origin essay and live product work',
    href: 'https://toothfairy.network',
    accent: '#B794F6',
    external: true,
    image: '/toothfairy/animation/tfn-tanda-hero-poster.webp',
    credit: null,
  },
  {
    number: '02',
    name: 'Lex Rooftop Garden',
    label: 'COMMUNITY BUILD / LIVE',
    description: 'A resident-led garden companion with a rooftop map, PlantTalk, and a live 3D view of 45 Carlton.',
    proof: 'Real rooftop, live product',
    href: 'https://garden.sathian.ai',
    accent: '#8BC34A',
    external: true,
    image: '/projects/lex-rooftop-aerial.jpg',
    credit: 'https://open.toronto.ca/open-data-licence/',
  },
  {
    number: '03',
    name: 'BTC Cultural Atlas',
    label: 'CULTURAL MAP / LIVE',
    description: 'Numbers from music, history, sports, area codes, and the internet mapped against Bitcoin’s live price.',
    proof: '500+ cultural markers',
    href: 'https://btc.sathian.ai',
    accent: '#F7931A',
    external: true,
    image: '/media/bitcoin-coin.jpg',
    credit: null,
  },
]

const HERO_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
}

const HERO_ITEM = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Arrow({ size = 15 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('Subscribe request failed')
      setEmail('')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="hub-mono relaunch-form-note relaunch-form-note--success">You’re on the list.</p>
  }

  return (
    <form onSubmit={submit} className="relaunch-newsletter-form">
      <label className="sr-only" htmlFor="relaunch-email">Email address</label>
      <input
        id="relaunch-email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining…' : 'Join the list'}
        <Arrow />
      </button>
      {status === 'error' && <p className="hub-mono relaunch-form-note">That did not go through. Please try again.</p>}
    </form>
  )
}

function SectionIntro({ index, label, title, note }: { index: string; label: string; title: string; note?: string }) {
  return (
    <div className="relaunch-section-intro">
      <div className="relaunch-section-code">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </div>
  )
}

export function HomeClient({ writings, campaign }: HomeClientProps) {
  const featured = writings[0]
  const openAgent = (message?: string) => {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: message ? { message } : undefined }))
  }

  return (
    <div className="relaunch-shell" data-theme="dark">
      <SiteNav />
      <main>
        <section className="relaunch-hero" aria-labelledby="relaunch-title">
          <div className="relaunch-hero-atmosphere" aria-hidden="true">
            <span className="relaunch-orbit relaunch-orbit--one" />
            <span className="relaunch-orbit relaunch-orbit--two" />
            <span className="relaunch-beacon" />
          </div>

          <motion.div
            className="relaunch-hero-grid"
            variants={HERO_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            <div className="relaunch-hero-copy">
              <motion.p variants={HERO_ITEM} className="hub-eyebrow relaunch-kicker">
                SATHIAN S. / TORONTO / CURRENTLY BUILDING
              </motion.p>
              <motion.h1 variants={HERO_ITEM} id="relaunch-title">
                Proof of work,
                <span>in public.</span>
              </motion.h1>
              <motion.p variants={HERO_ITEM} className="relaunch-hero-summary">
                I build products and small AI systems. I write about what I am learning, from childhood
                rituals to Solana and personal AI. The site agent is the quickest way to ask what I am
                working on or leave me a note.
              </motion.p>
              <motion.div variants={HERO_ITEM} className="relaunch-hero-links">
                <button type="button" onClick={() => openAgent()}>Ask the site agent <Arrow /></button>
                <Link href="/writings">Read the field notes</Link>
              </motion.div>
            </div>

            <motion.div
              variants={HERO_ITEM}
              id="agent"
              className="relaunch-agent-host"
              aria-label="Sathian's site agent"
            >
              <div id="home-agent-slot" />
            </motion.div>
          </motion.div>
        </section>

        {campaign && (
          <ScrollReveal>
            <section id="txodds" className="relaunch-campaign" aria-labelledby="txodds-campaign-title">
              <div className="relaunch-content relaunch-campaign-frame">
                <div className="relaunch-campaign-meta">
                  <span>{campaign.eyebrow}</span>
                  <time dateTime={campaign.deadline}>{campaign.deadlineLabel}</time>
                </div>
                <div className="relaunch-campaign-grid">
                  <div className="relaunch-campaign-copy">
                    <p className="hub-eyebrow">TXODDS WORLD CUP</p>
                    <h2 id="txodds-campaign-title">Start with what you already know.</h2>
                    <p>
                      Tell the site agent your background, interests, and available time. It can suggest a
                      realistic track, three ideas, or a useful way to join a team.
                    </p>
                  </div>
                  <div className="relaunch-campaign-actions">
                    <button type="button" onClick={() => openAgent(campaign.prompts[0])}>
                      Ask what I could build <Arrow />
                    </button>
                    {campaign.referralUrl ? (
                      <a href={campaign.referralUrl} target="_blank" rel="noopener noreferrer">
                        Register with Sathian’s referral <Arrow />
                      </a>
                    ) : (
                      <p className="relaunch-campaign-pending">Unique referral link pending</p>
                    )}
                    <a className="relaunch-campaign-source" href={campaign.listingUrl} target="_blank" rel="noopener noreferrer">
                      Official Superteam Canada challenge
                    </a>
                  </div>
                </div>
                <div className="relaunch-campaign-prompts" aria-label="TxODDS agent questions">
                  {campaign.prompts.slice(1, 4).map((prompt) => (
                    <button type="button" key={prompt} onClick={() => openAgent(prompt)}>{prompt}</button>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section id="now" className="relaunch-section relaunch-now">
            <div className="relaunch-content">
              <SectionIntro
                index="01"
                label="NOW"
                title="Projects with a pulse."
              />
              <div className="relaunch-projects">
                {PROJECTS.map((project, index) => {
                  const content = (
                    <>
                      <div className="relaunch-project-topline">
                        <span>{project.number}</span>
                        <span style={{ color: project.accent }}>{project.label}</span>
                      </div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="relaunch-project-proof">
                        <span style={{ background: project.accent }} />
                        {project.proof}
                      </div>
                      <span className="relaunch-project-arrow"><Arrow size={18} /></span>
                    </>
                  )

                  const className = `relaunch-project relaunch-project--${index + 1}`
                  return project.external ? (
                    <a
                      key={project.name}
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      style={project.image ? {
                        backgroundImage: `linear-gradient(180deg, rgba(7,8,14,0.48), rgba(7,8,14,0.97)), url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <a key={project.name} href={project.href} className={className}>{content}</a>
                  )
                })}
              </div>
              <p className="relaunch-project-credit">
                Lex Rooftop Garden image: <a href="https://open.toronto.ca/open-data-licence/" target="_blank" rel="noopener noreferrer">City of Toronto orthophoto, 2025</a>
              </p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="building" className="relaunch-section relaunch-build">
            <div className="relaunch-content">
              <SectionIntro
                index="02"
                label="Building in public"
                title="Active building logs."
              />
              <div className="relaunch-timeline">
                {BUILD_NOTES.map((note) => (
                  <article key={`${note.date}-${note.title}`} className="relaunch-note">
                    <div className="relaunch-note-rail">
                      <span style={{ background: note.accent }} />
                      <time dateTime={note.date}>{formatDate(note.date)}</time>
                    </div>
                    <div className="relaunch-note-body">
                      <div className="relaunch-note-meta">
                        <span style={{ color: note.accent }}>{note.status}</span>
                        <span>{note.project}</span>
                      </div>
                      <h3>
                        {note.external ? (
                          <a href={note.href} target="_blank" rel="noopener noreferrer">{note.title}</a>
                        ) : (
                          <Link href={note.href}>{note.title}</Link>
                        )}
                      </h3>
                      <dl>
                        <div><dt>What changed</dt><dd>{note.changed}</dd></div>
                        <div><dt>What I learned</dt><dd>{note.learned}</dd></div>
                        <div><dt>Next</dt><dd>{note.next}</dd></div>
                      </dl>
                      {note.proofHref && note.proofLabel && (
                        <a
                          className="relaunch-note-proof"
                          href={note.proofHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {note.proofLabel} <Arrow />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {featured && (
          <ScrollReveal>
            <section id="writing" className="relaunch-section relaunch-writing">
              <div className="relaunch-content">
                <SectionIntro index="03" label="WRITING" title="Essays from the workbench." />
                <Link href={featured.href} className="relaunch-featured-writing" style={{ '--writing-accent': featured.accent } as React.CSSProperties}>
                  <div className="relaunch-writing-meta">
                    <span>LATEST ESSAY</span>
                    <span>{formatDate(featured.date)}</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h3>{featured.title}</h3>
                  <p>{featured.description}</p>
                  <span className="relaunch-reading-link">Read the essay <Arrow /></span>
                </Link>
                <div className="relaunch-writing-list">
                  {writings.slice(1, 4).map((article) => (
                    <Link key={article.href} href={article.href}>
                      <span className="relaunch-writing-date">{formatDate(article.date)}</span>
                      <strong>{article.title}</strong>
                      <span>{article.readTime}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/writings" className="relaunch-all-writing">All writing <Arrow /></Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section id="practice" className="relaunch-section relaunch-practice">
            <div className="relaunch-content relaunch-practice-grid">
              <div>
                <p className="hub-eyebrow relaunch-kicker">04 / AI PRACTICE</p>
                <h2>Useful systems, kept close to the work.</h2>
              </div>
              <div>
                <p>
                  I build small AI systems around real work. My own setup runs on persistent context,
                  tools, and review loops. I also help a few people turn repetitive, messy workflows into something useful.
                </p>
                <button type="button" onClick={() => openAgent('I have a workflow problem. Here is what keeps getting done by hand:')}>
                  Leave me a note and tell me what keeps getting done by hand <Arrow />
                </button>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="about" className="relaunch-section relaunch-close">
            <div className="relaunch-content relaunch-close-grid">
              <div className="relaunch-about">
                <p className="hub-eyebrow relaunch-kicker">05 / ABOUT</p>
                <h2>Builder. Student. Father.</h2>
                <p>I use writing and code to examine money, culture, memory, and how people adapt to new systems. Toronto is home.</p>
                <Link href="/about">A little more context <Arrow /></Link>
              </div>
              <div className="relaunch-newsletter">
                <p className="hub-eyebrow relaunch-kicker">FIELD NOTES BY EMAIL</p>
                <h2>New essays and build notes.</h2>
                <p>A quiet note when something worth sharing ships.</p>
                <NewsletterForm />
              </div>
            </div>
          </section>
        </ScrollReveal>

        <footer className="relaunch-footer">
          <div className="relaunch-content">
            <div>
              <span className="hub-mono">sathian.ai</span>
              <span>© {new Date().getFullYear()} Sathian S.</span>
            </div>
            <nav aria-label="Footer navigation">
              <a href="#now">Projects</a>
              <a href="#building">Building</a>
              <Link href="/writings">Writing</Link>
              <Link href="/about">About</Link>
              <a href="mailto:hi@sathian.ai">Email</a>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  )
}
