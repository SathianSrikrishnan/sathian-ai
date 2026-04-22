'use client'

import Link from 'next/link'
import {
  wallCards,
  allTraditionsForGlobe,
  allTraditionImages,
} from '@/data/wall-cards'
import { TfnGlobe } from '@/components/toothfairy/stories/tfn-globe'
import { PhotoBorder } from '@/components/toothfairy/stories/photo-border'
import { StoriesLegend } from '@/components/toothfairy/stories/stories-legend'
import { C, ds } from '@/components/toothfairy/tokens'

export default function StoriesPage() {
  const markers = allTraditionsForGlobe()
  const thumbnails = allTraditionImages()
  const featured = wallCards.filter((c) => c.featured)

  const totalTraditions = markers.length
  const activeStories = wallCards.filter((c) => c.linkedFullStory).length
  const comingSoon = totalTraditions - activeStories

  return (
    <main>
      {/* Minimal nav */}
      <nav
        style={{
          padding: '1rem 1.5rem',
          maxWidth: '72rem',
          margin: '0 auto',
        }}
      >
        <Link
          href="/toothfairy/concept-b"
          style={{
            fontFamily: ds.fonts.body,
            fontSize: '0.9rem',
            color: C.gold,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
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
          padding: '2rem 1.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: ds.fonts.headline,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.15,
            margin: '0 0 0.75rem',
          }}
        >
          Stories from Around the World
        </h1>
        <p
          style={{
            fontFamily: ds.fonts.body,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontStyle: 'italic',
            color: C.dim,
            margin: 0,
          }}
        >
          Every tooth tells a story.
        </p>
      </header>

      {/* Globe + photo border */}
      <section
        style={{
          padding: '2rem 1rem 3rem',
          maxWidth: '72rem',
          margin: '0 auto',
        }}
      >
        <PhotoBorder thumbnails={thumbnails}>
          <TfnGlobe markers={markers} size={420} />
        </PhotoBorder>
      </section>

      {/* Stats */}
      <div
        style={{
          textAlign: 'center',
          padding: '1rem 1.5rem 2.5rem',
          fontFamily: ds.fonts.body,
          fontSize: '0.95rem',
          color: C.dim,
          letterSpacing: '0.04em',
        }}
      >
        {totalTraditions} traditions <Bullet /> {activeStories} stories live{' '}
        <Bullet /> {comingSoon} more coming
      </div>

      {/* Hairline divider */}
      <div
        style={{
          maxWidth: '56rem',
          height: 1,
          background: C.border,
          margin: '0 auto',
        }}
      />

      {/* Active stories legend */}
      <section
        style={{
          padding: '3rem 1.5rem',
          maxWidth: '72rem',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: ds.fonts.headline,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: C.gold,
            textAlign: 'center',
            margin: '0 0 1.75rem',
            letterSpacing: '0.02em',
          }}
        >
          Active Stories
        </h2>
        <StoriesLegend stories={featured} />
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '2rem 1.5rem 3rem',
          fontFamily: ds.fonts.body,
          fontSize: '0.85rem',
          color: C.dim,
        }}
      >
        Made with love on Tooth Fairy Network
      </footer>
    </main>
  )
}

function Bullet() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'oklch(78% 0.14 80 / 0.5)',
        margin: '0 0.75rem',
        verticalAlign: 'middle',
      }}
    />
  )
}
