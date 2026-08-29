import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('Inside MonkeDAO public feature', () => {
  const routePath = 'src/app/writings/inside-monkedao/page.tsx'
  const stylesPath = 'src/app/writings/inside-monkedao/inside-monkedao.module.css'
  const videoPath = 'public/inside-monkedao/inside-monkedao-field-report-v1.9.0.mp4'

  it('registers the field report as the newest reviewed writing', () => {
    const article = articles.find((entry) => entry.slug === 'inside-monkedao')
    expect(article).toBeDefined()
    expect(article?.date).toBe('2026-08-29')
    expect(article?.title).toBe('Inside MonkeDAO')
    expect(article?.description).toContain('firsthand')
  })

  it('ships a custom canonical feature route with primary-source links', () => {
    expect(existsSync(new URL(`../../${routePath}`, import.meta.url))).toBe(true)
    const route = read(routePath)
    expect(route).toContain('https://sathian.ai/writings/inside-monkedao')
    expect(route).toContain('https://monkedao.io/our-story')
    expect(route).toContain('https://monkedao.io/benefits')
    expect(route).toContain('https://monkedao.io/monkefoundry')
    expect(route).toContain('https://superteam.fun/earn/regions/canada')
    expect(route).toContain('SMB Gen3 #13769')
  })

  it('preserves the approved feature design and responsive contract', () => {
    expect(existsSync(new URL(`../../${stylesPath}`, import.meta.url))).toBe(true)
    const styles = read(stylesPath)
    expect(styles).toContain('linear-gradient(90deg')
    expect(styles).toContain('@media (max-width: 560px)')
    expect(styles).toContain(':focus-visible')
    expect(styles).toContain('prefers-reduced-motion')
  })

  it('includes the verified public film and approved image assets', () => {
    const video = new URL(`../../${videoPath}`, import.meta.url)
    expect(existsSync(video)).toBe(true)
    expect(statSync(video).size).toBeGreaterThan(50_000_000)
    expect(existsSync(new URL('../../public/inside-monkedao/opening-cover.png', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../../public/inside-monkedao/smb-gen3-13769.png', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../../public/inside-monkedao/monkedao-logo.png', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../../public/inside-monkedao/solana-mark.svg', import.meta.url))).toBe(true)
  })

  it('does not leak private-review labels or the corrected misspelling', () => {
    const publicSurface = `${read(routePath)}\n${read(stylesPath)}`
    expect(publicSurface).not.toMatch(/private review|private prototype|owner review/iu)
    expect(publicSurface).not.toMatch(/\bSlana\b/iu)
    expect(publicSurface).toContain('Solana')
    expect(publicSurface).toContain('Benny')
  })
})
