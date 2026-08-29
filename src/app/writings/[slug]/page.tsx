import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles-db'
import { ArticleRenderer } from '@/components/article/ArticleRenderer'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'

type Props = { params: { slug: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — sathian.ai`,
    description: article.description,
    authors: [{ name: 'Sathian Srikrishnan', url: 'https://sathian.ai/about' }],
    keywords: article.domains,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: ['Sathian Srikrishnan'],
      modifiedTime: article.updatedAt,
      siteName: 'Sathian Srikrishnan',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author: {
      '@type': 'Person',
      '@id': SATHIAN_PERSON_SCHEMA['@id'],
      name: 'Sathian Srikrishnan',
      url: 'https://sathian.ai/about',
    },
    publisher: {
      '@type': 'Person',
      '@id': SATHIAN_PERSON_SCHEMA['@id'],
      name: 'Sathian Srikrishnan',
      url: 'https://sathian.ai/about',
    },
    url: `https://sathian.ai/writings/${article.slug}`,
    mainEntityOfPage: `https://sathian.ai/writings/${article.slug}`,
    articleSection: article.domains?.[0],
    keywords: article.domains?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleRenderer article={article} />
    </>
  )
}
