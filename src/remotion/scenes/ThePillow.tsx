import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { SceneText } from '../components/SceneText';
import { Tooth } from '../components/Tooth';
import { COLORS, seededPosition } from '../styles';

export const ThePillow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const zoom = interpolate(frame, [0, 5 * fps], [1, 1.08], {
    extrapolateRight: 'clamp',
  });

  const bedY = height * 0.55;
  const pillowX = width * 0.52;
  const pillowY = bedY - 30;

  // Sparkle particles drifting up from pillow
  const sparkles = Array.from({ length: 12 }, (_, i) => {
    const pos = seededPosition(i + 50);
    const startX = pillowX - 60 + (pos.x / 100) * 120;
    const baseY = pillowY - 20;
    const drift = interpolate(frame, [0, 5 * fps], [0, -150 - pos.y * 2], {
      extrapolateRight: 'clamp',
    });
    const fadeIn = interpolate(frame, [i * 8, i * 8 + 20], [0, 0.8], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const size = 2 + (pos.x / 100) * 4;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: startX + Math.sin((frame / fps + i) * 2) * 15,
          top: baseY + drift,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: COLORS.toothGlow,
          opacity: fadeIn * (0.5 + 0.5 * Math.sin(frame / fps * 3 + i)),
          boxShadow: `0 0 ${size * 3}px ${COLORS.toothGlow}`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <CosmicBackground accentColor={COLORS.stardust} glowIntensity={0.15} />

      {/* Window */}
      <div style={{
        position: 'absolute', right: width * 0.15, top: height * 0.12,
        width: 160, height: 200, border: `2px solid rgba(255,255,255,0.15)`,
        borderRadius: 8, overflow: 'hidden',
      }}>
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(180deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.08) 100%)`,
        }} />
        {/* Moon */}
        <div style={{
          position: 'absolute', top: 30, right: 25, width: 35, height: 35,
          borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
          boxShadow: '0 0 30px rgba(255,255,255,0.15)',
        }} />
      </div>

      {/* Bed frame */}
      <div style={{
        position: 'absolute', left: width * 0.25, top: bedY,
        width: width * 0.5, height: 12, backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 6,
      }} />
      {/* Headboard */}
      <div style={{
        position: 'absolute', left: width * 0.25, top: bedY - 120,
        width: 12, height: 130, backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 6,
      }} />

      {/* Blanket */}
      <div style={{
        position: 'absolute', left: width * 0.28, top: bedY - 60,
        width: width * 0.44, height: 65, backgroundColor: 'rgba(124,58,237,0.12)',
        borderRadius: '20px 20px 4px 4px', border: '1px solid rgba(124,58,237,0.1)',
      }} />

      {/* Girl silhouette (head) */}
      <div style={{
        position: 'absolute', left: pillowX - 20, top: bedY - 95,
        width: 50, height: 45, borderRadius: '50% 50% 40% 40%',
        backgroundColor: 'rgba(255,255,255,0.07)',
      }} />
      {/* Hair */}
      <div style={{
        position: 'absolute', left: pillowX - 30, top: bedY - 100,
        width: 55, height: 30, borderRadius: '50%',
        backgroundColor: 'rgba(30,20,40,0.8)',
      }} />

      {/* Pillow */}
      <div style={{
        position: 'absolute', left: pillowX - 70, top: pillowY - 15,
        width: 140, height: 35, backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
      }} />

      {/* Tooth glow under pillow */}
      <Tooth x={pillowX} y={pillowY + 5} size={22} glowIntensity={1.2} />

      {sparkles}

      <SceneText text="Every tooth tells a story" enterAt={1.5} exitAt={4.5} />
    </AbsoluteFill>
  );
};
