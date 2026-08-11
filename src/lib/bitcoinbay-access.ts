import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const BITCOINBAY_ACCESS_COOKIE = 'bitcoinbay_access'
export const BITCOINBAY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const TOKEN_VERSION = 'bitcoinbay-v1'
const MAX_FUTURE_SKEW_SECONDS = 60

type AccessEnvironment = Record<string, string | undefined>

export interface BitcoinBayAccessConfig {
  accessCode: string
  secret: string
}

function digest(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest()
}

function secureStringEqual(left: string, right: string): boolean {
  return timingSafeEqual(digest(left), digest(right))
}

function tokenPayload(issuedAtSeconds: number): string {
  return `${TOKEN_VERSION}.${issuedAtSeconds}`
}

function tokenSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex')
}

export function matchesAccessCode(provided: string, expected: string): boolean {
  if (!provided || !expected) return false
  return secureStringEqual(provided, expected)
}

export function createAccessToken(
  secret: string,
  issuedAtSeconds = Math.floor(Date.now() / 1000),
): string {
  const payload = tokenPayload(issuedAtSeconds)
  return `${payload}.${tokenSignature(payload, secret)}`
}

export function verifyAccessToken(
  token: string | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!token || !secret) return false

  const [version, issuedAtValue, suppliedSignature, extra] = token.split('.')
  if (extra || version !== TOKEN_VERSION || !/^\d+$/.test(issuedAtValue ?? '')) return false
  if (!/^[a-f0-9]{64}$/.test(suppliedSignature ?? '')) return false

  const issuedAtSeconds = Number(issuedAtValue)
  if (!Number.isSafeInteger(issuedAtSeconds)) return false
  if (issuedAtSeconds > nowSeconds + MAX_FUTURE_SKEW_SECONDS) return false
  if (nowSeconds - issuedAtSeconds > BITCOINBAY_COOKIE_MAX_AGE_SECONDS) return false

  const payload = tokenPayload(issuedAtSeconds)
  const expectedSignature = tokenSignature(payload, secret)
  return secureStringEqual(suppliedSignature, expectedSignature)
}

export function readAccessConfig(
  environment: AccessEnvironment = process.env,
): BitcoinBayAccessConfig | null {
  const accessCode = environment.BITCOINBAY_ACCESS_CODE?.trim() ?? ''
  const secret = environment.BITCOINBAY_GATE_SECRET?.trim() ?? ''

  if (!/^\d{4,8}$/.test(accessCode) || secret.length < 32) return null
  return { accessCode, secret }
}
