import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'
import { getPublicProfileMemoryCards } from '@/lib/public-profile'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('The Polytheistic Test release', () => {
  it('remains published with the approved editorial contract', () => {
    const article = articles.find((entry) => entry.slug === 'saraswati-lakshmi-and-the-ledger')
    expect(article).toMatchObject({
      slug: 'saraswati-lakshmi-and-the-ledger',
      title: 'The Polytheistic Test',
      date: '2026-08-14',
    })
    expect(article?.body).toContain('“Why does Saraswati carry music?” one of my seven-year-old daughters asked me.')
    expect(article?.body).toContain('I was born Hindu. It took my children to make me study what I had inherited.')
    expect(article?.body).toContain('Every technology should pass two tests')
    expect(article?.body).toContain('AI is polytheistic, not monotheistic')
    expect(article?.body).toContain('I used the tests first on the Solana Observatory')
    expect(article?.sectionHeadings).toContain('Other places I am testing this')
    expect(article?.sectionHeadings).toContain('Where this metaphor could break')
    expect(article?.body).toContain('crypto communities become gated communities')
    expect(article?.body).toContain('What can the ledger actually prove?')
    expect(article?.body).not.toContain('I do not see my daughters every day.')
    expect(article?.body).not.toContain('promotional subject')
  })

  it('serves the interactive essay at its canonical writing URL', () => {
    const config = read('next.config.js')
    const essay = read('public/features/saraswati-lakshmi-ledger.html')

    expect(config).toContain("source: '/writings/saraswati-lakshmi-and-the-ledger'")
    expect(config).toContain("destination: '/features/saraswati-lakshmi-ledger.html'")
    expect(essay).toContain('<title>The Polytheistic Test</title>')
    expect(essay).toContain('<h1>The<span>Polytheistic Test</span></h1>')
    expect(essay).toContain('“Why does Saraswati carry music?”')
    expect(essay).toContain('The Saraswati test and the Lakshmi test.')
    expect(essay).toContain('class="project project-primary"')
    expect(essay).toContain('Other places I am testing this.')
    expect(essay).toContain('Where this metaphor could break.')
    expect(essay).toContain('crypto communities become gated communities')
    expect(essay).toContain('.hero-art img { aspect-ratio: auto; height: auto; object-fit: contain;')
    expect(essay).not.toContain('My daughters remain part of the reason')
    expect(essay).toContain('data-saraswati-score')
    expect(essay).toContain('/media/flagship-hero.png')
    expect(essay).toContain('/sathian-profile.png')
    expect(essay).toContain('https://sathian.ai/media/flagship-hero.png')
    expect(essay).toContain('.author-note { display: grid; grid-template-columns: 88px minmax(0, 1fr);')
    expect(essay).toContain('width: min(var(--measure), 100%); margin: 46px auto 0;')
    expect(essay).toContain('.reel-card:first-child img { height: auto; aspect-ratio: 16 / 9; object-fit: contain;')
    expect(essay).toContain('.reel-card:first-child .reel-caption { position: static;')
    expect(essay).toContain('data-reel-count>Frame 1 of 5')
    expect(essay).not.toContain('href="index.html"')
    expect(essay).toContain('href="https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/"')
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
    const writing = cards.find((card) => card.id === 'featured-writing-polytheistic-test')
    const release = cards.find((card) => card.id === 'latest-release')

    expect(writing?.source.ref).toBe('https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger')
    expect(writing?.title).toContain('The Polytheistic Test')
    expect(writing?.body).toContain('Saraswati test')
    expect(release?.title).toContain('Latest release:')
  })
})
