import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  ARCHIVE_SITE_PROJECTS,
  FEATURED_SITE_PROJECTS,
  SITE_PROJECTS,
  findSiteProjectsByAlias,
} from '@/content/site-projects'
import { getPublicProfileMemoryCards } from '@/lib/public-profile'

const homepage = readFileSync(
  new URL('../../src/components/home/HomeClient.tsx', import.meta.url),
  'utf8',
)

describe('canonical site-agent public knowledge', () => {
  const cards = getPublicProfileMemoryCards()

  it('keeps every public portfolio project in one reviewed lifecycle registry', () => {
    expect(SITE_PROJECTS.map((project) => project.id)).toEqual([
      'project-tooth-fairy-network',
      'project-autoquote-automator',
      'project-solana-ecosystem-observatory',
      'project-clinicalguard',
      'project-agenttab',
      'project-btc-cultural-atlas',
      'project-lex-rooftop-garden',
    ])

    for (const project of SITE_PROJECTS) {
      expect(['primary', 'active', 'prototype', 'archive']).toContain(project.status)
      expect(project.aliases.length).toBeGreaterThan(0)
      expect(project.approvedClaims.length).toBeGreaterThan(0)
      expect(project.reviewedAt).toMatch(/^2026-\d{2}-\d{2}$/)
      expect(project.href).toMatch(/^(?:https:\/\/|\/)/)
    }

    expect(FEATURED_SITE_PROJECTS.map((project) => project.status)).toEqual([
      'primary',
      'prototype',
    ])
    expect(ARCHIVE_SITE_PROJECTS).toHaveLength(4)
    expect(ARCHIVE_SITE_PROJECTS.every((project) => project.status === 'archive')).toBe(true)
  })

  it.each([
    ['TFN', 'project-tooth-fairy-network'],
    ['Toothlight', 'project-tooth-fairy-network'],
    ['Coverage Ledger', 'project-autoquote-automator'],
    ['Clinical Guard', 'project-clinicalguard'],
    ['AgentTab', 'project-agenttab'],
    ['BTC Cultural Atlas', 'project-btc-cultural-atlas'],
    ['Lex Rooftop Garden', 'project-lex-rooftop-garden'],
  ])('resolves the public alias %s through the registry', (message, expectedId) => {
    expect(findSiteProjectsByAlias(`Tell me about ${message}`).map((project) => project.id)).toContain(expectedId)
  })

  it.each([
    ['project-tooth-fairy-network', 'https://toothfairy.network'],
    ['project-autoquote-automator', 'https://ontario-all-quote-agent.vercel.app'],
    ['project-solana-ecosystem-observatory', 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/'],
    ['project-clinicalguard', 'https://sathian.ai/projects/clinicalguard'],
    ['published-writing', 'https://sathian.ai/writings'],
    ['current-public-work', 'https://sathian.ai/'],
    ['site-agent-capabilities', 'https://sathian.ai/#featured-work'],
    ['site-agent-note-workflow', 'https://sathian.ai/#compose-note'],
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

  it('describes AutoQuote as private prototype evidence rather than an active hackathon build', () => {
    const autoQuote = cards.find((card) => card.id === 'project-autoquote-automator')
    const currentWork = cards.find((card) => card.id === 'current-public-work')

    expect(autoQuote?.body).toContain('private, personalized Ontario auto-insurance research prototype')
    expect(autoQuote?.body).toContain('was not submitted to a hackathon')
    expect(autoQuote?.body).toContain('not a quoting service')
    expect(autoQuote?.body).toContain('No live premiums')
    expect(autoQuote?.body).toContain('insurer-form submission, purchase, or binding action')
    expect(autoQuote?.tags).toContain('status-prototype')
    expect(currentWork?.body).not.toContain('AutoQuote Automator')
  })

  it('turns every registry record into a freshness-stamped public memory card', () => {
    for (const project of SITE_PROJECTS) {
      const card = cards.find((candidate) => candidate.id === project.id)

      expect(card).toBeDefined()
      expect(card?.body).toBe(project.approvedClaims.join(' '))
      expect(card?.validFrom).toBe(`${project.reviewedAt}T00:00:00.000Z`)
      expect(card?.tags).toEqual(expect.arrayContaining([
        `status-${project.status}`,
        ...project.aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
      ]))
    }
  })

  it('publishes a concise guide to the site agent instead of making visitors guess', () => {
    const capabilities = cards.find((card) => card.id === 'site-agent-capabilities')

    expect(capabilities?.body).toContain('explain and compare')
    expect(capabilities?.body).toContain('latest Draw with Tanda release')
    expect(capabilities?.body).toContain('find Sathian’s writing')
    expect(capabilities?.body).toContain('leave Sathian a note')
    expect(capabilities?.body).toContain('follow-up questions')
    expect(capabilities?.body).not.toMatch(/private memory|operate his private systems/i)
  })

  it('documents deliberate note composition and a real receipt', () => {
    const noteWorkflow = cards.find((card) => card.id === 'site-agent-note-workflow')

    expect(noteWorkflow?.body).toContain('actual message')
    expect(noteWorkflow?.body).toContain('deliberately send')
    expect(noteWorkflow?.body).toContain('receipt')
  })

  it('uses the same project registry for the homepage and agent', () => {
    expect(homepage).toContain("from '@/content/site-projects'")
    expect(homepage).toContain('FEATURED_SITE_PROJECTS')
    expect(homepage).toContain('ARCHIVE_SITE_PROJECTS')
    expect(homepage).toContain('SOLANA_OBSERVATORY_PROJECT')
  })
})
