import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const pagePath = resolve(root, 'src/app/launchpad/page.tsx')
const cssPath = resolve(root, 'src/app/launchpad/launchpad.module.css')
const videoPath = resolve(root, 'public/media/launchpad/sathian-launchpad-application.mp4')
const posterPath = resolve(root, 'public/media/launchpad/sathian-launchpad-poster.jpg')
const captionsPath = resolve(root, 'public/media/launchpad/sathian-launchpad-application.en.vtt')

describe('Stan Launchpad application page', () => {
  it('ships one dedicated video-first route and all local media', () => {
    for (const path of [pagePath, cssPath, videoPath, posterPath, captionsPath]) {
      expect(existsSync(path)).toBe(true)
    }

    expect(statSync(videoPath).size).toBe(30_169_940)
    const hash = createHash('sha256').update(readFileSync(videoPath)).digest('hex')
    expect(hash).toBe('81082a4b7e92f6b7db01641b246067af84536cb8249ae0ca7cfc75a19d5fb4d4')

    const posterHash = createHash('sha256').update(readFileSync(posterPath)).digest('hex')
    expect(posterHash).toBe('785c369a7138ec29438e3f6e0f111127e20cfefedb033640a036a2e6f83bfbd2')
  })

  it('keeps the application unlisted and focused on the native video', () => {
    const page = readFileSync(pagePath, 'utf8')
    const sitemap = readFileSync(resolve(root, 'src/app/sitemap.ts'), 'utf8')

    expect(page).toContain("robots: { index: false, follow: false }")
    expect(page).toContain("alternates: { canonical: '/launchpad' }")
    expect(page).toContain('<video')
    expect(page).toContain('controls')
    expect(page).toContain('playsInline')
    expect(page).toContain('preload="metadata"')
    expect(page).toContain('/media/launchpad/sathian-launchpad-application.mp4')
    expect(page).toContain('/media/launchpad/sathian-launchpad-application.en.vtt')
    expect(page).not.toContain('<figcaption>')
    expect(sitemap).not.toContain("'/launchpad'")
  })

  it('frames the application as a six-question founder prospectus', () => {
    const page = readFileSync(pagePath, 'utf8')
    const copy = page.replace(/\s+/g, ' ')

    for (const required of [
      'Who',
      'What',
      'When',
      'Where',
      'Why',
      'How',
      'Sathian Srikrishnan, 43.',
      'Divorced father of two.',
      'working web application',
      'deployed Solana mainnet program',
      'real deposits for my family and a small circle of friends',
      'Colosseum\u2019s Frontier Hackathon',
      'May 2026',
      'Camp Timberlake',
      'October 4\u201319',
      'Twenty primary teeth',
      'Call one toll-free number.',
      'physical keepsake',
      'parent-controlled future gift',
      'fourteen days',
      'first paying families',
    ]) {
      expect(copy).toContain(required)
    }

    expect(page).toContain('href="/writings/the-gap-between-weeks"')
    expect(page).toContain('The Gap Between Weeks')
    expect(page).toContain('href="/hackathons"')

    const requestedOrder = ['<dt>Who</dt>', '<dt>What</dt>', '<dt>Where</dt>', '<dt>When</dt>', '<dt>Why</dt>', '<dt>How</dt>']
    const positions = requestedOrder.map((label) => page.indexOf(label))
    expect(positions).toEqual([...positions].sort((a, b) => a - b))

    for (const prohibited of [
      'Binance',
      'Coinbase',
      '150 traditions',
      'total addressable market',
      'The version I&apos;m testing now.',
      'An old ritual, rebuilt for now.',
      'Two weeks to find the truth.',
    ]) {
      expect(page).not.toContain(prohibited)
    }
  })

  it('uses the existing editorial system and removes the site-agent distraction', () => {
    const page = readFileSync(pagePath, 'utf8')
    const css = readFileSync(cssPath, 'utf8')

    expect(page).toContain('minimal-site')
    expect(page).toContain('data-theme="workshop"')
    expect(css).toContain('.page ~ :global([data-site-agent-root])')
    expect(css).toContain('@media (max-width: 720px)')
    expect(css).toContain(':focus-visible')
    expect(css).toContain('prefers-reduced-motion')
  })
})
