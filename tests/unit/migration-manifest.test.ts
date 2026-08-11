import { readdirSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const migrationsUrl = new URL('../../supabase/migrations/', import.meta.url)
const migrationFiles = readdirSync(migrationsUrl)
  .filter((name) => name.endsWith('.sql'))
  .sort()

function migrationVersion(name: string) {
  return name.split('_', 1)[0]
}

function migrationContaining(pattern: RegExp) {
  return migrationFiles.find((name) =>
    pattern.test(readFileSync(new URL(name, migrationsUrl), 'utf8')),
  )
}

describe('Supabase migration manifest', () => {
  it('uses one unique numeric version for every migration, including the shared legacy baseline', () => {
    const versions = migrationFiles.map(migrationVersion)

    expect(versions).toEqual(versions.map((version) => expect.stringMatching(/^\d{4,14}$/)))
    expect(new Set(versions).size).toBe(versions.length)
    expect(migrationFiles.slice(0, 3)).toEqual([
      '0001_initial_schema.sql',
      '0002_family_workspace.sql',
      '0003_family_garden_savings.sql',
    ])
  })

  it('creates the public-agent schema before dependent migrations alter it', () => {
    const base = migrationContaining(/create\s+table\s+agent_attachments/i)
    const fileIntake = migrationContaining(/create\s+table\s+agent_upload_rate_limits/i)
    const studio = migrationContaining(/create\s+table\s+homepage_sections/i)

    expect(base).toBeDefined()
    expect(fileIntake).toBeDefined()
    expect(studio).toBeDefined()
    expect(migrationFiles.indexOf(base!)).toBeLessThan(migrationFiles.indexOf(fileIntake!))
    expect(migrationFiles.indexOf(base!)).toBeLessThan(migrationFiles.indexOf(studio!))
  })

  it('adds a service-only durable message rate limit', () => {
    const rateLimitMigration = migrationContaining(/create\s+table\s+agent_message_rate_limits/i)

    expect(rateLimitMigration).toBeDefined()
    const source = readFileSync(new URL(rateLimitMigration!, migrationsUrl), 'utf8')
    expect(source).toMatch(/alter\s+table\s+agent_message_rate_limits\s+enable\s+row\s+level\s+security/i)
    expect(source).toMatch(/create\s+or\s+replace\s+function\s+agent_consume_message_rate_limit/i)
    expect(source).toMatch(/grant\s+execute[\s\S]{0,180}agent_consume_message_rate_limit[\s\S]{0,180}service_role/i)
    expect(source).not.toMatch(/grant[\s\S]{0,100}agent_message_rate_limits[\s\S]{0,80}(?:anon|authenticated)/i)
  })

  it('keeps the private quarantine bucket at the five-megabyte launch ceiling', () => {
    const storageLimitMigration = migrationContaining(
      /update\s+storage\.buckets[\s\S]{0,220}file_size_limit\s*=\s*5242880/i,
    )

    expect(storageLimitMigration).toBeDefined()
  })

  it('retires the two TxODDS campaign cards without deleting public-memory history', () => {
    const retirementMigration = migrationContaining(/txodds-canada-referral-sprint/i)

    expect(retirementMigration).toBeDefined()
    const source = readFileSync(new URL(retirementMigration!, migrationsUrl), 'utf8')
    expect(source).toMatch(/update\s+public_memory_cards[\s\S]*status\s*=\s*'retired'/i)
    expect(source).toContain('txodds-world-cup-hackathon')
    expect(source).not.toMatch(/delete\s+from\s+public_memory_cards/i)
  })

  it('retires stale portfolio cards and refreshes TFN without deleting public-memory history', () => {
    const refreshMigration = migrationContaining(/sathian-ai-practice[\s\S]*lex-rooftop-garden/i)

    expect(refreshMigration).toBeDefined()
    const source = readFileSync(new URL(refreshMigration!, migrationsUrl), 'utf8')
    expect(source).toContain('btc-cultural-atlas')
    expect(source).toContain('tooth-fairy-network')
    expect(source).toMatch(/status\s*=\s*'retired'/i)
    expect(source).not.toMatch(/delete\s+from\s+public_memory_cards/i)
  })
})
