// Server component: static homepage markup is not hydrated. Only the nav and
// the tracked links (TrackedLinks.tsx) ship as client islands.
import Image from 'next/image'
import Link from 'next/link'

import { NetworkBenefits } from '@/components/NetworkBenefits'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedAnchor, TrackedLink } from '@/components/home/TrackedLinks'
import {
  FEATURED_SITE_PROJECTS,
  HACKATHON_SITE_PROJECTS,
  MORE_SITE_PROJECTS,
} from '@/content/site-projects'
import { toothFairySocialLinks } from '@/lib/social-links'
import { LATEST_WRITING } from '@/content/latest-writing'

const HOME_GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=home'

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

const FEATURED_WRITINGS = [
  LATEST_WRITING.feature,
  {
    slug: 'inside-monkedao',
    prefetch: true,
    label: 'NEW FILM + FIRSTHAND FIELD REPORT',
    cta: 'Watch and read the field report',
    image: '/inside-monkedao/opening-cover.png',
    alt: 'Inside MonkeDAO — a firsthand field report from the Solana ecosystem',
  },
  {
    slug: 'saraswati-lakshmi-and-the-ledger',
    prefetch: false,
    label: 'FEATURED ESSAY / INTERACTIVE FIELD NOTE',
    cta: 'Read and try the two tests',
    image: '/media/flagship-hero.png',
    alt: 'Saraswati and Lakshmi connected by a luminous ledger',
  },
] as const

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
        <header className="minimal-home-hero minimal-container village-home-hero">
          <div>
            <p className="minimal-kicker minimal-home-identity"><span className="minimal-home-identity__part">SATHIAN SRIKRISHNAN</span><span className="minimal-home-identity__part">FOUNDER + DAD</span><span className="minimal-home-identity__part">TORONTO</span></p>
            <h1>Bring the Tooth Fairy to your child’s network.</h1>
            <p className="minimal-home-mission">I build things for the people I love. This one starts with a child, their art and the people who show up.</p>
            <NetworkBenefits />
            <p>Parents choose who joins their child’s network. They hold the wallet key.</p>
            <div className="about-actions">
              <TrackedLink href="/village" event="village_opened" properties={{ placement: 'homepage_hero' }} className="about-button about-button--primary">See the Tooth Fairy Network gift</TrackedLink>
              <Link href="/about" className="about-button">Meet Sathian</Link>
            </div>
            <p className="first20-note">I’m inviting families to try a free printed Proof with US$10 to start.</p>
          </div>
          <Link href="/village" className="village-home-art" aria-label="See what a child gets from Tooth Fairy Network">
            <Image src="/village/proof-in-hand.webp" alt="A real printed Proof of Growth with a tooth-fairy artwork, held in a hand" width={1105} height={1600} sizes="(max-width: 760px) 100vw, 460px" priority />
          </Link>
        </header>

        <section id="agent" className="minimal-agent-section minimal-container" aria-label="Ask Sathian's site agent">
          <div className="minimal-agent-frame relaunch-agent-host">
            <div id="home-agent-slot" />
          </div>
          <p className="minimal-agent-note">
            Answers come from reviewed public context. Notes can be routed to Sathian. Please do not send secrets.
          </p>
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="building-now">
          <h2 id="building-now">Building now</h2>
          <div className="minimal-featured-list">
            {FEATURED_SITE_PROJECTS.map((project, index) => (
              <article key={project.name} className={`minimal-featured-project minimal-featured-project--${index + 1}`}>
                <div className="minimal-project-copy">
                  {index === 0 && (
                    <div className="minimal-tfn-title">
                      <Image
                        src="/projects/tooth-fairy-network/tanda-profile.png"
                        alt="Tanda, the Tooth Fairy Network guide"
                        width={58}
                        height={58}
                      />
                      <h3>{project.name}</h3>
                    </div>
                  )}
                  {index !== 0 && <h3>{project.name}</h3>}
                  <p className="minimal-label">{project.label}</p>
                  <p>{project.description}</p>
                  {index === 0 ? (
                    <TrackedAnchor
                      href={HOME_GIFT_HREF}
                      className="minimal-text-link"
                      carryAdClick
                      event="gift_cta_clicked"
                      properties={{ placement: 'homepage_tfn' }}
                    >
                      Give a child their first wallet
                    </TrackedAnchor>
                  ) : (
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
                      {project.cta}
                    </a>
                  )}
                  {index === 0 && (
                    <nav className="minimal-tfn-socials" aria-label="Tooth Fairy Network social channels">
                      {toothFairySocialLinks.map((link) => (
                        <TrackedAnchor
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          event="tfn_social_opened"
                          properties={{
                            placement: 'homepage',
                            channel: link.label.toLowerCase(),
                          }}
                        >
                          {link.label}
                        </TrackedAnchor>
                      ))}
                    </nav>
                  )}
                </div>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-project-media" aria-label={project.cta}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                </a>
              </article>
            ))}
            <article className="minimal-featured-project minimal-featured-project--learn">
              <div className="minimal-project-copy">
                <p className="minimal-kicker">TOOTH FAIRY NETWORK</p>
                <h3>Learn with Tanda</h3>
                <p className="minimal-label">STORIES + SHORT LESSONS / FREE</p>
                <p>Stories and short lessons on saving, money and the internet, for children and the grown-ups who love them.</p>
                <TrackedLink
                  href="/learn"
                  className="minimal-text-link"
                  event="learn_opened"
                  properties={{ placement: 'homepage' }}
                >
                  Start learning
                </TrackedLink>
              </div>
              <Link href="/learn" className="minimal-project-media" aria-label="Open Learn with Tanda">
                <Image
                  src="/learn-art/classroom-master.webp"
                  alt="Tanda teaching a dad and two children at a chalkboard about a child's digital vault"
                  fill
                  sizes="(max-width: 760px) 100vw, 58vw"
                />
              </Link>
            </article>
          </div>
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="featured-work">
          <h2 id="featured-work">Featured writing</h2>

          <div className="minimal-featured-list">
            {FEATURED_WRITINGS.map((feature) => {
              const writing = writings.find(
                (entry) => entry.href === `/writings/${feature.slug}`,
              )
              if (!writing) return null

              return (
                <article key={feature.slug} className="minimal-featured-project minimal-featured-project--article">
                  <div className="minimal-project-copy">
                    <h3>{writing.title}</h3>
                    <p className="minimal-label">{feature.label}</p>
                    <p>{writing.description}</p>
                    <Link href={writing.href} prefetch={feature.prefetch} className="minimal-text-link">
                      {feature.cta}
                    </Link>
                  </div>
                  <Link
                    href={writing.href}
                    prefetch={feature.prefetch}
                    className="minimal-project-media"
                    aria-label={`Read ${writing.title}`}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 58vw"
                    />
                  </Link>
                </article>
              )
            })}
          </div>
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
            {MORE_SITE_PROJECTS.map((project) => {
              const content = (
                <>
                <span className="minimal-more-thumb">
                  {project.image ? <Image src={project.image} alt="" fill sizes="136px" /> : <span aria-hidden="true" />}
                </span>
                <strong>{project.name}</strong>
                <span className="minimal-label">{project.label}</span>
                </>
              )
              return project.href.startsWith('/') ? (
                <Link key={project.name} href={project.href}>{content}</Link>
              ) : (
                <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer">{content}</a>
              )
            })}
          </div>
        </section>
        <section className="minimal-section minimal-container" aria-labelledby="home-hackathons">
          <div className="minimal-section-heading">
            <h2 id="home-hackathons">Hackathons</h2>
            <Link href="/hackathons" className="minimal-text-link">All builds</Link>
          </div>
          <p>Working systems built against the clock: {HACKATHON_SITE_PROJECTS.map((project) => project.name).join(', ')}.</p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
