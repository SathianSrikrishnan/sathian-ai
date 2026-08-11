import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Bitcoin Bay published proposal', () => {
  it('has a dedicated /bitcoinbay page', () => {
    expect(existsSync(resolve(process.cwd(), 'src/app/bitcoinbay/page.tsx'))).toBe(true)
  })

  it('publishes the approved cohort, food, sponsor, and hardware guidance', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/page.tsx'), 'utf8')

    for (const required of [
      'Bitcoin Bay already has the signal.',
      'The Node Lab',
      'six learners',
      'two-pizza',
      '$10 suggested',
      '$50–$100',
      'simple sponsor',
      '8 GB RAM',
      '1 TB SSD',
      '2 TB preferred',
      'Linux-capable',
      'September 14',
      '60-minute working session',
    ]) {
      expect(page).toContain(required)
    }
  })

  it('removes internal critique and creative shorthand from the published draft', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/page.tsx'), 'utf8').toLowerCase()

    for (const prohibited of [
      'what leaked',
      'leaky funnel',
      'bitcoin pastor',
      'crypto polytheist',
      'placeholder portrait',
      'internal only',
    ]) {
      expect(page).not.toContain(prohibited)
    }
  })

  it('fails closed behind a no-index server gate and a scoped secure cookie', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/page.tsx'), 'utf8')
    const actionPath = resolve(process.cwd(), 'src/app/bitcoinbay/actions.ts')

    expect(page).toContain("robots: { index: false, follow: false }")
    expect(page).toContain("export const dynamic = 'force-dynamic'")
    expect(page).toContain('verifyAccessToken')
    expect(page).toContain('cookies()')
    expect(existsSync(actionPath)).toBe(true)

    const action = readFileSync(actionPath, 'utf8')
    expect(action).toContain("'use server'")
    expect(action).toContain('matchesAccessCode')
    expect(action).toContain('httpOnly: true')
    expect(action).toContain("sameSite: 'strict'")
    expect(action).toContain("path: '/bitcoinbay'")
  })

  it('hides the public site agent with a CSS-module-pure sibling selector', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/bitcoinbay.module.css'), 'utf8')
    const chat = readFileSync(resolve(process.cwd(), 'src/components/ChatWidget.tsx'), 'utf8')

    expect(css).toContain('.page ~ :global([data-site-agent-root])')
    expect(css).toContain('.gate ~ :global([data-site-agent-root])')
    expect(chat).toContain('data-site-agent-root')
  })

  it('uses paper-safe accent colors and keeps the visible brand name as the link name', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/page.tsx'), 'utf8')
    const css = readFileSync(resolve(process.cwd(), 'src/app/bitcoinbay/bitcoinbay.module.css'), 'utf8')

    expect(page).not.toContain('aria-label="Return to the beginning"')
    expect(css).toContain('--orange-ink: #9a4b00')
    expect(css).toContain('--teal-ink: #006f66')
    expect(css).toContain('.paperSection .eyebrow')
    expect(css).toContain('.cta .eyebrow')
    expect(css).toContain('.orangeSection .eyebrow')
  })
})
