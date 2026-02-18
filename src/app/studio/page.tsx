'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ArticleSummary {
  id: string
  title: string
  slug: string
  date: string
  status: 'draft' | 'published'
  readTime: string
  domains: string[]
  description: string
  theme: { accent: string }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function StudioDashboard() {
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/studio/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 14, color: '#6B7280' }}>Loading...</p>
      </div>
    )
  }

  const drafts = articles.filter((a) => a.status === 'draft')
  const published = articles.filter((a) => a.status === 'published')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 16,
        }}
      >
        Drafts ({drafts.length})
      </h2>
      {drafts.length === 0 && (
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#374151', marginBottom: 32 }}>
          No drafts
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 48 }}>
        {drafts.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
      </div>

      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 16,
        }}
      >
        Published ({published.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {published.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/studio/${article.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 16px',
        textDecoration: 'none',
        borderBottom: '1px solid #1E1E2A',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#111118' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <div
        style={{
          width: 4,
          height: 40,
          borderRadius: 2,
          background: article.theme.accent,
          opacity: article.status === 'draft' ? 0.4 : 1,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: '#E6EDF3',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {article.title}
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background: article.status === 'published' ? '#22C55E18' : '#F59E0B18',
              color: article.status === 'published' ? '#22C55E' : '#F59E0B',
              flexShrink: 0,
            }}
          >
            {article.status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>
            {formatDate(article.date)}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151' }}>
            {article.readTime}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#4B5563' }}>
            {article.domains.join(' / ')}
          </span>
        </div>
      </div>
    </Link>
  )
}
