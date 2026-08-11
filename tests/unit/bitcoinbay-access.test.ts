import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Bitcoin Bay private proposal access', () => {
  it('has a dedicated server-side access module', () => {
    expect(existsSync(resolve(process.cwd(), 'src/lib/bitcoinbay-access.ts'))).toBe(true)
  })

  it('exposes the shared-code and signed-cookie access contract', async () => {
    const access = await import('@/lib/bitcoinbay-access')

    expect(typeof access.matchesAccessCode).toBe('function')
    expect(typeof access.createAccessToken).toBe('function')
    expect(typeof access.verifyAccessToken).toBe('function')
    expect(typeof access.readAccessConfig).toBe('function')
    expect(access.BITCOINBAY_ACCESS_COOKIE).toBe('bitcoinbay_access')
  })

  it('matches only the exact shared code', async () => {
    const { matchesAccessCode } = await import('@/lib/bitcoinbay-access')

    expect(matchesAccessCode('4826', '4826')).toBe(true)
    expect(matchesAccessCode('4827', '4826')).toBe(false)
    expect(matchesAccessCode('48260', '4826')).toBe(false)
    expect(matchesAccessCode('', '4826')).toBe(false)
  })

  it('signs access tokens and rejects tampering, expiry, and future timestamps', async () => {
    const {
      BITCOINBAY_COOKIE_MAX_AGE_SECONDS,
      createAccessToken,
      verifyAccessToken,
    } = await import('@/lib/bitcoinbay-access')
    const secret = 'a-production-grade-secret-that-is-long-enough'
    const issuedAt = 1_800_000_000
    const token = createAccessToken(secret, issuedAt)
    const tamperedToken = `${token.slice(0, -1)}${token.endsWith('0') ? '1' : '0'}`

    expect(verifyAccessToken(token, secret, issuedAt + 30)).toBe(true)
    expect(verifyAccessToken(tamperedToken, secret, issuedAt + 30)).toBe(false)
    expect(verifyAccessToken(token, 'the-wrong-production-secret-value', issuedAt + 30)).toBe(false)
    expect(verifyAccessToken(token, secret, issuedAt + BITCOINBAY_COOKIE_MAX_AGE_SECONDS + 1)).toBe(false)
    expect(verifyAccessToken(token, secret, issuedAt - 61)).toBe(false)
    expect(verifyAccessToken(undefined, secret, issuedAt)).toBe(false)
  })

  it('fails closed when the server configuration is absent or weak', async () => {
    const { readAccessConfig } = await import('@/lib/bitcoinbay-access')

    expect(readAccessConfig({})).toBeNull()
    expect(readAccessConfig({ BITCOINBAY_ACCESS_CODE: '4826' })).toBeNull()
    expect(readAccessConfig({
      BITCOINBAY_ACCESS_CODE: '24',
      BITCOINBAY_GATE_SECRET: 'a-production-grade-secret-that-is-long-enough',
    })).toBeNull()
    expect(readAccessConfig({
      BITCOINBAY_ACCESS_CODE: '4826',
      BITCOINBAY_GATE_SECRET: 'short',
    })).toBeNull()
    expect(readAccessConfig({
      BITCOINBAY_ACCESS_CODE: '4826',
      BITCOINBAY_GATE_SECRET: 'a-production-grade-secret-that-is-long-enough',
    })).toEqual({
      accessCode: '4826',
      secret: 'a-production-grade-secret-that-is-long-enough',
    })
  })
})
