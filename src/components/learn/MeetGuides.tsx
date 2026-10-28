'use client'
import { useRef } from 'react'
export function MeetGuides() {
 const guides=useRef<HTMLDivElement>(null)
 return <div ref={guides} className="learn-meet-controls" aria-label="Meet our guides" onPlayCapture={event=>{guides.current?.querySelectorAll('video').forEach(video=>{if(video!==event.target)video.pause()})}}>
 <figure><figcaption>Meet Tanda</figcaption><video controls playsInline preload="metadata" src="/learn-media/welcome-r2/tanda-welcome-review.mp4" poster="/learn-media/welcome-r2/tanda-welcome-review-poster.jpg" aria-label="Meet Tanda"><track kind="captions" src="/learn-media/welcome-r2/tanda-welcome-review.vtt" srcLang="en" label="English" /></video></figure>
 <figure><figcaption>Meet Sathian</figcaption><video controls playsInline preload="metadata" src="/proof-assets/proof-main-20261027/proof-main-before-final-cta-review.mp4" poster="/proof-assets/proof-site-first-edition/revision12/founder-proof-r12.jpg" aria-label="Sathian’s founder message"><track kind="captions" src="/proof-assets/proof-main-20261027/proof-main-before-final-cta-review.vtt" srcLang="en" label="English" /></video></figure>
 </div>
}
