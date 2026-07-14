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

  it('leads with proof of work and a useful agent doorway', () => {
    expect(homepage).toContain('Proof of work,')
    expect(homepage).toContain('Ask what I’m building, learning, or available to help with.')
    expect(homepage).toContain('Ask my agent')
  })

  it('replaces stale events with a dated Building in Public stream', () => {
    expect(homepage).toContain('Building in public')
    expect(homepage).toContain('What changed')
    expect(homepage).toContain('What I learned')
    expect(homepage).toContain('Next')
    expect(homepage).not.toMatch(/Signal\s*&\s*Noise/i)
  })

  it('keeps the AI practice explanation concise and specific', () => {
    expect(homepage).toContain('I build small AI systems around real work.')
    expect(homepage).toContain('tell me what keeps getting done by hand')
    expect(homepage).not.toContain('AI-native systems for real work')
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
    expect(homeClient).toContain("image: '/projects/btc-cultural-atlas-hero.png'")
    expect(
      existsSync(new URL('../../public/projects/btc-cultural-atlas-hero.png', import.meta.url)),
    ).toBe(true)
  })
})
