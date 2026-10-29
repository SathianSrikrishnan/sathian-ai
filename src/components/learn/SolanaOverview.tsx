import film from '@/lib/learn/solana-overview-film.json'
export function SolanaOverview() {
 return <article className="learn-solana-overview topic-solana" aria-labelledby="solana-overview-title">
  <h3 id="solana-overview-title" className="learn-topic-title">Solana and SOL</h3>
  <video controls playsInline preload="none" src={film.src} poster={film.poster} aria-label="Watch Solana and SOL">
   <track kind="captions" src={film.captions} srcLang="en" label="English" /><a href={film.src}>Open Solana and SOL</a>
  </video>
  <p>Solana is the network. SOL is its token.</p>
 </article>
}
