import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NetworkBenefits } from '@/components/NetworkBenefits'
import { VillageForm } from '@/components/VillageForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { TrackedLink } from '@/components/TrackedLink'
import { PROOF } from '@/content/proof'

const GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=village'
export const metadata: Metadata = {
  title: { absolute: "Tooth Fairy Network | A parent-controlled child's network" },
  description: 'Give a child you love a printed Proof of Growth and a parent-controlled digital wallet. Ask Sathian for a free printed Proof with US$10 to start.',
  alternates: { canonical: '/village' },
  robots: { index: true, follow: true },
  openGraph: { title: "A child’s network, led by their parent.", description: 'Parents choose the network. A printed Proof, a personal note and US$10 to start.', url: 'https://sathian.ai/village', images: [{ url: '/village/network-oct31/01-network-circle.webp', width: 1536, height: 1024, alt: 'A village of loved ones around a child' }] },
  twitter: { card: 'summary_large_image', title: "A child’s network, led by their parent.", description: 'A printed Proof and a first wallet, with the parent holding the key.', images: ['/village/network-oct31/01-network-circle.webp'] },
}

const STEPS = [
  ['You ask', 'Tell me who you are to the child. Please leave the child’s name and photos out of this form.'],
  ['We make it theirs', 'I’ll get in touch. We choose artwork or a photo and a note from you.'],
  ['The parent says yes', 'The parent chooses who joins the child’s network and accepts the gift.'],
  ['Their network can add', 'A lost tooth. A birthday. A first bike ride. Loved ones can give again.'],
] as const

export default function VillagePage() {
  return <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
    <SiteNav />
    <main className="about-page village-page">
      <header className="about-hero village-hero minimal-container">
        <div className="about-hero__copy">
          <p className="minimal-kicker">THE CHILD’S VILLAGE / TOOTH FAIRY NETWORK</p>
          <h1>A child’s network, led by their parent.</h1>
          <p className="about-lead">Tooth Fairy Network brings the people who love a child together. The parent decides who joins.</p>
          <NetworkBenefits />
          <p>A free printed Proof and US$10 to start. For the child you love, near or far.</p>
          <div className="about-actions"><a href="#ask" className="about-button about-button--primary">Ask for a free gift</a><a href="#the-gift" className="about-button">See what they get</a></div>
          <p className="first20-note">I’m Sathian, a dad in Toronto. Try it and tell me what you think.</p>
        </div>
        <Image className="first20-hero-photo" src="/village/network-oct31/01-network-circle.webp" alt="Childlike illustration of a girl holding Proof of Growth, four adults holding Proof of Love and Tanda beside a piggy bank" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 600px" priority />
      </header>

      <section id="the-gift" className="minimal-section minimal-container" aria-labelledby="gift-title">
        <h2 id="gift-title">What the child gets</h2>
        <figure className="network-product-display"><Image src="/village/network-oct31/04-product-glass-table-concept.webp" alt="Illustrative gift presentation: Proof of Growth and Proof of Love designs on a glass table, a piggy bank and a sample digital wallet screen" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 1100px" /><figcaption>Illustrative gift presentation.</figcaption></figure>
        <div className="village-product-grid network-product-details">
          <div><h3>A printed Proof of Growth</h3><p>Their artwork or your photo, with your note inside. A keepsake to hold and read again.</p></div>
          <div><h3>A note from someone who cares</h3><p>A message that marks a small moment. Even when you live far away.</p></div>
          <div><h3>A first digital wallet</h3><p>US$10 to start. The parent holds the key and can take money out.</p></div>
        </div>
      </section>

      <section className="minimal-section minimal-container village-story-grid" aria-labelledby="village-roles">
        <Image src="/village/network-oct31/03-network-village-path.webp" alt="Childlike illustration of Tanda connecting four family homes to a girl holding Proof of Growth, with the parent holding the key" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 600px" />
        <div><h2 id="village-roles">A network chosen by the parent.</h2><p>Aunts. Uncles. Grandparents. Godparents. Friends. The people who show up for a child.</p><p><strong>You give.</strong> A picture, a note and a gift.</p><p><strong>The parent holds the key.</strong> They choose who joins the child’s network, accept the gift and control the wallet.</p><p><strong>The child gets a keepsake.</strong> Each gift marks a moment in their life.</p><p>Tanda brings the Tooth Fairy story to life. Think of a village: real people who care, brought together in a network the parent chooses.</p></div>
      </section>

      <section className="minimal-section minimal-container" aria-labelledby="steps-title"><h2 id="steps-title">From their network to their shelf</h2><ol className="village-steps">{STEPS.map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

      <section className="minimal-section minimal-container village-story-grid" aria-labelledby="grow-title">
        <div><h2 id="grow-title">Keep the artwork. Add to the story.</h2><p>The tiny hands get bigger. The artwork changes. Each Proof gives that moment a place to stay.</p><p>New gifts can add to the same wallet. Here’s a simple example of gifts adding up.</p><ol className="village-deposits"><li>First gift <strong>US$10</strong></li><li>Another US$10 gift <strong>US$20</strong></li><li>A US$5 gift <strong>US$25</strong></li></ol><p className="first20-note">Gift totals shown before any fees or changes in value. This is an example, not a forecast.</p><p>The wallet uses digital money on Solana. Fees and risks apply. <a href={GIFT_HREF}>Read the gift details and FAQ</a>.</p></div>
        <figure><Image src="/village/network-oct31/02-network-picnic.webp" alt="Childlike illustration of a family picnic: a girl holds Proof of Growth, adults hold Proof of Love and Tanda brings a gift to the piggy bank" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 600px" /><figcaption>A small moment, shared by their network.</figcaption></figure>
      </section>

      <section className="minimal-section minimal-container village-founder" aria-labelledby="why-title"><Image src="/sathian-portrait.webp" alt="Pencil portrait of Sathian" width={160} height={160} unoptimized loading="eager" /><div><p className="minimal-kicker">A NOTE FROM SATHIAN</p><h2 id="why-title">I built it for my kids first.</h2><p>I’m a dad and a builder in Toronto. The people who love a child don’t all live in one home. I wanted a way for them to give, and for the child to keep the story.</p><TrackedLink href={PROOF.href} event="proof_opened" placement="village_founder" className="minimal-text-link">Watch why I built Proof</TrackedLink></div></section>

      <section id="ask" className="minimal-section minimal-container village-request" aria-labelledby="ask-title"><div><h2 id="ask-title">Ask for a free gift</h2><p>I’ll print a Proof and start the wallet with US$10. Leave your details and I’ll get in touch to work out the next steps.</p><p>I’d love your honest feedback. A public review is your choice. If you write one, please say the gift was free.</p><p className="first20-note">This is a request, not a checkout. Please share only your own contact details here. <Link href="/privacy">Privacy</Link></p></div><VillageForm /></section>

      <section className="minimal-section minimal-container village-next" aria-labelledby="next-title"><h2 id="next-title">More from Tooth Fairy Network</h2><div className="village-next-links"><TrackedLink href="/learn" event="learn_opened" placement="village_footer">Free stories and money lessons with Tanda →</TrackedLink><TrackedLink href={GIFT_HREF} event="gift_cta_clicked" placement="village_footer">See the paid gift and full details →</TrackedLink></div><details><summary>Coming next: the Proof of Growth app</summary><p>I’m building a way to save growth moments and gifts in one place. Planned for Meta glasses, Apple iPhone and Google Android. The app is not public yet, and no launch date is set.</p></details></section>
    </main><SiteFooter />
  </div>
}
