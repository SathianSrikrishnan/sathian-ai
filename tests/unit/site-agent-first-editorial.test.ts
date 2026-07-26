import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readSource = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('site-agent-first editorial pass', () => {
  const home = readSource('src/components/home/HomeClient.tsx')
  const widget = readSource('src/components/ChatWidget.tsx')
  const about = readSource('src/app/about/page.tsx')
  const automation = readSource('src/app/automation/page.tsx')
  const agentIndex = readSource('src/app/agents/page.tsx')
  const articles = readSource('src/lib/articles.ts')
  const nav = readSource('src/components/SiteNav.tsx')
  const memory = readSource('src/lib/memory.ts')
  const buildNotes = readSource('src/lib/public-build-notes.ts')

  it('puts the real working agent in the homepage hero instead of a duplicate mock panel', () => {
    expect(home).toContain('id="home-agent-slot"')
    expect(home).not.toContain('className="relaunch-agent-panel"')
    expect(widget).toContain('createPortal')
    expect(widget).toContain("pathname === '/'")
    expect(widget).toContain("document.getElementById('home-agent-slot')")
    expect(widget).toContain('setOpen(true)')
  })

  it('uses Sathian\'s annotated homepage language', () => {
    expect(home).toContain('A personal workshop.')
    expect(home).toContain('Projects, writing, and agentic experiments')
    expect(home).toContain('Projects with a pulse.')
    expect(home).not.toContain('The systems underneath the work.')
    expect(home).not.toContain('BUILD_NOTES')
    expect(home).not.toContain('Three things with a pulse.')
    expect(home).not.toContain('A dated record, including the misses.')
  })

  it('retires the short-lived TxODDS campaign without changing the editorial baseline', () => {
    expect(home).not.toMatch(/TxODDS|txodds|World Cup build/)
    expect(memory).not.toContain('getTxOddsCampaignMemoryCards')
    expect(home).toContain('Projects with a pulse.')
    expect(agentIndex).toContain('Public build record')
  })

  it('consolidates About and Automation into one concise public page', () => {
    expect(about).toContain('relaunch-inner-shell')
    expect(about).toContain('relaunch-page-header')
    expect(about).toContain('Small systems for messy work.')
    expect(about).toContain('Public context. Private boundaries.')
    expect(about).not.toContain('Four systems I keep returning to.')
    expect(automation).toContain("redirect('/about#automation')")
  })

  it('keeps the human navigation short and gives agents a quieter index', () => {
    expect(nav).toContain("{ label: 'Projects', href: '/#now'")
    expect(nav).toContain("{ label: 'Hackathons', href: '/hackathons'")
    expect(nav).toContain("{ label: 'Writing', href: '/writings'")
    expect(nav).toContain("{ label: 'About', href: '/about'")
    expect(nav).not.toContain("{ label: 'Automation'")
    expect(nav).not.toContain("{ label: 'Email'")
    expect(agentIndex).toContain('FOR AGENTS / PUBLIC CONTEXT')
    expect(agentIndex).toContain('Public build record')
    expect(agentIndex).toContain('Tooth Fairy Network')
    expect(agentIndex).toContain('/hackathons')
  })

  it('dates The Gap Between Weeks to July 4, 2026', () => {
    expect(articles).toMatch(/slug: 'the-gap-between-weeks',[\s\S]*?date: '2026-07-04'/)
  })

  it('points the Projects navigation item to the real homepage section', () => {
    expect(nav).toContain("{ label: 'Projects', href: '/#now'")
    expect(nav).not.toContain("{ label: 'Projects', href: '/#projects'")
  })

  it('adds the reviewed current chapter to the bounded public-agent context', () => {
    expect(memory).toContain('getPublicProfileMemoryCards')
    const profile = readSource('src/lib/public-profile.ts')
    expect(profile).toContain('student again in his 40s')
    expect(profile).toContain('Toronto technology community')
    expect(profile).toContain('King & Bay Custom Clothing')
    expect(profile).not.toMatch(/children(?:'s)? names|credentials|client data/i)
  })

  it('links the verified TFN devnet proof without presenting it as a production release', () => {
    const profile = readSource('src/lib/public-profile.ts')
    expect(buildNotes).toContain('Making a childhood memory ownable without making it public')
    expect(buildNotes).toContain('Inspect the devnet transaction')
    expect(buildNotes).toContain('proofHref')
    expect(buildNotes).toContain('No production or mainnet configuration changed')
    expect(buildNotes).not.toMatch(/decentralized Tooth Fairy Network|mainnet launch/i)
    expect(profile).toContain('guardian-owned digital keepsake')
    expect(profile).toContain('optional future fund')
    expect(profile).toContain('4QnZV6aJ4jZLujSZZ3hUWJoQ9acSetyifcKVufYK4E9U')
    expect(profile).toContain('Bubblegum V1')
    expect(profile).toContain('Bubblegum V2')
  })
})
