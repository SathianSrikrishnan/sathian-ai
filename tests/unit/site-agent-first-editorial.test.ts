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

  it('uses Sathian\'s approved minimal homepage language', () => {
    expect(home).toContain('Digital Experiments')
    expect(home).not.toContain("Welcome to Sathian's Digital Workshop")
    expect(home).not.toContain('Ask the site agent about what I am building and writing, or leave me a note.')
    expect(widget).not.toContain('PUBLIC CONTEXT / PRIVATE INTAKE')
    expect(home).not.toContain('The fastest way to reach me is to ask.')
    expect(home).toContain('Featured work')
    expect(home).toContain('More projects &amp; curiosities')
    expect(home).not.toContain('The systems underneath the work.')
    expect(home).not.toContain('BUILD_NOTES')
    expect(home).not.toContain('Three things with a pulse.')
    expect(home).not.toContain('A dated record, including the misses.')
  })

  it('retires the short-lived TxODDS campaign without changing the editorial baseline', () => {
    expect(home).not.toMatch(/TxODDS|txodds|World Cup build/)
    expect(memory).not.toContain('getTxOddsCampaignMemoryCards')
    expect(home).toContain('Featured work')
    expect(agentIndex).toContain('Public build record')
  })

  it('keeps a crawlable identity page while folding Automation into the chat-first front door', () => {
    expect(about).toContain("'@type': 'ProfilePage'")
    expect(about).toContain('Sathian Srikrishnan')
    expect(automation).toContain("redirect('/#agent')")
  })

  it('keeps the human navigation to the four approved pages and gives agents a quieter index', () => {
    expect(nav).toContain("{ label: 'Home', href: '/'")
    expect(nav).toContain("{ label: 'About', href: '/about'")
    expect(nav).toContain("{ label: 'Hackathons', href: '/hackathons'")
    expect(nav).toContain("{ label: 'Writing', href: '/writings'")
    expect(nav).not.toContain("{ label: 'Projects'")
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

  it('points Home navigation to the chat-first front door', () => {
    expect(nav).toContain("{ label: 'Home', href: '/'")
    expect(nav).not.toContain("{ label: 'Projects'")
  })

  it('adds the reviewed current chapter to the bounded public-agent context', () => {
    expect(memory).toContain('getPublicProfileMemoryCards')
    const profile = readSource('src/lib/public-profile.ts')
    expect(profile).toContain('student again in his 40s')
    expect(profile).toContain('Toronto technology community')
    expect(profile).toContain('King & Bay Custom Clothing')
    expect(profile).not.toMatch(/children(?:'s)? names|credentials|client data/i)
  })

  it('keeps the devnet build note as history while publishing the verified Mainnet contract state', () => {
    const profile = readSource('src/lib/public-profile.ts')
    expect(buildNotes).toContain('Making a childhood memory ownable without making it public')
    expect(buildNotes).toContain('Inspect the devnet transaction')
    expect(buildNotes).toContain('proofHref')
    expect(buildNotes).toContain('No production or mainnet configuration changed')
    expect(buildNotes).not.toMatch(/decentralized Tooth Fairy Network|mainnet launch/i)
    expect(profile).toContain('FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC')
    expect(profile).toContain('2-of-3 Squads multisig')
    expect(profile).toContain('0.01 SOL deposit')
    expect(profile).toContain('1.00 canonical-USDC deposit')
    expect(profile).toContain('does not mean the customer-facing USDC or on-ramp flow is released')
  })
})
