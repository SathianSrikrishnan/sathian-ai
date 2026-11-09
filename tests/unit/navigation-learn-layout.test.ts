import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

it('keeps the primary menu focused and connections under About', () => {
  const nav = readFileSync('src/components/SiteNav.tsx', 'utf8')
  expect([...nav.matchAll(/label: '([^']+)'/g)].map(match => match[1])).toEqual(['Home', 'Proof', 'Learn', 'Write', 'About'])
  expect(readFileSync('src/components/SiteFooter.tsx', 'utf8')).toContain('href="/about#follow"')
  expect(readFileSync('src/app/about/page.tsx', 'utf8')).toContain('<FollowSath profiles')
})

it('groups both Solana films in the same responsive lesson card grid', () => {
  const collection = readFileSync('src/components/learn/LessonCollection.tsx', 'utf8')
  expect(collection).toContain('className="learn-picture-lessons learn-solana-lessons"')
  const overview = readFileSync('src/components/learn/SolanaOverview.tsx', 'utf8')
  expect(overview).toContain('className="learn-picture-lesson learn-solana-overview topic-solana"')
  expect(overview).toContain('className="learn-picture-film"')
  expect(overview).toContain('preload="none"')
})
