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
    expect(sitemap).not.toContain("'/launchpad'")
  })

  it('uses a concise, parent-led explanation instead of a crypto pitch', () => {
    const page = readFileSync(pagePath, 'utf8')

    for (const required of [
      'I built it first for my own children.',
      'A toll-free call',
      'physical keepsake',
      'guardian-owned digital wallet',
      '20 primary teeth',
      'Families worldwide',
      'Parent-led by design',
      'two weeks',
      'paying families',
    ]) {
      expect(page).toContain(required)
    }

    for (const prohibited of ['Binance', 'Coinbase', '150 traditions', 'total addressable market']) {
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
