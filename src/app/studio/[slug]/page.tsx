'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { type Article } from '@/lib/articles'
import { ArticleRenderer } from '@/components/article/ArticleRenderer'

function safeParseJson<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 14,
  padding: '8px 12px',
  background: '#111118',
  border: '1px solid #1E1E2A',
  borderRadius: 6,
  color: '#E6EDF3',
  outline: 'none',
  width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 11,
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export default function StudioEditor() {
  const params = useParams()
  const router = useRouter()
  const slugParam = params.slug as string

  const [articleId, setArticleId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [titleHighlight, setTitleHighlight] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [author, setAuthor] = useState('Sathian')
  const [domains, setDomains] = useState('')
  const [description, setDescription] = useState('')
  const [readTime, setReadTime] = useState('')
  const [body, setBody] = useState('')
  const [pullQuotes, setPullQuotes] = useState('')
  const [accentColor, setAccentColor] = useState('#8B5CF6')
  const [background, setBackground] = useState<'beams' | 'aurora' | 'grid'>('aurora')
  const [mood, setMood] = useState<'energetic' | 'contemplative' | 'urgent'>('contemplative')
  const [sectionHeadings, setSectionHeadings] = useState('')
  const [sectionTints, setSectionTints] = useState('')
  const [mediaJson, setMediaJson] = useState('[]')
  const [specialElementsJson, setSpecialElementsJson] = useState('[]')
  const [textHighlightsJson, setTextHighlightsJson] = useState('[]')
  const [hiddenSignal, setHiddenSignal] = useState('')

  useEffect(() => {
    fetch(`/api/studio/articles?slug=${slugParam}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((a) => {
        setArticleId(a.id)
        setStatus(a.status)
        setTitle(a.title)
        setTitleHighlight(a.titleHighlight || '')
        setSlug(a.slug)
        setDate(a.date)
        setAuthor(a.author)
        setDomains(a.domains.join(', '))
        setDescription(a.description)
        setReadTime(a.readTime)
        setBody(a.body)
        setPullQuotes(a.pullQuotes.join('\n'))
        setAccentColor(a.theme.accent)
        setBackground(a.theme.background)
        setMood(a.theme.mood)
        setSectionHeadings((a.sectionHeadings || []).join('\n'))
        setSectionTints((a.sectionTints || []).join('\n'))
        setMediaJson(JSON.stringify(a.media || [], null, 2))
        setSpecialElementsJson(JSON.stringify(a.specialElements || [], null, 2))
        setTextHighlightsJson(JSON.stringify(a.textHighlights || [], null, 2))
        setHiddenSignal(a.hiddenSignal || '')
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [slugParam])

  const buildArticle = useCallback((): Article => {
    return {
      title,
      titleHighlight: titleHighlight || undefined,
      slug,
      date,
      author,
      domains: domains.split(',').map((d) => d.trim()).filter(Boolean),
      description,
      readTime: readTime || `${Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))} min`,
      body,
      pullQuotes: pullQuotes.split('\n').filter(Boolean),
      theme: {
        accent: accentColor,
        accentGlow: `${accentColor}1F`,
        background,
        mood,
      },
      sectionHeadings: sectionHeadings.split('\n').filter(Boolean),
      sectionTints: sectionTints.split('\n').filter(Boolean),
      media: safeParseJson(mediaJson, []),
      specialElements: safeParseJson(specialElementsJson, []),
      textHighlights: safeParseJson(textHighlightsJson, []),
      hiddenSignal: hiddenSignal || undefined,
    }
  }, [title, titleHighlight, slug, date, author, domains, description, readTime, body, pullQuotes, accentColor, background, mood, sectionHeadings, sectionTints, mediaJson, specialElementsJson, textHighlightsJson, hiddenSignal])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const articleData = buildArticle()
    const res = await fetch(`/api/studio/articles/${articleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function handleTogglePublish() {
    const newStatus = status === 'published' ? 'draft' : 'published'
    const res = await fetch(`/api/studio/articles/${articleId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) setStatus(newStatus)
  }

  async function handleDelete() {
    if (!confirm('Delete this article permanently?')) return
    await fetch(`/api/studio/articles/${articleId}`, { method: 'DELETE' })
    router.push('/studio')
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 14, color: '#6B7280' }}>Loading...</p>
      </div>
    )
  }

  if (!articleId) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 14, color: '#EF4444' }}>Article not found</p>
      </div>
    )
  }

  return (
    <div>
      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #1E1E2A',
          background: '#0D0D14',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Tabs */}
          <button
            onClick={() => setTab('edit')}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '6px 14px',
              background: tab === 'edit' ? '#1E1E2A' : 'transparent',
              border: '1px solid',
              borderColor: tab === 'edit' ? '#2E2E3A' : 'transparent',
              borderRadius: 6,
              color: tab === 'edit' ? '#E6EDF3' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setTab('preview')}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '6px 14px',
              background: tab === 'preview' ? '#1E1E2A' : 'transparent',
              border: '1px solid',
              borderColor: tab === 'preview' ? '#2E2E3A' : 'transparent',
              borderRadius: 6,
              color: tab === 'preview' ? '#E6EDF3' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            Preview
          </button>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 4,
              background: status === 'published' ? '#22C55E18' : '#F59E0B18',
              color: status === 'published' ? '#22C55E' : '#F59E0B',
              marginLeft: 8,
            }}
          >
            {status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '6px 16px',
              background: saved ? '#22C55E' : '#8B5CF6',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={handleTogglePublish}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid #2E2E3A',
              borderRadius: 6,
              color: status === 'published' ? '#F59E0B' : '#22C55E',
              cursor: 'pointer',
            }}
          >
            {status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid #2E2E3A',
              borderRadius: 6,
              color: '#EF4444',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {tab === 'edit' ? (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 120px' }}>
          {/* Core fields */}
          <Section title="Core">
            <Field label="Title">
              <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Row>
              <Field label="Title Highlight" hint="substring to accent">
                <input style={inputStyle} value={titleHighlight} onChange={(e) => setTitleHighlight(e.target.value)} placeholder="optional" />
              </Field>
              <Field label="Slug">
                <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} />
              </Field>
            </Row>
            <Row>
              <Field label="Date">
                <input style={inputStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              <Field label="Author">
                <input style={inputStyle} value={author} onChange={(e) => setAuthor(e.target.value)} />
              </Field>
              <Field label="Read Time">
                <input style={inputStyle} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="auto" />
              </Field>
            </Row>
            <Field label="Domains" hint="comma-separated">
              <input style={inputStyle} value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="consciousness, technology" />
            </Field>
            <Field label="Description">
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
          </Section>

          {/* Content */}
          <Section title="Content">
            <Field label="Body" hint="sections separated by --- on its own line">
              <textarea
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, lineHeight: '1.7' }}
                rows={30}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Field>
            <Field label="Pull Quotes" hint="one per line">
              <textarea
                style={{ ...inputStyle, resize: 'vertical' }}
                rows={6}
                value={pullQuotes}
                onChange={(e) => setPullQuotes(e.target.value)}
              />
            </Field>
          </Section>

          {/* Theme */}
          <Section title="Theme">
            <Row>
              <Field label="Accent Color">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: 40, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <input style={{ ...inputStyle, flex: 1 }} value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                </div>
              </Field>
              <Field label="Background">
                <select
                  style={inputStyle}
                  value={background}
                  onChange={(e) => setBackground(e.target.value as 'beams' | 'aurora' | 'grid')}
                >
                  <option value="aurora">aurora</option>
                  <option value="beams">beams</option>
                  <option value="grid">grid</option>
                </select>
              </Field>
              <Field label="Mood">
                <select
                  style={inputStyle}
                  value={mood}
                  onChange={(e) => setMood(e.target.value as 'energetic' | 'contemplative' | 'urgent')}
                >
                  <option value="contemplative">contemplative</option>
                  <option value="energetic">energetic</option>
                  <option value="urgent">urgent</option>
                </select>
              </Field>
            </Row>
          </Section>

          {/* Structure */}
          <Section title="Structure">
            <Row>
              <Field label="Section Headings" hint="one per line">
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={6}
                  value={sectionHeadings}
                  onChange={(e) => setSectionHeadings(e.target.value)}
                />
              </Field>
              <Field label="Section Tints" hint="hex colors, one per line">
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={6}
                  value={sectionTints}
                  onChange={(e) => setSectionTints(e.target.value)}
                />
              </Field>
            </Row>
          </Section>

          {/* Advanced */}
          <Section title="Advanced">
            <Field label="Hidden Signal">
              <textarea
                style={{ ...inputStyle, resize: 'vertical' }}
                rows={3}
                value={hiddenSignal}
                onChange={(e) => setHiddenSignal(e.target.value)}
              />
            </Field>
            <Field label="Text Highlights" hint="JSON array">
              <textarea
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                rows={6}
                value={textHighlightsJson}
                onChange={(e) => setTextHighlightsJson(e.target.value)}
              />
            </Field>
            <Field label="Media" hint="JSON array">
              <textarea
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                rows={8}
                value={mediaJson}
                onChange={(e) => setMediaJson(e.target.value)}
              />
            </Field>
            <Field label="Special Elements" hint="JSON array">
              <textarea
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                rows={6}
                value={specialElementsJson}
                onChange={(e) => setSpecialElementsJson(e.target.value)}
              />
            </Field>
          </Section>
        </div>
      ) : (
        <ArticleRenderer article={buildArticle()} backHref="/studio" backLabel="Studio" />
      )}
    </div>
  )
}

// Layout helpers
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: '1px solid #1E1E2A',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>{children}</div>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 200 }}>
      <span style={labelStyle}>
        {label}
        {hint && <span style={{ color: '#4B5563', fontWeight: 400 }}> ({hint})</span>}
      </span>
      {children}
    </label>
  )
}
