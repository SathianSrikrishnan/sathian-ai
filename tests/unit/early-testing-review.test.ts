import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/proof/route'
afterEach(() => vi.unstubAllEnvs())
describe('public Proof review without inactive intake', () => {
 it('keeps protected review noindex without developer labels', async () => {
  vi.stubEnv('CENTRAL_SIGNUP_REVIEW', 'true')
  const html=await (await GET()).text()
  expect(html).toContain('content="noindex,nofollow"')
  expect(html).not.toContain('Protected design review')
  expect(html).not.toContain('signup-preview')
 })
 it('preserves seven approved films and the verified contact invitation', async () => {
  const html=await (await GET()).text()
  expect(html.match(/data-film="/g)).toHaveLength(7)
  expect(html).toContain('Questions or requests? Email us')
  expect(html).toContain('mailto:info@toothfairy.network')
  expect(html).not.toContain('class="sample-note"')
 })
 it('does not mount intake even when an unrelated activation flag is present', async () => {
  vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'true')
  const html=await (await GET()).text()
  expect(html).not.toContain('<form')
  expect(html).not.toContain('/api/early-testing')
  expect(html).not.toContain('signup is not activated')
 })
 it('retains the offer, parent control and future fee scope in appropriate FAQs', async () => {
  const html=await (await GET()).text()
  expect(html).toContain('US$59')
  expect(html).toContain('US$10 starting digital-asset deposit')
  expect(html).toContain('subject to the published access and settlement terms')
  expect(html).toContain('Future tools or network activity may have separate terms or fees')
 })
})
