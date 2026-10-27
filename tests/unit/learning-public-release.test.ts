import { expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import lessons from '../../src/lib/learn/lessons.json'
import films from '../../src/lib/learn/storybook/films.json'

it('ships the approved classroom and Tanda assets while retaining only the production story-media baseline', () => {
  expect(lessons.map(l => l.id)).toEqual(['bitcoin', 'ethereum', 'solana'])
  expect(films.map(f => f.slug)).toEqual(['tanda-origin', 'first-tooth-fee', 'toothlight-treaty'])
  for (const name of ['planet-v2-review', 'stablecoins', 'founder-r3-review']) {
    expect(existsSync(`public/learn-media/${name}`)).toBe(false)
  }
  expect(existsSync('public/learn-media/welcome-r2/dad-welcome-review.mp4')).toBe(false)
  const approved = JSON.parse(readFileSync('docs/releases/learn-v9-public-assets.json', 'utf8'))
  for (const asset of approved.assets) {
    expect(createHash('sha256').update(readFileSync(asset.path)).digest('hex')).toBe(asset.sha256)
  }
})
