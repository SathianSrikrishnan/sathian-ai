import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Writing — sathian.ai'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0A0A0F 0%, #12121F 50%, #0A0A0F 100%)',
        color: '#F9FAFB',
      }}>
        {/* Cyan glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.08), transparent 70%)',
        }} />

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: 'Georgia, serif',
          }}>
            Writing
          </div>
          <div style={{
            fontSize: '22px',
            color: '#9CA3AF',
            fontFamily: 'system-ui, sans-serif',
          }}>
            Essays on culture, money, and technology
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
