import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { MORE_SITE_PROJECTS, SITE_PROJECTS } from '@/content/site-projects'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('CCAC Vibe Learning local site review', () => {
  it('serves the preserved piano demo at the Sathian AI route', () => {
    const config = read('next.config.js')
    const page = read('public/ccac-vibe-piano/index.html')

    expect(config).toContain("source: '/ccac'")
    expect(config).toContain("destination: '/ccac-vibe-piano/index.html'")
    expect(page).toContain('<title>CCAC Vibe Learning · Piano playground</title>')
    expect(page).toContain('Little Lanterns')
    expect(page).toContain('River Flows in You')
    expect(page).toContain('Canon in D')
    expect(page).toMatch(/app\.js\?v=[^"']+/)
    expect(page).toMatch(/style\.css\?v=[^"']+/)
    expect(page).toContain('performed by Kassia')
    expect(page).toContain('data-song="little-lanterns"')
    expect(page).toContain('creativecommons.org/licenses/by/4.0/')
    expect(page).not.toContain('This requested song is not playable yet.')
    expect(page).toContain('Prototype')
    expect(page).not.toContain('Local prototype')
    expect(page).not.toContain('noindex,nofollow')
    expect(page).toContain('Piano Playground')
    expect(page).not.toContain('Follow a note. Find its key.')
    expect(page).not.toContain('Let your ears')
    expect(page).not.toContain('class="side-notes"')
    expect(page).not.toContain('id="review-form"')

    for (const asset of ['app.js', 'music.js', 'style.css', 'songs.js', 'canon-score.js', 'piano-audio.js', 'samples/C4.mp3']) {
      expect(existsSync(new URL(`../../public/ccac-vibe-piano/${asset}`, import.meta.url))).toBe(true)
    }
  })

  it('makes the prototype discoverable without presenting it as published', () => {
    const project = SITE_PROJECTS.find((entry) => entry.slug === 'ccac-vibe-piano')

    expect(project).toMatchObject({
      name: 'CCAC Vibe Learning',
      status: 'prototype',
      href: '/ccac',
      image: '/projects/ccac-vibe-piano.svg',
    })
    expect(project?.description).toContain('public prototype')
    expect(MORE_SITE_PROJECTS.at(0)?.slug).toBe('ccac-vibe-piano')
    expect(existsSync(new URL('../../public/projects/ccac-vibe-piano.svg', import.meta.url))).toBe(true)
    expect(project?.approvedClaims.join(' ')).not.toMatch(/published|live/i)
    expect(read('src/app/sitemap.ts')).toContain("'/ccac'")
  })
})
