import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS } from '../styles';

export const Tooth: React.FC<{
  x: number;
  y: number;
  size?: number;
  glowIntensity?: number;
  pulseSpeed?: number;
}> = ({ x, y, size = 40, glowIntensity = 1, pulseSpeed = 1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.8 + 0.2 * Math.sin((frame / fps) * pulseSpeed * Math.PI * 2);
  const glow = glowIntensity * pulse;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size * 1.2,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Glow aura */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.8,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.toothGlow}${Math.round(glow * 180).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${size * 0.3}px)`,
        }}
      />
      {/* Tooth shape */}
      <svg viewBox="0 0 40 48" width={size} height={size * 1.2}>
        <path
          d="M20 2 C12 2 4 8 4 18 C4 28 8 36 12 44 C14 48 16 48 18 44 C19 42 21 42 22 44 C24 48 26 48 28 44 C32 36 36 28 36 18 C36 8 28 2 20 2Z"
          fill={COLORS.white}
          filter="url(#toothGlow)"
          opacity={0.95}
        />
        <defs>
          <filter id="toothGlow">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
