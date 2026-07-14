import { createClient } from '@supabase/supabase-js'

import { createPublicMemoryRepository } from '@/lib/agent/public-memory'
import type {
  MemoryContext,
  PublicMemoryCard,
  PublicMemoryClient,
} from '@/lib/agent/types'

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
  const client = getPublicMemoryClient()
  if (!client) return []

  try {
    const repository = createPublicMemoryRepository(client)
    return await repository.findApproved()
  } catch (error) {
    console.error('Public memory retrieval failed', error)
    return []
  }
}

export async function getMemoryContext(_message: string): Promise<MemoryContext> {
  return buildMemoryContext(await getPublicMemoryCards())
}
