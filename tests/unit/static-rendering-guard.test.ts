import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(__dirname, '../..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

// Reading request data in the root layout makes every route dynamic (about
// 590 ms of server time per request in production). Keep it out.
describe('static rendering guard', () => {
  it('root layout reads no request headers or cookies', () => {
    const layout = read('src/app/layout.tsx')
    expect(layout).not.toMatch(/from ['"]next\/headers['"]/)
    expect(layout).not.toMatch(/force-dynamic/)
  })

  it('site agent still hides itself on Tooth Fairy hosts (client-side)', () => {
    const widget = read('src/components/DeferredChatWidget.tsx')
    expect(widget).toMatch(/isToothFairyHost\(window\.location\.hostname\)/)
  })

  it('essay pages use ISR, not force-dynamic', () => {
    const page = read('src/app/writings/[slug]/page.tsx')
    expect(page).not.toMatch(/force-dynamic/)
    expect(page).toMatch(/export const revalidate = 60/)
  })
})
