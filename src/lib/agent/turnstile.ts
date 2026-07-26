interface TurnstileVerificationResponse {
  success?: unknown
  hostname?: unknown
  action?: unknown
}

function visitorIp(request: Request): string | null {
  return request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
}

export async function verifyFileIntakeHuman(input: {
  token: string
  request: Request
  idempotencyKey: string
}): Promise<boolean> {
  const endpoint = process.env.TURNSTILE_VERIFY_URL
  if (!endpoint) throw new Error('turnstile_verify_url_missing')

  const url = new URL(endpoint)
  if (url.protocol !== 'https:') throw new Error('turnstile_verify_url_must_be_https')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: input.token,
      remoteip: visitorIp(input.request),
      idempotency_key: /^[a-f0-9-]{36}$/i.test(input.idempotencyKey)
        ? input.idempotencyKey
        : crypto.randomUUID(),
    }),
    signal: AbortSignal.timeout(8_000),
  })
  if (!response.ok) return false

  const result = await response.json() as TurnstileVerificationResponse
  if (result.success !== true || result.action !== 'turnstile-spin-v1') return false

  const requestHostname = new URL(input.request.url).hostname.toLowerCase()
  const configuredHostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? requestHostname)
    .split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)

  return typeof result.hostname === 'string'
    && configuredHostnames.includes(result.hostname.toLowerCase())
}
