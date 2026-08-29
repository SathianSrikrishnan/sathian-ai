import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { articles } from '@/lib/articles'
import { isToothFairyHost } from '@/lib/site-host'

export const dynamic = 'force-dynamic'

const SITE_RELEASED_AT = new Date('2026-07-15T00:00:00.000Z')

interface PublishedWriting {
  slug: string
  date: string
  updatedAt?: string
}

function safeDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
}

export function buildSitemapForHost(
  host: string,
  updated = SITE_RELEASED_AT,
  publishedWritings: PublishedWriting[] = articles,
): MetadataRoute.Sitemap {
  if (!isToothFairyHost(host)) {
    const base = 'https://sathian.ai'
    const coreRoutes = [
      '',
      '/about',
      '/hackathons',
      '/writings',
      '/projects/tooth-fairy-network/draw-with-tanda',
      '/projects/clinicalguard',
    ]
    const writingDates = publishedWritings.map((article) =>
      safeDate(article.updatedAt ?? article.date, updated),
    )
    const writingIndexUpdated = writingDates.reduce(
      (latest, date) => date > latest ? date : latest,
      updated,
    )
    const coreEntries = coreRoutes.map((path, index) => ({
      url: `${base}${path}`,
      lastModified: path === '/writings' ? writingIndexUpdated : updated,
      changeFrequency: path === '' || path === '/writings' ? 'weekly' : 'monthly',
      priority: index === 0 ? 1 : path === '/writings' ? 0.9 : 0.7,
    })) as MetadataRoute.Sitemap
    const writingEntries: MetadataRoute.Sitemap = [
      {
        url: `${base}/writings/agent-allowance-lab`,
        lastModified: updated,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      ...publishedWritings
        .filter((article) => article.slug !== 'agent-allowance-lab')
        .map((article) => ({
          url: `${base}/writings/${article.slug}`,
          lastModified: safeDate(article.updatedAt ?? article.date, updated),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
    ]

    return [...coreEntries, ...writingEntries]
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = headers().get('host') ?? ''
  if (isToothFairyHost(host)) return buildSitemapForHost(host)

  const { getPublishedArticles } = await import('@/lib/articles-db')
  const published = await getPublishedArticles()
  return buildSitemapForHost(host, SITE_RELEASED_AT, published.map((article) => ({
    slug: article.slug,
    date: article.date,
    updatedAt: article.updatedAt,
  })))
}
