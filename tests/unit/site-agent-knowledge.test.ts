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
    ['project-tooth-fairy-network', 'https://toothfairy.network'],
    ['project-autoquote-automator', 'https://ontario-all-quote-agent.vercel.app'],
    ['project-solana-ecosystem-observatory', 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/'],
    ['project-clinicalguard', 'https://sathian.ai/projects/clinicalguard'],
    ['published-writing', 'https://sathian.ai/writings'],
    ['current-public-work', 'https://sathian.ai/'],
  ])('publishes %s with a public source', (id, expectedSource) => {
    const card = cards.find((candidate) => candidate.id === id)

    expect(card).toBeDefined()
    expect(card?.source.ref).toContain(expectedSource)
    expect(card?.tags.length).toBeGreaterThan(2)
  })

  it('leads with verified TFN Mainnet capability while keeping the public on-ramp gated', () => {
    const tfn = cards.find((card) => card.id === 'project-tooth-fairy-network')
    const currentWork = cards.find((card) => card.id === 'current-public-work')

    expect(tfn?.body).toContain('deployed Solana Mainnet program')
    expect(tfn?.body).toContain('time-locked SOL and canonical USDC deposits')
    expect(tfn?.body).toContain('on-ramp checkout experience remains behind a release gate')
    expect(currentWork?.body).toContain('primary public build is Tooth Fairy Network')
    expect(currentWork?.body).not.toMatch(/AI practice/i)
    expect(cards.some((card) => card.id === 'toothlight-devnet-ownership-proof')).toBe(false)
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
