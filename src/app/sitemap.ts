import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sathian.ai'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/writings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/writings/yakkos-world`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/writings/the-yellow-box`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/writings/cream-2-point-0`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/writings/nine-pages`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/btc-atlas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/toothfairy/network`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/toothfairy/network/technical`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/toothfairy/network/market`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
