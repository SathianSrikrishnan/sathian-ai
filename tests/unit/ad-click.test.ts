import { describe, expect, it } from 'vitest'

import { withAdClick } from '@/lib/ad-click'

const GIFT = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=referral&utm_campaign=about'

describe('ad click pass-through to the gift site', () => {
  it('adds the landing gclid to a gift link and keeps the UTMs', () => {
    const next = new URL(withAdClick(GIFT, '?gclid=abc123&utm_source=google'))
    expect(next.searchParams.get('gclid')).toBe('abc123')
    expect(next.searchParams.get('utm_campaign')).toBe('about')
  })

  it('falls back to the click id stored at landing', () => {
    const storage = { getItem: (key: string) => (key === 'sathian-ad-click-gbraid' ? 'g-1' : null) }
    expect(new URL(withAdClick(GIFT, '', storage)).searchParams.get('gbraid')).toBe('g-1')
  })

  it('leaves non-gift links and click-free visits unchanged', () => {
    expect(withAdClick('https://proof.sathian.ai/', '?gclid=abc')).toBe('https://proof.sathian.ai/')
    expect(withAdClick('/learn', '?gclid=abc')).toBe('/learn')
    expect(withAdClick(GIFT, '')).toBe(new URL(GIFT).toString())
  })
})
