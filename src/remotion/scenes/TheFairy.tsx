import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { COLORS, seededPosition } from '../styles';

export const TheFairy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Fairy path: enters from upper-right, curves down to pillow area
  const progress = interpolate(frame, [0, 4 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const fairyX = interpolate(progress, [0, 0.3, 0.7, 1],
    [width + 50, width * 0.7, width * 0.55, width * 0.52]);
  const fairyY = interpolate(progress, [0, 0.3, 0.5, 1],
    [-50, height * 0.2, height * 0.35, height * 0.45]);

  // Wing shimmer
  const wingShimmer = 0.6 + 0.4 * Math.sin(frame / fps * 8);
  const wingAngle = Math.sin(frame / fps * 6) * 8;

  // Dust trail
  const dustTrail = Array.from({ length: 20 }, (_, i) => {
    const trailProgress = Math.max(0, progress - i * 0.03);
    if (trailProgress <= 0) return null;

    const tx = interpolate(trailProgress, [0, 0.3, 0.7, 1],
      [width + 50, width * 0.7, width * 0.55, width * 0.52]);
    const ty = interpolate(trailProgress, [0, 0.3, 0.5, 1],
      [-50, height * 0.2, height * 0.35, height * 0.45]);

    const pos = seededPosition(i + 70);
    const drift = (frame - i * 3) * 0.3;
    const opacity = interpolate(i, [0, 20], [0.8, 0], { extrapolateRight: 'clamp' });
    const size = 3 + (1 - i / 20) * 5;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: tx + (pos.x - 50) * 0.5 + Math.sin(drift * 0.05) * 10,
          top: ty + (pos.y - 50) * 0.3 + drift * 0.5,
          width: size, height: size, borderRadius: '50%',
          backgroundColor: COLORS.toothGlow,
          opacity: opacity * (0.5 + 0.5 * Math.sin(frame / fps * 4 + i)),
          boxShadow: `0 0 ${size * 2}px ${COLORS.toothGlow}`,
        }}
      />
    );
  });

  // Room brightening as fairy enters
  const roomGlow = interpolate(frame, [fps, 3 * fps], [0, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.stardust} glowIntensity={0.1 + roomGlow} />

      {/* Pillow glow (destination) */}
      <div style={{
        position: 'absolute',
        left: width * 0.52 - 80, top: height * 0.5 - 20,
        width: 160, height: 40, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        boxShadow: `0 0 60px ${COLORS.amberGlow}`,
      }} />

      {dustTrail}

      {/* Fairy body */}
      <div style={{
        position: 'absolute', left: fairyX, top: fairyY,
        transform: 'translate(-50%, -50%)',
      }}>
        {/* Wings */}
        <div style={{
          position: 'absolute', left: -22, top: -15,
          width: 24, height: 30,
          background: `linear-gradient(135deg, rgba(124,58,237,${wingShimmer * 0.6}), rgba(6,182,212,${wingShimmer * 0.4}))`,
          borderRadius: '50% 10% 50% 10%',
          transform: `rotate(${-20 + wingAngle}deg)`,
          boxShadow: `0 0 15px rgba(124,58,237,${wingShimmer * 0.5})`,
        }} />
        <div style={{
          position: 'absolute', right: -22, top: -15,
          width: 24, height: 30,
          background: `linear-gradient(225deg, rgba(124,58,237,${wingShimmer * 0.6}), rgba(6,182,212,${wingShimmer * 0.4}))`,
          borderRadius: '10% 50% 10% 50%',
          transform: `rotate(${20 - wingAngle}deg)`,
          boxShadow: `0 0 15px rgba(124,58,237,${wingShimmer * 0.5})`,
        }} />
        {/* Body */}
        <div style={{
          width: 14, height: 22, borderRadius: '40% 40% 50% 50%',
          background: `linear-gradient(180deg, ${COLORS.white}dd, ${COLORS.toothGlow}aa)`,
          boxShadow: `0 0 20px ${COLORS.amberGlow}`,
        }} />
        {/* Head */}
        <div style={{
          position: 'absolute', left: -1, top: -12,
          width: 16, height: 14, borderRadius: '50%',
          backgroundColor: `${COLORS.white}dd`,
          boxShadow: `0 0 10px ${COLORS.amberGlow}`,
        }} />
      </div>
    </AbsoluteFill>
  );
};
