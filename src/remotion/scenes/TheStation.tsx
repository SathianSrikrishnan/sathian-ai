import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { Tooth } from '../components/Tooth';
import { COLORS, seededPosition } from '../styles';

export const TheStation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Fairy + tooth fly upward
  const flyProgress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad),
  });
  const fairyY = interpolate(flyProgress, [0, 1], [height * 0.7, height * 0.35]);
  const fairyX = interpolate(flyProgress, [0, 1], [width * 0.4, width * 0.5]);

  // Station materializes
  const stationEntry = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const stationX = width * 0.5;
  const stationY = height * 0.3;

  // Hexagonal station structure
  const hexSize = 120 * stationEntry;

  // Portal swirl
  const portalRotation = (frame / fps) * 60;
  const portalOpacity = interpolate(frame, [fps, 2.5 * fps], [0, 0.6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Orbiting shapes
  const orbitals = [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (i / 6) * Math.PI * 2 + (frame / fps) * 0.8;
    const radius = 160 * stationEntry;
    const ox = stationX + Math.cos(angle) * radius;
    const oy = stationY + Math.sin(angle) * radius;
    const size = 8 + i * 2;

    return (
      <div
        key={i}
        style={{
          position: 'absolute', left: ox - size / 2, top: oy - size / 2,
          width: size, height: size,
          transform: `rotate(${angle * 57.3}deg)`,
          backgroundColor: i % 2 === 0 ? `${COLORS.aurora}60` : `${COLORS.nebula}60`,
          border: `1px solid ${i % 2 === 0 ? COLORS.aurora : COLORS.nebula}40`,
          opacity: stationEntry,
        }}
      />
    );
  });

  // Circuit trace patterns on station
  const circuits = Array.from({ length: 8 }, (_, i) => {
    const pos = seededPosition(i + 120);
    const traceOpacity = stationEntry * (0.3 + 0.3 * Math.sin(frame / fps * 2 + i));
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: stationX - hexSize + (pos.x / 100) * hexSize * 2,
          top: stationY - hexSize * 0.7 + (pos.y / 100) * hexSize * 1.4,
          width: 30 + pos.x * 0.5, height: 1,
          backgroundColor: COLORS.aurora,
          opacity: traceOpacity,
          boxShadow: `0 0 6px ${COLORS.aurora}`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.nebula} glowIntensity={0.2} />

      {/* Portal swirl */}
      <div style={{
        position: 'absolute',
        left: stationX - 100, top: stationY - 100,
        width: 200, height: 200, borderRadius: '50%',
        border: `2px solid ${COLORS.nebula}`,
        opacity: portalOpacity,
        transform: `rotate(${portalRotation}deg)`,
        boxShadow: `0 0 40px ${COLORS.purpleGlow}, inset 0 0 40px ${COLORS.purpleGlow}`,
      }} />

      {/* Station hexagon */}
      <div style={{
        position: 'absolute',
        left: stationX - hexSize, top: stationY - hexSize * 0.7,
        width: hexSize * 2, height: hexSize * 1.4,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: `linear-gradient(180deg, rgba(6,182,212,0.08), rgba(124,58,237,0.12))`,
        border: `1px solid rgba(6,182,212,${stationEntry * 0.3})`,
        opacity: stationEntry,
      }} />

      {circuits}
      {orbitals}

      {/* Fairy approaching with tooth */}
      {flyProgress < 1 && (
        <Tooth x={fairyX} y={fairyY} size={30} glowIntensity={1.2} />
      )}

      {/* Tooth entering station */}
      {flyProgress >= 1 && (
        <Tooth x={stationX} y={stationY} size={interpolate(frame, [3 * fps, 4 * fps], [30, 20], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })} glowIntensity={1.5} />
      )}
    </AbsoluteFill>
  );
};
