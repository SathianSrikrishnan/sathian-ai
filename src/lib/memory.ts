import { createClient } from '@supabase/supabase-js'

import { createPublicMemoryRepository } from '@/lib/agent/public-memory'
import type {
  MemoryContext,
  PublicMemoryCard,
  PublicMemoryClient,
} from '@/lib/agent/types'
import { getTxOddsCampaignMemoryCards } from '@/lib/campaigns/txodds'

let publicMemoryClient: PublicMemoryClient | null | undefined

function getPublicMemoryClient(): PublicMemoryClient | null {
  if (publicMemoryClient !== undefined) return publicMemoryClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    publicMemoryClient = null
    return publicMemoryClient
  }

  publicMemoryClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as PublicMemoryClient

  return publicMemoryClient
}

export function buildMemoryContext(cards: PublicMemoryCard[]): MemoryContext {
  if (cards.length === 0) {
    return { content: '', sources: [] }
  }

  const sources = Array.from(new Set(cards.map((card) => card.source.ref)))
  const facts = cards.map((card) => `- ${card.title}: ${card.body}`).join('\n')

  return {
    content: `## Reviewed Public Memory\n${facts}`,
    sources,
  }
}

export async function getPublicMemoryCards(): Promise<PublicMemoryCard[]> {
  const campaignCards = getTxOddsCampaignMemoryCards()
  const client = getPublicMemoryClient()
  if (!client) return campaignCards

  try {
    const repository = createPublicMemoryRepository(client)
    const reviewedCards = await repository.findApproved()
    const cardsBySlug = new Map(
      [...reviewedCards, ...campaignCards].map((card) => [card.slug, card]),
    )
    return Array.from(cardsBySlug.values())
  } catch (error) {
    console.error('Public memory retrieval failed', error)
    return campaignCards
  }
}

export async function getMemoryContext(_message: string): Promise<MemoryContext> {
  return buildMemoryContext(await getPublicMemoryCards())
}
