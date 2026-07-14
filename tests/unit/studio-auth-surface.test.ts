import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8')
}

describe('Studio passwordless entrance', () => {
  it('asks for email without retaining the legacy password entrance', () => {
    const login = source('../../src/app/studio/login/page.tsx')

    expect(login).toMatch(/type=["']email["']/)
    expect(login).toMatch(/If this address is approved/i)
    expect(login).not.toMatch(/type=["']password["']|Wrong password|STUDIO_PASSWORD/)
  })

  it('uses a fixed callback and prevents sign-up through the auth endpoint', () => {
    const route = source('../../src/app/api/studio/auth/route.ts')
    const authorization = source('../../src/lib/studio-authorization.ts')

    expect(route).toMatch(/STUDIO_ALLOWED_EMAILS/)
    expect(route).toMatch(/resolveStudioPublicOrigin/)
    expect(authorization).toMatch(/shouldCreateUser:\s*false/)
    expect(authorization).not.toMatch(/headers\.get\(['"]host|x-forwarded-host/i)
  })

  it('exchanges only supported confirmation credentials and removes them from the next URL', () => {
    const confirm = source('../../src/app/studio/auth/confirm/route.ts')

    expect(confirm).toMatch(/exchangeCodeForSession/)
    expect(confirm).toMatch(/verifyOtp/)
    expect(confirm).toMatch(/token_hash/)
    expect(confirm).toMatch(/\/studio\/mfa/)
    expect(confirm).not.toMatch(/headers\.get\(['"]host|x-forwarded-host/i)
  })

  it('removes private navigation and the public chat widget from entrance pages', () => {
    const navigation = source('../../src/app/studio/StudioNavigation.tsx')
    const chatWidget = source('../../src/components/ChatWidget.tsx')

    expect(navigation).toMatch(/pathname.*studio\/login/s)
    expect(navigation).toMatch(/pathname.*studio\/mfa/s)
    expect(chatWidget).toMatch(/pathname\?\.startsWith\(['"]\/studio['"]\)/)
  })
})

describe('Studio TOTP checkpoint', () => {
  it('supports enrollment, a QR code, and a six-digit verification challenge', () => {
    const mfa = source('../../src/app/studio/mfa/page.tsx')

    expect(mfa).toMatch(/factorType:\s*['"]totp['"]/)
    expect(mfa).toMatch(/qr_code/)
    expect(mfa).toMatch(/challengeAndVerify/)
    expect(mfa).toMatch(/inputMode=["']numeric["']/)
    expect(mfa).toMatch(/maxLength=\{6\}/)
  })

  it('does not persist or log the authenticator secret', () => {
    const mfa = source('../../src/app/studio/mfa/page.tsx')

    expect(mfa).not.toMatch(/localStorage|sessionStorage|console\.(log|info|debug)/)
  })
})
