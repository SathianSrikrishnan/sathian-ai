'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { SiteNav } from '@/components/SiteNav'
import { SocialLink } from '@/components/SocialLink'
import { WorkshopMachine } from '@/components/home/WorkshopMachine'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { personalSocialLinks, toothFairySocialLinks } from '@/lib/social-links'

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
    const company = String(new FormData(event.currentTarget).get('company') ?? '')

    setStatus('loading')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'sathian-home', company }),
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
      <label className="newsletter-honeypot" aria-hidden="true" hidden>
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
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

export function HomeClient({ writings }: HomeClientProps) {
  const featured = writings[0]
  const openAgent = (message?: string) => {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: message ? { message } : undefined }))
  }

  return (
    <div className="relaunch-shell" data-theme="workshop">
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
                A personal workshop.
              </motion.h1>
              <motion.p variants={HERO_ITEM} className="relaunch-hero-summary">
                Projects, writing, and agentic experiments across culture, memory, money, and the internet.
                The site agent can help you find your way around or leave me a note.
              </motion.p>
              <motion.div variants={HERO_ITEM} className="relaunch-hero-links">
                <button type="button" onClick={() => openAgent()}>Ask the site agent <Arrow /></button>
                <Link href="/writings">Read the field notes</Link>
              </motion.div>
              <motion.div variants={HERO_ITEM} className="relaunch-social-dock relaunch-social-dock--personal" aria-label="Find Sathian online">
                {personalSocialLinks.map((link) => <SocialLink key={link.label} {...link} />)}
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

        <section className="relaunch-machine-band" aria-label="How ideas move through the workshop">
          <div className="relaunch-content relaunch-machine-band__grid">
            <div>
              <p className="hub-eyebrow relaunch-kicker">THE WORKSHOP LOOP</p>
              <h2>From a loose idea to something inspectable.</h2>
              <p>
                Notes, conversations, and rough questions pass through small systems, tests, and public
                receipts. The useful parts become projects; the rest stays a working experiment.
              </p>
            </div>
            <div className="relaunch-machine-stage">
              <WorkshopMachine />
            </div>
          </div>
        </section>

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
              <div className="relaunch-project-socials" aria-label="Tooth Fairy Network social profiles">
                <div>
                  <span className="relaunch-project-socials__eyebrow">Tooth Fairy Network</span>
                  <strong>Follow the build</strong>
                </div>
                <div className="relaunch-social-dock relaunch-social-dock--tfn">
                  {toothFairySocialLinks.map((link) => <SocialLink key={link.label} {...link} />)}
                </div>
              </div>
              <p className="relaunch-project-credit">
                Lex Rooftop Garden image: <a href="https://open.toronto.ca/open-data-licence/" target="_blank" rel="noopener noreferrer">City of Toronto orthophoto, 2025</a>
              </p>
            </div>
          </section>
        </ScrollReveal>

        {featured && (
          <ScrollReveal>
            <section id="writing" className="relaunch-section relaunch-writing">
              <div className="relaunch-content">
                <SectionIntro index="02" label="WRITING" title="Essays from the workbench." />
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
          <section id="about" className="relaunch-section relaunch-close">
            <div className="relaunch-content relaunch-close-grid">
              <div className="relaunch-about">
                <p className="hub-eyebrow relaunch-kicker">03 / ABOUT</p>
                <h2>Builder. Student. Father.</h2>
                <p>I use writing and code to examine money, culture, memory, and how people adapt to new systems. Toronto is home.</p>
                <Link href="/about">A little more context <Arrow /></Link>
              </div>
              <div className="relaunch-newsletter">
                <p className="hub-eyebrow relaunch-kicker">WRITING, BY EMAIL</p>
                <h2>New writing and occasional updates.</h2>
                <p>A short note when I publish something worth sharing.</p>
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
              <Link href="/hackathons">Hackathons</Link>
              <Link href="/writings">Writing</Link>
              <Link href="/about">About</Link>
              <Link href="/agents">For agents</Link>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  )
}
