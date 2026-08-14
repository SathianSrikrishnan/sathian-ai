import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { isToothFairyHost } from '@/lib/site-host'

export const dynamic = 'force-dynamic'

export function buildRobotsForHost(host: string): MetadataRoute.Robots {
  const toothFairyHost = isToothFairyHost(host)
  const base = toothFairyHost ? 'https://toothfairy.network' : 'https://sathian.ai'
  const privateRoutes = ['/studio', '/api/', '/toothfairy/admin/']
  const personalLegacyRoutes = ['/animation/', '/tooth/', '/toothfairy/']

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: toothFairyHost ? privateRoutes : [...privateRoutes, ...personalLegacyRoutes],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}

export default function robots(): MetadataRoute.Robots {
  return buildRobotsForHost(headers().get('host') ?? '')
}
