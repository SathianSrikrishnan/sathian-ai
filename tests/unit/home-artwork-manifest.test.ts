import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import catalog from '../../src/content/home-artwork.json'
import manifest from '../../docs/marketing/home-artwork-20261109.json'

describe('approved homepage artwork delivery', () => {
  it('keeps fourteen verified source copies unchanged', () => {
    expect(manifest.assets).toHaveLength(14)
    expect(new Set(manifest.assets.map(asset => asset.sha256)).size).toBe(14)
    for (const asset of manifest.assets) {
      const bytes = readFileSync(resolve(asset.path))
      expect(bytes.byteLength, asset.path).toBe(asset.bytes)
      expect(createHash('sha256').update(bytes).digest('hex'), asset.path).toBe(asset.sha256)
      expect(asset.provenance).toContain('not an authenticated customer')
    }
  })
  it('uses only documented artwork and preserves the original hero', () => {
    const slides = Object.values(catalog).flat()
    expect(slides).toHaveLength(16)
    expect(new Set(slides.map(slide => slide.src)).size).toBe(16)
    expect(catalog.hero[0].src).toBe('/village/review-oct31/proof-and-certificate-usdc.webp')
    for (const slide of slides) {
      expect(slide.alt.length).toBeGreaterThan(15)
      expect(slide.width).toBeGreaterThan(0)
      expect(slide.height).toBeGreaterThan(0)
      const asset = manifest.assets.find(entry => entry.path === `public${slide.src}`)
      if (asset) {
        expect(slide.width).toBe(asset.width)
        expect(slide.height).toBe(asset.height)
        expect(slide.alt).toBe(asset.alt)
      } else {
        expect(['/village/review-oct31/proof-and-certificate-usdc.webp', '/village/review-oct31/when-gift.webp']).toContain(slide.src)
      }
    }
  })
})
