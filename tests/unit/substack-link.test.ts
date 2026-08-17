import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Substack distribution link', () => {
  it('links the publication from Writing and the durable links page', () => {
    const writingsPage = readFileSync('src/app/writings/page.tsx', 'utf8')
    const linksPage = readFileSync('src/app/links/page.tsx', 'utf8')

    expect(writingsPage).toContain('https://sathians.substack.com')
    expect(writingsPage).toContain('Read and subscribe on Substack')
    expect(linksPage).toContain("{ label: 'Substack'")
    expect(linksPage).toContain("href: 'https://sathians.substack.com'")
  })
})
