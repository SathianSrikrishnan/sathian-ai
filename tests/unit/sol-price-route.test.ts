import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const route = readFileSync(
  new URL('../../src/app/api/toothfairy/sol-price/route.ts', import.meta.url),
  'utf8',
)

describe('SOL price route deployment contract', () => {
  it('runs as a dynamic server route so Vercel emits a function', () => {
    expect(route).toMatch(/export const dynamic = ['"]force-dynamic['"]/)
  })
})
