import type { PublicMemoryCard } from '@/lib/agent/types'
import {
  CLINICAL_GUARD_PROJECT,
  DRAW_WITH_TANDA_EPISODES,
  LATEST_RELEASE,
  type SiteRelease,
} from '@/content/site-releases'
import {
  AUTOQUOTE_AUTOMATOR_PROJECT,
  SOLANA_OBSERVATORY_PROJECT,
  TOOTH_FAIRY_NETWORK_PROJECT,
  type PublicSiteProject,
} from '@/content/site-projects'

const PROFILE_SOURCE = 'https://sathian.ai/'
const TFN_MAINNET_PROGRAM = 'https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC'

function projectToPublicMemoryCard(project: PublicSiteProject): PublicMemoryCard {
  return {
    id: project.id,
    slug: project.slug,
    title: project.name,
    body: project.agentSummary,
    summary: project.description,
    tags: project.tags,
    source: { ref: project.href, kind: 'published_project' },
    validFrom: '2026-08-10T00:00:00.000Z',
    validUntil: null,
  }
}

export function releaseToPublicMemoryCard(
  release: SiteRelease,
  options: { latest?: boolean } = {},
): PublicMemoryCard {
  const sourceRef = `https://sathian.ai${release.pageHref}`
  return {
    id: options.latest ? 'latest-release' : `release-${release.id}`,
    slug: options.latest ? `latest-release-${release.slug}` : `release-${release.slug}`,
    title: `${options.latest ? 'Latest release: ' : ''}${release.title}`,
    body: release.agentSummary,
    summary: release.description,
    tags: [...release.tags, ...(options.latest ? ['latest-release'] : [])],
    source: { ref: sourceRef, kind: 'published_page' },
    validFrom: release.publishedAt,
    validUntil: null,
  }
}

export function getPublicProfileMemoryCards(): PublicMemoryCard[] {
  return [
    projectToPublicMemoryCard(TOOTH_FAIRY_NETWORK_PROJECT),
    releaseToPublicMemoryCard(LATEST_RELEASE, { latest: true }),
    ...DRAW_WITH_TANDA_EPISODES
      .filter((release) => release.id !== LATEST_RELEASE.id)
      .map((release) => releaseToPublicMemoryCard(release)),
    projectToPublicMemoryCard(AUTOQUOTE_AUTOMATOR_PROJECT),
    projectToPublicMemoryCard(SOLANA_OBSERVATORY_PROJECT),
    {
      id: 'project-clinicalguard',
      slug: 'clinicalguard',
      title: CLINICAL_GUARD_PROJECT.title,
      body: `${CLINICAL_GUARD_PROJECT.description} It was built for the ${CLINICAL_GUARD_PROJECT.event}.`,
      summary: CLINICAL_GUARD_PROJECT.tagline,
      tags: ['project', 'hackathon', 'clinicalguard', 'healthcare-ai', 'langgraph'],
      source: {
        ref: `https://sathian.ai${CLINICAL_GUARD_PROJECT.pageHref}`,
        kind: 'published_page',
      },
      validFrom: '2026-03-01T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'published-writing',
      slug: 'published-writing',
      title: 'Sathian’s published writing',
      body: 'Sathian publishes notes on culture, money, technology, fatherhood, and the products he is learning to build. The writing index is the canonical place to browse the current collection.',
      summary: 'Notes on culture, money, technology, fatherhood, and building in public.',
      tags: ['writing', 'articles', 'essays', 'culture', 'money', 'technology', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings', kind: 'published_page' },
      validFrom: '2026-08-10T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'current-public-work',
      slug: 'current-public-work',
      title: 'What Sathian is building now',
      body: 'Sathian’s primary public build is Tooth Fairy Network, a private family time-capsule and future-gift product with a deployed Solana Mainnet program. Draw with Tanda and the Solana Ecosystem Observatory explain the story and the network behind it. AutoQuote Automator remains an active experiment. ClinicalGuard and earlier hackathons remain in the public archive.',
      summary: 'Tooth Fairy Network first, supported by public learning, content, and a small active project portfolio.',
      tags: ['current-work', 'building-now', 'projects', 'digital-experiments', 'portfolio', 'tooth-fairy-network'],
      source: { ref: 'https://sathian.ai/', kind: 'published_page' },
      validFrom: '2026-08-10T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'profile-current-chapter',
      slug: 'sathian-current-chapter',
      title: 'Sathian’s current chapter',
      body: 'Sathian is a builder, father, and student again in his 40s, based in Toronto. He is increasingly active in the Toronto technology community and is learning in public across AI agents, Solana, Web3, and product building. Many of the builders teaching him the most are closer to his children’s age than his own, which he finds humbling and energizing.',
      summary: 'A builder and student again in his 40s, learning in public from Toronto.',
      tags: ['bio', 'toronto', 'student', 'ai', 'solana', 'current-work'],
      source: { ref: PROFILE_SOURCE, kind: 'published_profile' },
      validFrom: '2026-07-15T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'profile-career-route',
      slug: 'sathian-career-route',
      title: 'Sathian’s route back to technology',
      body: 'Sathian’s career has crossed recruiting, entrepreneurship, and custom clothing, including serving as CEO of King & Bay Custom Clothing. His first close exposure to startup-building came around Waterloo’s entrepreneurship community as a university co-op student in the mid-2000s. He now carries those business and relationship lessons into software, AI, and public experiments.',
      summary: 'A non-linear career from Waterloo entrepreneurship through recruiting and King & Bay to technology.',
      tags: ['bio', 'career', 'waterloo', 'king-and-bay', 'entrepreneurship'],
      source: { ref: PROFILE_SOURCE, kind: 'published_profile' },
      validFrom: '2026-07-15T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'profile-site-agent-boundary',
      slug: 'site-agent-public-boundary',
      title: 'What Sathian’s site agent can do',
      body: 'The site agent is a public doorway to Sathian. It can answer from reviewed public projects, writing, and current-work context, or persist a visitor note and return a receipt. It cannot enter Sathian’s private memory or operate his private systems. A direct public agent API is planned only after its capabilities, limits, and receipts can be documented clearly.',
      summary: 'A public-context guide and receipt-backed message doorway with a strict private boundary.',
      tags: ['site-agent', 'public-context', 'privacy', 'intake'],
      source: { ref: PROFILE_SOURCE, kind: 'published_profile' },
      validFrom: '2026-07-15T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'tooth-fairy-network-mainnet-proof',
      slug: 'tooth-fairy-network-mainnet-proof',
      title: 'Tooth Fairy Network Mainnet program and deposit proof',
      body: 'Tooth Fairy Network’s executable Solana Mainnet program is deployed at FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC and governed by a recorded 2-of-3 Squads multisig. It is unpaused. Founder-controlled Mainnet canaries verified a 0.01 SOL deposit and a 1.00 canonical-USDC deposit, with the contract applying its documented 2% fee and protecting 98% in each deposit account. This proves the live contract rails; it does not mean the customer-facing USDC or on-ramp flow is released.',
      summary: 'A live, multisig-governed Mainnet program with verified SOL and canonical-USDC deposit canaries.',
      tags: ['tooth-fairy-network', 'toothlight', 'solana', 'mainnet', 'deposit', 'usdc', 'ownership', 'transparent-value-transfer'],
      source: { ref: TFN_MAINNET_PROGRAM, kind: 'verified_mainnet_program' },
      validFrom: '2026-07-30T00:00:00.000Z',
      validUntil: null,
    },
  ]
}
