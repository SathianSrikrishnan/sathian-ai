import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8')
}

const apiRoutes = [
  '../../src/app/api/studio/overview/route.ts',
  '../../src/app/api/studio/inbox/route.ts',
  '../../src/app/api/studio/memory/route.ts',
  '../../src/app/api/studio/homepage/route.ts',
  '../../src/app/api/studio/build-notes/route.ts',
]

describe('typed Studio control room', () => {
  it('gives every major work area a named dashboard destination', () => {
    const dashboard = source('../../src/app/studio/page.tsx')

    for (const destination of ['Writing', 'Build notes', 'Homepage', 'Public memory', 'Inbox']) {
      expect(dashboard).toContain(destination)
    }
  })

  it('shows provenance, approval, and expiry in public memory', () => {
    const memory = source('../../src/app/studio/memory/page.tsx')

    expect(memory).toMatch(/sourceRef/)
    expect(memory).toMatch(/approved|Approval/)
    expect(memory).toMatch(/validUntil|Expiry/)
  })

  it('shows receipts, delivery, retention, and attachment quarantine in the inbox', () => {
    const inbox = source('../../src/app/studio/inbox/page.tsx')

    expect(inbox).toMatch(/receipt/i)
    expect(inbox).toMatch(/delivery/i)
    expect(inbox).toMatch(/retention/i)
    expect(inbox).toMatch(/attachment[\s\S]*status|quarantine/i)
  })

  it('uses keyboard-accessible typed homepage controls without an arbitrary builder', () => {
    const homepage = source('../../src/app/studio/homepage/page.tsx')

    expect(homepage).toMatch(/Move .* up/)
    expect(homepage).toMatch(/Move .* down/)
    expect(homepage).not.toMatch(/dangerouslySetInnerHTML|contentEditable|widgetType|component picker/i)
  })

  it('keeps build notes in the three-part editorial structure', () => {
    const notes = source('../../src/app/studio/build-notes/page.tsx')

    expect(notes).toContain('What changed')
    expect(notes).toContain('What I learned')
    expect(notes).toContain('Next')
  })

  it('requires AAL2 again inside every control-room API handler', () => {
    for (const route of apiRoutes) {
      expect(source(route)).toMatch(/requireStudioAal2/)
    }
  })
})
