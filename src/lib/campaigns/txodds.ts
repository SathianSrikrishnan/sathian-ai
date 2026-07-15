import type { PublicMemoryCard } from '@/lib/agent/types'

export const TXODDS_CAMPAIGN_DEADLINE = '2026-07-18T03:59:00.000Z'
export const TXODDS_LISTING_URL = 'https://superteam.fun/earn/listing/bring-the-most-canadian-signups-to-the-txodds-hackathon'
export const TXODDS_HACKATHON_URL = 'https://superteam.fun/earn/hackathon/world-cup'

const TXODDS_CAMPAIGN_START = '2026-07-15T00:00:00.000Z'

export interface TxOddsCampaign {
  slug: 'txodds-world-cup'
  eyebrow: string
  title: string
  description: string
  deadline: string
  deadlineLabel: string
  listingUrl: string
  referralUrl: string | null
  prompts: string[]
}

function isAllowedReferralHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return [
    'superteam.fun',
    'txodds.com',
    'txodds.net',
  ].some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
}

function validatedReferralUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null

  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !isAllowedReferralHost(url.hostname)) return null
    if (url.href.replace(/\/$/, '') === TXODDS_LISTING_URL) return null
    if (url.href.replace(/\/$/, '') === TXODDS_HACKATHON_URL) return null
    return url.href
  } catch {
    return null
  }
}

function isCampaignActive(now: Date): boolean {
  const timestamp = now.getTime()
  return Number.isFinite(timestamp)
    && timestamp >= Date.parse(TXODDS_CAMPAIGN_START)
    && timestamp < Date.parse(TXODDS_CAMPAIGN_DEADLINE)
}

export function getTxOddsCampaign(
  options: { now?: Date; referralUrl?: string | null } = {},
): TxOddsCampaign | null {
  const now = options.now ?? new Date()
  if (!isCampaignActive(now)) return null

  const referralUrl = options.referralUrl === undefined
    ? process.env.TXODDS_REFERRAL_URL
    : options.referralUrl

  return {
    slug: 'txodds-world-cup',
    eyebrow: 'LIVE FIELD TEST / CANADA',
    title: 'Find your World Cup build',
    description: 'Tell my site agent what you know, what you enjoy, and how much time you have. It will suggest a TxODDS track and a realistic project you could ship.',
    deadline: TXODDS_CAMPAIGN_DEADLINE,
    deadlineLabel: 'Referral sprint closes Friday at 11:59 PM Toronto time',
    listingUrl: TXODDS_LISTING_URL,
    referralUrl: validatedReferralUrl(referralUrl),
    prompts: [
      'Which TxODDS track fits my background?',
      'Give me three realistic weekend project ideas for the TxODDS hackathon.',
      'I’m not technical. Can I participate in the TxODDS hackathon?',
      'How can I find a team for the TxODDS hackathon?',
      'Why are prediction markets interesting?',
    ],
  }
}

export function getTxOddsCampaignMemoryCards(now = new Date()): PublicMemoryCard[] {
  if (!isCampaignActive(now)) return []

  return [
    {
      id: 'campaign-txodds-canada-referrals',
      slug: 'txodds-canada-referral-sprint',
      title: 'TxODDS Canadian referral sprint',
      body: 'Sathian is running a short public experiment for the Superteam Canada TxODDS referral bounty. Verified Canadian hackathon registrations attributed to his unique referral link or code are the primary measure. The campaign also values useful participants, clear storytelling, and creative public content. The listing welcomes creators, community builders, students, developers, founders, and marketers, highlights non-technical contributors and team formation, and asks that the content work for people with little or no crypto experience. Sathian’s site agent can help a visitor choose a track, shape a realistic project idea, find a team, or leave Sathian a note.',
      summary: 'A short Canadian referral sprint supported by Sathian’s site agent.',
      tags: ['campaign', 'txodds', 'canada', 'hackathon', 'referral', 'site-agent'],
      source: { ref: TXODDS_LISTING_URL, kind: 'campaign_listing' },
      validFrom: TXODDS_CAMPAIGN_START,
      validUntil: TXODDS_CAMPAIGN_DEADLINE,
    },
    {
      id: 'campaign-txodds-world-cup',
      slug: 'txodds-world-cup-hackathon',
      title: 'TxODDS World Cup hackathon',
      body: 'The TxODDS World Cup hackathon is a global Superteam build sprint with three tracks: Prediction Markets and Settlement, Trading Tools and Agents, and Consumer and Fan Experiences. Builders use TxLINE sports data, and the global submission window runs through July 19, 2026. Prediction markets turn expectations about future events into priced probabilities; in this hackathon, verified live match data can support market resolution and settlement. Sathian can help people think through a project, but the official track pages and rules remain the authority for eligibility and submission requirements.',
      summary: 'A global build sprint using TxLINE sports data across three tracks.',
      tags: ['campaign', 'txodds', 'world-cup', 'hackathon', 'prediction-markets', 'agents', 'fan-experiences'],
      source: { ref: TXODDS_HACKATHON_URL, kind: 'official_hackathon_page' },
      validFrom: TXODDS_CAMPAIGN_START,
      validUntil: TXODDS_CAMPAIGN_DEADLINE,
    },
  ]
}
