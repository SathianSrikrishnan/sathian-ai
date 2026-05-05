import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://toothfairy.network'
  const updated = new Date()

  return [
    { url: base, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/toothfairy/app`, lastModified: updated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/toothfairy/stories`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/toothfairy/story/tanda`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/story/viking-origin`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/story/ratoncito-perez`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/toothfairy/keepsake/preview`, lastModified: updated, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/toothfairy/faq`, lastModified: updated, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/toothfairy/recover`, lastModified: updated, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
