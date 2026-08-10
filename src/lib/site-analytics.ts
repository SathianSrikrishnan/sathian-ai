'use client'

import { track } from '@vercel/analytics'

type SiteEventValue = string | number | boolean | null | undefined
type SiteEventProperties = Record<string, SiteEventValue>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: 'event', eventName: string, properties?: SiteEventProperties) => void
  }
}
/**
 * Sends one privacy-safe event to both analytics destinations.
 * Callers must use labels and counts only; never include chat text, email,
 * filenames, or other visitor-provided content.
 */
export function trackSiteEvent(
  eventName: string,
  properties: SiteEventProperties = {},
) {
  track(eventName, properties)

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties)
  }
}
