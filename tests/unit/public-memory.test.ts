import { describe, expect, it } from 'vitest'

import { createPublicMemoryRepository } from '@/lib/agent/public-memory'
import type { PublicMemoryClient } from '@/lib/agent/types'
import { buildMemoryContext } from '@/lib/memory'

type Row = Record<string, unknown>

function createClient(rows: Row[]) {
  const calls: unknown[][] = []
  const builder: Record<string, unknown> = {}

  for (const method of ['select', 'eq', 'not', 'neq', 'or', 'order', 'limit']) {
    builder[method] = (...args: unknown[]) => {
      calls.push([method, ...args])
      return builder
    }
  }

  builder.then = (resolve: (value: { data: Row[]; error: null }) => unknown) =>
    Promise.resolve(resolve({ data: rows, error: null }))

  return {
    calls,
    client: {
      from(table: string) {
        calls.push(['from', table])
        return builder
      },
    } as unknown as PublicMemoryClient,
  }
}

const now = new Date('2026-07-14T14:00:00.000Z')

const approvedCard = {
  id: '6df9bdeb-bf15-4737-ae64-03caaf6f2c82',
  slug: 'tooth-fairy-network',
  title: 'Tooth Fairy Network',
  body: 'A family memory ritual built around the moments of a lost tooth.',
  summary: null,
  tags: ['project'],
  source_ref: 'https://sathian.ai/writings/the-gap-between-weeks',
  source_kind: 'published_page',
  visibility: 'public',
  status: 'approved',
  valid_from: '2026-07-01T00:00:00.000Z',
  valid_until: null,
  approved_at: '2026-07-14T12:00:00.000Z',
}

describe('reviewed public memory repository', () => {
  it('requests only approved public cards inside their validity window', async () => {
    const { client, calls } = createClient([approvedCard])
    const repository = createPublicMemoryRepository(client)

    const cards = await repository.findApproved({ now })

    expect(cards).toHaveLength(1)
    expect(calls).toContainEqual(['eq', 'visibility', 'public'])
    expect(calls).toContainEqual(['eq', 'status', 'approved'])
    expect(calls).toContainEqual(['not', 'source_ref', 'is', null])
    expect(calls).toContainEqual(['neq', 'source_ref', ''])
    expect(calls).toContainEqual(['or', `valid_from.is.null,valid_from.lte.${now.toISOString()}`])
    expect(calls).toContainEqual(['or', `valid_until.is.null,valid_until.gt.${now.toISOString()}`])
  })

  it('defensively excludes drafts, expired, future, private, and unprovenanced rows', async () => {
    const rows = [
      approvedCard,
      { ...approvedCard, id: 'draft', status: 'draft' },
      { ...approvedCard, id: 'expired', valid_until: '2026-07-14T13:00:00.000Z' },
      { ...approvedCard, id: 'future', valid_from: '2026-07-15T00:00:00.000Z' },
      { ...approvedCard, id: 'private', visibility: 'private' },
      { ...approvedCard, id: 'missing-source', source_ref: '' },
    ]
    const { client } = createClient(rows)
    const repository = createPublicMemoryRepository(client)

    const cards = await repository.findApproved({ now })

    expect(cards.map((card) => card.id)).toEqual([approvedCard.id])
  })

  it('returns explicit source references with every card', async () => {
    const { client } = createClient([approvedCard])
    const repository = createPublicMemoryRepository(client)

    const [card] = await repository.findApproved({ now })

    expect(card.source).toEqual({
      ref: approvedCard.source_ref,
      kind: approvedCard.source_kind,
    })
  })

  it('returns an empty result without falling back to private memory', async () => {
    const { client } = createClient([])
    const repository = createPublicMemoryRepository(client)

    const cards = await repository.findApproved({ now })

    expect(cards).toEqual([])
    expect(buildMemoryContext(cards)).toEqual({ content: '', sources: [] })
  })
})
