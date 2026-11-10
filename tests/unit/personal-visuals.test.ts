import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

type Slide = { src: string; alt: string; width: number; height: number }
const artwork = JSON.parse(read('src/content/home-artwork.json')) as Record<string, Slide[]>

describe('requested homepage artwork correction', () => {
  it('preserves the existing homepage section order and server-rendered shell', () => {
    const home = read('src/components/home/HomeClient.tsx')
    expect(home).not.toContain('HomeMoments')
    expect(home).not.toContain("'use client'")
    expect(home.indexOf('id="home-agent-slot"')).toBeLessThan(home.indexOf('founder-quick-questions'))
    expect(home.indexOf('founder-quick-questions')).toBeLessThan(home.indexOf('aria-labelledby="building-now"'))
    expect(home).toContain('<FollowSath profiles />')
    expect(home.match(/Meet Sathian/g)).toHaveLength(1)
  })

  it('keeps Who and What static and puts mini carousels only in Where, When and Why', () => {
    const home = read('src/components/home/HomeClient.tsx')
    expect(home.match(/<QuestionArtwork /g)).toHaveLength(2)
    expect(home.match(/<HomeHeroCarousel \/>/g)).toHaveLength(1)
    expect(home.match(/<ArtworkCarousel /g)).toHaveLength(3)
    expect(home).not.toContain('additional=')
    const questionCards = [...home.matchAll(/<article className=\{artworkStyles.card\}>([\s\S]*?)<\/article>/g)]
    expect(questionCards).toHaveLength(5)
    const headings = ['Who I am.', 'What I build.', 'Where to begin.', 'When to start.', 'Why it matters.']
    questionCards.forEach((match, index) => {
      const card = match[1]
      expect(card).toContain(headings[index])
      expect(card.indexOf(index < 2 ? '<QuestionArtwork ' : '<ArtworkCarousel ')).toBeLessThan(card.indexOf('<details>'))
      expect(card.slice(card.indexOf('<details>'))).not.toMatch(/<ArtworkCarousel|<QuestionArtwork|<button/)
    })
    expect(questionCards[0][1]).toContain('/village/review-oct31/who-dad.webp')
    expect(questionCards[1][1]).toContain('/village/review-oct31/what-gift.webp')
    for (const [index, key] of ['where', 'when', 'why'].entries()) {
      expect(questionCards[index + 2][1]).toContain(`slides={HOME_QUESTION_SLIDES.${key}}`)
    }
    const staticArtwork = read('src/components/home/QuestionArtwork.tsx')
    expect(staticArtwork).not.toContain("'use client'")
    expect(staticArtwork).toContain('loading="lazy"')
    expect(read('src/components/home/HomeHeroCarousel.tsx')).toContain('slides={HOME_HERO_SLIDES}')
  })

  it('uses the exact approved catalog, including all 14 copied and hash-verified varied bank assets', () => {
    expect(Object.keys(artwork).sort()).toEqual(['hero', 'when', 'where', 'why'])
    const slides = Object.values(artwork).flat()
    for (const group of Object.values(artwork)) expect(group).toHaveLength(4)
    expect(new Set(slides.map(slide => slide.src)).size).toBe(16)
    for (const slide of slides) {
      expect(slide.src).toMatch(/^\/(?:home-art\/approved-bank-20261109|village\/review-oct31)\//)
      expect(slide.src).not.toContain('..')
      expect(existsSync(join(process.cwd(), 'public', slide.src))).toBe(true)
      expect(slide.width).toBeGreaterThan(0)
      expect(slide.height).toBeGreaterThan(0)
      expect(slide.alt.trim().length).toBeGreaterThan(20)
    }
    const manifest = JSON.parse(read('docs/marketing/home-artwork-20261109.json')) as {
      assets: { path: string; sha256: string; bytes: number; width: number; height: number; alt: string; source: string }[]
    }
    expect(manifest.assets).toHaveLength(14)
    const bankSlides = slides.filter(slide => slide.src.startsWith('/home-art/approved-bank-20261109/'))
    expect(bankSlides.map(slide => `public${slide.src}`).sort()).toEqual(manifest.assets.map(asset => asset.path).sort())
    for (const asset of manifest.assets) {
      const bytes = readFileSync(join(process.cwd(), asset.path))
      expect(bytes.byteLength).toBe(asset.bytes)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256)
      expect(asset.source).toMatch(/^tooth-fairy-network\/public\/product\//)
      const slide = bankSlides.find(item => `public${item.src}` === asset.path)
      expect(slide).toMatchObject({ width: asset.width, height: asset.height, alt: asset.alt })
    }
    expect(slides.filter(slide => !bankSlides.includes(slide)).map(slide => slide.src).sort()).toEqual([
      '/village/review-oct31/proof-and-certificate-usdc.webp', '/village/review-oct31/when-gift.webp',
    ])
    const data = read('src/content/home-hero-slides.ts')
    expect(data).toMatch(/HOME_HERO_INTERVAL_MS\s*=\s*1_000\b/)
    expect(data).toContain("import artwork from './home-artwork.json'")
    for (const key of Object.keys(artwork)) expect(data).toContain(`artwork.${key}`)
  })

  it('waits for one decoded next image and clears timers when paused, offscreen or hidden', () => {
    const carousel = read('src/components/home/ArtworkCarousel.tsx')
    expect(carousel).toContain('prefers-reduced-motion: reduce')
    expect(carousel).toContain('visibilitychange')
    expect(carousel).toContain('IntersectionObserver')
    // Nov 9: keyboard focus pauses; a tap (mouse/touch focus) keeps it turning.
    expect(carousel).toContain("matches(':focus-visible')) setRunning(false)")
    expect(carousel).toContain('running && !reducedMotion && !hovered && visible && pageVisible')
    expect(carousel).toContain('if (!rotating || !imageLoaded) return')
    expect(carousel).toContain('window.clearTimeout(timer)')
    expect(carousel).toContain('getImageProps(')
    expect(carousel.match(/new window.Image\(\)/g)).toHaveLength(1)
    expect(carousel.match(/<Image /g)).toHaveLength(1)
    expect(carousel).toContain('preload.decode()')
    expect(carousel).toContain('rotating && due && ready === next')
    expect(carousel).toContain('requested !== null && ready === requested')
    expect(carousel).toContain('cancelled = true')
    expect(carousel).not.toMatch(/gsap|motion\/|swiper|setInterval/)
  })

  it('turns by itself with no arrows: the picture is the Next button and a small in-frame pause icon stays (owner, Nov 9; WCAG 2.2.2)', () => {
    const carousel = read('src/components/home/ArtworkCarousel.tsx')
    expect(carousel.match(/<button /g)).toHaveLength(2)
    for (const label of ['Previous image', 'styles.arrow']) expect(carousel).not.toContain(label)
    for (const label of ['aria-label="Next image"', 'Pause automatic rotation', 'width="14" height="14"']) expect(carousel).toContain(label)
    expect(carousel).toContain('aria-roledescription="carousel"')
    expect(carousel).toContain('aria-label={`${index + 1} of ${slides.length}`}')
    expect(carousel).not.toMatch(/<figcaption|styles\.(?:caption|counter|controls|bottomBar)|<details|<summary/)
    const styles = read('src/components/home/HomeHeroCarousel.module.css')
    expect(styles).toContain('.pause { top: 0; right: 0; }')
    expect(styles).toContain(':focus-visible')
  })

  it('shows Finished Proofs on the Village page: a stack, a drifting row and a round carousel', () => {
    const village = read('src/app/village/page.tsx')
    for (const part of ['<ProofStack />', '<ProofRound />', 'village-real-proofs']) expect(village).toContain(part)
    expect(village).not.toContain('<ProofRow')
    expect(village).not.toContain('<GiftGallery')
  })

  it('restores About and Links contact presentation with plain X labels', () => {
    const about = read('src/app/about/page.tsx')
    expect(about).toContain('<FollowSath profiles title="How You Connect" />')
    expect(about).not.toContain('All links and channels')
    const links = read('src/app/links/page.tsx')
    expect(links).toContain('A few ways in.')
    expect(links).toContain("canonical: '/links'")
    expect(links).toContain('personalSocialLinks.map')
    expect(links).toContain('toothFairySocialLinks.map')
    expect(links).not.toContain('inside-monkedao')
    expect(read('src/components/FollowSath.tsx')).not.toContain('@Sathian')
    expect(read('src/lib/social-links.ts')).toContain('https://x.com/Sathian')
  })
})
