import { describe, it, expect } from 'vitest'
import { isLessonAvailable } from '../../src/lib/learn/media-policy'
import editorial from '../../src/lib/learn/editorial-readiness.json'
describe('learning editorial gate', () => {
  it('cannot unlock held PoH teaching merely by installing its movie', () => {
    expect(editorial.solana.status).toBe('assembled-review-pending')
    expect(editorial.solana.publicReleaseApproved).toBe(false)
    expect(isLessonAvailable(true, 'factual-review-needed')).toBe(false)
    expect(isLessonAvailable(true, editorial.solana.status)).toBe(true)
    expect(isLessonAvailable(false)).toBe(false)
    expect(isLessonAvailable(true)).toBe(true)
  })
})
