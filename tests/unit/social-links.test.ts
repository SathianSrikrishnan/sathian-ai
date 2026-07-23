import { describe, expect, it } from 'vitest'

import { personalSocialLinks, toothFairySocialLinks } from '@/lib/social-links'

describe('public social destinations', () => {
  it('publishes the complete personal profile set', () => {
    expect(personalSocialLinks.map((link) => link.label)).toEqual([
      'Instagram',
      'X',
      'Luma',
      'LinkedIn',
      'YouTube',
    ])
  })

  it('publishes the complete Tooth Fairy Network profile set', () => {
    expect(toothFairySocialLinks.map((link) => link.label)).toEqual([
      'Instagram',
      'X',
      'LinkedIn',
      'YouTube',
    ])
  })
})
