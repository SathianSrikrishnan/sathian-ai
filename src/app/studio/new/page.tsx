'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewArticle() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    const finalSlug = slug.trim() || slugify(title)

    const res = await fetch('/api/studio/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        slug: finalSlug,
        date: today,
        author: 'Sathian',
        domains: [],
        description: description.trim() || 'Draft article',
        readTime: '',
        body: '',
        pullQuotes: [],
        theme: {
          accent: '#8B5CF6',
          accentGlow: 'rgba(139, 92, 246, 0.12)',
          background: 'aurora',
          mood: 'contemplative',
        },
        status: 'draft',
      }),
    })

    if (res.ok) {
      router.push(`/studio/${finalSlug}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create')
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px' }}>
      <h1
        style={{
          fontFamily: 'sans-serif',
          fontSize: 24,
          fontWeight: 700,
          color: '#E6EDF3',
          marginBottom: 32,
        }}
      >
        New Article
      </h1>
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slug) setSlug(slugify(e.target.value))
            }}
            autoFocus
            required
            style={{
              fontFamily: 'sans-serif',
              fontSize: 16,
              padding: '10px 14px',
              background: '#111118',
              border: '1px solid #1E1E2A',
              borderRadius: 6,
              color: '#E6EDF3',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>Slug</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugify(title) || 'auto-generated-from-title'}
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              padding: '10px 14px',
              background: '#111118',
              border: '1px solid #1E1E2A',
              borderRadius: 6,
              color: '#9CA3AF',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description for cards and OG tags"
            style={{
              fontFamily: 'sans-serif',
              fontSize: 14,
              padding: '10px 14px',
              background: '#111118',
              border: '1px solid #1E1E2A',
              borderRadius: 6,
              color: '#E6EDF3',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </label>

        {error && (
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#EF4444' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || !title.trim()}
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            padding: '12px 14px',
            background: saving ? '#1E1E2A' : '#8B5CF6',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: saving ? 'wait' : 'pointer',
            marginTop: 8,
          }}
        >
          {saving ? 'Creating...' : 'Create Draft'}
        </button>
      </form>
    </div>
  )
}
