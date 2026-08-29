import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import * as robotsModule from '@/app/robots'
import * as sitemapModule from '@/app/sitemap'

type RobotsBuilder = (host: string) => {
  rules: { disallow?: string | string[] }
  sitemap?: string | string[]
}

type SitemapBuilder = (
  host: string,
  updated?: Date,
  publishedWritings?: Array<{ slug: string; date: string; updatedAt?: string }>,
) => Array<{ url: string; lastModified?: Date | string }>

describe('public-site indexing', () => {
  it('serves a sathian.ai crawler map on the personal domain and previews', () => {
    const buildRobots = (robotsModule as { buildRobotsForHost?: RobotsBuilder }).buildRobotsForHost
    const buildSitemap = (sitemapModule as { buildSitemapForHost?: SitemapBuilder }).buildSitemapForHost

    expect(buildRobots).toBeTypeOf('function')
    expect(buildSitemap).toBeTypeOf('function')
    if (!buildRobots || !buildSitemap) return

    expect(buildRobots('sathian.ai').sitemap).toBe('https://sathian.ai/sitemap.xml')
    expect(buildRobots('candidate.vercel.app').sitemap).toBe('https://sathian.ai/sitemap.xml')

    const urls = buildSitemap('sathian.ai', new Date('2026-07-15T00:00:00.000Z')).map((entry) => entry.url)
    expect(urls).toContain('https://sathian.ai')
    expect(urls).toContain('https://sathian.ai/about')
    expect(urls).toContain('https://sathian.ai/hackathons')
    expect(urls).toContain('https://sathian.ai/writings')
    expect(urls).toContain('https://sathian.ai/projects/tooth-fairy-network/draw-with-tanda')
    expect(urls).toContain('https://sathian.ai/projects/clinicalguard')
    expect(urls).toContain('https://sathian.ai/writings/the-gap-between-weeks')
    expect(urls).not.toContain('https://sathian.ai/agents')
    expect(urls).not.toContain('https://sathian.ai/links')
    expect(urls).not.toContain('https://sathian.ai/btc-atlas')
    expect(urls.every((url) => url.startsWith('https://sathian.ai'))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('keeps legacy prototypes out of the personal-site crawl surface', () => {
    const buildRobots = (robotsModule as { buildRobotsForHost?: RobotsBuilder }).buildRobotsForHost
    expect(buildRobots).toBeTypeOf('function')
    if (!buildRobots) return

    const disallow = buildRobots('sathian.ai').rules.disallow
    expect(disallow).toEqual(expect.arrayContaining(['/animation/', '/tooth/', '/toothfairy/']))
    expect(disallow).not.toContain('/voice/')
    expect(buildRobots('toothfairy.network').rules.disallow).not.toContain('/toothfairy/')
  })

  it('publishes a clear Sathian person entity from the homepage', () => {
    const page = readFileSync(new URL('../../src/app/page.tsx', import.meta.url), 'utf8')
    const home = readFileSync(new URL('../../src/components/home/HomeClient.tsx', import.meta.url), 'utf8')
    const layout = readFileSync(new URL('../../src/app/layout.tsx', import.meta.url), 'utf8')
    const identity = readFileSync(new URL('../../src/lib/site-identity.ts', import.meta.url), 'utf8')

    expect(page).toContain('SATHIAN_PERSON_SCHEMA')
    expect(identity).toContain("name: 'Sathian Srikrishnan'")
    expect(identity).toContain("alternateName: ['Sathian', 'Sathian S.']")
    expect(identity).toContain('sameAs:')
    expect(identity).toContain("name: 'Sathian Srikrishnan'")
    expect(identity).toContain("alternateName: ['sathian.ai', 'Digital Experiments']")
    expect(layout).toContain("siteName: 'Sathian Srikrishnan'")
    expect(home).toContain('SATHIAN SRIKRISHNAN')
  })

  it('publishes a real indexable profile page for the same person entity', () => {
    const about = readFileSync(new URL('../../src/app/about/page.tsx', import.meta.url), 'utf8')

    expect(about).not.toContain("redirect('/')")
    expect(about).toContain("'@type': 'ProfilePage'")
    expect(about).toContain("SATHIAN_PERSON_SCHEMA['@id']")
    expect(about).toContain('Sathian Srikrishnan')
  })

  it('uses the full identity and stable profile entity on every writing surface', () => {
    const article = readFileSync(new URL('../../src/app/writings/[slug]/page.tsx', import.meta.url), 'utf8')
    const allowance = readFileSync(new URL('../../src/app/writings/agent-allowance-lab/page.tsx', import.meta.url), 'utf8')
    const renderer = readFileSync(new URL('../../src/components/article/ArticleRenderer.tsx', import.meta.url), 'utf8')

    for (const source of [article, allowance]) {
      expect(source).toContain("name: 'Sathian Srikrishnan'")
      expect(source).toContain("SATHIAN_PERSON_SCHEMA['@id']")
    }
    expect(article).toContain('dateModified')
    expect(renderer).toContain('By Sathian Srikrishnan')
    expect(allowance).toContain('By Sathian Srikrishnan')
  })

  it('uses stable modification dates and loads future published Studio articles', () => {
    const buildSitemap = (sitemapModule as { buildSitemapForHost?: SitemapBuilder }).buildSitemapForHost
    expect(buildSitemap).toBeTypeOf('function')
    if (!buildSitemap) return

    const first = buildSitemap('sathian.ai')
    const second = buildSitemap('sathian.ai')
    expect(first.map((entry) => String(entry.lastModified))).toEqual(
      second.map((entry) => String(entry.lastModified)),
    )

    const source = readFileSync(new URL('../../src/app/sitemap.ts', import.meta.url), 'utf8')
    expect(source).toMatch(/getPublishedArticles/)
    expect(source).toMatch(/export default async function sitemap/)
  })

  it('does not duplicate a Studio article that also has a built-in route', () => {
    const buildSitemap = (sitemapModule as { buildSitemapForHost?: SitemapBuilder }).buildSitemapForHost
    expect(buildSitemap).toBeTypeOf('function')
    if (!buildSitemap) return

    const urls = buildSitemap('sathian.ai', new Date('2026-07-15T00:00:00.000Z'), [
      { slug: 'agent-allowance-lab', date: '2026-07-11' },
    ]).map((entry) => entry.url)

    expect(urls.filter((url) => url.endsWith('/writings/agent-allowance-lab'))).toHaveLength(1)
  })

  it('preserves the Tooth Fairy crawler map on Tooth Fairy hosts', () => {
    const buildRobots = (robotsModule as { buildRobotsForHost?: RobotsBuilder }).buildRobotsForHost
    const buildSitemap = (sitemapModule as { buildSitemapForHost?: SitemapBuilder }).buildSitemapForHost

    expect(buildRobots).toBeTypeOf('function')
    expect(buildSitemap).toBeTypeOf('function')
    if (!buildRobots || !buildSitemap) return

    for (const host of ['toothfairy.network', 'www.toothfairy.network', 'toothfairy.sathian.ai']) {
      expect(buildRobots(host).sitemap).toBe('https://toothfairy.network/sitemap.xml')
      expect(buildSitemap(host).every((entry) => entry.url.startsWith('https://toothfairy.network'))).toBe(true)
    }
  })
})
