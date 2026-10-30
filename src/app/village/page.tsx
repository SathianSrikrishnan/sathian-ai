import type { Metadata } from 'next'
import Image from 'next/image'

import { VillageForm } from '@/components/VillageForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedLink } from '@/components/TrackedLink'
import { PROOF } from '@/content/proof'

// Unlisted offer page for people the owner meets in person or online (Luma, events). Not in the nav or sitemap.
const GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=village'
// Set to the owner's short video message once it is recorded; the section stays hidden until then.
const WELCOME_VIDEO = ''

export const metadata: Metadata = {
  title: { absolute: 'Are you part of a child’s village? | Sathian' },
  description: 'It takes a village to raise a child. Give a child you love a printed Proof and their own savings wallet, free. The child keeps it for life. The parent holds the key.',
  alternates: { canonical: '/village' },
  robots: { index: false, follow: false },
}

const GETS = [
  'A printed Proof to keep on their shelf, with their drawing or your photo and your note.',
  'Their own savings wallet, started with US$10. It belongs to the child for life.',
  'A code on the Proof that opens the wallet. The parent holds the key.',
]

const LEARN_MORE = [
  {
    kicker: 'WHY I BUILT IT',
    title: 'Watch Proof',
    text: 'The story behind it, in short films.',
    href: PROOF.href,
    event: 'proof_opened',
    image: '/proof-assets/product-samples-20261028/sample-front.webp',
    alt: 'A crayon sketch of Tanda the tooth fairy dropping a coin into a piggy bank',
  },
  {
    kicker: 'FOR FAMILIES',
    title: 'Learn with Tanda',
    text: 'Free stories and short lessons about money, for kids and grown-ups.',
    href: '/learn',
    event: 'learn_opened',
    image: '/learn-art/classroom-master.webp',
    alt: 'Tanda teaching a family about saving and digital money',
  },
  {
    kicker: 'THE GIFT',
    title: 'See the full gift',
    text: 'How it works, what it costs and common questions.',
    href: GIFT_HREF,
    event: 'gift_cta_clicked',
    image: '/projects/tooth-fairy-network/family-storybook-hero.webp',
    alt: 'Tanda the tooth fairy beside a glowing Proof',
  },
] as const

export default function VillagePage() {
  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />

      <main className="about-page">
        <header className="about-hero minimal-container">
          <div className="about-hero__copy">
            <p className="minimal-kicker">THE VILLAGE / A FREE GIFT FROM SATHIAN</p>
            <h1>Are you part of a child&apos;s village?</h1>
            <p className="about-lead">
              It takes a village to raise a child. Give one you love their own savings, free.
              I&apos;ll print them a Proof and start their savings wallet. The child keeps it for life.
              The parent holds the key. You&apos;re the giver.
            </p>
            <div className="about-actions">
              <a href="#ask" className="about-button about-button--primary">Ask for a free gift</a>
              <TrackedLink href={PROOF.href} event="proof_opened" placement="village_hero" className="about-button">
                Why I built it
              </TrackedLink>
            </div>
          </div>
          <Image
            className="about-hero__portrait first20-hero-photo"
            src="/village/proof-my-tooth.webp"
            alt="A printed Proof of Growth with a child's drawing called My Tooth"
            width={805}
            height={1200}
            sizes="(max-width: 760px) 200px, 340px"
            priority
          />
        </header>

        {WELCOME_VIDEO && (
          <section className="minimal-section minimal-container" aria-labelledby="first20-video">
            <h2 id="first20-video">A quick hello</h2>
            <video className="first20-video" src={WELCOME_VIDEO} controls playsInline preload="metadata" />
          </section>
        )}

        <section className="minimal-section minimal-container" aria-labelledby="first20-gets">
          <h2 id="first20-gets">What the child gets</h2>
          <div className="first20-gets">
            <ul>
              {GETS.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <Image
              src="/village/proof-fathers-day.webp"
              alt="A printed Proof of Growth held in a hand. Names and the code are hidden."
              width={900}
              height={1184}
              sizes="(max-width: 760px) 100vw, 320px"
            />
          </div>
          <p className="first20-note">Real Proofs I&apos;ve printed. Names and codes are hidden.</p>
        </section>

        <section className="minimal-section minimal-container about-story" aria-labelledby="first20-who">
          <h2 id="first20-who">It takes a village</h2>
          <p>
            Parents are busy. I know. I&apos;m one. When it comes to their kids, they count on the people
            closest to them: aunts, uncles, godparents, grandparents and good friends. That&apos;s the village.
          </p>
          <p>
            Tooth Fairy Network connects a child&apos;s village. You give the gift. The parent says yes and holds the key.
            The child keeps it. Anyone in the village can add to it later. Are you a parent? Even better. Ask for your own child.
          </p>
        </section>

        <section className="minimal-section minimal-container about-story" aria-labelledby="first20-why">
          <h2 id="first20-why">Why I built it</h2>
          <p>
            I&apos;m a dad and a builder in Toronto. I&apos;m divorced, and I&apos;m very much in my kids&apos; lives.
            A lot of kids grow up like mine. The people who love them don&apos;t all live under one roof.
          </p>
          <p>
            I built this for my own kids first: one gift they won&apos;t outgrow. Toys get lost. Cash gets spent.
            This stays on their shelf, and the savings stay theirs.
          </p>
        </section>

        <section className="minimal-section minimal-container about-story" aria-labelledby="first20-ask-back">
          <h2 id="first20-ask-back">What I ask in return</h2>
          <p>
            Just your honest feedback. Tell me what works and what doesn&apos;t. Want to post a review?
            That would mean a lot. Please say your gift was free.
          </p>
          <p>
            People who&apos;ve tried it tell me it&apos;s really cool, and the first paying families are coming in.
            An app for Meta glasses is almost ready. I&apos;m open to ideas and partnerships too. Let&apos;s talk.
          </p>
        </section>

        <section id="ask" className="minimal-section minimal-container" aria-labelledby="first20-ask">
          <h2 id="first20-ask">Ask for a free gift</h2>
          <VillageForm />
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="first20-more">
          <h2 id="first20-more">Learn more</h2>
          <div className="about-cards">
            {LEARN_MORE.map((card) => (
              <TrackedLink key={card.title} href={card.href} event={card.event} placement="village_learn_more" className="about-card">
                <span className="about-card__media">
                  <Image src={card.image} alt={card.alt} fill sizes="(max-width: 760px) 100vw, 360px" />
                </span>
                <span className="minimal-kicker">{card.kicker}</span>
                <strong>{card.title}</strong>
                <span className="about-card__text">{card.text}</span>
              </TrackedLink>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
