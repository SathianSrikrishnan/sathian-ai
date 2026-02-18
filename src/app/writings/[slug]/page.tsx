import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticleBySlug, getPublishedArticles } from '@/lib/articles-db'
import { ArticleRenderer } from '@/components/article/ArticleRenderer'

type Props = { params: { slug: string } }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — sathian.ai`,
    description: article.description,
    authors: [{ name: 'Sathian S.', url: 'https://sathian.ai' }],
    keywords: article.domains,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: ['Sathian S.'],
      siteName: 'sathian.ai',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()
  return <ArticleRenderer article={article} />
}
