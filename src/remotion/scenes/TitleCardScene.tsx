import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../styles';

export const TitleCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Staggered entry animations
  const titleEntry = spring({
    frame: frame - 0.8 * fps,
    fps,
    config: { damping: 25, stiffness: 60 },
  });
  const taglineEntry = spring({
    frame: frame - 2.0 * fps,
    fps,
    config: { damping: 30, stiffness: 80 },
  });
  const urlEntry = spring({
    frame: frame - 3.0 * fps,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  // Glow pulse
  const glowPulse = 0.3 + 0.15 * Math.sin((frame / fps) * 2);

  // Background particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = i * 4729;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 1103 + 27077) % 111953) / 111953;
    const speed = 0.15 + (i % 5) * 0.08;
    const size = 1.5 + (i % 3);
    const drift = Math.sin((frame / fps) * speed + i * 0.6) * 15;
    const float = Math.cos((frame / fps) * speed * 0.7 + i * 1.1) * 10;
    const pulse = 0.15 + 0.2 * Math.sin((frame / fps) * 1.2 + i);
    const color = i % 4 === 0 ? COLORS.stardust : i % 4 === 1 ? COLORS.aurora : i % 4 === 2 ? COLORS.nebula : COLORS.cryptoGreen;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: pulse,
          transform: `translate(${drift}px, ${float}px)`,
          boxShadow: `0 0 ${size * 4}px ${color}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [durationInFrames - fps * 0.5, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {particles}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`,
          opacity: glowPulse * exitOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '30%',
          textAlign: 'center',
          opacity: titleEntry * exitOpacity,
          transform: `translateY(${interpolate(titleEntry, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: "'Outfit', system-ui, sans-serif",
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textShadow: `0 0 60px ${COLORS.purpleGlow}, 0 0 120px ${COLORS.amberGlow}`,
          }}
        >
          The Tooth Fairy Network
        </div>
      </div>

      {/* Tagline: "Childhood milestones. On chain." */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '52%',
          textAlign: 'center',
          opacity: taglineEntry * exitOpacity,
          transform: `translateY(${interpolate(taglineEntry, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: COLORS.dimWhite,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.1em',
          }}
        >
          Childhood milestones. On chain.
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '64%',
          textAlign: 'center',
          opacity: urlEntry * exitOpacity,
          transform: `translateY(${interpolate(urlEntry, [0, 1], [15, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            background: `linear-gradient(135deg, ${COLORS.aurora}, ${COLORS.nebula})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', system-ui, sans-serif",
            letterSpacing: '0.05em',
          }}
        >
          sathian.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};
