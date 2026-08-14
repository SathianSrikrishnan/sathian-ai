import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = new URL('../../', import.meta.url)
const exists = (path: string) => existsSync(new URL(path, root))
const readSource = (path: string) => readFileSync(new URL(path, root), 'utf8')

describe('retired private Kai Voice surface', () => {
  it('removes the standalone page, dedicated APIs, and obsolete private-memory pipeline', () => {
    for (const path of [
      'src/app/voice/page.tsx',
      'src/app/voice/layout.tsx',
      'src/app/voice/about/page.tsx',
      'src/app/api/voice/conversation/route.ts',
      'src/app/api/voice/speak/route.ts',
      'src/app/api/voice/transcribe/route.ts',
      'src/lib/context-loader.ts',
      'src/lib/db-memory.ts',
      'SETUP-INSTRUCTIONS.md',
      'scripts/setup-db.js',
      'scripts/setup-database.sql',
      'scripts/migrate-context.js',
    ]) {
      expect(exists(path), `${path} should be retired`).toBe(false)
    }
  })

  it('removes voice-only SDK dependencies while preserving the shared TFN voiceover tool', () => {
    const packageJson = JSON.parse(readSource('package.json')) as {
      dependencies?: Record<string, string>
    }
    const colosseumVoiceover = readSource('src/app/api/toothfairy/colosseum/voiceover/route.ts')

    expect(packageJson.dependencies).not.toHaveProperty('@anthropic-ai/sdk')
    expect(packageJson.dependencies).not.toHaveProperty('@elevenlabs/elevenlabs-js')
    expect(exists('src/lib/voice-auth.ts')).toBe(true)
    expect(colosseumVoiceover).toContain('@/lib/voice-auth')
  })

  it('redirects old voice URLs to the public site agent instead of leaving a dead route', () => {
    const config = readSource('next.config.js')
    const robots = readSource('src/app/robots.ts')
    const middleware = readSource('src/middleware.ts')

    expect(config).toContain("source: '/voice/:path*'")
    expect(config).toContain("destination: '/#agent'")
    expect(robots).not.toContain("'/voice/'")
    expect(middleware).not.toContain("pathname.startsWith('/api/voice/')")
  })
})
