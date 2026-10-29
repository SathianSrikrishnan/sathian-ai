'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { holdPendingAgentOpen, isAgentListening } from '@/lib/agent/pending-open'
import { isLearningPath } from '@/lib/learn/route-policy'
import { isToothFairyHost } from '@/lib/site-host'

// The site agent (and motion, which only it uses in the shared layout) is kept
// off the first-paint path: its chunk is requested once the browser is idle
// after hydration. On the homepage the agent already mounted in an effect and
// faded in after first paint, so the finished page looks the same.
const ChatWidget = dynamic(() => import('./ChatWidget').then((mod) => mod.ChatWidget), {
  ssr: false,
})

export function DeferredChatWidget() {
  const pathname = usePathname()
  if (isLearningPath(pathname)) return null
  return <DeferredChatWidgetContent />
}

function DeferredChatWidgetContent() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Tooth Fairy hosts never get the site agent. The host is checked here, in
    // the browser, so the shared layout stays static (no request headers).
    if (isToothFairyHost(window.location.hostname)) return

    let done = false
    const load = () => {
      if (done) return
      done = true
      setReady(true)
    }

    const onEarlyOpen = (event: Event) => {
      if (isAgentListening()) return
      holdPendingAgentOpen((event as CustomEvent).detail)
      load()
    }
    window.addEventListener('open-chat', onEarlyOpen)

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(load, { timeout: 2000 })
    } else {
      timeoutId = setTimeout(load, 200)
    }

    return () => {
      window.removeEventListener('open-chat', onEarlyOpen)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  return ready ? <ChatWidget /> : null
}
