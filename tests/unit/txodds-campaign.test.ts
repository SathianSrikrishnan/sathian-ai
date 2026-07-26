import { describe, expect, it } from 'vitest'

import {
  getTxOddsCampaign,
  getTxOddsCampaignMemoryCards,
  TXODDS_CAMPAIGN_DEADLINE,
  TXODDS_LISTING_URL,
} from '@/lib/campaigns/txodds'

describe('TxODDS launch campaign', () => {
  it('is active before the referral sprint closes and carries reviewed public context', () => {
    const now = new Date('2026-07-15T16:00:00.000Z')

    const campaign = getTxOddsCampaign({ now })
    const cards = getTxOddsCampaignMemoryCards(now)

    expect(campaign?.title).toBe('Find your World Cup build')
    expect(campaign?.referralUrl).toBeNull()
    expect(campaign?.prompts).toContain('Which TxODDS track fits my background?')
    expect(cards.length).toBeGreaterThanOrEqual(2)
    expect(cards.map((card) => card.body).join(' ')).toContain('non-technical contributors')
    expect(cards.map((card) => card.body).join(' ')).toContain('priced probabilities')
    expect(cards.every((card) => card.validUntil === TXODDS_CAMPAIGN_DEADLINE)).toBe(true)
    expect(cards.every((card) => card.source.ref.startsWith('https://superteam.fun/'))).toBe(true)
  })

  it('disappears at the deadline so stale campaign claims cannot linger', () => {
    const deadline = new Date(TXODDS_CAMPAIGN_DEADLINE)

    expect(getTxOddsCampaign({ now: deadline })).toBeNull()
    expect(getTxOddsCampaignMemoryCards(deadline)).toEqual([])
  })

  it('does not appear before its reviewed publication window', () => {
    const beforeLaunch = new Date('2026-07-14T23:59:59.000Z')

    expect(getTxOddsCampaign({ now: beforeLaunch })).toBeNull()
    expect(getTxOddsCampaignMemoryCards(beforeLaunch)).toEqual([])
  })

  it('requires a secure unique link and never mistakes the bounty listing for a referral', () => {
    const now = new Date('2026-07-15T16:00:00.000Z')

    expect(getTxOddsCampaign({ now, referralUrl: TXODDS_LISTING_URL })?.referralUrl).toBeNull()
    expect(getTxOddsCampaign({ now, referralUrl: 'javascript:alert(1)' })?.referralUrl).toBeNull()
    expect(
      getTxOddsCampaign({ now, referralUrl: 'https://txodds.example/register?ref=sathian' })?.referralUrl,
    ).toBeNull()
    expect(
      getTxOddsCampaign({ now, referralUrl: 'https://hackathon.txodds.com/register?ref=sathian' })?.referralUrl,
    ).toBe('https://hackathon.txodds.com/register?ref=sathian')
    expect(
      getTxOddsCampaign({ now, referralUrl: 'https://superteam.fun/earn/r/G24D8TQ' })?.referralUrl,
    ).toBe('https://superteam.fun/earn/r/G24D8TQ')
  })
})
