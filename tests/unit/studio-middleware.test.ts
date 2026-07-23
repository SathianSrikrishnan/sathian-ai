import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const middlewareSource = readFileSync(
  new URL('../../src/middleware.ts', import.meta.url),
  'utf8',
)
const playwrightSource = readFileSync(
  new URL('../../playwright.config.ts', import.meta.url),
  'utf8',
)

const studioRouteSources = [
  '../../src/app/api/studio/articles/route.ts',
  '../../src/app/api/studio/articles/[id]/route.ts',
  '../../src/app/api/studio/articles/[id]/publish/route.ts',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'))

describe('Studio authorization enforcement', () => {
  it('routes the Studio subdomain root into the existing Studio', () => {
    expect(middlewareSource).toMatch(/hostname\s*===\s*'studio\.sathian\.ai'/)
    expect(middlewareSource).toMatch(/pathname\s*===\s*'\/'[\s\S]*new URL\('\/studio'/)
  })

  it('allows browser-test bypass only outside production', () => {
    expect(middlewareSource).toMatch(/NODE_ENV\s*!==\s*'production'/)
    expect(middlewareSource).toMatch(/STUDIO_E2E_BYPASS\s*===\s*'true'/)
    expect(playwrightSource).toMatch(/STUDIO_E2E_BYPASS:\s*'true'/)
  })

  it('uses Supabase AAL authorization instead of the legacy password cookie', () => {
    expect(middlewareSource).toMatch(/decideStudioAccess/)
    expect(middlewareSource).toMatch(/getAuthenticatorAssuranceLevel/)
    expect(middlewareSource).not.toMatch(/studio_auth|STUDIO_PASSWORD|verifyStudioToken/)
  })

  it('requires handler-level AAL2 authorization on every Studio article API', () => {
    for (const source of studioRouteSources) {
      expect(source).toMatch(/requireStudioAal2/)
    }
  })
})
