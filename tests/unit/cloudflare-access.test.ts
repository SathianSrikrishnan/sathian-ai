import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { accessConfigFromEnv, isStudioAccessGranted, resetAccessKeyCache, verifyAccessJwt } from '@/lib/cloudflare-access'

const TEAM = 'https://kai-mobile.cloudflareaccess.com'
const AUD = 'studio-aud-123'
const NOW = 1_790_000_000_000
const allowed = new Set(['sathians@gmail.com'])
const env = { STUDIO_ACCESS_TEAM_DOMAIN: TEAM, STUDIO_ACCESS_AUD: AUD }

let signer: CryptoKeyPair
let other: CryptoKeyPair
let jwks: { keys: JsonWebKey[] }

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const enc = (v: unknown) => b64url(new TextEncoder().encode(JSON.stringify(v)))

async function jwt(claims: Record<string, unknown>, key = signer.privateKey, kid = 'k1') {
  const head = enc({ alg: 'RS256', kid, typ: 'JWT' })
  const body = enc({ iss: TEAM, aud: [AUD], email: 'sathians@gmail.com', exp: NOW / 1000 + 300, nbf: NOW / 1000 - 5, ...claims })
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${body}`))
  return `${head}.${body}.${b64url(new Uint8Array(sig))}`
}

const fetchCerts = async () => ({ ok: true, json: async () => jwks })
const deps = { fetch: fetchCerts, now: NOW }
const cfg = { teamDomain: TEAM, aud: AUD }

beforeAll(async () => {
  const alg = { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }
  signer = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']) as CryptoKeyPair
  other = await crypto.subtle.generateKey(alg, true, ['sign', 'verify']) as CryptoKeyPair
  jwks = { keys: [{ ...(await crypto.subtle.exportKey('jwk', signer.publicKey)), kid: 'k1' } as JsonWebKey] }
})
beforeEach(() => resetAccessKeyCache())

describe('Cloudflare Access JWT for Studio', () => {
  it('is off unless both env values are set and the team domain is a cloudflareaccess.com origin', () => {
    expect(accessConfigFromEnv({})).toBeNull()
    expect(accessConfigFromEnv({ STUDIO_ACCESS_TEAM_DOMAIN: TEAM })).toBeNull()
    expect(accessConfigFromEnv({ STUDIO_ACCESS_TEAM_DOMAIN: 'https://evil.example.com', STUDIO_ACCESS_AUD: AUD })).toBeNull()
    expect(accessConfigFromEnv({ STUDIO_ACCESS_TEAM_DOMAIN: `${TEAM}/`, STUDIO_ACCESS_AUD: AUD })).toEqual(cfg)
  })

  it('accepts a genuine token and returns its email', async () => {
    expect(await verifyAccessJwt(await jwt({}), cfg, deps)).toBe('sathians@gmail.com')
  })

  it('rejects a token signed by another key, an unknown kid, or a tampered body', async () => {
    expect(await verifyAccessJwt(await jwt({}, other.privateKey), cfg, deps)).toBeNull()
    expect(await verifyAccessJwt(await jwt({}, signer.privateKey, 'nope'), cfg, deps)).toBeNull()
    const [h, , s] = (await jwt({})).split('.')
    expect(await verifyAccessJwt(`${h}.${enc({ iss: TEAM, aud: [AUD], email: 'x@y.z', exp: NOW / 1000 + 300 })}.${s}`, cfg, deps)).toBeNull()
  })

  it('rejects wrong issuer, wrong audience, expired, and missing or garbage tokens', async () => {
    expect(await verifyAccessJwt(await jwt({ iss: 'https://other.cloudflareaccess.com' }), cfg, deps)).toBeNull()
    expect(await verifyAccessJwt(await jwt({ aud: ['hub-aud'] }), cfg, deps)).toBeNull()
    expect(await verifyAccessJwt(await jwt({ exp: NOW / 1000 - 1 }), cfg, deps)).toBeNull()
    expect(await verifyAccessJwt(null, cfg, deps)).toBeNull()
    expect(await verifyAccessJwt('a.b.c', cfg, deps)).toBeNull()
  })

  it('grants Studio only to an allowed email with a valid token', async () => {
    const h = (t: string) => new Headers({ 'cf-access-jwt-assertion': t })
    expect(await isStudioAccessGranted(h(await jwt({})), allowed, env, deps)).toBe(true)
    expect(await isStudioAccessGranted(h(await jwt({ email: 'someone@else.com' })), allowed, env, deps)).toBe(false)
    expect(await isStudioAccessGranted(h(await jwt({})), allowed, {}, deps)).toBe(false)
    expect(await isStudioAccessGranted(new Headers(), allowed, env, deps)).toBe(false)
  })
})
