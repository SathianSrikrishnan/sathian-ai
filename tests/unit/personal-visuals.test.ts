import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { HOME_MOMENTS } from '@/content/home-moments'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('public personal visual collection', () => {
  it('provides ten distinct reviewed public images with useful captions and destinations', () => {
    expect(HOME_MOMENTS).toHaveLength(10)
    expect(new Set(HOME_MOMENTS.map((item) => item.src)).size).toBe(10)
    for (const item of HOME_MOMENTS) {
      expect(item.alt.length).toBeGreaterThan(20)
      expect(item.title.length).toBeGreaterThan(5)
      expect(item.href).toMatch(/^(\/|https:\/\/proof\.sathian\.ai\/)/)
      expect(existsSync(join(process.cwd(), 'public', item.src))).toBe(true)
      expect(item.src).not.toMatch(/private|review-v16|PhoneBackup|Photo-Archive/)
    }
  })

  it('uses the already-redacted physical Proof images', () => {
    const proofs = HOME_MOMENTS.filter((item) => item.src.includes('/village/'))
    expect(proofs).toHaveLength(2)
    for (const proof of proofs) {
      expect(proof.src).toContain('/performance-nov2/')
      expect(proof.alt).toContain('names and codes hidden')
    }
  })

  it('keeps the new Home collection server-rendered and lazy without timer-driven motion', () => {
    const gallery = read('src/components/home/HomeMoments.tsx')
    expect(gallery).not.toContain("'use client'")
    expect(gallery).not.toMatch(/setInterval|setTimeout|autoPlay/)
    expect(gallery).toContain('loading="lazy"')
    expect(gallery).not.toContain('priority')
    expect(gallery).toContain('Photos, film stills and artwork.')
    expect(gallery).toContain('HOME_MOMENTS.map')
  })

  it('preserves the hero and site-agent order before the new visual collection', () => {
    const home = read('src/components/home/HomeClient.tsx')
    expect(home).not.toContain("'use client'")
    expect(home.indexOf('id="home-agent-slot"')).toBeLessThan(home.indexOf('<HomeMoments />'))
    expect(home.indexOf('<HomeMoments />')).toBeLessThan(home.indexOf('aria-labelledby="building-now"'))
    expect(home).toContain('proof-and-certificate-usdc.webp')
    expect(home).toContain('<FollowSath profiles />')
  })

  it('retains the Links canonical, profile registries and existing work destinations', () => {
    const links = read('src/app/links/page.tsx')
    expect(links).toContain("canonical: '/links'")
    expect(links).toContain('personalSocialLinks.map')
    expect(links).toContain('toothFairySocialLinks.map')
    expect(links).toContain('SATH_CALENDAR_HREF')
    for (const href of ['/farcaster', 'https://toothfairy.network', '/writings', '/agents']) {
      expect(links).toContain("href: '" + href + "'")
    }
    expect(links).toContain('aria-labelledby="personal-links"')
    expect(links).toContain('aria-labelledby="tfn-links"')
  })

  it('reserves image geometry and provides keyboard-visible focus styling', () => {
    const galleryStyle = read('src/components/home/HomeMoments.module.css')
    const followStyle = read('src/app/links/links.module.css')
    expect(galleryStyle).toContain('aspect-ratio:')
    expect(galleryStyle).toContain('font-size: clamp(32px, 4vw, 43px)')
    expect(galleryStyle).toContain('Iowan Old Style, Baskerville, Georgia, serif')
    expect(followStyle).toContain('aspect-ratio:')
    expect(galleryStyle).toContain(':focus-visible')
    expect(followStyle).toContain(':focus-visible')
    expect(galleryStyle).not.toContain('animation:')
    expect(followStyle).not.toContain('animation:')
  })
})
