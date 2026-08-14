import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'
import { getPublicProfileMemoryCards } from '@/lib/public-profile'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('Saraswati, Lakshmi, and the Ledger release', () => {
  it('is the newest published writing with the approved editorial contract', () => {
    expect(articles[0]).toMatchObject({
      slug: 'saraswati-lakshmi-and-the-ledger',
      title: 'Saraswati, Lakshmi, and the Ledger',
      date: '2026-08-14',
    })
    expect(articles[0].body).toContain('I do not see my daughters every day.')
    expect(articles[0].body).toContain('two kinds of power')
    expect(articles[0].body).toContain('AI is polytheistic, not monotheistic')
    expect(articles[0].body).toContain('What can the ledger actually prove?')
  })

  it('serves the interactive essay at its canonical writing URL', () => {
    const config = read('next.config.js')
    const essay = read('public/features/saraswati-lakshmi-ledger.html')

    expect(config).toContain("source: '/writings/saraswati-lakshmi-and-the-ledger'")
    expect(config).toContain("destination: '/features/saraswati-lakshmi-ledger.html'")
    expect(essay).toContain('The Saraswati test and the Lakshmi test.')
    expect(essay).toContain('data-saraswati-score')
    expect(essay).toContain('/media/flagship-hero.png')
    expect(essay).toContain('/sathian-profile.png')
    expect(essay).toContain('https://sathian.ai/media/flagship-hero.png')
  })

  it('puts the essay first in Featured Work without moving the chatbot', () => {
    const home = read('src/components/home/HomeClient.tsx')
    const agentIndex = home.indexOf('id="agent"')
    const featuredIndex = home.indexOf('id="featured-work"')
    const essayIndex = home.indexOf('minimal-featured-project--article')
    const projectIndex = home.indexOf('FEATURED_SITE_PROJECTS.map')

    expect(agentIndex).toBeGreaterThan(-1)
    expect(featuredIndex).toBeGreaterThan(agentIndex)
    expect(essayIndex).toBeGreaterThan(featuredIndex)
    expect(projectIndex).toBeGreaterThan(essayIndex)
    expect(home).toContain('/media/flagship-hero.png')
  })

  it('adds reviewed public context for the site agent without replacing the video release', () => {
    const cards = getPublicProfileMemoryCards()
    const writing = cards.find((card) => card.id === 'latest-featured-writing')
    const release = cards.find((card) => card.id === 'latest-release')

    expect(writing?.source.ref).toBe('https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger')
    expect(writing?.body).toContain('newest featured writing')
    expect(writing?.body).toContain('Saraswati test')
    expect(release?.title).toContain('Latest release:')
  })
})
