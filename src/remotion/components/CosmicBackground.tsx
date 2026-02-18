import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, seededPosition, seededValue } from '../styles';

const STAR_COUNT = 80;

export const CosmicBackground: React.FC<{
  accentColor?: string;
  glowIntensity?: number;
}> = ({ accentColor = COLORS.nebula, glowIntensity = 0.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />
      {/* Stars */}
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const pos = seededPosition(i + 1);
        const size = seededValue(i + 100, 1, 3);
        const twinkleSpeed = seededValue(i + 200, 0.5, 2);
        const twinkleOffset = seededValue(i + 300, 0, Math.PI * 2);
        const opacity = 0.3 + 0.4 * Math.sin((frame / fps) * twinkleSpeed + twinkleOffset);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: COLORS.white,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
