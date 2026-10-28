import type { PublicMemoryCard } from '@/lib/agent/types'
import { LATEST_WRITING } from '@/content/latest-writing'
import { PROOF } from '@/content/proof'
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
export const TFN_GIFT_HREF = 'https://toothfairy.money/?utm_source=sathian.ai&utm_medium=site-agent&utm_campaign=agent'
const TFN_MAINNET_PROGRAM ='https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC'

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
  const otherActiveSummary = otherActive.length === 1
    ? `${otherActive[0].name} is another active public build.`
    : `${joinProjectNames(otherActive)} are also active public builds.`
  return {
    id: 'current-public-work',
    slug: 'current-public-work',
    title: 'What Sathian is building now',
    body: `Sathian's primary public build is ${primary?.name}. ${otherActiveSummary} Learn with Tanda at https://sathian.ai/learn is the free family-learning side: illustrated stories, short lessons and drawing videos. ${joinProjectNames(ARCHIVE_SITE_PROJECTS)} are archived portfolio projects, not current active builds.`,
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
    { id: 'proof-front-door', slug: 'proof-front-door', title: 'PROOF and founding families', body: PROOF.agentSummary, summary: PROOF.description, tags: ['proof', 'founding-families', 'seven-chapters'], source: { ref: PROOF.href, kind: 'published_page' }, validFrom: '2026-10-04T00:00:00.000Z', validUntil: null },
    {
      id: 'profile-search-identity',
      slug: 'sathian-search-identity',
      title: 'Sathian Srikrishnan',
      body: 'Sathian Srikrishnan is a founder and dad in Toronto. He builds products people love, starting with the ones his own children need. Today that is Tooth Fairy Network: a child’s first digital wallet and a personalized Vault Book, given by the people who love them. After ten years leading a startup he co-founded, he stepped away in 2025 to learn and build again, and he writes about what worked and what didn’t. He publishes publicly as Sathian.',
      summary: 'The canonical public identity connecting Sathian, Sathian Srikrishnan, and sathian.ai.',
      tags: ['bio', 'identity', 'sathian', 'sathian-srikrishnan'],
      source: { ref: 'https://sathian.ai/about', kind: 'published_profile' },
      validFrom: '2026-09-03T00:00:00.000Z',
      validUntil: null,
    },
    ...SITE_PROJECTS.map(projectToPublicMemoryCard),
    releaseToPublicMemoryCard(LATEST_RELEASE, { latest: true }),
    ...DRAW_WITH_TANDA_EPISODES
      .filter((release) => release.id !== LATEST_RELEASE.id)
      .map((release) => releaseToPublicMemoryCard(release)),
    {
      id: 'latest-featured-writing',
      slug: `latest-featured-writing-${LATEST_WRITING.slug}`,
      title: `Newest featured writing: ${LATEST_WRITING.title}`,
      body: `${LATEST_WRITING.agentSummary} Read the article at https://sathian.ai${LATEST_WRITING.href}. ${LATEST_WRITING.substackHref ? `Read and subscribe on Substack: ${LATEST_WRITING.substackHref}` : 'This piece is published on sathian.ai; no separate Substack edition is available.'}`,
      summary: LATEST_WRITING.description,
      tags: [...LATEST_WRITING.tags],
      source: { ref: `https://sathian.ai${LATEST_WRITING.href}`, kind: 'published_page' },
      validFrom: LATEST_WRITING.publishedAt,
      validUntil: null,
    },
    {
      id: 'featured-writing-inside-monkedao',
      slug: 'featured-writing-inside-monkedao',
      title: 'Featured writing: Inside MonkeDAO',
      body: 'Inside MonkeDAO is a firsthand field report and edited interview about how a Solana NFT collection became an operating community. Benny describes MonkeDAO’s origin, the role of in-person trust, and how MonkeFoundry helps founders move from introductions to useful support. Sathian adds his own early experience as an SMB Gen3 holder while clearly separating firsthand reporting from interpretation.',
      summary: 'A firsthand film and field report about ownership, participation, and community infrastructure on Solana.',
      tags: ['featured-writing', 'monkedao', 'solana', 'community', 'field-report', 'film'],
      source: { ref: 'https://sathian.ai/writings/inside-monkedao', kind: 'published_page' },
      validFrom: '2026-08-29T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'featured-writing-polytheistic-test',
      slug: 'featured-writing-saraswati-lakshmi-and-the-ledger',
      title: 'Featured writing: The Polytheistic Test',
      body: 'The Polytheistic Test turns a question from one of Sathian’s seven-year-old daughters into a framework for asking whether AI, crypto, and other technologies deepen human capability and create durable flourishing. Its interactive Saraswati test and Lakshmi test help readers inspect a model, product, protocol, company, or policy without treating the result as a universal score. The Solana Observatory is the primary worked example, with Tooth Fairy Network, Agent Allowance Lab, and the site assistant shown as other experiments.',
      summary: 'An interactive visual essay about knowledge, prosperity, AI, crypto, and what deserves to be built.',
      tags: ['featured-writing', 'saraswati', 'lakshmi', 'ai', 'crypto', 'solana', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger', kind: 'published_page' },
      validFrom: '2026-08-14T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'published-writing',
      slug: 'published-writing',
      title: 'Sathian’s published writing',
      body: `Sathian publishes notes on culture, money, technology, fatherhood, and the products he is learning to build. His newest featured work is ${LATEST_WRITING.title}, followed by Inside MonkeDAO and The Polytheistic Test. The writing index is the canonical place to browse the current collection. ${LATEST_WRITING.substackHref ? `The latest essay is also on Substack: ${LATEST_WRITING.substackHref}` : 'The latest piece is on sathian.ai.'}`,
      summary: 'Notes on culture, money, technology, fatherhood, and building in public.',
      tags: ['writing', 'articles', 'essays', 'culture', 'money', 'technology', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings', kind: 'published_page' },
      validFrom: '2026-08-14T00:00:00.000Z',
      validUntil: null,
    },
    currentPublicWorkCard(),
    {
      id: 'tfn-give-a-gift',
      slug: 'tfn-give-a-gift',
      title: 'Give a child their first digital wallet',
      body: 'Grandparents, aunts, uncles and friends give it as a gift: a personalized printed Vault Book with your message and picture, and US$10 for the child’s own vault in Dollars, Bitcoin or Solana. It is US$59 once, with standard shipping and tax included, in the US and Canada. You make the gift first; the child’s parent accepts it and controls the vault. It is not a bank account and is not insured.',
      summary: 'The US$59 Tooth Fairy Network gift: a printed Vault Book plus US$10 in the child’s parent-controlled vault.',
      tags: ['gift', 'buy', 'price', 'tooth-fairy-network', 'tooth-fairy-money', 'vault-book', 'first-wallet'],
      source: { ref: TFN_GIFT_HREF, kind: 'published_page' },
      validFrom: '2026-10-28T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'learn-with-tanda',
      slug: 'learn-with-tanda',
      title: 'Learn with Tanda',
      body: 'Learn with Tanda is the free family-learning side of Tooth Fairy Network. Children and grown-ups watch seven illustrated stories, try short lessons that make Bitcoin, Ethereum and Solana’s early design simple, and draw along with Tanda videos.',
      summary: 'Free illustrated stories, simple money lessons and drawing videos for families.',
      tags: ['learn', 'learn-with-tanda', 'tanda', 'stories', 'lessons', 'families', 'kids', 'draw-with-tanda'],
      source: { ref: 'https://sathian.ai/learn', kind: 'published_page' },
      validFrom: '2026-10-28T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'site-agent-capabilities',
      slug: 'site-agent-capabilities',
      title: 'How Sathian’s site agent can help',
      body: 'The site agent can explain and compare Sathian’s public projects, help you give a child their first digital wallet through Tooth Fairy Network, point families to Learn with Tanda, find Sathian’s writing, answer follow-up questions using the current conversation, and help a visitor deliberately leave Sathian a note with an optional reply address. It uses reviewed public context and gives one useful next step instead of a wall of links.',
      summary: 'A focused guide to Sathian’s projects, the Tooth Fairy Network gift, Learn with Tanda, writing, and confirmed note workflow.',
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
      body: 'Tooth Fairy Network’s executable Solana Mainnet program is deployed at FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC and governed by a recorded 2-of-3 Squads multisig. It is unpaused. Founder-controlled Mainnet canaries verified a 0.01 SOL deposit and a 1.00 canonical-USDC deposit. This proves the live contract rails; it does not mean the customer-facing USDC or on-ramp flow is released.',
      summary: 'A live, multisig-governed Mainnet program with verified SOL and canonical-USDC deposit canaries.',
      tags: ['tooth-fairy-network', 'toothlight', 'solana', 'mainnet', 'deposit', 'usdc', 'ownership', 'transparent-value-transfer'],
      source: { ref: TFN_MAINNET_PROGRAM, kind: 'verified_mainnet_program' },
      validFrom: '2026-07-30T00:00:00.000Z',
      validUntil: null,
    },
  ]
}
