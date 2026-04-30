'use client'

import Link from 'next/link'
import {
  allTraditionsForGlobe,
  allTraditionImages,
} from '@/data/wall-cards'
import { FEATURED_STORIES } from '@/data/stories'
import { TfnGlobe } from '@/components/toothfairy/stories/tfn-globe'
import { PhotoBorder } from '@/components/toothfairy/stories/photo-border'

/* ─── Local cream palette (matches landing/Impeccable) ────────────────── */
const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldHover:  'oklch(62% 0.13 72)',
  border:     'oklch(88% 0.015 75)',
}

// Cover images for the three live stories — matches the landing page
// choices so the featured grid reads as the same trilogy across the site.
// Keys are StoryConfig.id values from FEATURED_STORIES.
const COVERS: Record<string, { cover: string; minutes: string }> = {
  'tanda':            { cover: '/story-assets/tanda/tf-05-tanda.png',            minutes: '4 min read' },
  'viking-origin':    { cover: '/story-assets/viking-origin/vo-01-village.png',  minutes: '5 min read' },
  'ratoncito-perez':  { cover: '/story-assets/ratoncito-perez/rp-02-mouse.png',  minutes: '4 min read' },
}

export default function StoriesPage() {
  const markers = allTraditionsForGlobe()
  const thumbnails = allTraditionImages()
  const totalTraditions = markers.length

  return (
    <main
      style={{
        background: c.cream,
        minHeight: '100vh',
        fontFamily: 'var(--font-body)',
        color: c.brown,
      }}
    >
      {/* Back nav */}
      <nav
        style={{
          padding: '1.25rem 1.5rem 0',
          maxWidth: '72rem',
          margin: '0 auto',
        }}
      >
        <Link
          href="/toothfairy"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: c.gold,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 500,
          }}
        >
          &larr; Back
        </Link>
      </nav>

      {/* Header */}
      <header
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
          padding: '3rem 1.5rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)',
            fontWeight: 500,
            color: c.brown,
            lineHeight: 1.08,
            margin: '0 0 0.9rem',
            letterSpacing: '-0.012em',
          }}
        >
          Stories from around the world
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
            fontStyle: 'italic',
            color: c.gold,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Every tooth tells a story.
        </p>
        <div
          style={{
            width: 48,
            height: 2,
            background: c.gold,
            margin: '1.75rem auto 0',
            borderRadius: 999,
          }}
          aria-hidden
        />
      </header>

      {/* 50 traditions — minimal stat at top */}
      <div
        style={{
          textAlign: 'center',
          padding: '0 1.5rem 2.5rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: c.brownMuted,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        {totalTraditions} traditions
      </div>

      {/* ── Active stories (moved to top) ────────────────────────────── */}
      <section
        style={{
          padding: '0 1.5rem 5rem',
          maxWidth: '72rem',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: c.gold,
            fontWeight: 500,
            textAlign: 'center',
            margin: '0 0 0.75rem',
          }}
        >
          Begin reading
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 500,
            color: c.brown,
            textAlign: 'center',
            margin: '0 0 2.5rem',
            letterSpacing: '-0.005em',
          }}
        >
          Active stories
        </h2>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            maxWidth: '64rem',
            margin: '0 auto',
          }}
        >
          {FEATURED_STORIES.map((story) => {
            const meta = COVERS[story.id] || {
              cover: story.scenes[0]?.background || '/story-assets/placeholder-gold.svg',
              minutes: '',
            }
            return (
              <Link
                key={story.id}
                href={`/toothfairy/story/${story.id}`}
                aria-label={`Begin reading ${story.title}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <ActiveStoryCard
                  title={story.title}
                  region={story.region}
                  cover={meta.cover}
                  minutes={meta.minutes}
                  description={story.description}
                />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Hairline divider */}
      <div
        style={{
          maxWidth: '56rem',
          height: 1,
          background: c.border,
          margin: '0 auto',
        }}
      />

      {/* ── Explore — globe + photo border ───────────────────────────── */}
      <section
        style={{
          padding: '4.5rem 1.5rem 2.5rem',
          maxWidth: '72rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: c.gold,
            fontWeight: 500,
            margin: '0 0 0.75rem',
          }}
        >
          Explore the world
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 500,
            color: c.brown,
            margin: '0 0 1rem',
            letterSpacing: '-0.005em',
          }}
        >
          {totalTraditions} golden traditions
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontStyle: 'italic',
            color: c.brownSoft,
            maxWidth: '44ch',
            margin: '0 auto 3rem',
            lineHeight: 1.45,
          }}
        >
          In Spain a mouse. In Korea a magpie. In Ethiopia a hyena.
          One ritual, a hundred shapes.
        </p>

        <div style={{ padding: '1rem 0 2rem' }}>
          <PhotoBorder thumbnails={thumbnails}>
            <TfnGlobe markers={markers} size={420} />
          </PhotoBorder>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem 3rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: c.brownMuted,
          borderTop: `1px solid ${c.border}`,
          background: c.creamDeep,
          marginTop: '2rem',
        }}
      >
        Made with love on Tooth Fairy Network
      </footer>
    </main>
  )
}

/* ─── Active story card (inline) ───────────────────────────────────── */

function ActiveStoryCard({
  title,
  region,
  cover,
  minutes,
  description,
}: {
  title: string
  region: string
  cover: string
  minutes: string
  description: string
}) {
  return (
    <article
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: c.cream,
        borderRadius: 24,
        overflow: 'hidden',
        border: `1px solid ${c.border}`,
        boxShadow: '0 4px 18px oklch(30% 0.035 65 / 0.08), 0 1px 4px oklch(30% 0.035 65 / 0.06)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 44px oklch(30% 0.035 65 / 0.18), 0 4px 12px oklch(30% 0.035 65 / 0.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 18px oklch(30% 0.035 65 / 0.08), 0 1px 4px oklch(30% 0.035 65 / 0.06)'
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/5',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={`${title} — ${region}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Bottom gradient for title legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, oklch(30% 0.035 65 / 0.85) 0%, oklch(30% 0.035 65 / 0.25) 38%, transparent 58%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '1.25rem 1.25rem 1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'oklch(92% 0.04 80)',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
              margin: '0 0 0.35rem',
              fontWeight: 600,
            }}
          >
            {region}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.4vw, 1.75rem)',
              fontWeight: 600,
              color: 'oklch(98% 0.005 80)',
              margin: 0,
              lineHeight: 1.08,
              textShadow: '0 2px 16px rgba(0,0,0,0.45)',
              letterSpacing: '-0.005em',
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem 1.4rem 1.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            lineHeight: 1.55,
            color: c.brownSoft,
            margin: '0 0 1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: c.gold,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Begin reading <span aria-hidden>&rarr;</span>
          </span>
          {minutes && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: c.brownMuted,
                fontStyle: 'italic',
              }}
            >
              {minutes}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
