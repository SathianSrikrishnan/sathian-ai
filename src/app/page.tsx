import type { Metadata } from 'next'
import { HomeClient, type HomeWriting } from '@/components/home/HomeClient'
import { getPublishedArticles } from '@/lib/articles-db'
import { SATHIAN_PERSON_SCHEMA, SATHIAN_WEBSITE_SCHEMA } from '@/lib/site-identity'

export const revalidate = 60

// Static prerender resolves the layout's relative './' canonical to /index.
export const metadata: Metadata = {
  title: { absolute: "Sathian Srikrishnan | Tooth Fairy Network" },
  description: "A dad and builder in Toronto. Explore Tooth Fairy Network: a printed Proof of Growth, a note from you and a child's first digital wallet. Plus stories, lessons and writing.",
  alternates: { canonical: '/' },
  openGraph: { title: "Sathian Srikrishnan | Tooth Fairy Network", description: "A printed Proof, artwork and a first wallet. Parents choose their child’s network and hold the key.", url: 'https://sathian.ai', images: ['/village/village-hands.webp'] },
  twitter: { card: 'summary_large_image', title: "Sathian Srikrishnan | Tooth Fairy Network", images: ['/village/village-hands.webp'] },
}

export default async function Home() {
  const articles = await getPublishedArticles()
  const writings: HomeWriting[] = articles.map((article) => ({
    title: article.title,
    description: article.description,
    href: `/writings/${article.slug}`,
    date: article.date,
    readTime: article.readTime,
    accent: article.theme.accent,
  }))
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([SATHIAN_PERSON_SCHEMA, SATHIAN_WEBSITE_SCHEMA]),
        }}
      />
      <HomeClient writings={writings} />
    </>
  )
}
