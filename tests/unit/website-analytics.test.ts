import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = (relativePath: string) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8')

describe('website analytics foundation', () => {
  it('loads Vercel Analytics and an isolated GA4 measurement ID from the root layout', () => {
    const layout = source('src/app/layout.tsx')
    const analytics = source('src/components/WebsiteAnalytics.tsx')
    const packageJson = JSON.parse(source('package.json')) as {
      dependencies?: Record<string, string>
    }

    expect(layout).toMatch(/WebsiteAnalytics/)
    expect(layout).toMatch(/<WebsiteAnalytics\s*\/>/)
    expect(packageJson.dependencies?.['@vercel/analytics']).toBeTruthy()
    expect(analytics).toMatch(/NEXT_PUBLIC_GA_MEASUREMENT_ID/)
    expect(analytics).toMatch(/googletagmanager\.com\/gtag\/js/)
    expect(analytics).toMatch(/send_page_view:\s*false/)
    expect(analytics).toMatch(/gtag\('event',\s*'page_view'/)
    expect(analytics).toMatch(/<Analytics\s*\/>/)
  })

  it('forwards privacy-safe site events to both Vercel Analytics and GA4', () => {
    const helper = source('src/lib/site-analytics.ts')
    expect(helper).toContain("import { track } from '@vercel/analytics'")
    expect(helper).toContain('track(eventName, properties)')
    expect(helper).toContain("window.gtag('event', eventName, properties)")
  })
})
