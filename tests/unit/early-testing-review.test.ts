import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/proof/route'

afterEach(() => vi.unstubAllEnvs())
describe('inactive protected signup review', () => {
  it('shows an explicit protected banner and keeps Proof controls disabled', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_REVIEW', 'true'); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'true')
    const html = await (await GET()).text()
    expect(html).toContain('Protected design review')
    expect(html).toContain('signup inactive')
    expect(html.match(/disabled data-central-disabled/g)).toHaveLength(2)
    expect(html).toContain('content="noindex,nofollow"')
  })
  it('keeps the gift page concise with seven optional approved Proof films', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_REVIEW', 'true'); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'false')
    const html = await (await GET()).text()
    expect(html).toContain('A gift for a<br>child you love.')
    expect(html).toContain('Savings their parent controls.')
    expect(html).toContain('How it works')
    expect(html).not.toContain('CURRENT PRODUCT OFFER')
    expect(html).not.toContain('Before you give')
    expect(html).not.toContain('class="vsl-kicker"')
    expect(html.match(/data-film="/g)).toHaveLength(7)
    expect(html).toContain('scroll horizontally')
    expect(html).toContain('Questions or requests? Email us')
  })
  it('keeps signup inactive without an activation flag', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_REVIEW', ''); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', '')
    expect(await (await GET()).text()).toContain('signup is not activated')
  })
  it('only enables the Proof UI outside review after explicit activation', async () => {
    vi.stubEnv('CENTRAL_SIGNUP_REVIEW', ''); vi.stubEnv('CENTRAL_SIGNUP_ENABLED', 'true')
    const html = await (await GET()).text()
    expect(html).not.toContain('disabled data-central-disabled')
    expect(html).not.toContain('id="signup-preview"')
    expect(html).toContain('id="interest"')
  })
})
