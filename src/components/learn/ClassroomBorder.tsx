'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
export function ClassroomBorder({ children }: { children: ReactNode }) {
 const ref=useRef<HTMLDivElement>(null)
 const [revealed,setRevealed]=useState(false)
 const [quiet,setQuiet]=useState(false)
 useEffect(()=>{
  const node=ref.current
  if (!node) return
  const media=window.matchMedia('(prefers-reduced-motion: reduce)')
  const stop=()=>setQuiet(true)
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setRevealed(true);observer.disconnect()}},{threshold:.08})
  observer.observe(node)
  if(media.matches) stop()
  document.addEventListener('play',stop,true)
  const iframeFocus=()=>{if(document.activeElement?.tagName==='IFRAME')stop()}
  window.addEventListener('blur',iframeFocus)
  media.addEventListener('change',stop)
  return ()=>{observer.disconnect();document.removeEventListener('play',stop,true);window.removeEventListener('blur',iframeFocus);media.removeEventListener('change',stop)}
 },[])
 return <div ref={ref} className="learn-border-stage" data-revealed={revealed} data-quiet={quiet}><div className="learn-border-art" aria-hidden="true"><img className="border-paper-one" src="/learn-art/draw-toby.webp" alt="" /><img className="border-paper-two" src="/learn-art/draw-robot.webp" alt="" /><svg viewBox="0 0 1000 700" preserveAspectRatio="none"><path d="M12 110 Q5 350 14 685 L987 685 Q994 350 985 110" /></svg></div>{children}</div>
}
