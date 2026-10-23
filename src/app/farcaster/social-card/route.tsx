import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#e8dfc2', color: '#251e17', padding: '68px 76px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 26 }}>SATHIAN · OPEN-SOURCE TEST BUILD</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, lineHeight: 1.08 }}>Run your own</div>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, lineHeight: 1.08 }}>Farcaster server.</div>
        <div style={{ display: 'flex', fontSize: 31, marginTop: 28 }}>One independent tester wanted.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26 }}><span>Windows / Ubuntu</span><span>sathian.ai/farcaster</span></div>
    </div>,
    { width: 1200, height: 630 },
  )
}