import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { isToothFairyHost } from '@/lib/site-host'

export const dynamic = 'force-dynamic'

export function buildRobotsForHost(host: string): MetadataRoute.Robots {
  const base = isToothFairyHost(host) ? 'https://toothfairy.network' : 'https://sathian.ai'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/', '/toothfairy/admin/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}

export default function robots(): MetadataRoute.Robots {
  return buildRobotsForHost(headers().get('host') ?? '')
}
