import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Tooth Fairy Keepsake';

type KeepsakeOGData = {
  childName: string;
  storyOrigin: string | null;
  mintDate: Date | null;
  drawingUrl: string | null;
};

async function getKeepsakeOGData(id: string): Promise<KeepsakeOGData> {
  // Phase 1 stub. Plan 01-03 wires this to real chain data.
  // The id is the milestone PDA string; until then we return neutral placeholder content
  // that degrades gracefully without exposing the raw id.
  void id;
  return {
    childName: 'A Tooth Fairy Keepsake',
    storyOrigin: null,
    mintDate: null,
    drawingUrl: null,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function OGImage({ params }: { params: { id: string } }) {
  const data = await getKeepsakeOGData(params.id);

  const cream = 'oklch(97.5% 0.01 80)';
  const creamDeep = 'oklch(95% 0.015 75)';
  const brown = 'oklch(30% 0.035 65)';
  const brownSoft = 'oklch(42% 0.03 65)';
  const gold = 'oklch(72% 0.145 75)';
  const goldTint = 'oklch(72% 0.145 75 / 0.2)';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: `linear-gradient(135deg, ${cream} 0%, ${creamDeep} 100%)`,
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Subtle gold border */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: `2px solid ${goldTint}`,
            borderRadius: 24,
            display: 'flex',
          }}
        />

        {/* Left 60% — text */}
        <div
          style={{
            width: '60%',
            height: '100%',
            padding: '80px 60px 80px 90px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: gold,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Tooth Fairy Network
          </div>

          <div
            style={{
              fontSize: 84,
              color: brown,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {data.childName}
          </div>

          <div
            style={{
              width: 80,
              height: 3,
              background: gold,
              marginTop: 28,
              marginBottom: 28,
            }}
          />

          {data.storyOrigin && (
            <div
              style={{
                fontSize: 28,
                color: brownSoft,
                fontStyle: 'italic',
                marginBottom: 16,
              }}
            >
              {data.storyOrigin}
            </div>
          )}

          {data.mintDate && (
            <div
              style={{
                fontSize: 22,
                color: brownSoft,
              }}
            >
              Created {formatDate(data.mintDate)}
            </div>
          )}
        </div>

        {/* Right 40% — visual */}
        <div
          style={{
            width: '40%',
            height: '100%',
            padding: '80px 90px 80px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 380,
              height: 380,
              borderRadius: 32,
              background: cream,
              border: `1px solid ${goldTint}`,
              boxShadow: `0 20px 60px oklch(30% 0.035 65 / 0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Gold star/tooth glyph */}
            <svg
              width={160}
              height={160}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2 L14.5 9 L22 9.5 L16 14.5 L18 22 L12 17.5 L6 22 L8 14.5 L2 9.5 L9.5 9 Z"
                fill={gold}
                stroke={gold}
                strokeWidth={0.5}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
