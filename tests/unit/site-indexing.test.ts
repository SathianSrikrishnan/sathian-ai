import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import * as robotsModule from '@/app/robots'
import * as sitemapModule from '@/app/sitemap'

type RobotsBuilder = (host: string) => {
  rules: { disallow?: string | string[] }
  sitemap?: string | string[]
}

type SitemapBuilder = (host: string, updated?: Date) => Array<{ url: string; lastModified?: Date | string }>

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
    expect(urls).toContain('https://sathian.ai/hackathons')
    expect(urls).toContain('https://sathian.ai/writings')
    expect(urls).toContain('https://sathian.ai/writings/the-gap-between-weeks')
    expect(urls).not.toContain('https://sathian.ai/about')
    expect(urls).not.toContain('https://sathian.ai/agents')
    expect(urls).not.toContain('https://sathian.ai/links')
    expect(urls).not.toContain('https://sathian.ai/btc-atlas')
    expect(urls.every((url) => url.startsWith('https://sathian.ai'))).toBe(true)
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
