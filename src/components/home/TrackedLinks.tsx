'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes, ComponentProps } from 'react'

import { applyAdClick } from '@/lib/ad-click'
import { trackSiteEvent } from '@/lib/site-analytics'

type EventProperties = Parameters<typeof trackSiteEvent>[1]

// Small client islands so the homepage itself can render on the server and
// skip hydrating static content. Markup matches the plain <a>/<Link> it replaces.

export function TrackedAnchor({
  event,
  properties,
  carryAdClick = false,
  ...anchor
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: Parameters<typeof trackSiteEvent>[0]
  properties?: EventProperties
  carryAdClick?: boolean
}) {
  return (
    <a
      {...anchor}
      onClick={(clickEvent) => {
        if (carryAdClick) applyAdClick(clickEvent.currentTarget)
        trackSiteEvent(event, properties)
      }}
    />
  )
}

export function TrackedLink({
  event,
  properties,
  ...link
}: ComponentProps<typeof Link> & {
  event: Parameters<typeof trackSiteEvent>[0]
  properties?: EventProperties
}) {
  return <Link {...link} onClick={() => trackSiteEvent(event, properties)} />
}
