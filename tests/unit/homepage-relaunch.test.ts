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
  const releaseRegistry = readOptional('src/content/site-releases.ts')
  const siteProjects = readOptional('src/content/site-projects.ts')
  const socialRegistry = readOptional('src/lib/social-links.ts')
  const siteIdentity = readOptional('src/lib/site-identity.ts')
  const homepage = `${page}\n${homeClient}\n${siteProjects}`
  const publicBuildRecord = `${agentIndex}\n${publicBuildNotes}`

  it('leads with the Village gift and preserves the live site agent', () => {
    // Owner, Oct 27: full name visible; the agent-manager title retired for founder + dad.
    expect(homepage).toContain('>SATHIAN SRIKRISHNAN</span>')
    expect(homepage).not.toContain('SATHN')
    expect(homepage).not.toContain('AGENT MANAGER + ORCHESTRATOR')
    expect(homepage).toContain('FOUNDER + DAD')
    expect(homepage).toContain('minimal-home-mission')
    expect(homepage).toContain('TORONTO')
    expect(homepage).toContain('Bring the Tooth Fairy to Your Child’s Village')
    expect(rootLayout.match(/title: 'Sathian Srikrishnan \| Digital Experiments'/g)).toHaveLength(3)
    expect(siteIdentity).toContain("name: 'Sathian'")
    expect(siteIdentity).not.toContain('SATHN')
    expect(homepage).not.toContain("Welcome to Sathian's Digital Workshop")
    expect(homepage).not.toContain('The fastest way to reach me is to ask.')
    expect(homeClient).toContain('id="home-agent-slot"')
    expect(homepage).not.toContain('Ask the site agent about what I am building and writing, or leave me a note.')
    expect(homepage).not.toContain('PUBLIC CONTEXT / PRIVATE INTAKE')
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

  it('uses founder and dad as Sathian\'s public theme (owner, Oct 28)', () => {
    expect(rootLayout).toContain('founder and dad in Toronto')
    expect(rootLayout).not.toContain('Agent manager and orchestrator')
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

  it('uses approved and source-captured artwork for every visible project', () => {
    expect(siteProjects).toContain("image: '/projects/tooth-fairy-network/family-storybook-hero.webp'")
    expect(homeClient).toContain("src=\"/projects/tooth-fairy-network/tanda-profile.png\"")
    expect(siteProjects).toContain("image: '/media/a-corporate-card-for-code-agenttab.png'")
    expect(siteProjects).toContain("image: '/projects/clinicalguard-dashboard.png'")
    expect(siteProjects).toContain("image: '/projects/autoquote-automator-dashboard.png'")
    expect(siteProjects).toContain("image: '/projects/solana-ecosystem-observatory.png'")
    expect(existsSync(new URL('../../public/projects/tooth-fairy-network/family-storybook-hero.webp', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../../public/projects/tooth-fairy-network/tanda-profile.png', import.meta.url))).toBe(true)
    expect(existsSync(new URL('../../public/projects/clinicalguard-dashboard.png', import.meta.url))).toBe(true)
    expect(
      existsSync(new URL('../../public/projects/autoquote-automator-dashboard.png', import.meta.url)),
    ).toBe(true)
    expect(
      existsSync(new URL('../../public/projects/solana-ecosystem-observatory.png', import.meta.url)),
    ).toBe(true)
  })

  it('features the live Draw with Tanda pilot and every official TFN social channel', () => {
    const durableTfnSurface = `${homeClient}\n${releaseRegistry}\n${socialRegistry}\n${siteProjects}`
    expect(durableTfnSurface).toContain('Draw with Tanda')
    expect(durableTfnSurface).toContain("youtubeVideoId: 'ZoY1ZEzJymY'")
    expect(durableTfnSurface).toContain('https://toothfairy.network')
    expect(homeClient).toContain('toothFairySocialLinks.map')
    expect(existsSync(new URL('../../public/projects/tooth-fairy-network/draw-finn-thumbnail.jpg', import.meta.url))).toBe(true)
  })

  it('nests Learn with Tanda under Tooth Fairy Network instead of a video banner', () => {
    expect(homeClient).not.toContain('id="latest-release"')
    expect(homeClient).not.toContain('minimal-latest-release')
    expect(homeClient).not.toContain('minimal-tfn-video')
    expect(homeClient).not.toContain('youtube-nocookie.com/embed')
    expect(homeClient).toContain('<h3>Learn with Tanda</h3>')
    expect(homeClient).toContain('/learn-art/classroom-master.webp')
    expect(homeClient).toContain('href="/learn"')
  })

  it('uses the same bold editorial heading treatment for the Solana project', () => {
    const styles = readOptional('src/app/globals.css')
    expect(styles).toContain('.minimal-solana h2')
  })

  it('keeps the homepage identity and title inside the mobile viewport', () => {
    const styles = readOptional('src/app/globals.css')
    expect(homeClient.match(/minimal-home-identity__part/g)).toHaveLength(3)
    expect(styles).toContain('.minimal-home-identity')
    expect(styles).toContain('font-size: clamp(44px, 12vw, 50px)')
  })

  it('keeps the Writing index quiet and removes the rejected headline', () => {
    expect(writingIndex).not.toContain('Writing to understand.')
    expect(writingIndex).toContain('Notes on culture, money, technology, fatherhood, and the products I am learning to build.')
  })

  it('keeps the homepage focused and moves older builds to Hackathons', () => {
    const hackathons = readOptional('src/app/hackathons/page.tsx')
    expect(homepage).toContain('Tooth Fairy Network')
    expect(homepage).not.toContain('New to Solana?')
    expect(homeClient).toContain('MORE_SITE_PROJECTS.map')
    expect(homeClient).toContain('href="/hackathons"')
    expect(homepage).toContain('Writing')
    expect(homepage).toContain('More projects &amp; curiosities')
    expect(hackathons).toContain('HACKATHON_SITE_PROJECTS')
    expect(hackathons).toContain('More builds &amp; experiments')
    expect(homepage).not.toContain('WRITING, BY EMAIL')
    expect(homepage).not.toContain('03 / ABOUT')
  })

  it('renders featured and archived projects from the canonical project registry', () => {
    expect(homeClient).toContain('FEATURED_SITE_PROJECTS')
    expect(homeClient).toContain('HACKATHON_SITE_PROJECTS')
    expect(homeClient).not.toContain('const FEATURED_PROJECTS = [')
    expect(homeClient).not.toContain('const MORE_PROJECTS = [')
  })
})
