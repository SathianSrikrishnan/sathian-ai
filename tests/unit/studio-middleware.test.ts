import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'

import { middleware } from '@/middleware'
import { signStudioToken } from '@/lib/studio-token'

const SECRET = 'middleware-test-secret'

function studioRequest(token: string) {
  return new NextRequest('https://sathian.ai/studio', {
    headers: { cookie: `studio_auth=${token}` },
  })
}

describe('Studio middleware authentication', () => {
  beforeEach(() => {
    process.env.STUDIO_PASSWORD = SECRET
  })

  afterEach(() => {
    delete process.env.STUDIO_PASSWORD
  })

  it('rejects a recent token with a forged HMAC', async () => {
    const forged = `${Date.now()}.${'a'.repeat(64)}`

    const response = await middleware(studioRequest(forged))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://sathian.ai/studio/login')
  })

  it('allows a correctly signed token', async () => {
    const token = await signStudioToken(SECRET)

    const response = await middleware(studioRequest(token))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })
})
