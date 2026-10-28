import Link from 'next/link'
import { STORIES } from '@/lib/learn/storybook'
import films from '@/lib/learn/storybook/films.json'
export function StoryShelf() {
 const standalone=films.filter(f=>!STORIES.some(s=>s.slug===f.slug))
 return <section className="learn-room-stories" aria-label="Storybook World">
  <div className="learn-room-section-line"><p>Storybook World</p><Link href="/learn/stories">Read the stories</Link></div>
  <div className="learn-book-grid">{STORIES.map(story=>{const film=films.find(f=>f.slug===story.slug);return <article key={story.slug} className="learn-book">
   {film ? <video controls playsInline preload="none" poster={film.poster} src={film.src} aria-label={film.title}>{film.captions && <track kind="captions" src={film.captions} srcLang="en" label="English" />}</video> : <Link href={`/learn/stories/${story.slug}`}><img src={story.cover} alt="" loading="lazy" width="480" height="480" /></Link>}
   <div className="learn-story-meta"><p>{film?.title || story.title}</p><Link href={`/learn/stories/${story.slug}`}>Read together</Link>{film && !film.captions && <p className="learn-caption-note">Captions are not yet available.</p>}</div>
  </article>})}{standalone.map(film=><article key={film.slug} className="learn-book learn-standalone-film"><video controls playsInline preload="none" poster={film.poster} src={film.src} aria-label={film.title}>{film.captions && <track kind="captions" src={film.captions} srcLang="en" label="English" />}</video><div className="learn-story-meta"><p>{film.title}</p>{!film.captions && <p className="learn-caption-note">Captions are not yet available.</p>}</div></article>)}</div>
 </section>
}


export function FeaturedStory() {
 const origin=STORIES.find(s=>s.slug==='tanda-origin')!
 const firstFilm=films.find(f=>f.slug===origin.slug)!
 return   <article className="learn-origin-feature learn-feed-feature" aria-label="Featured video"><div className="learn-origin-picture"><video controls playsInline preload="none" src={firstFilm.src} poster={firstFilm.poster} aria-label={firstFilm.title}><track kind="captions" src={firstFilm.captions} srcLang="en" label="English" /></video></div><div className="learn-origin-copy"><p className="learn-feature-label">Featured</p><p>{firstFilm.title}</p><Link href={`/learn/stories/${origin.slug}`}>Read together</Link></div></article>
}
