import { describe, it, expect } from 'vitest'
import { isLessonAvailable } from '../../src/lib/learn/media-policy'
import editorial from '../../src/lib/learn/editorial-readiness.json'
describe('learning editorial gate', () => {
  it('cannot unlock held PoH teaching merely by installing its movie', () => {
    expect(isLessonAvailable(true, 'factual-review-needed')).toBe(false)
    expect(isLessonAvailable(true, editorial.solana.status)).toBe(true)
    expect(isLessonAvailable(false)).toBe(false)
    expect(isLessonAvailable(true)).toBe(true)
  })
  it('records owner approval only for the explicitly historical PoH lesson', () => {
    expect(editorial.solana.status).toBe('historical-release-approved')
    expect(editorial.solana.publicReleaseApproved).toBe(true)
    expect(editorial.solana.textAuditComplete).toBe(true)
    expect(editorial.solana.localFramingCorrected).toBe(true)
  })
})
