// Cloudflare Access in front of studio.sathian.ai: Access signs every request it lets through with a
// short-lived RS256 JWT in the `Cf-Access-Jwt-Assertion` header. We verify it here (issuer, audience,
// expiry and signature against the team's published keys), so a forged or copied header, or a request
// that reaches Vercel directly, gets nothing. Off unless STUDIO_ACCESS_TEAM_DOMAIN and STUDIO_ACCESS_AUD
// are both set.

export type AccessConfig = { teamDomain: string; aud: string }
type Jwk = JsonWebKey & { kid?: string }
type Fetch = (url: string) => Promise<{ ok: boolean; json(): Promise<unknown> }>

const CERT_TTL_MS = 10 * 60 * 1000
let certCache: { url: string; at: number; keys: Jwk[] } | null = null

export function accessConfigFromEnv(env: Record<string, string | undefined> = process.env): AccessConfig | null {
  const teamDomain = env.STUDIO_ACCESS_TEAM_DOMAIN?.trim().replace(/\/+$/, '')
  const aud = env.STUDIO_ACCESS_AUD?.trim()
  if (!teamDomain || !aud || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain)) return null
  return { teamDomain, aud }
}

function b64urlBytes(part: string): Uint8Array<ArrayBuffer> {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((part.length + 3) % 4)
  const bin = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function b64urlJson(part: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(new TextDecoder().decode(b64urlBytes(part)))
    return v && typeof v === 'object' ? v as Record<string, unknown> : null
  } catch {
    return null
  }
}

async function accessKeys(teamDomain: string, fetchImpl: Fetch, now: number): Promise<Jwk[]> {
  const url = `${teamDomain}/cdn-cgi/access/certs`
  if (certCache && certCache.url === url && now - certCache.at < CERT_TTL_MS) return certCache.keys
  const res = await fetchImpl(url)
  if (!res.ok) throw new Error('access_certs_unavailable')
  const body = await res.json() as { keys?: Jwk[] }
  const keys = Array.isArray(body.keys) ? body.keys : []
  certCache = { url, at: now, keys }
  return keys
}

/** Returns the verified email, or null for anything missing, malformed, expired or not signed by Access. */
export async function verifyAccessJwt(
  token: string | null | undefined,
  config: AccessConfig,
  deps: { fetch?: Fetch; now?: number } = {},
): Promise<string | null> {
  if (!token || token.length > 8192) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const header = b64urlJson(parts[0])
  const claims = b64urlJson(parts[1])
  if (!header || !claims || header.alg !== 'RS256' || typeof header.kid !== 'string') return null

  const now = deps.now ?? Date.now()
  const nowSec = Math.floor(now / 1000)
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  if (claims.iss !== config.teamDomain || !aud.includes(config.aud)) return null
  if (typeof claims.exp !== 'number' || claims.exp <= nowSec) return null
  if (typeof claims.nbf === 'number' && claims.nbf > nowSec + 60) return null
  if (typeof claims.email !== 'string' || !claims.email) return null

  try {
    const fetchImpl = deps.fetch ?? ((u: string) => fetch(u))
    const jwk = (await accessKeys(config.teamDomain, fetchImpl, now)).find(k => k.kid === header.kid)
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`))
    return ok ? claims.email : null
  } catch {
    return null
  }
}

/**
 * Studio gate: true only when Access is configured, the request carries a valid Access JWT, and its email
 * is on STUDIO_ACCESS_EMAILS (separate from the Supabase STUDIO_ALLOWED_EMAILS). Access already required Google (or its email code) and only lets the
 * owner through; this is the app-side check that the header is genuine.
 */
export async function isStudioAccessGranted(
  headers: Headers,
  allowedEmails: ReadonlySet<string>,
  env: Record<string, string | undefined> = process.env,
  deps: { fetch?: Fetch; now?: number } = {},
): Promise<boolean> {
  const config = accessConfigFromEnv(env)
  if (!config) return false
  const email = await verifyAccessJwt(headers.get('cf-access-jwt-assertion'), config, deps)
  return Boolean(email && allowedEmails.has(email.trim().toLowerCase()))
}

/** Test hook: forget cached signing keys. */
export function resetAccessKeyCache() {
  certCache = null
}
