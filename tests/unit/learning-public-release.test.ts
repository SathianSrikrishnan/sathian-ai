import { expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import lessons from '../../src/lib/learn/lessons.json'
import films from '../../src/lib/learn/storybook/films.json'

it('keeps the two approved guide players visible and transcript disclosures out of the learner flow', () => {
  const guides = readFileSync('src/components/learn/MeetGuides.tsx', 'utf8')
  expect(guides.match(/<video /g)).toHaveLength(2)
  expect(guides).not.toContain('<details')
  expect(guides).toContain('/proof-assets/proof-main-20261027/proof-main-before-final-cta-review.mp4')
  expect(guides).not.toContain('dad-welcome')
  const collection = readFileSync('src/components/learn/LessonCollection.tsx', 'utf8')
  expect(collection).not.toContain('Parent notes')
  expect(collection).toContain('Try the questions')
  const inventory = JSON.parse(readFileSync('docs/releases/proof-learn-gift-20261028-assets.json', 'utf8'))
  for (const asset of inventory.assets) {
    expect(createHash('sha256').update(asset.normalization ? readFileSync(asset.path, 'utf8').replace(/\r\n/g, '\n') : readFileSync(asset.path)).digest('hex')).toBe(asset.sha256)
  }
})

it('ships the approved classroom and Tanda assets while retaining only the production story-media baseline', () => {
  expect(lessons.map(l => l.id)).toEqual(['bitcoin', 'ethereum', 'solana'])
  expect(films.map(f => f.slug)).toEqual(['tanda-origin', 'first-tooth-fee', 'toothlight-treaty'])
  for (const name of ['planet-v2-review', 'stablecoins', 'founder-r3-review']) {
    expect(existsSync(`public/learn-media/${name}`)).toBe(false)
  }
  expect(existsSync('public/learn-media/welcome-r2/dad-welcome-review.mp4')).toBe(false)
  const approved = JSON.parse(readFileSync('docs/releases/learn-v9-public-assets.json', 'utf8'))
  for (const asset of approved.assets) {
    expect(createHash('sha256').update(asset.normalization ? readFileSync(asset.path, 'utf8').replace(/\r\n/g, '\n') : readFileSync(asset.path)).digest('hex')).toBe(asset.sha256)
  }
})
