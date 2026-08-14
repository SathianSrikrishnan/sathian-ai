import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readOptional = (path: string) => {
  const url = new URL(`../../${path}`, import.meta.url)
  return existsSync(url) ? readFileSync(url, 'utf8') : ''
}

describe('durable release channel', () => {
  const releases = readOptional('src/content/site-releases.ts')
  const homepage = readOptional('src/components/home/HomeClient.tsx')
  const drawChannel = readOptional('src/app/projects/tooth-fairy-network/draw-with-tanda/page.tsx')
  const clinicalGuard = readOptional('src/app/projects/clinicalguard/page.tsx')
  const profile = readOptional('src/lib/public-profile.ts')
  const chat = readOptional('src/components/ChatWidget.tsx')

  it('uses one registry for the latest release across the homepage and site agent', () => {
    expect(releases).toContain('export const LATEST_RELEASE')
    expect(homepage).toContain('LATEST_RELEASE')
    expect(profile).toContain('releaseToPublicMemoryCard')
    expect(profile).toContain('LATEST_RELEASE')
  })

  it('publishes both known Draw with Tanda episodes from their verified YouTube records', () => {
    expect(releases).toContain("slug: 'finn-the-shark'")
    expect(releases).toContain("youtubeVideoId: 'ZoY1ZEzJymY'")
    expect(releases).toContain("slug: 'nori-the-narwhal'")
    expect(releases).toContain("id: 'draw-with-tanda-nori-2026-08-10'")
    expect(releases).toContain("youtubeVideoId: 'D0I_6me_WcU'")
    expect(releases).toContain("youtubeHref: 'https://youtu.be/D0I_6me_WcU'")
    expect(releases).not.toContain("status: 'next'")
    expect(drawChannel).toContain('DRAW_WITH_TANDA_EPISODES')
    expect(drawChannel).toContain('VideoObject')
    expect(drawChannel).toContain("episode.status === 'published'")
  })

  it('preserves the approved TFN brand and complete social-link contract on the channel page', () => {
    expect(drawChannel).toContain('/projects/tooth-fairy-network/tanda-profile.png')
    expect(drawChannel).toContain('toothFairySocialLinks.map')
    expect(drawChannel).toContain('Official Tooth Fairy Network channels')
  })

  it('gives ClinicalGuard a durable evidence page and links the archive to it', () => {
    const hackathons = readOptional('src/app/hackathons/page.tsx')
    const clinicalGuardSurface = `${clinicalGuard}\n${releases}`
    expect(clinicalGuardSurface).toContain('Five checks. One human decision.')
    expect(clinicalGuardSurface).toContain('2,390')
    expect(clinicalGuardSurface).toContain('841,507')
    expect(clinicalGuard).toContain('/projects/clinicalguard-dashboard.png')
    expect(hackathons).toContain("project: '/projects/clinicalguard'")
  })

  it('renders one next action and privacy-safe interaction events in the site agent', () => {
    const analytics = readOptional('src/lib/site-analytics.ts')
    expect(chat).not.toContain('sources?: string[]')
    expect(chat).toContain('nextAction?:')
    expect(chat).not.toContain('Agent source')
    expect(chat).toContain("trackSiteEvent('agent_prompt_selected'")
    expect(chat).toContain("trackSiteEvent('agent_question_submitted'")
    expect(chat).toContain("trackSiteEvent('agent_note_submitted'")
    expect(chat).toContain("trackSiteEvent('agent_answer_received'")
    expect(chat).toContain("trackSiteEvent('agent_source_opened'")
    expect(chat).toContain("trackSiteEvent('agent_note_sent'")
    expect(chat).toContain("trackSiteEvent('agent_answer_feedback'")
    expect(chat).toContain("'helpful' | 'not_helpful'")
    expect(analytics).toContain("window.gtag('event'")
  })

  it('does not count a deliberate note attempt as a chatbot question', () => {
    expect(chat).toMatch(/pendingIntent\s*===\s*'question'[\s\S]{0,500}agent_question_submitted/)
    expect(chat).toMatch(/pendingIntent\s*===\s*'note'[\s\S]{0,500}agent_note_submitted/)
  })
})
