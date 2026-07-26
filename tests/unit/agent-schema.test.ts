import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('../../supabase/migrations/20260714090000_public_agent_portal.sql', import.meta.url),
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

  it('persists intake and its outbox event through a service-only idempotent RPC', () => {
    expect(migration).toMatch(/create\s+or\s+replace\s+function\s+agent_create_intake/i)
    expect(migration).toMatch(/insert\s+into\s+agent_intakes/i)
    expect(migration).toMatch(/insert\s+into\s+delivery_outbox/i)
    expect(migration).toMatch(/where\s+dedupe_key\s*=\s*p_idempotency_key/i)
    expect(migration).toMatch(/revoke\s+all\s+on\s+function\s+agent_create_intake[\s\S]{0,120}from\s+public/i)
    expect(migration).toMatch(/grant\s+execute\s+on\s+function\s+agent_create_intake[\s\S]{0,180}to\s+service_role/i)
  })

  it('claims ready delivery rows atomically and exposes delivery transitions only to services', () => {
    expect(migration).toMatch(/create\s+or\s+replace\s+function\s+agent_claim_delivery_batch/i)
    expect(migration).toMatch(/for\s+update\s+skip\s+locked/i)
    expect(migration).toMatch(/status\s+in\s*\(\s*'pending'\s*,\s*'failed'\s*\)/i)
    expect(migration).toMatch(/create\s+or\s+replace\s+function\s+agent_mark_delivery_succeeded/i)
    expect(migration).toMatch(/create\s+or\s+replace\s+function\s+agent_mark_delivery_failed/i)
    expect(migration).toMatch(/revoke\s+all\s+on\s+function\s+agent_claim_delivery_batch[\s\S]{0,180}from\s+public/i)
    expect(migration).toMatch(/grant\s+execute\s+on\s+function\s+agent_claim_delivery_batch[\s\S]{0,220}to\s+service_role/i)
  })

  it('requires both the Studio admin role and AAL2 for operator policies', () => {
    expect(migration).toMatch(/auth\.jwt\(\)\s*->\s*'app_metadata'\s*->>\s*'role'[\s\S]{0,80}=\s*'studio_admin'/i)
    expect(migration).toMatch(/auth\.jwt\(\)\s*->>\s*'aal'[\s\S]{0,80}=\s*'aal2'/i)
    expect(migration).toMatch(/using\s*\(is_studio_operator\(\)\)/i)
  })
})
