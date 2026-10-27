import type { Metadata } from 'next'

import Link from 'next/link'

import { available, lessons } from '@/lib/learn/catalog'

import copy from '@/lib/learn/page-copy.json'

import { LessonCollection } from '@/components/learn/LessonCollection'



import { DrawingShelf } from '@/components/learn/DrawingShelf'
import { StoryShelf } from '@/components/learn/StoryShelf'
import { ClassroomBorder } from '@/components/learn/ClassroomBorder'

import { MeetGuides } from '@/components/learn/MeetGuides'

export const metadata: Metadata = { title: 'Learn with Tanda | PROOF', description: 'Learn, watch, read and draw with Tanda the Tooth Fairy.', alternates: { canonical: 'https://sathian.ai/learn' } }

export default function LearningBoard() {



  return <main className="learn-board learn-review learn-room">

    <nav className="learn-nav" aria-label="Learning navigation"><a href="https://proof.sathian.ai">PROOF</a><a href="https://sathian.ai">sathian.ai</a></nav>

    <ClassroomBorder><header className="learn-feed-heading learn-hero-first"><h1>Learn with Tanda</h1><p className="learn-feed-tagline">Big ideas made simple</p><MeetGuides /><a className="learn-hero-zoom" href="/learn-art/classroom-master.webp" target="_blank" rel="noreferrer" aria-label="View the complete classroom illustration in a new tab"><img className="learn-classroom-art" src="/learn-art/classroom-master.webp" alt="Tanda, Sathian and two children at a classroom board illustrating Dollars (USDC), Bitcoin and SOL, a digital vault screen, a public receiving address, a private key and physical Proof keepsakes." width="1672" height="941" fetchPriority="high" /></a><span className="learn-hero-zoom-note">Tap the illustration to enlarge.</span></header></ClassroomBorder>
    <div className="learn-room-section-line"><h2>More to explore</h2></div>
    <LessonCollection lessons={lessons} readyIds={lessons.filter(available).map(l => l.id)} />

    <StoryShelf />
    <DrawingShelf />

    <div className="learn-play-shelf"><a className="learn-play-card learn-play-planets" href="https://srikrishnan.work/planet-patterns"><div className="learn-play-planets-art"><img src="/learn-art/venus.png" alt="" loading="lazy" /><img src="/learn-art/earth.png" alt="" loading="lazy" /></div><div><p className="learn-resource-title">Planet Patterns</p><span>Try the interactive planet-drawing app.</span></div></a></div>


    <aside className="learn-adult-invitation" aria-label="Gift invitation for adults"><div><p>For grown-ups</p><a className="learn-proof-hub" href="https://proof.sathian.ai">Explore PROOF</a></div><a className="learn-button learn-gift-invitation" href="https://toothfairy.network/give/start">Be the Tooth Fairy</a></aside>


    <details id="parent-context" className="learn-parent-corner"><summary>For parents</summary><p>{copy.activityPurpose}</p><a href="https://toothfairy.network/#home-faq">Tooth Fairy Network FAQ</a><details><summary>Technical fundamentals</summary><p>{copy.lessonPurpose}</p></details>

      <details className="learn-sources"><summary>Questions about the product</summary><p>Family gifts and keepsakes prompted these questions. The product idea is parent-controlled; custody, ownership and privacy need product-specific answers.</p><p>These lessons explain system designs. Product wallet controls, legal rights, recovery, fees, guardian arrangements and physical keepsake terms need their own clear explanation.</p><p>Keys and digital signatures authorize spending. Legal ownership depends on the applicable arrangements and law. Bitcoin confirmations add confidence in a transaction; custody, key access and network-adopted rule changes affect real-world control.</p><p>A public transaction record and an artwork file are different things. The product must explain what is public, who can access files and how those files are protected. USDC has issuer blocklisting, so its controls need a separate explanation.</p><p>Parents can review the current <a href="https://toothfairy.network">Tooth Fairy Network product information</a>. Planned features and product terms need separate review.</p><ul><li><a href="https://bitcoin.org/en/how-it-works">Bitcoin: keys, signatures and records</a></li><li><a href="https://bitcoin.org/en/you-need-to-know">Bitcoin: confirmations and security considerations</a></li><li><a href="https://bitcoincore.org/en/lifecycle/">Bitcoin Core: consensus-rule changes</a></li><li><a href="https://bitcoin.org/en/protect-your-privacy">Bitcoin: public records and privacy</a></li><li><a href="https://help.circle.com/support/en/understand-circle-s-stablecoin-blocklisting-process?id=support_article_view&amp;sysparm_article=KB0011513">Circle: USDC blocklisting</a></li></ul></details>

    </details>

  </main>

}
