import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'BTC Cultural Atlas — Every Number Tells a Story'

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
        background: 'linear-gradient(135deg, #050510 0%, #0C0C24 50%, #050510 100%)',
        color: '#F9FAFB',
      }}>
        {/* Purple glow */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        }} />

        {/* sathian.ai */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          fontSize: '16px',
          color: '#4B5563',
          fontFamily: 'monospace',
        }}>
          sathian.ai
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}>
            BTC Cultural Atlas
          </div>
          <div style={{
            fontSize: '22px',
            color: '#9CA3AF',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}>
            Every number tells a story. Bitcoin&apos;s price mapped to 463 cultural markers.
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
          }}>
            {['Music', 'History', 'Sports', 'Area Codes', 'Internet'].map((tag) => (
              <span key={tag} style={{
                fontSize: '13px',
                color: '#A78BFA',
                fontFamily: 'monospace',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                background: 'rgba(124, 58, 237, 0.06)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
