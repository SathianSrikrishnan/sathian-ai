import { beforeEach, describe, expect, it, vi } from 'vitest'

import { articles } from '@/lib/articles'
import { PUBLISH_GATE_BASELINE, publishGate } from '@/lib/publish-gate'

const db = vi.hoisted(() => ({ current: null as Record<string, unknown> | null, writes: 0 }))

vi.mock('@/lib/supabase', () => {
  const chain = {
    from: () => chain,
    select: () => chain,
    eq: () => chain,
    order: () => chain,
    update: () => { db.writes += 1; return chain },
    insert: () => { db.writes += 1; return chain },
    single: async () => ({ data: db.current, error: null }),
  }
  return { supabase: chain, supabaseAdmin: chain }
})

const PLAIN = 'My girls outgrew every toy. We sold them all. Their savings are the one thing still here. That is why I built this.'
const HARD = 'The institutional infrastructure underpinning intergenerational wealth transmission necessitates sophisticated custodial arrangements that conventional financial intermediaries systematically fail to provide for families.'

function row(body: string, status: 'draft' | 'published', slug = 'new-essay') {
  return {
    id: 'a1', title: 'Theirs', title_highlight: null, slug, date: '2026-10-29', author: 'Sathian', domains: [],
    description: 'A gift that stays theirs.', read_time: '1 min', body, pull_quotes: [], theme: {}, media: null,
    section_headings: null, section_tints: null, special_elements: null, text_highlights: null, hidden_signal: null,
    status, sort_order: 0, created_at: '', updated_at: '',
  }
}

describe('publish gate', () => {
  it('every essay in the repo passes the gate', () => {
    for (const article of articles) {
      const gate = publishGate(article)
      expect(gate.reasons, article.slug).toEqual([])
    }
  })

  it('grandfathers only essays that exist', () => {
    const slugs = new Set(articles.map((a) => a.slug))
    for (const slug of Object.keys(PUBLISH_GATE_BASELINE)) expect(slugs.has(slug), slug).toBe(true)
  })

  it('passes plain writing and blocks hard writing for a new essay', () => {
    expect(publishGate({ slug: 'new-essay', title: 'Theirs', body: PLAIN }).ok).toBe(true)
    const blocked = publishGate({ slug: 'new-essay', title: 'Theirs', body: HARD })
    expect(blocked.ok).toBe(false)
    expect(blocked.reasons.join(' ')).toMatch(/Reading grade .* must be 5 or below/)
    expect(blocked.reasons.join(' ')).toMatch(/very hard sentence/)
  })

  it('blocks banned claims even in plain words', () => {
    for (const claim of ['Bitcoin has never been hacked.', 'It is risk-free.', 'You get 8% APY.', 'Our vault is audited.']) {
      expect(publishGate({ slug: 'new-essay', body: `${PLAIN} ${claim}` }).ok, claim).toBe(false)
    }
  })

  it('lets an old essay stay as it is but not get harder', () => {
    const old = articles.find((a) => a.slug === 'yakkos-world')!
    expect(publishGate(old).ok).toBe(true)
    expect(publishGate({ ...old, body: `${old.body}\n\n${HARD} ${HARD} ${HARD}` }).ok).toBe(false)
  })
})

describe('Studio writes go through the gate', () => {
  beforeEach(() => { db.current = null; db.writes = 0 })

  it('refuses to publish a hard draft and writes nothing', async () => {
    const { togglePublish, PublishGateError } = await import('@/lib/articles-db')
    db.current = row(HARD, 'draft')
    await expect(togglePublish('a1', 'published')).rejects.toBeInstanceOf(PublishGateError)
    expect(db.writes).toBe(0)
  })

  it('refuses to edit a published essay into hard writing', async () => {
    const { updateArticle, PublishGateError } = await import('@/lib/articles-db')
    db.current = row(PLAIN, 'published')
    await expect(updateArticle('a1', { body: HARD })).rejects.toBeInstanceOf(PublishGateError)
    expect(db.writes).toBe(0)
  })

  it('refuses to create a published essay that fails', async () => {
    const { createArticle, PublishGateError } = await import('@/lib/articles-db')
    await expect(createArticle({ slug: 'new-essay', title: 'Theirs', body: HARD, status: 'published' })).rejects.toBeInstanceOf(PublishGateError)
    expect(db.writes).toBe(0)
  })

  it('still saves drafts and publishes plain writing', async () => {
    const { togglePublish, updateArticle } = await import('@/lib/articles-db')
    db.current = row(HARD, 'draft')
    await updateArticle('a1', { body: HARD })
    expect(db.writes).toBe(1)
    db.current = row(PLAIN, 'draft')
    await togglePublish('a1', 'published')
    expect(db.writes).toBe(2)
  })
})
