import type {
  PublicMemoryCard,
  PublicMemoryClient,
  PublicMemoryRow,
} from '@/lib/agent/types'

const PUBLIC_MEMORY_COLUMNS = [
  'id',
  'slug',
  'title',
  'body',
  'summary',
  'tags',
  'source_ref',
  'source_kind',
  'visibility',
  'status',
  'valid_from',
  'valid_until',
  'approved_at',
].join(',')

function isCurrent(row: PublicMemoryRow, now: Date): boolean {
  if (row.visibility !== 'public' || row.status !== 'approved') return false
  if (!row.approved_at || !row.source_ref?.trim()) return false

  const timestamp = now.getTime()
  const validFrom = row.valid_from ? Date.parse(row.valid_from) : null
  const validUntil = row.valid_until ? Date.parse(row.valid_until) : null

  if (validFrom !== null && (!Number.isFinite(validFrom) || validFrom > timestamp)) return false
  if (validUntil !== null && (!Number.isFinite(validUntil) || validUntil <= timestamp)) return false

  return true
}

function toCard(row: PublicMemoryRow): PublicMemoryCard {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    summary: row.summary,
    tags: row.tags ?? [],
    source: {
      ref: row.source_ref,
      kind: row.source_kind,
    },
    validFrom: row.valid_from,
    validUntil: row.valid_until,
  }
}

export function createPublicMemoryRepository(client: PublicMemoryClient) {
  return {
    async findApproved(options: { now?: Date; limit?: number } = {}): Promise<PublicMemoryCard[]> {
      const now = options.now ?? new Date()
      const limit = Math.min(Math.max(options.limit ?? 24, 1), 100)
      const isoNow = now.toISOString()

      const { data, error } = await client
        .from('public_memory_cards')
        .select(PUBLIC_MEMORY_COLUMNS)
        .eq('visibility', 'public')
        .eq('status', 'approved')
        .not('source_ref', 'is', null)
        .neq('source_ref', '')
        .or(`valid_from.is.null,valid_from.lte.${isoNow}`)
        .or(`valid_until.is.null,valid_until.gt.${isoNow}`)
        .order('title', { ascending: true })
        .limit(limit)

      if (error) {
        throw new Error(`Public memory query failed: ${error.message}`)
      }

      return (data ?? []).filter((row) => isCurrent(row, now)).map(toCard)
    },
  }
}

export type PublicMemoryRepository = ReturnType<typeof createPublicMemoryRepository>
