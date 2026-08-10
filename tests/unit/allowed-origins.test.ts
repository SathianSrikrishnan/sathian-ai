import { describe, expect, it } from 'vitest'

import { isAllowedOrigin } from '@/lib/constants'

describe('approved production origins', () => {
  it('allows Studio API requests from the Studio subdomain', () => {
    expect(isAllowedOrigin('https://studio.sathian.ai')).toBe(true)
  })

  it('allows loopback preview ports outside production', () => {
    expect(isAllowedOrigin('http://localhost:3108')).toBe(true)
    expect(isAllowedOrigin('http://127.0.0.1:4173')).toBe(true)
  })

  it('does not confuse a localhost-looking hostname for loopback', () => {
    expect(isAllowedOrigin('http://localhost.attacker.example:3108')).toBe(false)
  })
})
