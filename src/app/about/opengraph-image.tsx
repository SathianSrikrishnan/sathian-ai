import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'About Sathian Srikrishnan'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0A0A0F 0%, #12121F 50%, #0A0A0F 100%)',
        color: '#F9FAFB',
      }}>
        {/* Warm glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(247, 147, 26, 0.10), transparent 70%)',
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

        <div style={{
          fontSize: '14px',
          color: '#F7931A',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px',
        }}>
          about
        </div>

        <div style={{
          fontSize: '56px',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '24px',
          fontFamily: 'Georgia, serif',
          maxWidth: '900px',
        }}>
          Sathian Srikrishnan
        </div>

        <div style={{
          fontSize: '22px',
          color: '#9CA3AF',
          fontFamily: 'system-ui, sans-serif',
          maxWidth: '700px',
          lineHeight: 1.4,
        }}>
          Builder in Toronto. Culture, money, and technology. Learning in public.
        </div>
      </div>
    ),
    { ...size }
  )
}
