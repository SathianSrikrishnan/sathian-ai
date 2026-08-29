import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { getPublicProfileMemoryCards } from '@/lib/public-profile'

const ROOT = process.cwd()

function read(relativePath: string) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8')
}

describe('homepage featured writing order', () => {
  it('leads with Inside MonkeDAO and keeps The Polytheistic Test second', () => {
    const home = read('src/components/home/HomeClient.tsx')
    const insideIndex = home.indexOf("slug: 'inside-monkedao'")
    const polytheisticIndex = home.indexOf("slug: 'saraswati-lakshmi-and-the-ledger'")
    const projectsIndex = home.indexOf('FEATURED_SITE_PROJECTS.map')

    expect(insideIndex).toBeGreaterThan(-1)
    expect(polytheisticIndex).toBeGreaterThan(insideIndex)
    expect(projectsIndex).toBeGreaterThan(polytheisticIndex)
    expect(home).toContain("image: '/inside-monkedao/opening-cover.png'")
    expect(home).toContain("label: 'NEW FILM + FIRSTHAND FIELD REPORT'")
    expect(home).toContain("cta: 'Watch and read the field report'")
    expect(home).toContain("image: '/media/flagship-hero.png'")
    expect(home).toContain("cta: 'Read and try the two tests'")
  })

  it('keeps both writings in reviewed public context', () => {
    const cards = getPublicProfileMemoryCards()
    const latest = cards.find((card) => card.id === 'latest-featured-writing')
    const polytheistic = cards.find(
      (card) => card.id === 'featured-writing-polytheistic-test',
    )

    expect(latest?.title).toContain('Inside MonkeDAO')
    expect(latest?.source.ref).toBe('https://sathian.ai/writings/inside-monkedao')
    expect(latest?.body).toContain('firsthand field report')
    expect(polytheistic?.title).toContain('The Polytheistic Test')
    expect(polytheistic?.source.ref).toBe(
      'https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger',
    )
  })
})
