import type { PublicMemoryCard } from '@/lib/agent/types'
import {
  CLINICAL_GUARD_PROJECT,
  DRAW_WITH_TANDA_EPISODES,
  LATEST_RELEASE,
  type SiteRelease,
} from '@/content/site-releases'

const ABOUT_SOURCE = 'https://sathian.ai/about'
const TOOTHLIGHT_DEVNET_PROOF = 'https://explorer.solana.com/tx/2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke?cluster=devnet'

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
    releaseToPublicMemoryCard(LATEST_RELEASE, { latest: true }),
    ...DRAW_WITH_TANDA_EPISODES
      .filter((release) => release.id !== LATEST_RELEASE.id)
      .map((release) => releaseToPublicMemoryCard(release)),
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
      id: 'profile-current-chapter',
      slug: 'sathian-current-chapter',
      title: 'Sathian’s current chapter',
      body: 'Sathian is a builder, father, and student again in his 40s, based in Toronto. He is increasingly active in the Toronto technology community and is learning in public across AI agents, Solana, Web3, and product building. Many of the builders teaching him the most are closer to his children’s age than his own, which he finds humbling and energizing.',
      summary: 'A builder and student again in his 40s, learning in public from Toronto.',
      tags: ['bio', 'toronto', 'student', 'ai', 'solana', 'current-work'],
      source: { ref: ABOUT_SOURCE, kind: 'published_profile' },
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
      source: { ref: ABOUT_SOURCE, kind: 'published_profile' },
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
      source: { ref: ABOUT_SOURCE, kind: 'published_profile' },
      validFrom: '2026-07-15T00:00:00.000Z',
      validUntil: null,
    },
    {
      id: 'toothlight-devnet-ownership-proof',
      slug: 'toothlight-devnet-ownership-proof',
      title: 'Toothlight ownership proof on Solana devnet',
      body: 'On July 15, 2026, Tooth Fairy Network minted one synthetic private-provenance Toothlight on Solana devnet to a disposable guardian wallet. Metaplex DAS independently verified asset ID 4QnZV6aJ4jZLujSZZ3hUWJoQ9acSetyifcKVufYK4E9U, its owner, tree, and metadata. A Toothlight separates a private memory vault, an optional guardian-owned digital keepsake for verifiable ownership and provenance, and an optional future fund. The child\'s artwork and parent\'s future letter stay off-chain and private by default. Production and mainnet were unchanged. The Bubblegum V1 proof validates the ownership path while the recommended Bubblegum V2 path is evaluated for production.',
      summary: 'A synthetic devnet Toothlight proved the ownership path while real family memories stayed private.',
      tags: ['tooth-fairy-network', 'toothlight', 'solana', 'devnet', 'privacy', 'ownership', 'provenance'],
      source: { ref: TOOTHLIGHT_DEVNET_PROOF, kind: 'verified_devnet_receipt' },
      validFrom: '2026-07-15T00:00:00.000Z',
      validUntil: null,
    },
  ]
}
