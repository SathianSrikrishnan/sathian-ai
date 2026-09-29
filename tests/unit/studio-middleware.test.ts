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

  it('lets Studio in only through a verified Cloudflare Access JWT, never the old logins', () => {
    expect(middlewareSource).toMatch(/isStudioAccessGranted/)
    expect(middlewareSource).toMatch(/STUDIO_ACCESS_EMAILS/)
    expect(middlewareSource).not.toMatch(/decideStudioAccess|getAuthenticatorAssuranceLevel|studio_auth|STUDIO_PASSWORD|verifyStudioToken/)
  })

  it('sends Studio on any other host to studio.sathian.ai, where Access guards it', () => {
    expect(middlewareSource).toMatch(/hostname !== 'studio\.sathian\.ai'/)
    expect(middlewareSource).toMatch(/'https:\/\/studio\.sathian\.ai'\), 308/)
  })

  it('requires handler-level AAL2 authorization on every Studio article API', () => {
    for (const source of studioRouteSources) {
      expect(source).toMatch(/requireStudioAal2/)
    }
  })
})
