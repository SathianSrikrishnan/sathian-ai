import { describe, expect, it } from 'vitest'

import { hasDedicatedApiRateLimit } from '@/middleware'

describe('API rate-limit routing', () => {
  it('leaves site-agent messages and funnel events to their durable route-specific limits', () => {
    expect(hasDedicatedApiRateLimit('/api/agent/message')).toBe(true)
    expect(hasDedicatedApiRateLimit('/api/agent/event')).toBe(true)
  })

  it('keeps the generic middleware limit on unrelated API routes', () => {
    expect(hasDedicatedApiRateLimit('/api/agent/upload/reserve')).toBe(false)
    expect(hasDedicatedApiRateLimit('/api/subscribe')).toBe(false)
  })
})
