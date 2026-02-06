import { ImageResponse } from 'next/og'
import { getArticle } from '@/lib/articles'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Article preview'

export default async function OGImage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)

  if (!article) {
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0A0A12',
          color: '#F0F6FC',
          fontSize: 32,
        }}>
          sathian.ai
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, #0A0A12 0%, #12121F 50%, #0A0A12 100%)`,
        color: '#F0F6FC',
      }}>
        {/* Accent glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: `radial-gradient(ellipse, ${article.theme.accent}15, transparent 70%)`,
        }} />

        {/* sathian.ai */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '60px',
          fontSize: '18px',
          color: '#6B7280',
          fontFamily: 'monospace',
        }}>
          sathian.ai
        </div>

        {/* Domains */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {article.domains.map((d) => (
            <span key={d} style={{
              fontSize: '14px',
              color: article.theme.accent,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              {d}
            </span>
          ))}
        </div>

        {/* Title */}
        <div style={{
          fontSize: '56px',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '24px',
          fontFamily: 'Georgia, serif',
          maxWidth: '900px',
        }}>
          {article.title}
        </div>

        {/* Author + Date */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '18px',
          color: '#6B7280',
          fontFamily: 'monospace',
        }}>
          <span style={{ color: '#9CA3AF' }}>{article.author}</span>
          <span>/</span>
          <span>{article.date}</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
