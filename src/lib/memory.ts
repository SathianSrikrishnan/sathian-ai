import { createClient } from '@supabase/supabase-js'

import { createPublicMemoryRepository } from '@/lib/agent/public-memory'
import type {
  MemoryContext,
  PublicMemoryCard,
  PublicMemoryClient,
} from '@/lib/agent/types'
import { getPublicProfileMemoryCards } from '@/lib/public-profile'

let publicMemoryClient: PublicMemoryClient | null | undefined

const RETIRED_PUBLIC_MEMORY_SLUGS = new Set([
  'sathian-ai-practice',
  'btc-cultural-atlas',
  'lex-rooftop-garden',
])

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

export function mergePublicMemoryCards(
  reviewedCards: PublicMemoryCard[],
  profileCards: PublicMemoryCard[],
): PublicMemoryCard[] {
  const currentReviewedCards = reviewedCards.filter(
    (card) => !RETIRED_PUBLIC_MEMORY_SLUGS.has(card.slug),
  )
  const cardsBySlug = new Map(
    [...currentReviewedCards, ...profileCards].map((card) => [card.slug, card]),
  )
  return Array.from(cardsBySlug.values())
}

export async function getPublicMemoryCards(): Promise<PublicMemoryCard[]> {
  const profileCards = getPublicProfileMemoryCards()
  const client = getPublicMemoryClient()
  if (!client) return profileCards

  try {
    const repository = createPublicMemoryRepository(client)
    const reviewedCards = await repository.findApproved()
    return mergePublicMemoryCards(reviewedCards, profileCards)
  } catch (error) {
    console.error('Public memory retrieval failed', error)
    return profileCards
  }
}

export async function getMemoryContext(_message: string): Promise<MemoryContext> {
  return buildMemoryContext(await getPublicMemoryCards())
}
