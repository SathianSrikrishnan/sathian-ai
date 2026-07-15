import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { articles } from '@/lib/articles'
import { isToothFairyHost } from '@/lib/site-host'

export const dynamic = 'force-dynamic'

export function buildSitemapForHost(host: string, updated = new Date()): MetadataRoute.Sitemap {
  if (!isToothFairyHost(host)) {
    const base = 'https://sathian.ai'
    const coreRoutes = ['', '/about', '/automation', '/writings', '/links', '/btc-atlas']
    const writingRoutes = [
      '/writings/agent-allowance-lab',
      ...articles.map((article) => `/writings/${article.slug}`),
    ]

    return [...coreRoutes, ...writingRoutes].map((path, index) => ({
      url: `${base}${path}`,
      lastModified: updated,
      changeFrequency: path === '' || path === '/writings' ? 'weekly' : 'monthly',
      priority: index === 0 ? 1 : path === '/writings' ? 0.9 : 0.7,
    }))
  }

  const base = 'https://toothfairy.network'

  return [
    { url: base, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/toothfairy/app/draw`, lastModified: updated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/toothfairy/smile-fund`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/toothfairy/stories`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/toothfairy/story/tanda`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/story/viking-origin`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/story/ratoncito-perez`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/keepsake/preview`, lastModified: updated, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/toothfairy/faq`, lastModified: updated, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/toothfairy/recover`, lastModified: updated, changeFrequency: 'monthly', priority: 0.5 },
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapForHost(headers().get('host') ?? '')
}
