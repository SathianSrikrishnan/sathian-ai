import type { Metadata } from 'next'
import Link from 'next/link'
import article from '@/lib/learn/mercury-pluto.json'
import films from '@/lib/learn/planets.json'
const film = films.find(f => f.slug === 'mercury-pluto')!
export const metadata: Metadata = {
 title: 'A Pluto year | Learn with Tanda',
 description: 'One trip around the Sun. Nearly 250 birthdays. A short illustrated family story about Pluto, history and gifts for tomorrow.',
 alternates: { canonical: 'https://sathian.ai/learn/planet-patterns/mercury-pluto' },
}
export default function MercuryPlutoPage() {
 return <main className="learn-lesson learn-planet-article">
  <nav className="learn-nav" aria-label="Learning navigation"><Link href="/learn#planet-heading">Back to Planet Patterns</Link></nav>
  <header className="learn-lesson-title"><h1>{article.title}</h1></header>
  <video controls playsInline preload="none" src={film.src} poster={film.poster} aria-label="Mercury and Pluto">
   <track kind="captions" src={film.captions} srcLang="en" label="English" /><a href={film.src}>Open the Mercury and Pluto film</a>
  </video>
  <article>
   {article.sections.map((section,index)=><section key={section.heading} className="pluto-year-section">
    <h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}
    {index===0 && <figure className="pluto-photo"><img src="/learn-art/pluto-year/pluto.webp" width="1100" height="619" alt="Pluto's icy surface photographed by NASA's New Horizons spacecraft" loading="lazy" /><figcaption>Pluto in true color. NASA/Johns Hopkins APL/Southwest Research Institute.</figcaption></figure>}
    {index===1 && <>
     <figure className="pluto-map"><img src="/learn-art/pluto-year/united-states.webp" width="1092" height="790" alt="Map of all 50 United States, with Alaska and Hawaii in separate insets" loading="lazy" /><figcaption>The United States: modern state boundaries. U.S. Census Bureau.</figcaption></figure>
     <div className="pluto-documents">
      <figure><a href={article.historicalImage.source}><img src={article.historicalImage.src} width="900" height="1065" alt={article.historicalImage.alt} loading="lazy" /></a><figcaption><strong>1776 · Declaration</strong>Thirteen colonies declare independence from Britain. Adopted July 4. Shown: 1823 Stone engraving.</figcaption></figure>
      <figure><a href="https://www.archives.gov/founding-docs/constitution"><img src="/learn-art/pluto-year/constitution.webp" width="630" height="762" alt="First page of the United States Constitution" loading="lazy" /></a><figcaption><strong>1787 · Constitution</strong>A plan for the U.S. government. Signed September 17.</figcaption></figure>
      <figure><a href="https://www.archives.gov/founding-docs/bill-of-rights"><img src="/learn-art/pluto-year/bill-of-rights.webp" width="1035" height="1100" alt="The Bill of Rights document" loading="lazy" /></a><figcaption><strong>1791 · Bill of Rights</strong>The first ten amendments protect key freedoms. Ratified December 15.</figcaption></figure>
     </div><p className="pluto-image-credit">Documents: National Archives, public domain. <a href={article.historicalImage.source}>Download and reuse statement</a>.</p>
    </>}
   </section>)}
   <p className="pluto-grownup-link">For grown-ups: <Link href="/writings/gold-at-birth">Gold at Birth</Link>, a family gift story.</p>
   <details className="learn-sources"><summary>Film transcript</summary><p>{article.transcript}</p></details>
   <details className="learn-sources"><summary>About the drawing model</summary>{article.modelNotes.map(s=><section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}</details>
   <details className="learn-sources"><summary>Sources and image credits</summary><ul>{article.sources.map(s=><li key={s.url}><a href={s.url}>{s.title}</a></li>)}</ul></details>
  </article>
  <Link className="learn-button" href="/learn#planet-heading">Back to Planet Patterns</Link>
 </main>
}
