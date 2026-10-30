import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { VillageForm } from '@/components/VillageForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedLink } from '@/components/TrackedLink'
import { PROOF } from '@/content/proof'

const GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=village'
export const metadata: Metadata = {
  title: { absolute: "A child's village | A printed Proof and first wallet | Sathian" },
  description: 'Give a child you love a printed Proof of Growth and a parent-controlled digital wallet. Ask Sathian for a free printed Proof with US$10 to start.',
  alternates: { canonical: '/village' },
  robots: { index: true, follow: true },
  openGraph: { title: "Are you part of a child's village?", description: 'A book to hold. A note from you. US$10 to start.', url: 'https://sathian.ai/village', images: [{ url: '/village/village-hands.webp', width: 687, height: 463, alt: 'A village of loved ones around a child' }] },
  twitter: { card: 'summary_large_image', title: "Are you part of a child's village?", description: 'A printed Proof and a first wallet, with the parent holding the key.', images: ['/village/village-hands.webp'] },
}

const STEPS = [
  ['You ask', 'Tell me who you are to the child. Please leave the child’s name and photos out of this form.'],
  ['We make it theirs', 'I’ll get in touch. We choose a drawing or photo and a note from you.'],
  ['The parent says yes', 'The parent accepts the gift and holds the wallet key.'],
  ['The village can add', 'A lost tooth. A birthday. A first bike ride. Loved ones can give again.'],
] as const

export default function VillagePage() {
  return <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
    <SiteNav />
    <main className="about-page village-page">
      <header className="about-hero village-hero minimal-container">
        <div className="about-hero__copy">
          <p className="minimal-kicker">A CHILD’S VILLAGE / TOOTH FAIRY NETWORK</p>
          <h1>Are you part of a child&apos;s village?</h1>
          <p className="about-lead">A book they can hold. A note from you. A first wallet with US$10 to start.</p>
          <p>For the child you love, near or far. Their parent holds the key.</p>
          <div className="about-actions"><a href="#ask" className="about-button about-button--primary">Ask for a free gift</a><a href="#the-gift" className="about-button">See what they get</a></div>
          <p className="first20-note">I’m Sathian, a dad in Toronto. Try it and tell me what you think.</p>
        </div>
        <Image className="first20-hero-photo" src="/village/village-hands.webp" alt="Marker-style illustration of loved ones holding hands around a child, with Tanda and a piggy bank" width={687} height={463} sizes="(max-width: 760px) 100vw, 600px" priority />
      </header>

      <section id="the-gift" className="minimal-section minimal-container" aria-labelledby="gift-title">
        <p className="minimal-kicker">SOMETHING TO KEEP / SOMETHING TO BUILD ON</p>
        <h2 id="gift-title">What the child gets</h2>
        <div className="village-product-grid">
          <figure><Image src="/village/proof-in-hand.webp" alt="A real printed Proof held in a hand, with a tooth-fairy drawing; personal details are blurred" width={1105} height={1600} sizes="(max-width: 760px) 100vw, 360px" /><figcaption><h3>A book of their own</h3><p>A printed Proof of Growth. Their art or your photo goes on it.</p><small>Real print. An earlier cover design.</small></figcaption></figure>
          <figure><Image src="/village/sample-inside-wallet.webp" alt="Sample inside page with a note from Tanda about a gift from Aunt Jo" width={638} height={1032} sizes="(max-width: 760px) 100vw, 360px" /><figcaption><h3>Your words, kept</h3><p>Leave a note they can read again. Even when you live far away.</p><small>Sample design with made-up details.</small></figcaption></figure>
          <figure><Image src="/village/sample-certificate.webp" alt="Sample certificate showing US$10 in digital dollars; marked sandbox demonstration, no real gift" width={1031} height={1276} sizes="(max-width: 760px) 100vw, 360px" /><figcaption><h3>A first digital wallet</h3><p>US$10 to start. The parent holds the key and can take money out.</p><small>Sample certificate. Not a live balance.</small></figcaption></figure>
        </div>
      </section>

      <section className="minimal-section minimal-container village-story-grid" aria-labelledby="village-roles">
        <Image src="/village/village-map.webp" alt="Marker-style village map with paths from family homes to a child and piggy bank" width={687} height={463} sizes="(max-width: 760px) 100vw, 600px" />
        <div><p className="minimal-kicker">YOU DON’T HAVE TO LIVE NEXT DOOR</p><h2 id="village-roles">You’re part of their village.</h2><p>Aunts. Uncles. Grandparents. Godparents. Friends. The people who show up for a child.</p><p><strong>You give.</strong> A picture, a note and a gift.</p><p><strong>The parent holds the key.</strong> They accept the gift and control the wallet.</p><p><strong>The child gets a keepsake.</strong> Each gift marks a moment in their life.</p><p>Tanda brings the Tooth Fairy story to life. The village is the real people who care.</p></div>
      </section>

      <section className="minimal-section minimal-container" aria-labelledby="steps-title"><h2 id="steps-title">From your village to their shelf</h2><ol className="village-steps">{STEPS.map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

      <section className="minimal-section minimal-container village-story-grid" aria-labelledby="grow-title">
        <div><p className="minimal-kicker">ONE CHILD / MANY SMALL MOMENTS</p><h2 id="grow-title">Keep the drawings. Add to the story.</h2><p>The tiny hands get bigger. The drawings change. Each Proof gives that moment a place to stay.</p><p>New gifts can add to the same wallet. Here’s a simple example of gifts adding up.</p><ol className="village-deposits"><li>First gift <strong>US$10</strong></li><li>Another US$10 gift <strong>US$20</strong></li><li>A US$5 gift <strong>US$25</strong></li></ol><p className="first20-note">Gift totals shown before any fees or changes in value. This is an example, not a forecast.</p><p>The wallet uses digital money on Solana. Fees and risks apply. <a href={GIFT_HREF}>Read the gift details and FAQ</a>.</p></div>
        <figure><Image src="/village/proof-detail.webp" alt="Close-up of the tooth-fairy drawing on a real printed Proof" width={1600} height={1067} sizes="(max-width: 760px) 100vw, 600px" /><figcaption>A drawing from Tanda’s sketchbook, on a real print.</figcaption></figure>
      </section>

      <section className="minimal-section minimal-container village-story-grid" aria-labelledby="art-title">
        <Image src="/village/sample-inside-love.webp" alt="Sample keepsake drawing of an aunt pushing a child on a swing" width={638} height={1032} sizes="(max-width: 760px) 100vw, 420px" />
        <div><p className="minimal-kicker">THE PEOPLE IN THEIR STORY</p><h2 id="art-title">“Auntie and me.”</h2><p>A day at the park. A visit from Grandma. A picture made just for you.</p><p>Start with a moment that matters to both of you. Then give it a home in their book.</p><p className="first20-note">Sample artwork from Tanda’s sketchbook. The names are made up.</p><a href="#ask" className="about-button">Let’s make their first Proof</a></div>
      </section>

      <section className="minimal-section minimal-container village-founder" aria-labelledby="why-title"><Image src="/sathian-portrait.webp" alt="Pencil portrait of Sathian" width={160} height={160} unoptimized loading="eager" /><div><p className="minimal-kicker">A NOTE FROM SATHIAN</p><h2 id="why-title">I built it for my kids first.</h2><p>I’m a dad and a builder in Toronto. The people who love a child don’t all live in one home. I wanted a way for them to give, and for the child to keep the story.</p><TrackedLink href={PROOF.href} event="proof_opened" placement="village_founder" className="minimal-text-link">Watch why I built Proof</TrackedLink></div></section>

      <section id="ask" className="minimal-section minimal-container village-request" aria-labelledby="ask-title"><div><p className="minimal-kicker">TRY IT / TELL ME WHAT YOU THINK</p><h2 id="ask-title">Ask for a free gift</h2><p>I’ll print a Proof and start the wallet with US$10. Leave your details and I’ll get in touch to work out the next steps.</p><p>I’d love your honest feedback. A public review is your choice. If you write one, please say the gift was free.</p><p className="first20-note">This is a request, not a checkout. Please share only your own contact details here. <Link href="/privacy">Privacy</Link></p></div><VillageForm /></section>

      <section className="minimal-section minimal-container village-next" aria-labelledby="next-title"><h2 id="next-title">More from the village</h2><div className="village-next-links"><TrackedLink href="/learn" event="learn_opened" placement="village_footer">Free stories and money lessons with Tanda →</TrackedLink><TrackedLink href={GIFT_HREF} event="gift_cta_clicked" placement="village_footer">See the paid gift and full details →</TrackedLink></div><details><summary>Coming next: the village app</summary><p>I’m building a way to save growth moments and gifts in one place. The app is not public yet. There’s no launch date to promise.</p></details></section>
    </main><SiteFooter />
  </div>
}
