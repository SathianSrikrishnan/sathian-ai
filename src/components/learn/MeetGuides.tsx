'use client'
import { useRef } from 'react'
export function MeetGuides() {
 const tanda=useRef<HTMLVideoElement>(null)
 return <div className="learn-meet-controls" aria-label="Meet our guides"><details onToggle={event=>{if(!event.currentTarget.open)tanda.current?.pause()}}><summary>Meet Tanda</summary><div className="learn-meet-expansion"><video ref={tanda} controls playsInline preload="none" src="/learn-media/welcome-r2/tanda-welcome-review.mp4" poster="/learn-media/welcome-r2/tanda-welcome-review-poster.jpg" aria-label="Tanda welcome"><track kind="captions" src="/learn-media/welcome-r2/tanda-welcome-review.vtt" srcLang="en" label="English" /></video></div></details><details><summary>Meet Sathian <span className="learn-meet-status">Being revised</span></summary><div className="learn-meet-expansion"><p>Founder of Tooth Fairy Network. Father of two.</p><p><strong>Founder welcome being revised.</strong></p></div></details></div>
}
