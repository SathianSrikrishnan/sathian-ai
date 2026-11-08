import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('requested homepage artwork correction', () => {
  it('removes the personal gallery without changing the original section order', () => {
    const home = read('src/components/home/HomeClient.tsx')
    expect(home).not.toContain('HomeMoments')
    expect(home).not.toContain("'use client'")
    expect(home.indexOf('id="home-agent-slot"')).toBeLessThan(home.indexOf('founder-quick-questions'))
    expect(home.indexOf('founder-quick-questions')).toBeLessThan(home.indexOf('aria-labelledby="building-now"'))
    expect(home).toContain('<FollowSath profiles />')
  })
  it('adds approved public artwork inside the existing hero and all five question cards', () => {
    const home = read('src/components/home/HomeClient.tsx')
    expect(home.match(/<QuestionArtwork /g)).toHaveLength(5)
    expect(home).toContain('proof-and-certificate-usdc.webp')
    expect(home).toContain('collage-7-640.webp')
    expect(home).toContain('collage-6-640.webp')
    for (let i = 0; i < 8; i++) expect(existsSync(join(process.cwd(), 'public/proof-assets/proof-site-first-edition', `collage-${i}-640.webp`))).toBe(true)
  })
  it('preserves lazy, server-rendered artwork and full-image geometry without motion dependencies', () => {
    const artwork = read('src/components/home/QuestionArtwork.tsx')
    expect(artwork).not.toContain("'use client'")
    expect(artwork).not.toMatch(/setInterval|setTimeout|autoPlay/)
    expect(artwork).toContain('loading="lazy"')
    const css = read('src/components/home/HomeArtwork.module.css')
    expect(css).toContain('object-fit: contain')
    expect(css).toContain('aspect-ratio: 4 / 3')
    expect(css).toContain(':focus-visible')
  })
  it('restores About and Links contact presentation with plain X labels', () => {
    const about = read('src/app/about/page.tsx')
    expect(about).toContain('<FollowSath profiles title="How You Connect" />')
    expect(about).not.toContain('All links and channels')
    const links = read('src/app/links/page.tsx')
    expect(links).toContain('A few ways in.')
    expect(links).toContain("canonical: '/links'")
    expect(links).toContain('personalSocialLinks.map')
    expect(links).toContain('toothFairySocialLinks.map')
    expect(links).not.toContain('inside-monkedao')
    expect(read('src/components/FollowSath.tsx')).not.toContain('@Sathian')
    expect(read('src/lib/social-links.ts')).toContain('https://x.com/Sathian')
  })
})
