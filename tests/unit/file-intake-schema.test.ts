import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL('../../supabase/migrations/20260714_agent_file_intake.sql', import.meta.url),
  'utf8',
)

describe('agent file-intake schema', () => {
  it('enforces one generated object per intake', () => {
    expect(migration).toMatch(/unique[\s\S]{0,100}agent_attachments[\s\S]{0,100}intake_id/i)
    expect(migration).toMatch(/'intakes\/'\s*\|\|[\s\S]{0,120}p_attachment_id/i)
    expect(migration).not.toMatch(/v_object_path\s*:=\s*[^;]*p_(?:original|sanitized)_filename/i)
  })

  it('keeps rate limiting durable and browser storage access unavailable', () => {
    expect(migration).toMatch(/create\s+table\s+agent_upload_rate_limits/i)
    expect(migration).toMatch(/create\s+or\s+replace\s+function\s+agent_consume_upload_rate_limit/i)
    expect(migration).toMatch(/drop\s+policy[\s\S]{0,100}studio reads agent quarantine objects/i)
    expect(migration).not.toMatch(/grant\s+select[\s\S]{0,120}storage\.objects[\s\S]{0,80}authenticated/i)
  })

  it('allows metadata delivery only after pending state clears', () => {
    expect(migration).toMatch(/attachment\.status\s+in\s*\(\s*'quarantined'\s*,\s*'approved'\s*\)/i)
    expect(migration).not.toMatch(/attachment\.status\s+in\s*\([^)]*'pending'/i)
  })
})
