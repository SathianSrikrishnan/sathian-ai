import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { isToothFairyHost } from '@/lib/site-host'

export const dynamic = 'force-dynamic'

export function buildRobotsForHost(host: string): MetadataRoute.Robots {
  const toothFairyHost = isToothFairyHost(host)
  const base = toothFairyHost ? 'https://toothfairy.network' : 'https://sathian.ai'
  const privateRoutes = ['/studio', '/api/', '/toothfairy/admin/']

  // Legacy /toothfairy, /tooth and /animation URLs stay crawlable on purpose: they now return
  // permanent redirects or 404s, and Google only drops them from the index once it can see that.
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: privateRoutes,
    },
    sitemap: `${base}/sitemap.xml`,
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  return buildRobotsForHost((await headers()).get('host') ?? '')
}
