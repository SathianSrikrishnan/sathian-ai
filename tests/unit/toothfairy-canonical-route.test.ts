import { describe, expect, it } from 'vitest'

import nextConfig from '../../next.config.js'

describe('Tooth Fairy Network canonical routing', () => {
  it('permanently redirects the legacy Sathian.ai landing page to the current product site', async () => {
    expect(nextConfig.redirects).toBeTypeOf('function')
    if (!nextConfig.redirects) return

    const redirects = await nextConfig.redirects()

    expect(redirects).toContainEqual({
      source: '/toothfairy',
      destination: 'https://toothfairy.network',
      permanent: true,
    })
  })

  it('retires legacy subpaths at the current product landing page', async () => {
    expect(nextConfig.redirects).toBeTypeOf('function')
    if (!nextConfig.redirects) return

    const redirects = await nextConfig.redirects()

    expect(redirects).toContainEqual({
      source: '/toothfairy/:path*',
      destination: 'https://toothfairy.network',
      permanent: true,
    })
  })
})
