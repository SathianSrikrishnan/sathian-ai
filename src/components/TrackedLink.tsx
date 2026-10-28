'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { trackSiteEvent } from '@/lib/site-analytics'

/**
 * A link that records one funnel event (label + placement only) before navigating.
 * External links open in the same tab so the visitor's journey stays in one place.
 */
export function TrackedLink({
  href,
  event,
  placement,
  className,
  children,
}: {
  href: string
  event: 'gift_cta_clicked' | 'proof_opened' | 'learn_opened' | 'writing_opened'
  placement: string
  className?: string
  children: ReactNode
}) {
  const onClick = () => trackSiteEvent(event, { placement })
  if (href.startsWith('/')) {
    return <Link href={href} className={className} onClick={onClick}>{children}</Link>
  }
  return <a href={href} className={className} onClick={onClick}>{children}</a>
}
