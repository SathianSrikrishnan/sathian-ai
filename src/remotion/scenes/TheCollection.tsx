import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { SceneText } from '../components/SceneText';
import { Tooth } from '../components/Tooth';
import { COLORS, seededPosition } from '../styles';

export const TheCollection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Tooth rises from center-bottom to center
  const liftProgress = spring({
    frame: frame - fps,
    fps,
    config: { damping: 30, stiffness: 60 },
  });

  const toothY = interpolate(liftProgress, [0, 1], [height * 0.6, height * 0.38]);
  const toothX = width / 2;
  const toothSize = interpolate(liftProgress, [0, 1], [25, 55]);

  // Starburst rings
  const burstStart = 1.5 * fps;
  const burstProgress = interpolate(frame, [burstStart, burstStart + fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const rings = [1, 2, 3].map((ring) => {
    const ringRadius = burstProgress * ring * 120;
    const ringOpacity = interpolate(burstProgress, [0, 0.3, 1], [0, 0.6, 0], {
      extrapolateRight: 'clamp',
    });
    return (
      <div
        key={ring}
        style={{
          position: 'absolute',
          left: toothX - ringRadius,
          top: toothY - ringRadius,
          width: ringRadius * 2,
          height: ringRadius * 2,
          borderRadius: '50%',
          border: `2px solid ${COLORS.toothGlow}`,
          opacity: ringOpacity / ring,
        }}
      />
    );
  });

  // Particle starburst
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const dist = burstProgress * (100 + seededPosition(i + 80).x * 2);
    const px = toothX + Math.cos(angle) * dist;
    const py = toothY + Math.sin(angle) * dist;
    const opacity = interpolate(burstProgress, [0, 0.2, 1], [0, 1, 0]);
    const size = 2 + seededPosition(i + 90).y / 100 * 5;

    return (
      <div
        key={i}
        style={{
          position: 'absolute', left: px, top: py,
          width: size, height: size, borderRadius: '50%',
          backgroundColor: COLORS.toothGlow,
          opacity,
          boxShadow: `0 0 ${size * 3}px ${COLORS.toothGlow}`,
        }}
      />
    );
  });

  // Color shift: amber → purple creeping in from edges
  const colorShift = interpolate(frame, [3 * fps, 7 * fps], [0, 0.4], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Fairy hands (small silhouettes near tooth)
  const handOpacity = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 0.6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.stardust} glowIntensity={0.25} />

      {/* Purple edge creep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${COLORS.nebula}${Math.round(colorShift * 100).toString(16).padStart(2, '0')} 100%)`,
      }} />

      {rings}
      {particles}

      {/* Fairy hands */}
      <div style={{
        position: 'absolute', left: toothX - 45, top: toothY - 10,
        width: 20, height: 12, borderRadius: '50%',
        backgroundColor: `rgba(255,255,255,${handOpacity * 0.5})`,
        transform: 'rotate(20deg)',
      }} />
      <div style={{
        position: 'absolute', left: toothX + 25, top: toothY - 10,
        width: 20, height: 12, borderRadius: '50%',
        backgroundColor: `rgba(255,255,255,${handOpacity * 0.5})`,
        transform: 'rotate(-20deg)',
      }} />

      <Tooth x={toothX} y={toothY} size={toothSize} glowIntensity={1.5} pulseSpeed={2} />

      <SceneText text="One small tooth..." enterAt={3} exitAt={6} fontSize={48} />
    </AbsoluteFill>
  );
};
