import type { Metadata } from 'next'
import Image from 'next/image'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import {
  DRAW_WITH_TANDA_EPISODES,
  type SiteRelease,
} from '@/content/site-releases'
import { toothFairySocialLinks } from '@/lib/social-links'

export const metadata: Metadata = {
  title: 'Draw with Tanda | Tooth Fairy Network',
  description: 'Parent-and-child guided drawing episodes from Tooth Fairy Network, beginning with Finn the shark and Nori the narwhal.',
  openGraph: {
    title: 'Draw with Tanda | Tooth Fairy Network',
    description: 'Draw together, discover an animal tooth fact, and keep the story.',
    images: ['/projects/tooth-fairy-network/draw-finn-thumbnail.jpg'],
  },
}

const publishedEpisodes = DRAW_WITH_TANDA_EPISODES.filter(
  (episode) => episode.status === 'published' && episode.youtubeVideoId,
)

const VideoObject = publishedEpisodes.map((episode) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: episode.title,
  description: episode.description,
  thumbnailUrl: [`https://sathian.ai${episode.image}`],
  uploadDate: episode.publishedAt,
  embedUrl: `https://www.youtube.com/embed/${episode.youtubeVideoId}`,
  contentUrl: episode.youtubeHref,
}))

export default function DrawWithTandaPage() {
  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(VideoObject) }}
        />

        <header className="minimal-channel-hero minimal-container">
          <div className="minimal-channel-hero__identity">
            <Image
              src="/projects/tooth-fairy-network/tanda-profile.png"
              alt="Tanda, the Tooth Fairy Network guide"
              width={72}
              height={72}
              priority
            />
            <p className="minimal-kicker">TOOTH FAIRY NETWORK / FAMILY DRAWING CHANNEL</p>
          </div>
          <h1>Draw with Tanda.</h1>
          <p>
            Pick an animal, learn the strange thing about its teeth, and draw it together. The finished picture becomes part of the family story.
          </p>
          <div className="minimal-channel-hero__actions">
            <a href="https://toothfairy.network/draw" target="_blank" rel="noopener noreferrer" className="minimal-button-link">
              Open the TFN activity hub
            </a>
            <a href="https://www.youtube.com/@ToothFairy-Network" target="_blank" rel="noopener noreferrer" className="minimal-text-link">
              Visit the YouTube channel
            </a>
          </div>
        </header>

        <section className="minimal-channel-releases minimal-container" aria-labelledby="episodes-heading">
          <div className="minimal-section-heading minimal-section-heading--stacked">
            <div>
              <p className="minimal-kicker">RELEASE LEDGER</p>
              <h2 id="episodes-heading">
                {publishedEpisodes.length} {publishedEpisodes.length === 1 ? 'episode' : 'episodes'}. Draw together.
              </h2>
            </div>
            <p>Every episode stays tied to its actual publication state.</p>
          </div>

          <div className="minimal-channel-list">
            {DRAW_WITH_TANDA_EPISODES.map((episode) => (
              <Episode key={episode.id} episode={episode} />
            ))}
          </div>
        </section>

        <section className="minimal-channel-about minimal-container" aria-labelledby="channel-purpose">
          <p className="minimal-kicker">WHY IT BELONGS HERE</p>
          <h2 id="channel-purpose">A doorway into Tooth Fairy Network.</h2>
          <div>
            <p>
              Draw with Tanda turns a passive video into something a child made with a parent. It introduces the Tooth Fairy Network world through play before asking a family to preserve anything.
            </p>
            <p>
              New episodes can be published by updating one release record. The homepage, this channel page, search metadata, and Sathian&apos;s site agent all read from that same public record.
            </p>
          </div>
        </section>

        <section className="minimal-channel-social minimal-container" aria-labelledby="official-tfn-channels">
          <div>
            <p className="minimal-kicker">FOLLOW THE BUILD</p>
            <h2 id="official-tfn-channels">Official Tooth Fairy Network channels</h2>
          </div>
          <nav className="minimal-tfn-socials" aria-label="Official Tooth Fairy Network channels">
            {toothFairySocialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Episode({ episode }: { episode: SiteRelease }) {
  const published = episode.status === 'published' && episode.youtubeVideoId && episode.youtubeHref

  return (
    <article id={episode.slug} className={`minimal-channel-episode minimal-channel-episode--${episode.status}`}>
      <div className="minimal-channel-episode__copy">
        <p className="minimal-kicker">
          EPISODE {episode.episode} / {published ? 'WATCH NOW' : 'Next release'}
        </p>
        <h3>{episode.shortTitle}</h3>
        <p>{episode.description}</p>
        {published ? (
          <div className="minimal-record-links">
            <a href={episode.youtubeHref!} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
              Watch on YouTube
            </a>
            <a href={`https://toothfairy.network/draw/${episode.slug === 'nori-the-narwhal' ? 'narwhal' : 'shark'}`} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
              Open the drawing activity
            </a>
          </div>
        ) : (
          <p className="minimal-channel-episode__status">
            Approved master prepared. A public player will appear here only after the real YouTube release is available.
          </p>
        )}
      </div>

      <div className="minimal-channel-episode__media">
        {published ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${episode.youtubeVideoId}`}
            title={episode.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <Image src={episode.image} alt={episode.imageAlt} fill sizes="(max-width: 760px) 100vw, 54vw" />
        )}
      </div>
    </article>
  )
}
