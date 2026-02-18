import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'sathian.ai — experiments, projects, and writings'

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
        {/* Accent glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(247, 147, 26, 0.12), transparent 70%)',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontFamily: 'system-ui, sans-serif',
          }}>
            sathian.ai
          </div>
          <div style={{
            fontSize: '22px',
            color: '#9CA3AF',
            fontFamily: 'monospace',
          }}>
            experiments / projects / writings
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
