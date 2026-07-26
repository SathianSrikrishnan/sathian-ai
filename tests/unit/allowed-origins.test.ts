import { describe, expect, it } from 'vitest'

import { isAllowedOrigin } from '@/lib/constants'

describe('approved production origins', () => {
  it('allows Studio API requests from the Studio subdomain', () => {
    expect(isAllowedOrigin('https://studio.sathian.ai')).toBe(true)
  })
})
