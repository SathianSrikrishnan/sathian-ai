import film from '@/lib/learn/stablecoin-film.json'

export function StablecoinFilm() {
  return <video className="learn-stablecoin-film" controls playsInline preload="none" src={film.src} poster={film.poster} aria-label="Watch the USDC story">
    <track kind="captions" src={film.captions} srcLang="en" label="English" />
    <a href={film.src}>Open the USDC story</a>
  </video>
}
