'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { trackToothlightEvent } from '@/lib/toothlight/client/product-analytics'

const LAUNCH_CLICK_EVENTS = new Set([
  'cta_click',
  'invite_clicked',
  'learn_clicked',
])

export function TFNProductAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    trackToothlightEvent('page_view', { pathname })
    if (isLaunchLandingPath(pathname)) {
      trackToothlightEvent('landing_view', { pathname })
    }
  }, [pathname])

  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null
      const clickable = target?.closest('a, button')
      if (!clickable) return

      const label = (clickable.textContent || clickable.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80)
      const href = clickable instanceof HTMLAnchorElement ? clickable.href : null

      const clickProperties = {
        label: label || clickable.tagName.toLowerCase(),
        href,
        element: clickable.tagName.toLowerCase(),
      }

      trackToothlightEvent('ui_click', clickProperties)
      for (const launchEvent of inferLaunchClickEvents(clickable, href)) {
        trackToothlightEvent(launchEvent, clickProperties)
      }
    }

    document.addEventListener('click', trackClick, { capture: true })
    return () => document.removeEventListener('click', trackClick, { capture: true })
  }, [])

  return null
}

function isLaunchLandingPath(pathname: string | null) {
  if (pathname === '/toothlight' || pathname === '/toothfairy') return true
  if (typeof window === 'undefined') return false
  return pathname === '/' && window.location.hostname.includes('toothfairy')
}

function inferLaunchClickEvents(clickable: Element, href: string | null) {
  const events = new Set<string>()
  const explicitEvent = clickable.getAttribute('data-tfn-event')
  if (explicitEvent && LAUNCH_CLICK_EVENTS.has(explicitEvent)) {
    events.add(explicitEvent)
  }

  const pathname = href ? safePathname(href) : null
  if (pathname?.startsWith('/toothlight/start')) events.add('cta_click')
  if (pathname === '/toothlight/learn') events.add('learn_clicked')
  if (pathname && /^\/toothlight\/t\/[^/]+\/family/.test(pathname)) events.add('invite_clicked')

  return Array.from(events)
}

function safePathname(href: string) {
  try {
    return new URL(href).pathname
  } catch {
    return href
  }
}
