import type { PublicMemoryCard } from '@/lib/agent/types'
import {
  DRAW_WITH_TANDA_EPISODES,
  LATEST_RELEASE,
  type SiteRelease,
} from '@/content/site-releases'
import {
  ACTIVE_SITE_PROJECTS,
  ARCHIVE_SITE_PROJECTS,
  SITE_PROJECTS,
  projectAliasTag,
  type PublicSiteProject,
} from '@/content/site-projects'

const PROFILE_SOURCE = 'https://sathian.ai/'
const TFN_MAINNET_PROGRAM = 'https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC'

function projectToPublicMemoryCard(project: PublicSiteProject): PublicMemoryCard {
  const sourceRef = project.href.startsWith('/')
    ? `https://sathian.ai${project.href}`
    : project.href
  return {
    id: project.id,
    slug: project.slug,
    title: project.name,
    body: project.approvedClaims.join(' '),
    summary: project.description,
    tags: Array.from(new Set([
      ...project.topics,
      project.slug,
      `status-${project.status}`,
      ...project.aliases.map(projectAliasTag),
    ])),
    source: { ref: sourceRef, kind: 'published_project' },
    validFrom: `${project.reviewedAt}T00:00:00.000Z`,
    validUntil: null,
  }
}

function joinProjectNames(projects: readonly PublicSiteProject[]): string {
  const names = projects.map((project) => project.name)
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
}

function currentPublicWorkCard(): PublicMemoryCard {
  const primary = ACTIVE_SITE_PROJECTS.find((project) => project.status === 'primary')
  const otherActive = ACTIVE_SITE_PROJECTS.filter((project) => project.status === 'active')
  const lastReviewedAt = ACTIVE_SITE_PROJECTS
    .map((project) => project.reviewedAt)
    .sort()
    .at(-1)
  return {
    id: 'current-public-work',
    slug: 'current-public-work',
    title: 'What Sathian is building now',
    body: `Sathian's primary public build is ${primary?.name}. ${joinProjectNames(otherActive)} are also active public builds. Draw with Tanda is the public family-content stream inside Tooth Fairy Network. ${joinProjectNames(ARCHIVE_SITE_PROJECTS)} are archived portfolio projects, not current active builds.`,
    summary: 'Tooth Fairy Network first, supported by public learning, content, and a small active project portfolio.',
    tags: ['current-work', 'building-now', 'projects', 'digital-experiments', 'portfolio', 'tooth-fairy-network'],
    source: { ref: 'https://sathian.ai/', kind: 'published_page' },
    validFrom: lastReviewedAt ? `${lastReviewedAt}T00:00:00.000Z` : null,
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
    ...SITE_PROJECTS.map(projectToPublicMemoryCard),
    releaseToPublicMemoryCard(LATEST_RELEASE, { latest: true }),
    ...DRAW_WITH_TANDA_EPISODES
      .filter((release) => release.id !== LATEST_RELEASE.id)
      .map((release) => releaseToPublicMemoryCard(release)),
    {
      id: 'latest-featured-writing',
      slug: 'latest-featured-writing-saraswati-lakshmi-and-the-ledger',
      title: 'Newest featured writing: The Polytheistic Test',
      body: 'Sathian’s newest featured writing is The Polytheistic Test. A question from one of his seven-year-old daughters becomes a framework for asking whether AI, crypto, and other technologies deepen human capability and create durable flourishing. Its interactive Saraswati test and Lakshmi test help readers inspect a model, product, protocol, company, or policy without treating the result as a universal score. The Solana Observatory is the primary worked example, with Tooth Fairy Network, Agent Allowance Lab, and the site assistant shown as other experiments.',
      summary: 'An interactive visual essay about knowledge, prosperity, AI, crypto, and what deserves to be built.',
      tags: ['latest-writing', 'featured-writing', 'saraswati', 'lakshmi', 'ai', 'crypto', 'solana', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger', kind: 'published_page' },
      validFrom: '2026-08-14T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'published-writing',
      slug: 'published-writing',
      title: 'Sathian’s published writing',
      body: 'Sathian publishes notes on culture, money, technology, fatherhood, and the products he is learning to build. His newest featured essay is The Polytheistic Test. The writing index is the canonical place to browse the current collection.',
      summary: 'Notes on culture, money, technology, fatherhood, and building in public.',
      tags: ['writing', 'articles', 'essays', 'culture', 'money', 'technology', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings', kind: 'published_page' },
      validFrom: '2026-08-14T00:00:00.000Z',
      validUntil: null,
    },
    currentPublicWorkCard(),
    {
      id: 'site-agent-capabilities',
      slug: 'site-agent-capabilities',
      title: 'How Sathian’s site agent can help',
      body: 'The site agent can explain and compare Sathian’s public projects, show the latest Draw with Tanda release, find Sathian’s writing, answer follow-up questions using the current conversation, and help a visitor deliberately leave Sathian a note with an optional reply address. It uses reviewed public context and gives one useful next step instead of a wall of links.',
      summary: 'A focused guide to Sathian’s projects, writing, releases, and confirmed note workflow.',
      tags: ['site-agent', 'capabilities', 'help', 'site-guide', 'navigation', 'public-context'],
      source: { ref: 'https://sathian.ai/#featured-work', kind: 'published_page' },
      validFrom: '2026-08-13T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'site-agent-note-workflow',
      slug: 'site-agent-note-workflow',
      title: 'How to leave Sathian a note',
      body: 'To leave Sathian a note, write your actual message in the note composer and add optional contact details only if you want a reply. Nothing is stored when you merely ask how notes work. The agent stores the note only when you deliberately send it, then returns a receipt if the intake succeeds.',
      summary: 'A deliberate note composer with optional reply details and a real intake receipt.',
      tags: ['site-agent', 'note', 'message', 'contact', 'receipt', 'intake'],
      source: { ref: 'https://sathian.ai/#compose-note', kind: 'published_page' },
      validFrom: '2026-08-13T00:00:00.000Z',
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
