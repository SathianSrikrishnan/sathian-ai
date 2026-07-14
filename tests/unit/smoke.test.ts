import { describe, expect, it } from 'vitest'

import { signStudioToken, verifyStudioToken } from '@/lib/studio-token'

describe('unit test lane', () => {
  it('resolves TypeScript path aliases and executes pure helpers', async () => {
    const token = await signStudioToken('test-secret')

    await expect(verifyStudioToken(token, 'test-secret')).resolves.toBe(true)
  })
})
