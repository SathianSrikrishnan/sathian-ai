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
  const writingIndex = readOptional('src/app/writings/page.tsx')
  const homepage = `${page}\n${homeClient}`

  it('leads with a personal workshop and a useful agent doorway', () => {
    expect(homepage).toContain('A personal workshop,')
    expect(homepage).toContain('agent can help you')
    expect(homepage).toContain('Ask the site agent')
  })

  it('keeps the approved homepage baseline free of the retired TxODDS sprint', () => {
    expect(page).not.toContain('getTxOddsCampaign')
    expect(homeClient).not.toContain('Start with what you already know.')
    expect(homeClient).not.toContain('Ask what I could build')
    expect(homeClient).not.toContain('campaign.referralUrl')
    expect(homepage).not.toMatch(/TxODDS|txodds/)
  })

  it('replaces stale events with a dated Building in Public stream', () => {
    expect(homepage).toContain('Building in public')
    expect(homepage).toContain('What changed')
    expect(homepage).toContain('What I learned')
    expect(homepage).toContain('Next')
    expect(homepage).not.toMatch(/Signal\s*&\s*Noise/i)
  })

  it('frames AI-native infrastructure as a bounded public experiment, not a sales pitch', () => {
    expect(homepage).toContain('AI-NATIVE INFRASTRUCTURE')
    expect(homepage).toContain('persistent memory')
    expect(homepage).toContain('RAG systems')
    expect(homepage).toContain('a small number of clients')
    expect(homepage).not.toContain('tell me what keeps getting done by hand')
  })

  it('records the Toothlight ownership proof as a bounded devnet milestone', () => {
    expect(homeClient).toContain('Making a childhood memory ownable without making it public')
    expect(homeClient).toContain('synthetic private-provenance Toothlight on Solana devnet')
    expect(homeClient).toContain('guardian-owned digital keepsake')
    expect(homeClient).toContain('Bubblegum V1')
    expect(homeClient).toContain('recommended V2 path')
    expect(homeClient).toContain('2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke')
    expect(homeClient).not.toMatch(/mainnet launch|guaranteed (?:growth|returns|appreciation)/i)
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

  it('uses project-owned artwork behind Tooth Fairy Network and BTC Cultural Atlas', () => {
    expect(homeClient).toContain("image: '/toothfairy/animation/tfn-tanda-hero-poster.webp'")
    expect(homeClient).toContain("image: '/media/bitcoin-coin.jpg'")
    expect(
      existsSync(new URL('../../public/media/bitcoin-coin.jpg', import.meta.url)),
    ).toBe(true)
  })
})
