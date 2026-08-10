import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'

const readOptional = (path: string) => {
  const url = new URL(`../../${path}`, import.meta.url)
  return existsSync(url) ? readFileSync(url, 'utf8') : ''
}

describe('sathian.ai relaunch surface', () => {
  const page = readOptional('src/app/page.tsx')
  const homeClient = readOptional('src/components/home/HomeClient.tsx')
  const articleDatabase = readOptional('src/lib/articles-db.ts')
  const rootLayout = readOptional('src/app/layout.tsx')
  const writingIndex = readOptional('src/app/writings/page.tsx')
  const agentIndex = readOptional('src/app/agents/page.tsx')
  const publicBuildNotes = readOptional('src/lib/public-build-notes.ts')
  const homepage = `${page}\n${homeClient}`
  const publicBuildRecord = `${agentIndex}\n${publicBuildNotes}`

  it('leads with the live site agent as the fastest contact doorway', () => {
    expect(homepage).toContain('SATHIAN S. / AGENT MANAGER + ORCHESTRATOR / TORONTO')
    expect(homepage).toContain('The fastest way to reach me is to ask.')
    expect(homeClient).toContain('id="home-agent-slot"')
    expect(homepage).toContain('Ask anything about the work, or leave me a note.')
  })

  it('keeps the approved homepage baseline free of the retired TxODDS sprint', () => {
    expect(page).not.toContain('getTxOddsCampaign')
    expect(homeClient).not.toContain('Start with what you already know.')
    expect(homeClient).not.toContain('Ask what I could build')
    expect(homeClient).not.toContain('campaign.referralUrl')
    expect(homepage).not.toMatch(/TxODDS|txodds/)
  })

  it('moves the dated build stream off the human homepage and into the agent index', () => {
    expect(homepage).not.toContain('Building in public')
    expect(homepage).not.toContain('What changed')
    expect(publicBuildRecord).toContain('Public build record')
    expect(publicBuildRecord).toContain('What changed')
    expect(publicBuildRecord).toContain('What I learned')
    expect(publicBuildRecord).toContain('Next')
    expect(homepage).not.toMatch(/Signal\s*&\s*Noise/i)
  })

  it('uses agent management and orchestration as Sathian\'s public theme', () => {
    expect(rootLayout).toContain('Agent manager and orchestrator')
  })

  it('frames AI-native infrastructure as a bounded public experiment, not a sales pitch', () => {
    expect(publicBuildRecord).toContain('AI-NATIVE INFRASTRUCTURE')
    expect(publicBuildRecord).toContain('persistent memory')
    expect(publicBuildRecord).toContain('a small number of client settings')
    expect(publicBuildRecord).toContain('bounded actions')
    expect(homepage).not.toContain('tell me what keeps getting done by hand')
  })

  it('records the Toothlight ownership proof as a bounded devnet milestone', () => {
    expect(publicBuildRecord).toContain('Making a childhood memory ownable without making it public')
    expect(publicBuildRecord).toContain('synthetic private-provenance Toothlight on Solana devnet')
    expect(publicBuildRecord).toContain('guardian-owned digital keepsake')
    expect(publicBuildRecord).toContain('Bubblegum V1')
    expect(publicBuildRecord).toContain('recommended V2 path')
    expect(publicBuildRecord).toContain('2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke')
    expect(publicBuildRecord).not.toMatch(/mainnet launch|guaranteed (?:growth|returns|appreciation)/i)
  })

  it('publishes the receipt-backed TFN wallet compatibility milestone', () => {
    expect(publicBuildRecord).toContain('Six wallets, one evidence ledger')
    expect(publicBuildRecord).toContain('Phantom, Solflare, Backpack, Jupiter Wallet, Trust Wallet, and MetaMask')
    expect(publicBuildRecord).toContain('Solflare, Backpack, and Jupiter Wallet completed the full escrow lifecycle')
    expect(publicBuildRecord).toContain('Trust and MetaMask still have documented escrow limitations')
    expect(publicBuildRecord).toContain('https://toothfairy.network/wallets')
    expect(publicBuildRecord).not.toMatch(/all wallets are supported|fully supports/i)
  })

  it('registers the approved Tooth Fairy Network origin essay and historical image', () => {
    const article = articles.find((entry) => entry.slug === 'the-gap-between-weeks')

    expect(article).toBeDefined()
    expect(article?.title).toBe('The Gap Between Weeks')
    expect(article?.body).not.toContain('—')
    expect(article?.body).not.toMatch(/Not an NFT\. Not a blockchain/i)
    expect(article?.media?.some((media) => media.src === '/media/the-gap-between-weeks-v1-homepage.png')).toBe(true)
    expect(existsSync(new URL('../../public/media/the-gap-between-weeks-v1-homepage.png', import.meta.url))).toBe(true)
  })

  it('keeps reviewed static articles available when the database has no matching row', () => {
    expect(articleDatabase).toContain("import { articles as staticArticles")
    expect(articleDatabase).toContain('mergePublishedArticles')
    expect(articleDatabase).toContain('findStaticArticle')
  })

  it('sorts the writing index by publication date instead of pinning an older proof first', () => {
    expect(writingIndex).toContain('const entries = [')
    expect(writingIndex).toContain('.sort((a, b) =>')
    expect(writingIndex).toContain('entries.map((article) =>')
  })

  it('uses official and source-captured artwork for the featured projects', () => {
    expect(homeClient).toContain("image: '/toothfairy/animation/tfn-tanda-hero-integrated-poster-v34.webp'")
    expect(homeClient).toContain("image: '/projects/autoquote-automator-dashboard.png'")
    expect(homeClient).toContain("image: '/projects/solana-ecosystem-observatory.png'")
    expect(
      existsSync(new URL('../../public/projects/autoquote-automator-dashboard.png', import.meta.url)),
    ).toBe(true)
    expect(
      existsSync(new URL('../../public/projects/solana-ecosystem-observatory.png', import.meta.url)),
    ).toBe(true)
  })

  it('keeps the homepage focused while preserving older work in a quiet archive', () => {
    expect(homepage).toContain('Tooth Fairy Network')
    expect(homepage).toContain('AutoQuote Automator')
    expect(homepage).toContain('New to Solana?')
    expect(homepage).toContain('Writing')
    expect(homepage).toContain('More projects &amp; curiosities')
    expect(homepage).toContain('Lex Rooftop Garden')
    expect(homepage).toContain('BTC Cultural Atlas')
    expect(homepage).toContain('AgentTab')
    expect(homepage).toContain('ClinicalGuard')
    expect(homepage).not.toContain('WRITING, BY EMAIL')
    expect(homepage).not.toContain('03 / ABOUT')
  })
})
