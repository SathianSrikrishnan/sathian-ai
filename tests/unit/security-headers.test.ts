import { describe, expect, it } from 'vitest'

import nextConfig from '../../next.config.js'

describe('public response security headers', () => {
  it('applies browser hardening headers to every route', async () => {
    expect(nextConfig.headers).toBeTypeOf('function')
    if (!nextConfig.headers) return

    const rules = await nextConfig.headers()
    const globalRule = rules.find((rule) => rule.source === '/(.*)')
    const headers = new Map(globalRule?.headers.map(({ key, value }) => [key, value]))

    expect(headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(headers.get('X-Frame-Options')).toBe('DENY')
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(headers.get('Permissions-Policy')).toContain('camera=(self)')
    expect(headers.get('Permissions-Policy')).toContain('microphone=(self)')
    expect(headers.get('Permissions-Policy')).toContain('geolocation=()')
  })
})
