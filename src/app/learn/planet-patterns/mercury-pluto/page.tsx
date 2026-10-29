import type { Metadata } from 'next'
import Link from 'next/link'
import article from '@/lib/learn/mercury-pluto.json'
import films from '@/lib/learn/planets.json'

const film = films.find(f => f.slug === 'mercury-pluto')!
export const metadata: Metadata = {
  title: 'Mercury and Pluto: a pattern across generations | Learn with Tanda',
  description: 'Explore Mercury’s 88-day orbit and dwarf planet Pluto’s 248-year orbit through a simple drawing model, a short film and a readable explanation.',
  alternates: { canonical: 'https://sathian.ai/learn/planet-patterns/mercury-pluto' },
}

export default function MercuryPlutoPage() {
  return <main className="learn-lesson learn-planet-article">
    <nav className="learn-nav" aria-label="Learning navigation"><Link href="/learn#planet-heading">Back to Planet Patterns</Link></nav>
    <header className="learn-lesson-title"><h1>{article.title}</h1></header>
    <video controls playsInline preload="none" src={film.src} poster={film.poster} aria-label="Mercury and Pluto">
      <track kind="captions" src={film.captions} srcLang="en" label="English" />
      <a href={film.src}>Open the Mercury and Pluto film</a>
    </video>
    <article>
      {article.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</section>)}
      <section><h2>Episode transcript</h2><p>{article.transcript}</p></section>
      <section><h2>Historical image and reuse</h2>
        <figure><a href={article.historicalImage.src} target="_blank" rel="noreferrer" aria-label="View the Stone engraving at full size"><img src={article.historicalImage.src} width={article.historicalImage.width} height={article.historicalImage.height} alt={article.historicalImage.alt} loading="lazy" /></a><figcaption>{article.historicalImage.caption}</figcaption></figure>
        <p>{article.historicalImage.paragraph}</p>
        <p><a href={article.historicalImage.source}>National Archives download and reuse statement</a> · <a href={article.historicalImage.original}>Original source image</a></p>
      </section>
      <section><h2>Sources</h2><ul>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul></section>
    </article>
    <Link className="learn-button" href="/learn#planet-heading">Back to Planet Patterns</Link>
  </main>
}
