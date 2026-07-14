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
  it('uses one unique numeric version for every migration', () => {
    const versions = migrationFiles.map(migrationVersion)

    expect(versions).toEqual(versions.map((version) => expect.stringMatching(/^\d{8,14}$/)))
    expect(new Set(versions).size).toBe(versions.length)
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
})
