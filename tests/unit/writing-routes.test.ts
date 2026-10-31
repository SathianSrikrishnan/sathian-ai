import { readdirSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { articles } from '@/lib/articles'
import { genericWritingParams } from '@/lib/writing-routes'

describe('generic writing prerenders', () => {
  it('never shadows a dedicated published feature route', () => {
    const root = new URL('../../src/app/writings/', import.meta.url)
    const dedicated = readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('[') && existsSync(new URL(`${e.name}/page.tsx`, root))).map(e => e.name)
    const generated = genericWritingParams(articles).map(e => e.slug)
    expect(dedicated).toContain('inside-monkedao')
    for (const slug of dedicated) expect(generated).not.toContain(slug)
    expect(generated).toContain('keep-the-internet-open')
  })
})
