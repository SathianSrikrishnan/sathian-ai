import { HomeClient, type HomeWriting } from '@/components/home/HomeClient'
import { getPublishedArticles } from '@/lib/articles-db'

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
  return <HomeClient writings={writings} />
}
