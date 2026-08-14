'use client'

import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import {
  DRAW_WITH_TANDA_CHANNEL_HREF,
  DRAW_WITH_TANDA_EPISODES,
  LATEST_RELEASE,
} from '@/content/site-releases'
import {
  ARCHIVE_SITE_PROJECTS,
  FEATURED_SITE_PROJECTS,
  SOLANA_OBSERVATORY_PROJECT,
} from '@/content/site-projects'
import { trackSiteEvent } from '@/lib/site-analytics'
import { toothFairySocialLinks } from '@/lib/social-links'

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

const DRAW_WITH_TANDA_PUBLISHED = DRAW_WITH_TANDA_EPISODES
  .filter((release) => release.status === 'published' && release.youtubeVideoId)
  .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
const DRAW_WITH_TANDA_LATEST = LATEST_RELEASE
const DRAW_WITH_TANDA_NEXT = DRAW_WITH_TANDA_EPISODES.find((release) => release.status === 'next')!

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
          <p className="minimal-kicker minimal-home-identity">
            <span className="minimal-home-identity__part">SATHIAN S.</span>
            <span className="minimal-home-identity__part">AGENT MANAGER + ORCHESTRATOR</span>
            <span className="minimal-home-identity__part">TORONTO</span>
          </p>
          <h1>Digital Experiments</h1>
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
                  <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
                    {project.cta}
                  </a>
                </div>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="minimal-project-media" aria-label={project.cta}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 58vw" />
                </a>
                {index === 0 && (
                  <div className="minimal-tfn-extension">
                    <div className="minimal-tfn-extension__copy">
                      <p className="minimal-kicker">DRAW WITH TANDA / TOOTH FAIRY NETWORK</p>
                      <h4>Draw together. Keep the story.</h4>
                      <p>
                        A parent-and-child drawing channel from Tooth Fairy Network. {DRAW_WITH_TANDA_PUBLISHED.length} guided drawing {DRAW_WITH_TANDA_PUBLISHED.length === 1 ? 'episode is' : 'episodes are'} public now{DRAW_WITH_TANDA_NEXT ? `; ${DRAW_WITH_TANDA_NEXT.shortTitle} is next` : ''}.
                      </p>
                      <div className="minimal-record-links">
                        <Link
                          href={DRAW_WITH_TANDA_CHANNEL_HREF}
                          className="minimal-text-link"
                          onClick={() => trackSiteEvent('draw_with_tanda_opened', { placement: 'homepage' })}
                        >
                          Explore the channel
                        </Link>
                        <a
                          href={DRAW_WITH_TANDA_LATEST.youtubeHref!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="minimal-text-link"
                          onClick={() => trackSiteEvent('draw_with_tanda_watch_started', {
                            placement: 'homepage',
                            episode: DRAW_WITH_TANDA_LATEST.slug,
                          })}
                        >
                          Watch on YouTube
                        </a>
                      </div>
                      <nav className="minimal-tfn-socials" aria-label="Tooth Fairy Network social channels">
                        {toothFairySocialLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackSiteEvent('tfn_social_opened', {
                              placement: 'homepage',
                              channel: link.label.toLowerCase(),
                            })}
                          >
                            {link.label}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="minimal-tfn-video">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${DRAW_WITH_TANDA_LATEST.youtubeVideoId}`}
                        title={DRAW_WITH_TANDA_LATEST.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
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
            <a href={SOLANA_OBSERVATORY_PROJECT.href} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
              {SOLANA_OBSERVATORY_PROJECT.cta}
            </a>
          </div>
          <a href={SOLANA_OBSERVATORY_PROJECT.href} target="_blank" rel="noopener noreferrer" className="minimal-project-media" aria-label={`Open ${SOLANA_OBSERVATORY_PROJECT.name}`}>
            <Image src={SOLANA_OBSERVATORY_PROJECT.image} alt={SOLANA_OBSERVATORY_PROJECT.alt} fill sizes="(max-width: 760px) 100vw, 58vw" />
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
            {ARCHIVE_SITE_PROJECTS.map((project) => {
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
      </main>

      <SiteFooter />
    </div>
  )
}
