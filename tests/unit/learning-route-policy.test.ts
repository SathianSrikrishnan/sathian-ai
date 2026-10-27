import { expect, it } from 'vitest'
import { isLearningPath } from '@/lib/learn/route-policy'
it('keeps learning routes free of the public agent and analytics without changing other site routes', () => {
  for (const p of ['/learn', '/learn/bitcoin', '/learn/ethereum']) expect(isLearningPath(p)).toBe(true)
  for (const p of ['/', '/about', '/proof', '/learner', '/writings', null]) expect(isLearningPath(p)).toBe(false)
})
