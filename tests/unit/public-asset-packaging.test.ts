import { readFileSync, readdirSync } from 'node:fs'
import ignore from 'ignore'
import { describe, expect, it } from 'vitest'

const root = new URL('../../', import.meta.url)
describe('Vercel public asset packaging', () => {
  it('excludes root review evidence without excluding approved public review artwork', () => {
    const rules = ignore().add(readFileSync(new URL('.vercelignore', root), 'utf8'))
    expect(rules.ignores('review-home.png')).toBe(true)
    expect(rules.ignores('.env.local')).toBe(true)
    const assets = readdirSync(new URL('public/village/review-oct31/', root))
    expect(assets).toContain('proof-and-certificate-usdc.webp')
    for (const asset of assets) expect(rules.ignores(`public/village/review-oct31/${asset}`)).toBe(false)
    expect(rules.ignores('public/media/founder-20261031/founder-film-final.mp4')).toBe(false)
  })
})
