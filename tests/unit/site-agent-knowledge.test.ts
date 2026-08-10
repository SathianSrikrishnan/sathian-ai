import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { getPublicProfileMemoryCards } from '@/lib/public-profile'

const homepage = readFileSync(
  new URL('../../src/components/home/HomeClient.tsx', import.meta.url),
  'utf8',
)

describe('canonical site-agent public knowledge', () => {
  const cards = getPublicProfileMemoryCards()

  it.each([
    ['project-autoquote-automator', 'https://ontario-all-quote-agent.vercel.app'],
    ['project-solana-ecosystem-observatory', 'https://htmlpreview.github.io/'],
    ['project-clinicalguard', 'https://sathian.ai/projects/clinicalguard'],
    ['published-writing', 'https://sathian.ai/writings'],
    ['current-public-work', 'https://sathian.ai/'],
  ])('publishes %s with a public source', (id, expectedSource) => {
    const card = cards.find((candidate) => candidate.id === id)

    expect(card).toBeDefined()
    expect(card?.source.ref).toContain(expectedSource)
    expect(card?.tags.length).toBeGreaterThan(2)
  })

  it('keeps common stale and alternate project names searchable', () => {
    const autoQuote = cards.find((card) => card.id === 'project-autoquote-automator')
    const solana = cards.find((card) => card.id === 'project-solana-ecosystem-observatory')

    expect(autoQuote?.tags).toEqual(expect.arrayContaining([
      'autoquote',
      'auto-insurance-agent',
      'coverage-ledger',
    ]))
    expect(solana?.tags).toEqual(expect.arrayContaining([
      'solana-dashboard',
      'ecosystem-observatory',
    ]))
  })

  it('uses the same project registry for the homepage and agent', () => {
    expect(homepage).toContain("from '@/content/site-projects'")
    expect(homepage).toContain('AUTOQUOTE_AUTOMATOR_PROJECT')
    expect(homepage).toContain('SOLANA_OBSERVATORY_PROJECT')
  })
})
