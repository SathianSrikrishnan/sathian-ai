import { HomeClient, type HomeWriting } from '@/components/home/HomeClient'
import { getPublishedArticles } from '@/lib/articles-db'
import { SATHIAN_PERSON_SCHEMA, SATHIAN_WEBSITE_SCHEMA } from '@/lib/site-identity'

export const revalidate = 60

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
