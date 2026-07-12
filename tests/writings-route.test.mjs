import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const routeSource = readFileSync(
  new URL('../src/app/writings/[slug]/page.tsx', import.meta.url),
  'utf8',
)

test('database-backed writing slugs render per request', () => {
  assert.match(routeSource, /export const dynamic = ['"]force-dynamic['"]/)
  assert.doesNotMatch(routeSource, /generateStaticParams/)
})
