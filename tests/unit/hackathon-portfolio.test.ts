import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'

const readSource = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('hackathon portfolio release', () => {
  const page = readSource('src/app/hackathons/page.tsx')

  it('features AutoQuote Automator before the earlier submissions', () => {
    const autoQuote = page.indexOf('AutoQuote Automator')
    const agentTab = page.indexOf('AgentTab')
    const toothFairy = page.indexOf('title="Tooth Fairy Network"')
    const clinicalGuard = page.indexOf('title="ClinicalGuard"')

    expect(autoQuote).toBeGreaterThan(-1)
    expect(agentTab).toBeGreaterThan(-1)
    expect(agentTab).toBeGreaterThan(autoQuote)
    expect(toothFairy).toBeGreaterThan(agentTab)
    expect(clinicalGuard).toBeGreaterThan(toothFairy)
  })

  it('links each entry to its strongest public proof', () => {
    expect(page).toContain('https://ontario-all-quote-agent.vercel.app')
    expect(page).toContain('https://github.com/SathianSrikrishnan/monad-blitz-toronto')
    expect(page).toContain('/writings/the-gap-between-weeks')
    expect(page).toContain(
      'https://www.linkedin.com/posts/activity-7437509764399640577-86Rt',
    )
    expect(page).toContain('https://github.com/SathianSrikrishnan/ClinicalGuard')
  })

  it('keeps the public evidence state explicit after the rename', () => {
    expect(page).toContain('15 families / 16 routes')
    expect(page).toContain('44 fields / 43 available')
    expect(page).toContain('16 routes / 0 premiums')
    expect(page).toContain('Public routes tested')
    expect(page).toContain('Live premiums returned')
    expect(page).toContain('Personal records exposed')
  })

  it('publishes the approved AgentTab essay with build and personal media', () => {
    const article = articles.find((entry) => entry.slug === 'a-corporate-card-for-code')

    expect(article?.title).toBe('A Corporate Card for Code')
    expect(article?.date).toBe('2026-07-25')
    expect(article?.body).toContain('At 7:45 that morning')
    expect(article?.body).toContain('The current contract is a public rulebook and receipt book.')
    expect(
      article?.media?.some(
        (media) => media.src === '/media/a-corporate-card-for-code-agenttab.png',
      ),
    ).toBe(true)
    expect(
      article?.media?.some((media) => media.src === '/sathian-profile.png'),
    ).toBe(true)
    expect(
      existsSync(
        new URL(
          '../../public/media/a-corporate-card-for-code-agenttab.png',
          import.meta.url,
        ),
      ),
    ).toBe(true)
  })

  it('gives the AgentTab essay a contained screenshot and readable workshop palette', () => {
    const article = articles.find((entry) => entry.slug === 'a-corporate-card-for-code')
    const renderer = readSource('src/components/article/ArticleRenderer.tsx')
    const styles = readSource('src/app/globals.css')

    expect(article?.heroLayout).toBe('contained')
    expect(article?.pullQuotes).toHaveLength(2)
    expect(article?.theme.accent).toBe('#8C451C')
    expect(renderer).toContain("article.heroLayout === 'contained'")
    expect(styles).toContain('.workshop-article blockquote')
  })

  it('uses the current workshop treatment for the floating site agent', () => {
    const widget = readSource('src/components/ChatWidget.tsx')
    const styles = readSource('src/app/globals.css')

    expect(widget).toContain('site-agent-panel--workshop')
    expect(styles).toContain('.site-agent-panel--workshop')
    expect(styles).toContain('.site-agent-panel--workshop.site-agent-panel--floating')
  })
})
