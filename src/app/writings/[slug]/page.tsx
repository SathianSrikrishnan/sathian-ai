import { KeepInternetOpen } from '@/components/article/keep-internet-open/KeepInternetOpen'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles-db'
import { articles as staticArticles } from '@/lib/articles'
import { ArticleRenderer } from '@/components/article/ArticleRenderer'
import { SATHIAN_PERSON_SCHEMA } from '@/lib/site-identity'

type Props = { params: Promise<{ slug: string }> }

// ISR: essays are pre-rendered at build and refreshed at most once a minute, the
// same window as the homepage and /writings. Slugs published later from Studio
// (database only) render on first request and are then cached the same way.
export const revalidate = 60

export function generateStaticParams() {
  return staticArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug)
  if (!article) return {}
  return {
    title: `${article.title} — sathian.ai`,
    description: article.description,
    alternates: { canonical: `https://sathian.ai/writings/${article.slug}` },
    authors: [{ name: 'Sathian', url: 'https://sathian.ai/about' }],
    keywords: article.domains,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: ['Sathian'],
      modifiedTime: article.updatedAt,
      siteName: 'Sathian',
      ...(article.slug === 'keep-the-internet-open' ? { images: [{ url: 'https://sathian.ai/media/keep-the-internet-open/tfn-child-drawing.jpg', alt: 'Sample family artwork — Keep the Internet Open' }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug((await params).slug)
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
      {article.slug === 'keep-the-internet-open' ? <KeepInternetOpen /> : <ArticleRenderer article={article} />}
    </>
  )
}
