import { describe, expect, it } from 'vitest'

import {
  STUDIO_TOKEN_TTL_MS,
  signStudioToken,
  verifyStudioToken,
} from '@/lib/studio-token'

const SECRET = 'a-long-test-secret'
const NOW = Date.UTC(2026, 6, 14, 12, 0, 0)

describe('Studio authentication token', () => {
  it('accepts a correctly signed unexpired token', async () => {
    const token = await signStudioToken(SECRET, NOW - 60_000)

    await expect(verifyStudioToken(token, SECRET, NOW)).resolves.toBe(true)
  })

  it('rejects a recent timestamp with a forged signature', async () => {
    const forged = `${NOW - 60_000}.${'a'.repeat(64)}`

    await expect(verifyStudioToken(forged, SECRET, NOW)).resolves.toBe(false)
  })

  it.each([
    '',
    'missing-signature',
    `${NOW}.abc`,
    `not-a-timestamp.${'a'.repeat(64)}`,
    `${NOW}.${'a'.repeat(64)}.extra`,
  ])('rejects malformed token %j', async (token) => {
    await expect(verifyStudioToken(token, SECRET, NOW)).resolves.toBe(false)
  })

  it('rejects future-dated tokens', async () => {
    const token = await signStudioToken(SECRET, NOW + 1)

    await expect(verifyStudioToken(token, SECRET, NOW)).resolves.toBe(false)
  })

  it('rejects expired tokens', async () => {
    const token = await signStudioToken(SECRET, NOW - STUDIO_TOKEN_TTL_MS)

    await expect(verifyStudioToken(token, SECRET, NOW)).resolves.toBe(false)
  })
})
