import { describe, expect, it } from 'vitest'

import { signToken, verifyToken } from '@/lib/studio-auth'

describe('unit test lane', () => {
  it('resolves TypeScript path aliases and executes pure helpers', () => {
    const token = signToken('test-secret')

    expect(verifyToken(token, 'test-secret')).toBe(true)
  })
})
