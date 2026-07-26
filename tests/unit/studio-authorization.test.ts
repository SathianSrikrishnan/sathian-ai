import { describe, expect, it, vi } from 'vitest'

import {
  decideStudioAccess,
  isStudioEmailAllowed,
  parseStudioAllowedEmails,
  requestStudioMagicLink,
  resolveStudioPublicOrigin,
} from '@/lib/studio-authorization'

describe('Studio email allowlist', () => {
  it('normalizes configured addresses and compares them case-insensitively', () => {
    const allowed = parseStudioAllowedEmails(' Sathian@Example.com, operator@example.com ')

    expect(Array.from(allowed)).toEqual(['sathian@example.com', 'operator@example.com'])
    expect(isStudioEmailAllowed('SATHIAN@example.com', allowed)).toBe(true)
    expect(isStudioEmailAllowed('visitor@example.com', allowed)).toBe(false)
  })

  it('fails closed when the allowlist is empty', () => {
    expect(isStudioEmailAllowed('sathian@example.com', parseStudioAllowedEmails(undefined))).toBe(false)
  })
})

describe('Studio magic-link requests', () => {
  it('does not call Supabase for an email outside the allowlist', async () => {
    const signInWithOtp = vi.fn()

    const result = await requestStudioMagicLink(
      { email: 'unknown@example.com' },
      {
        allowedEmails: parseStudioAllowedEmails('sathian@example.com'),
        publicOrigin: 'https://sathian.ai',
        signInWithOtp,
      },
    )

    expect(result).toEqual({ kind: 'accepted' })
    expect(signInWithOtp).not.toHaveBeenCalled()
  })

  it('prevents account creation and keeps the PKCE callback on the Studio origin', async () => {
    const signInWithOtp = vi.fn().mockResolvedValue({ error: null })

    const result = await requestStudioMagicLink(
      { email: 'Sathian@example.com' },
      {
        allowedEmails: parseStudioAllowedEmails('sathian@example.com'),
        publicOrigin: 'https://studio.sathian.ai',
        signInWithOtp,
      },
    )

    expect(result).toEqual({ kind: 'accepted' })
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'sathian@example.com',
      options: {
        shouldCreateUser: false,
        emailRedirectTo: 'https://studio.sathian.ai/studio/auth/confirm',
      },
    })
  })

  it('reports delivery failure when the provider declines an approved request', async () => {
    const signInWithOtp = vi.fn().mockResolvedValue({ error: new Error('provider unavailable') })

    const result = await requestStudioMagicLink(
      { email: 'sathian@example.com' },
      {
        allowedEmails: parseStudioAllowedEmails('sathian@example.com'),
        publicOrigin: 'https://sathian.ai',
        signInWithOtp,
      },
    )

    expect(result).toEqual({ kind: 'delivery_failed' })
  })

  it('rejects malformed email before checking the provider', async () => {
    const signInWithOtp = vi.fn()

    const result = await requestStudioMagicLink(
      { email: 'not-an-email' },
      {
        allowedEmails: parseStudioAllowedEmails('sathian@example.com'),
        publicOrigin: 'https://sathian.ai',
        signInWithOtp,
      },
    )

    expect(result).toEqual({ kind: 'invalid_email' })
    expect(signInWithOtp).not.toHaveBeenCalled()
  })
})

describe('Studio redirect origin', () => {
  it('uses only the canonical Studio origin in production', () => {
    expect(resolveStudioPublicOrigin({ nodeEnv: 'production' })).toBe('https://studio.sathian.ai')
    expect(
      resolveStudioPublicOrigin({
        nodeEnv: 'production',
        configuredOrigin: 'https://attacker.example',
      }),
    ).toBeNull()
  })

  it('allows only explicit local development origins outside production', () => {
    expect(
      resolveStudioPublicOrigin({
        nodeEnv: 'development',
        configuredOrigin: 'http://localhost:3000/',
      }),
    ).toBe('http://localhost:3000')
    expect(
      resolveStudioPublicOrigin({
        nodeEnv: 'development',
        configuredOrigin: 'http://localhost:9999',
      }),
    ).toBeNull()
  })
})

describe('Studio authorization decisions', () => {
  const approvedAal1 = {
    hasUser: true,
    emailAllowed: true,
    hasStudioRole: true,
    aal: 'aal1' as const,
  }
  const approvedAal2 = { ...approvedAal1, aal: 'aal2' as const }

  it('keeps login, confirmation, and the sign-in endpoint public', () => {
    expect(decideStudioAccess({ pathname: '/studio/login' })).toEqual({ kind: 'allow' })
    expect(decideStudioAccess({ pathname: '/studio/auth/confirm' })).toEqual({ kind: 'allow' })
    expect(decideStudioAccess({ pathname: '/api/studio/auth' })).toEqual({ kind: 'allow' })
  })

  it('redirects an unauthenticated page and rejects an unauthenticated API', () => {
    expect(decideStudioAccess({ pathname: '/studio' })).toEqual({
      kind: 'redirect',
      location: '/studio/login',
    })
    expect(decideStudioAccess({ pathname: '/api/studio/articles' })).toEqual({
      kind: 'deny',
      status: 401,
      code: 'unauthorized',
    })
  })

  it('sends AAL1 pages to MFA, lets the MFA page enroll, and blocks AAL1 APIs', () => {
    expect(decideStudioAccess({ pathname: '/studio', ...approvedAal1 })).toEqual({
      kind: 'redirect',
      location: '/studio/mfa',
    })
    expect(decideStudioAccess({ pathname: '/studio/mfa', ...approvedAal1 })).toEqual({
      kind: 'allow',
    })
    expect(decideStudioAccess({ pathname: '/api/studio/articles', ...approvedAal1 })).toEqual({
      kind: 'deny',
      status: 403,
      code: 'mfa_required',
    })
  })

  it('allows AAL2 Studio pages and APIs only when email and role are approved', () => {
    expect(decideStudioAccess({ pathname: '/studio', ...approvedAal2 })).toEqual({ kind: 'allow' })
    expect(decideStudioAccess({ pathname: '/api/studio/articles', ...approvedAal2 })).toEqual({
      kind: 'allow',
    })
    expect(
      decideStudioAccess({ pathname: '/studio', ...approvedAal2, emailAllowed: false }),
    ).toEqual({ kind: 'redirect', location: '/studio/login?error=not_authorized' })
    expect(
      decideStudioAccess({ pathname: '/api/studio/articles', ...approvedAal2, hasStudioRole: false }),
    ).toEqual({ kind: 'deny', status: 403, code: 'forbidden' })
  })

  it('moves an already verified operator away from the MFA setup page', () => {
    expect(decideStudioAccess({ pathname: '/studio/mfa', ...approvedAal2 })).toEqual({
      kind: 'redirect',
      location: '/studio',
    })
  })
})
