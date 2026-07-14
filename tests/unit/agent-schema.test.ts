import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('../../supabase/migrations/20260714_public_agent_portal.sql', import.meta.url),
  'utf8',
)

const tables = [
  'public_memory_cards',
  'agent_sessions',
  'agent_messages',
  'agent_intakes',
  'agent_attachments',
  'routing_decisions',
  'delivery_outbox',
  'audit_events',
]

describe('public agent portal schema', () => {
  it.each(tables)('enables row-level security on %s', (table) => {
    expect(migration).toMatch(
      new RegExp(`alter\\s+table\\s+${table}\\s+enable\\s+row\\s+level\\s+security`, 'i'),
    )
  })

  it('does not grant anonymous intake listing, updates, or deletes', () => {
    expect(migration).toMatch(/revoke\s+all\s+on\s+agent_intakes\s+from\s+anon/i)
    expect(migration).not.toMatch(
      /create\s+policy[\s\S]{0,180}on\s+agent_intakes[\s\S]{0,180}to\s+anon/i,
    )
    expect(migration).not.toMatch(/grant\s+(select|update|delete)[\s\S]{0,80}agent_intakes[\s\S]{0,40}anon/i)
  })

  it('only exposes approved public memory within its validity window', () => {
    expect(migration).toMatch(/visibility\s*=\s*'public'/i)
    expect(migration).toMatch(/status\s*=\s*'approved'/i)
    expect(migration).toMatch(/valid_from\s+is\s+null\s+or\s+valid_from\s*<=\s*now\(\)/i)
    expect(migration).toMatch(/valid_until\s+is\s+null\s+or\s+valid_until\s*>\s*now\(\)/i)
    expect(migration).toMatch(/source_ref\s+text\s+not\s+null/i)
  })

  it('creates a private quarantine bucket without a public read policy', () => {
    expect(migration).toMatch(/'agent-quarantine'[\s\S]{0,160}false/i)
    expect(migration).not.toMatch(
      /create\s+policy[\s\S]{0,220}on\s+storage\.objects[\s\S]{0,220}to\s+(public|anon)/i,
    )
  })
})
