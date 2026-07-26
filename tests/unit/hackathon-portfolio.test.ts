import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { articles } from '@/lib/articles'

const readSource = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('hackathon portfolio release', () => {
  const page = readSource('src/app/hackathons/page.tsx')

  it('presents the three submissions in reverse chronological order', () => {
    const agentTab = page.indexOf('AgentTab')
    const toothFairy = page.indexOf('title="Tooth Fairy Network"')
    const clinicalGuard = page.indexOf('title="ClinicalGuard"')

    expect(agentTab).toBeGreaterThan(-1)
    expect(toothFairy).toBeGreaterThan(agentTab)
    expect(clinicalGuard).toBeGreaterThan(toothFairy)
  })

  it('links each entry to its strongest public proof', () => {
    expect(page).toContain('https://github.com/SathianSrikrishnan/monad-blitz-toronto')
    expect(page).toContain('/writings/the-gap-between-weeks')
    expect(page).toContain(
      'https://www.linkedin.com/posts/activity-7437509764399640577-86Rt',
    )
    expect(page).toContain('https://github.com/SathianSrikrishnan/ClinicalGuard')
  })

  it('publishes the approved AgentTab essay with build and personal media', () => {
    const article = articles.find((entry) => entry.slug === 'a-corporate-card-for-code')

    expect(article?.title).toBe('A Corporate Card for Code')
    expect(article?.date).toBe('2026-07-25')
    expect(article?.body).toContain('At 7:45 that morning')
    expect(article?.body).toContain('The current contract is a public rulebook and receipt book.')
    expect(
      article?.media?.some(
        (media) => media.src === '/media/a-corporate-card-for-code-agenttab.jpg',
      ),
    ).toBe(true)
    expect(
      article?.media?.some((media) => media.src === '/sathian-profile.png'),
    ).toBe(true)
    expect(
      existsSync(
        new URL(
          '../../public/media/a-corporate-card-for-code-agenttab.jpg',
          import.meta.url,
        ),
      ),
    ).toBe(true)
  })

  it('uses the current workshop treatment for the floating site agent', () => {
    const widget = readSource('src/components/ChatWidget.tsx')
    const styles = readSource('src/app/globals.css')

    expect(widget).toContain('site-agent-panel--workshop')
    expect(styles).toContain('.site-agent-panel--workshop')
    expect(styles).toContain('.site-agent-panel--workshop.site-agent-panel--floating')
  })
})
