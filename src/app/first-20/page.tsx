import type { Metadata } from 'next'
import Image from 'next/image'

import { FirstTwentyForm } from '@/components/FirstTwentyForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedLink } from '@/components/TrackedLink'
import { PROOF } from '@/content/proof'

// Unlisted page for people the owner meets in person (Luma events). Not in the nav or sitemap.
const GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=first20'

export const metadata: Metadata = {
  title: { absolute: 'The First 20 | Sathian' },
  description: 'For people I meet in person: a free Proof for a special child in your life, in return for your honest feedback.',
  alternates: { canonical: '/first-20' },
  robots: { index: false, follow: false },
}

const LEARN_MORE = [
  {
    kicker: 'WHY I BUILT IT',
    title: 'Watch Proof',
    text: 'The story behind Tooth Fairy Network, in short films.',
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
    title: 'See the gift',
    text: 'A printed Proof, plus US$10 in their own savings.',
    href: GIFT_HREF,
    event: 'gift_cta_clicked',
    image: '/projects/tooth-fairy-network/family-storybook-hero.webp',
    alt: 'Tanda the tooth fairy beside a glowing Proof',
  },
] as const

export default function FirstTwentyPage() {
  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />

      <main className="about-page">
        <header className="about-hero minimal-container">
          <div className="about-hero__copy">
            <p className="minimal-kicker">THE FIRST 20 / FOR PEOPLE I MEET</p>
            <h1>Glad we met.</h1>
            <p className="about-lead">
              I&apos;m Sathian, a dad and a builder in Toronto. I made Tooth Fairy Network for my own kids.
              It&apos;s a gift that belongs to the child. The parent holds the key.
            </p>
            <div className="about-actions">
              <a href="#ask" className="about-button about-button--primary">Ask for a free Proof</a>
              <TrackedLink href={PROOF.href} event="proof_opened" placement="first20_hero" className="about-button">
                Why I built it
              </TrackedLink>
            </div>
          </div>
          <Image
            className="about-hero__portrait"
            src="/sathian-portrait.webp"
            alt="Pencil portrait of Sathian Srikrishnan"
            width={720}
            height={720}
            sizes="(max-width: 760px) 160px, 340px"
            priority
          />
        </header>

        <section className="minimal-section minimal-container about-story" aria-labelledby="first20-why">
          <h2 id="first20-why">Why I built it</h2>
          <p>
            I&apos;m divorced, and I&apos;m very much in my kids&apos; lives. A lot of kids grow up like mine.
            The people who love them don&apos;t all live under one roof.
          </p>
          <p>
            Dads, moms, aunts, uncles and grandparents still want to be part of their days.
            Tech can help us show up, even from far away.
          </p>
          <p>
            So I built a gift that stays with the child. A printed Proof with their drawing or your photo.
            Savings that are theirs. Anyone who loves them can add to it with a gift of their own.
          </p>
        </section>

        <section className="minimal-section minimal-container about-story" aria-labelledby="first20-offer">
          <h2 id="first20-offer">My offer to the first 20</h2>
          <p>
            Is there a special child in your life? Maybe you&apos;re their aunt, uncle or godparent.
            Maybe you&apos;re their parent. I&apos;ll make them a Proof for free. No strings.
          </p>
          <p>
            All I ask is your honest feedback. Tell me what works and what doesn&apos;t.
            A review would mean a lot, but it&apos;s up to you. If you post one, please say your Proof was free.
          </p>
        </section>

        <section id="ask" className="minimal-section minimal-container" aria-labelledby="first20-ask">
          <h2 id="first20-ask">Ask for a free Proof</h2>
          <FirstTwentyForm />
        </section>

        <section className="minimal-section minimal-container" aria-labelledby="first20-more">
          <h2 id="first20-more">Learn more</h2>
          <div className="about-cards">
            {LEARN_MORE.map((card) => (
              <TrackedLink key={card.title} href={card.href} event={card.event} placement="first20_learn_more" className="about-card">
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
