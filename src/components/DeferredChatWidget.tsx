'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ensureAgentSession } from '@/lib/agent/site-session'
import { holdPendingAgentOpen, isAgentListening } from '@/lib/agent/pending-open'
import { isLearningPath } from '@/lib/learn/route-policy'
import { isToothFairyHost } from '@/lib/site-host'

// Keep the same visible doorway, but request the chat/motion/audio bundle only
// when someone opens it. Early events are replayed after the listener mounts.
const ChatWidget = dynamic(() => import('./ChatWidget').then(mod => mod.ChatWidget), { ssr: false })

export function DeferredChatWidget() {
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [eligible, setEligible] = useState(false)
  const [homeTarget, setHomeTarget] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const allowed = !isLearningPath(pathname) && !isToothFairyHost(window.location.hostname)
    setEligible(allowed)
    setHomeTarget(pathname === '/' ? document.getElementById('home-agent-slot') : null)
    if (!allowed) return
    ensureAgentSession(pathname)
    const open = (event: Event) => {
      if (isAgentListening()) return
      holdPendingAgentOpen((event as CustomEvent).detail)
      setReady(true)
    }
    window.addEventListener('open-chat', open)
    return () => window.removeEventListener('open-chat', open)
  }, [pathname])
  if (!eligible || isLearningPath(pathname)) return null
  if (ready) return <ChatWidget />
  const open = () => window.dispatchEvent(new CustomEvent('open-chat', { detail: { source: 'doorway' } }))
  if (pathname === '/') return <div data-site-agent-root>{homeTarget ? createPortal(
    <button type="button" aria-expanded={false} className="site-agent-reopen" onClick={open}>
      <span className="site-agent-reopen__status"><span /> SITE AGENT</span>
      <strong>Ask Sathian</strong>
      <span>Ask about the work or leave Sathian a note.</span>
    </button>, homeTarget) : null}</div>
  return <div data-site-agent-root><button type="button" onClick={open} aria-label="Open chat" className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer overflow-hidden" style={{ border: '2px solid rgba(255,255,255,.2)', boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}>
    {/* Same avatar as the full widget, with no audio or model code until open. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/sathian-profile.webp" alt="" width="56" height="56" className="w-full h-full object-cover" />
  </button></div>
}
