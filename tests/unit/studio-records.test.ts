import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  formatStudioReceipt,
  parseBuildNoteMutation,
  parseHomepageMutation,
  parseMemoryMutation,
} from '@/lib/studio/records'

const FIRST_ID = '11111111-1111-4111-8111-111111111111'
const SECOND_ID = '22222222-2222-4222-8222-222222222222'

describe('typed homepage records', () => {
  it('turns one complete, duplicate-free ID list into explicit positions', () => {
    expect(
      parseHomepageMutation(
        { kind: 'order', ids: [SECOND_ID, FIRST_ID] },
        new Set([FIRST_ID, SECOND_ID]),
      ),
    ).toEqual({
      ok: true,
      value: {
        kind: 'order',
        records: [
          { id: SECOND_ID, position: 0 },
          { id: FIRST_ID, position: 1 },
        ],
      },
    })
  })

  it('rejects duplicate, missing, and unknown section IDs', () => {
    const existing = new Set([FIRST_ID, SECOND_ID])

    expect(parseHomepageMutation({ kind: 'order', ids: [FIRST_ID, FIRST_ID] }, existing).ok).toBe(false)
    expect(parseHomepageMutation({ kind: 'order', ids: [FIRST_ID] }, existing).ok).toBe(false)
    expect(
      parseHomepageMutation(
        { kind: 'order', ids: [FIRST_ID, '33333333-3333-4333-8333-333333333333'] },
        existing,
      ).ok,
    ).toBe(false)
  })

  it('allows only the named section fields and rejects arbitrary HTML or widgets', () => {
    const existing = new Set([FIRST_ID])
    expect(
      parseHomepageMutation(
        {
          kind: 'section',
          id: FIRST_ID,
          fields: {
            heading: 'Proof of work, in public.',
            enabled: true,
            ctaHref: '/writings',
          },
        },
        existing,
      ).ok,
    ).toBe(true)

    expect(
      parseHomepageMutation(
        { kind: 'section', id: FIRST_ID, fields: { html: '<iframe src="bad"></iframe>' } },
        existing,
      ).ok,
    ).toBe(false)
  })
})

describe('public-memory review records', () => {
  it('accepts approval and expiry fields only', () => {
    expect(
      parseMemoryMutation({
        id: FIRST_ID,
        status: 'approved',
        visibility: 'public',
        validUntil: '2026-12-31T23:59:00.000Z',
      }),
    ).toEqual({
      ok: true,
      value: {
        id: FIRST_ID,
        status: 'approved',
        visibility: 'public',
        validUntil: '2026-12-31T23:59:00.000Z',
      },
    })
  })

  it('rejects unknown states and attempts to edit source content through the review endpoint', () => {
    expect(parseMemoryMutation({ id: FIRST_ID, status: 'live' }).ok).toBe(false)
    expect(parseMemoryMutation({ id: FIRST_ID, body: 'replace the memory' }).ok).toBe(false)
  })
})

describe('structured build notes', () => {
  const note = {
    title: 'A smaller, safer Studio',
    slug: 'a-smaller-safer-studio',
    project: 'sathian.ai',
    date: '2026-07-14',
    whatChanged: 'Replaced the shared password with a private two-step entrance.',
    whatLearned: 'Operator tools need the same boundary at every layer.',
    nextStep: 'Connect the reviewed control room data.',
    status: 'draft',
  }

  it('accepts a complete plain-text record', () => {
    expect(parseBuildNoteMutation(note)).toEqual({ ok: true, value: note })
  })

  it('rejects embedded markup and unknown component fields', () => {
    expect(parseBuildNoteMutation({ ...note, whatChanged: '<script>alert(1)</script>' }).ok).toBe(false)
    expect(parseBuildNoteMutation({ ...note, widget: 'weather' }).ok).toBe(false)
  })
})

describe('Studio display receipts', () => {
  it('shows a short receipt without exposing database IDs', () => {
    expect(formatStudioReceipt('a4e76c62-0cd2-4b84-92ef-0a364930087f')).toBe('A4E76C62')
  })
})

describe('control-room schema', () => {
  const migration = readFileSync(
    new URL('../../supabase/migrations/20260714_studio_control_room.sql', import.meta.url),
    'utf8',
  )

  it('stores homepage sections and build notes as constrained records', () => {
    expect(migration).toMatch(/create\s+table\s+homepage_sections/i)
    expect(migration).toMatch(/section_type[\s\S]{0,180}hero[\s\S]{0,180}projects/i)
    expect(migration).toMatch(/create\s+table\s+build_notes/i)
    expect(migration).toMatch(/what_changed\s+text\s+not\s+null/i)
    expect(migration).not.toMatch(/html\s+text|widget\s+json|component\s+json/i)
  })

  it('uses the same AAL2 Studio operator policy for both tables', () => {
    expect(migration).toMatch(/on\s+homepage_sections[\s\S]{0,180}is_studio_operator\(\)/i)
    expect(migration).toMatch(/on\s+build_notes[\s\S]{0,180}is_studio_operator\(\)/i)
  })
})
