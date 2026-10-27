import type { Metadata } from 'next'
import Link from 'next/link'
import { available, lessons } from '@/lib/learn/catalog'
import copy from '@/lib/learn/page-copy.json'
import { LessonCollection } from '@/components/learn/LessonCollection'
export const metadata: Metadata = { title: 'Learn with Tanda | PROOF', description: 'Explore digital keys, shared rules and security together.', alternates: { canonical: 'https://sathian.ai/learn' } }
export default function LearningBoard() {
  const founderFilm = copy.founderFilm as { src: string | null; poster: string | null }
  return <main className="learn-board">
    <nav className="learn-nav" aria-label="Learning navigation"><a href="https://proof.sathian.ai">PROOF</a><Link href="/">sathian.ai</Link></nav>
    <header className="learn-intro"><h1>{copy.familyHeading}</h1><p>{copy.familyWelcome}</p><p>Tanda is our Tooth Fairy. I’m Sathian, a dad learning alongside you.</p></header>
    <div className="learn-family-resources">
    <a className="learn-planets" href="https://srikrishnan.work/planet-patterns"><div className="learn-planets-art"><img src="/learn-art/venus.png" alt="" /><img src="/learn-art/earth.png" alt="" /></div><div><p className="learn-kicker">Draw with Tanda</p><p className="learn-resource-title">Planet Patterns</p><p>Two planets. Different speeds. Draw the connection.</p></div></a>
      <a className="learn-resource-card" href="/learn/stories"><p className="learn-kicker">Read together</p><p className="learn-resource-title">Stories</p><p>Seven illustrated stories to read together, with three story films.</p></a>
    </div>
    <div className="learn-what"><p className="learn-kicker">What we’ll explore</p><p>{copy.lessonPurpose}</p></div>
    <LessonCollection lessons={lessons} readyIds={lessons.filter(available).map(l => l.id)} />
    <section className="learn-founder" aria-label="About Dad"><details><summary>Why I made this</summary><p>{copy.founderOpening}</p><p>{copy.founderMore}</p>{founderFilm.src && <video controls playsInline preload="metadata" src={founderFilm.src} poster={founderFilm.poster || undefined} aria-label="Dad introduces Learn with Tanda" />}</details></section>
    <section className="learn-adults" aria-label="For parents"><a className="learn-button secondary" href="https://proof.sathian.ai">For parents: Explore the Proof</a><p>Family gifts and keepsakes prompted these questions. The product idea is parent-controlled; custody, ownership and privacy need product-specific answers.</p>
      <details className="learn-sources"><summary>Questions about the product</summary><p>These lessons explain system designs. Product wallet controls, legal rights, recovery, fees, guardian arrangements and physical keepsake terms need their own clear explanation.</p><p>Keys and digital signatures authorize spending. Legal ownership depends on the applicable arrangements and law. Bitcoin confirmations add confidence in a transaction; custody, key access and network-adopted rule changes affect real-world control.</p><p>A public transaction record and an artwork file are different things. The product must explain what is public, who can access files and how those files are protected. USDC has issuer blocklisting, so its controls need a separate explanation.</p><p>Parents can review the current <a href="https://toothfairy.network">Tooth Fairy Network product information</a>. Planned features and product terms need separate review.</p><ul><li><a href="https://bitcoin.org/en/how-it-works">Bitcoin: keys, signatures and records</a></li><li><a href="https://bitcoin.org/en/you-need-to-know">Bitcoin: confirmations and security considerations</a></li><li><a href="https://bitcoincore.org/en/lifecycle/">Bitcoin Core: consensus-rule changes</a></li><li><a href="https://bitcoin.org/en/protect-your-privacy">Bitcoin: public records and privacy</a></li><li><a href="https://help.circle.com/support/en/understand-circle-s-stablecoin-blocklisting-process?id=support_article_view&amp;sysparm_article=KB0011513">Circle: USDC blocklisting</a></li></ul></details>
    </section>
  </main>
}
