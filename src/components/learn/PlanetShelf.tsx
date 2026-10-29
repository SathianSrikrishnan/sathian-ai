'use client'
import { useRef } from 'react'
import films from '@/lib/learn/planets.json'
export function PlanetShelf() {
 const shelf=useRef<HTMLElement>(null)
 return <section ref={shelf} className="learn-planets" aria-labelledby="planet-heading" onPlayCapture={event=>shelf.current?.querySelectorAll('video').forEach(video=>{if(video!==event.target)video.pause()})}>
  <div className="learn-room-section-line"><h2 id="planet-heading">Planet Patterns</h2></div>
  <div className="learn-planet-grid">{films.map(film=><figure key={film.slug}><figcaption>{film.title}</figcaption><video controls playsInline preload="none" src={film.src} poster={film.poster} aria-label={film.title}><track kind="captions" src={film.captions} srcLang="en" label="English" /></video>{'article' in film && <a className="learn-planet-reading" href={film.article}>Read about Mercury and Pluto</a>}</figure>)}</div>
  <a className="learn-button" data-planet-app href="https://srikrishnan.work/planet-patterns">Try drawing it together</a>
 </section>
}
