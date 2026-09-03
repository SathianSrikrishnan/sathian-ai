import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { SOLANA_OBSERVATORY_PROJECT } from '@/content/site-projects'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('Solana Observatory public project feature', () => {
  const routePath = 'src/app/projects/solana-observatory/page.tsx'
  const stylesPath = 'src/app/projects/solana-observatory/solana-observatory.module.css'
  const videoPath = 'public/projects/solana-observatory-demo.mp4'
  const compactMetricsImagePath = 'public/projects/solana-observatory-six-metrics.png'
  const interviewImagePath =
    'public/inside-monkedao/inside-monkedao-interview-two-shot.png'

  it('routes the public project card through the first-party project page', () => {
    expect(SOLANA_OBSERVATORY_PROJECT.href).toBe(
      'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/',
    )
    expect(SOLANA_OBSERVATORY_PROJECT.pageHref).toBe('/projects/solana-observatory')
    expect(SOLANA_OBSERVATORY_PROJECT.cta).toBe('Open the Solana guide')
    expect(SOLANA_OBSERVATORY_PROJECT.pageCta).toBe('Watch the 3-minute walkthrough')
    expect(SOLANA_OBSERVATORY_PROJECT.status).toBe('active')
  })

  it('ships one canonical page with the live dashboard and public proof links', () => {
    expect(existsSync(new URL(`../../${routePath}`, import.meta.url))).toBe(true)
    const route = read(routePath)

    expect(route).toContain('https://sathian.ai/projects/solana-observatory')
    expect(route).toContain('https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/')
    expect(route).toContain('https://github.com/SathianSrikrishnan/solana-ecosystem-dashboard')
    expect(route).toContain('report.md')
    expect(route).toContain('report.json')
    expect(route).toContain('45 source-carrying records')
    expect(route).toContain('six-hour refresh')
  })

  it('connects the project and walkthrough to Sathian with machine-readable metadata', () => {
    const route = read(routePath)

    expect(route).toContain("authors: [{ name: 'Sathian Srikrishnan', url: 'https://sathian.ai/about' }]")
    expect(route).toContain("'@type': 'CreativeWork'")
    expect(route).toContain("author: { '@id': SATHIAN_PERSON_SCHEMA['@id'] }")
    expect(route).toContain("'@type': 'VideoObject'")
    expect(route).toContain("duration: 'PT3M3S'")
    expect(route).toContain('type="application/ld+json"')
  })

  it('includes the verified public walkthrough and responsive editorial treatment', () => {
    const video = new URL(`../../${videoPath}`, import.meta.url)
    expect(existsSync(video)).toBe(true)
    expect(statSync(video).size).toBeGreaterThan(15_000_000)

    expect(existsSync(new URL(`../../${stylesPath}`, import.meta.url))).toBe(true)
    const styles = read(stylesPath)
    expect(styles).toContain('@media (max-width: 720px)')
    expect(styles).toContain('--obs-display: var(--font-display)')
    expect(styles).toContain('font-size: clamp(56px, 6.5vw, 94px)')
    expect(styles).toContain('font-size: clamp(46px, 14vw, 60px)')
    expect(styles).toContain('grid-row: 1 / span 2')
    expect(styles).toContain('grid-column: 2')
    expect(styles).toContain(':focus-visible')
    expect(styles).toContain('prefers-reduced-motion')
  })

  it('ships the compact Substack visuals from approved public sources', () => {
    const compactMetricsImage = new URL(
      `../../${compactMetricsImagePath}`,
      import.meta.url,
    )
    const interviewImage = new URL(`../../${interviewImagePath}`, import.meta.url)

    expect(existsSync(compactMetricsImage)).toBe(true)
    expect(statSync(compactMetricsImage).size).toBeGreaterThan(50_000)
    expect(existsSync(interviewImage)).toBe(true)
    expect(statSync(interviewImage).size).toBeGreaterThan(100_000)
  })

  it('keeps review-only language out of the public route', () => {
    const route = read(routePath)
    expect(route).not.toMatch(/private review|not for publication|owner playback/iu)
  })
})
