import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  findTraditionBySlug,
  comingSoonTraditions,
  wallCards,
  type ComingSoonTradition,
  type WallCard,
} from '@/data/wall-cards'
import { getStoryById } from '@/data/stories'
import { C, ds } from '@/components/toothfairy/tokens'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const wcParams = wallCards.map((c) => ({ slug: c.slug }))
  const csParams = comingSoonTraditions.map((t) => ({ slug: t.slug }))
  return [...wcParams, ...csParams]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const found = findTraditionBySlug(slug)
  if (!found) return { title: 'Story Not Found | Tooth Fairy Network' }

  const text =
    found.type === 'wall-card' ? found.data.miniStory : found.data.synopsis
  const description = text.slice(0, 150) + (text.length > 150 ? '…' : '')

  return {
    title: `${found.data.title} | Tooth Fairy Network`,
    description,
  }
}

export default async function ComingSoonStoryPage({ params }: Props) {
  const { slug } = await params
  const found = findTraditionBySlug(slug)

  if (!found) {
    notFound()
  }

  // Active full story → redirect to /toothfairy/story/[id], BUT only when
  // the target story is actually registered in ALL_STORIES. Otherwise the
  // wall-card's `linkedFullStory` points at a slug that 404s, so we fall
  // through and render the mini-story coming-soon view instead.
  if (
    found.type === 'wall-card' &&
    found.data.linkedFullStory &&
    getStoryById(found.data.linkedFullStory)
  ) {
    redirect(`/toothfairy/story/${found.data.linkedFullStory}`)
  }

  // Wall-card without full story (Japan, Mongolia) → render mini-story coming-soon page
  // Coming-soon tradition → render synopsis coming-soon page
  return (
    <main
      style={{
        background: C.bg,
        color: C.text,
        minHeight: '100vh',
      }}
    >
      <Header />

      <article
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem',
        }}
      >
        {found.type === 'wall-card' ? (
          <ContentForWallCard data={found.data} />
        ) : (
          <ContentForComingSoon data={found.data} />
        )}

        <Divider />

        <CtaBlock />

        <Divider />

        <RelatedTraditions currentSlug={slug} />
      </article>

      <Footer />
    </main>
  )
}

// ─── Components ───────────────────────────────────────────

function Header() {
  return (
    <nav
      style={{
        padding: '1rem 1.5rem',
        maxWidth: 920,
        margin: '0 auto',
      }}
    >
      <Link
        href="/toothfairy/stories"
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
        &larr; Back to Stories
      </Link>
    </nav>
  )
}

function ContentForWallCard({ data }: { data: WallCard }) {
  return (
    <>
      <Hero src={data.image} alt={data.title} isPlaceholder={false} />
      <Region region={data.region} />
      <Title title={data.title} />
      <Character name={data.characterName} />
      <Body text={data.miniStory} />
    </>
  )
}

function ContentForComingSoon({ data }: { data: ComingSoonTradition }) {
  return (
    <>
      <Hero
        src="/story-assets/placeholder-gold.svg"
        alt={data.title}
        isPlaceholder
      />
      <Region region={data.region} />
      <Title title={data.title} />
      <Character name={data.characterName} />
      <Body text={data.synopsis} />
    </>
  )
}

function Hero({
  src,
  alt,
  isPlaceholder,
}: {
  src: string
  alt: string
  isPlaceholder: boolean
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto 2rem',
        aspectRatio: '1',
        borderRadius: ds.borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${C.borderGold}`,
        background: C.surface,
        position: 'relative',
        boxShadow: '0 20px 40px oklch(12% 0.04 270 / 0.4)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 480px"
        style={{ objectFit: 'cover' }}
        unoptimized={isPlaceholder || src.endsWith('.svg')}
        priority
      />
    </div>
  )
}

function Region({ region }: { region: string }) {
  return (
    <div
      style={{
        fontFamily: ds.fonts.body,
        fontSize: '0.75rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: C.gold,
        textAlign: 'center',
        marginBottom: '0.5rem',
      }}
    >
      {region}
    </div>
  )
}

function Title({ title }: { title: string }) {
  return (
    <h1
      style={{
        fontFamily: ds.fonts.headline,
        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
        fontWeight: 700,
        color: C.text,
        textAlign: 'center',
        lineHeight: 1.15,
        margin: '0 0 0.4rem',
      }}
    >
      {title}
    </h1>
  )
}

function Character({ name }: { name: string }) {
  return (
    <div
      style={{
        fontFamily: ds.fonts.body,
        fontSize: '0.95rem',
        fontStyle: 'italic',
        color: C.dim,
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      {name}
    </div>
  )
}

function Body({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: ds.fonts.body,
        fontSize: '1.125rem',
        lineHeight: 1.7,
        color: C.text,
        marginBottom: '2rem',
      }}
    >
      {text}
    </p>
  )
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: C.border,
        margin: '2.5rem 0',
        position: 'relative',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: C.bg,
          padding: '0 1rem',
          color: C.gold,
          fontSize: '1rem',
          letterSpacing: '0.4em',
        }}
      >
        &middot; &middot; &middot;
      </span>
    </div>
  )
}

function CtaBlock() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        background: C.surface,
        borderRadius: ds.borderRadius.lg,
        border: `1px solid ${C.borderGold}`,
      }}
    >
      <h2
        style={{
          fontFamily: ds.fonts.headline,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: C.gold,
          margin: '0 0 0.75rem',
        }}
      >
        Story coming soon
      </h2>
      <p
        style={{
          fontFamily: ds.fonts.body,
          fontSize: '1rem',
          lineHeight: 1.6,
          color: C.muted,
          maxWidth: 440,
          margin: '0 auto 1.5rem',
        }}
      >
        This tooth fairy tradition is in the queue. Want to help bring it to life?
      </p>
      <button
        type="button"
        disabled
        style={{
          fontFamily: ds.fonts.body,
          fontSize: '0.95rem',
          fontWeight: 500,
          padding: '0.75rem 1.5rem',
          background: C.goldSoft,
          color: C.gold,
          border: `1px solid ${C.borderGold}`,
          borderRadius: ds.borderRadius.full,
          cursor: 'not-allowed',
          opacity: 0.7,
        }}
      >
        Notify me when this story is ready
      </button>
    </div>
  )
}

function RelatedTraditions({ currentSlug }: { currentSlug: string }) {
  // Pick 3 random coming-soon traditions (excluding current)
  const candidates = comingSoonTraditions.filter((t) => t.slug !== currentSlug)
  const picks = pickRandom(candidates, 3)

  return (
    <section>
      <h3
        style={{
          fontFamily: ds.fonts.headline,
          fontSize: '1.25rem',
          fontWeight: 700,
          color: C.gold,
          textAlign: 'center',
          margin: '0 0 1.5rem',
        }}
      >
        More traditions to discover
      </h3>
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {picks.map((t) => (
          <Link
            key={t.slug}
            href={`/toothfairy/stories/${t.slug}`}
            style={{
              display: 'block',
              padding: '1rem',
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: ds.borderRadius.md,
              textDecoration: 'none',
              transition: 'border-color 0.3s',
            }}
          >
            <div
              style={{
                fontFamily: ds.fonts.body,
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: C.gold,
                marginBottom: 4,
              }}
            >
              {t.region}
            </div>
            <div
              style={{
                fontFamily: ds.fonts.headline,
                fontSize: '1rem',
                fontWeight: 700,
                color: C.text,
              }}
            >
              {t.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
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
  )
}

// ─── Helpers ──────────────────────────────────────────────

function pickRandom<T>(arr: T[], n: number): T[] {
  // Deterministic pick (no Math.random — keeps SSR stable)
  // Use slug-derived hash later if needed; for now take spaced indices.
  if (arr.length <= n) return arr
  const out: T[] = []
  const step = Math.floor(arr.length / n) || 1
  for (let i = 0; i < n; i++) {
    out.push(arr[(i * step) % arr.length])
  }
  return out
}
