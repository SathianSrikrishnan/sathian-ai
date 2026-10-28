'use client'
import { useRef } from 'react'
export function MeetGuides() {
 const guides=useRef<HTMLDivElement>(null)
 return <div ref={guides} className="learn-meet-controls" aria-label="Meet our guides" onPlayCapture={event=>{guides.current?.querySelectorAll('video').forEach(video=>{if(video!==event.target)video.pause()})}}>
 <figure><figcaption>Meet Tanda</figcaption><video controls playsInline preload="none" src="/learn-media/welcome-r2/tanda-welcome-review.mp4" poster="/learn-media/welcome-r2/tanda-welcome-review-poster.jpg" aria-label="Meet Tanda"><track kind="captions" src="/learn-media/welcome-r2/tanda-welcome-review.vtt" srcLang="en" label="English" /></video></figure>
 <figure><figcaption>Meet Dad</figcaption><video controls playsInline preload="none" src="/learn-media/cartoon-dad-welcome-20261028/learn-with-tanda-coherent-welcome.mp4" poster="/learn-media/cartoon-dad-welcome-20261028/poster.webp" aria-label="Sathian’s founder message"><track kind="captions" src="/learn-media/cartoon-dad-welcome-20261028/learn-with-tanda-coherent-welcome.vtt" srcLang="en" label="English" /></video></figure>
 </div>
}
