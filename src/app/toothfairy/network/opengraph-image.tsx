import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'The Tooth Fairy Network'

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
        background: 'linear-gradient(135deg, #030712 0%, #0C1222 50%, #030712 100%)',
        color: '#F9FAFB',
      }}>
        {/* Cyan glow */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.10), rgba(244, 63, 94, 0.04) 50%, transparent 70%)',
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
            fontSize: '60px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}>
            The Tooth Fairy Network
          </div>
          <div style={{
            fontSize: '22px',
            color: '#9CA3AF',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}>
        Turn lost teeth into first forever memories and Smile Funds.
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
          }}>
      {['Forever Memories', 'Smile Funds', 'Family Milestones'].map((tag) => (
              <span key={tag} style={{
                fontSize: '13px',
                color: '#06B6D4',
                fontFamily: 'monospace',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                background: 'rgba(6, 182, 212, 0.06)',
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
