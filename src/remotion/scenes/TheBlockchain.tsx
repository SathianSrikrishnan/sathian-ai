import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { Tooth } from '../components/Tooth';
import { COLORS, seededPosition } from '../styles';

// Node positions for doubling visualization: 1 → 2 → 4 → 8 → 16
function getNodePositions(count: number, cx: number, cy: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
}

export const TheBlockchain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;

  // Node doubling timeline
  const stages = [
    { count: 1, radius: 0, start: 0.5, label: '1' },
    { count: 2, radius: 60, start: 1.5, label: '2' },
    { count: 4, radius: 120, start: 2.5, label: '4' },
    { count: 8, radius: 200, start: 3.5, label: '8' },
    { count: 16, radius: 300, start: 4.5, label: '16' },
  ];

  // Hash text (typewriter)
  const hashes = [
    { text: '0x7f3a...c4e2', y: cy - 180, start: 1 },
    { text: 'BLOCK #847291', y: cy + 180, start: 2 },
    { text: 'HASH: a9f2e1...', y: cy - 220, start: 3 },
    { text: 'NONCE: 42069', y: cy + 220, start: 4 },
  ];

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.aurora} glowIntensity={0.15} />

      {/* Central tooth (small, encased) */}
      <Tooth x={cx} y={cy} size={28} glowIntensity={0.8} pulseSpeed={1} />

      {/* Geometric frame around tooth */}
      <div style={{
        position: 'absolute', left: cx - 30, top: cy - 30,
        width: 60, height: 60,
        border: `1px solid ${COLORS.aurora}40`,
        transform: `rotate(${(frame / fps) * 15}deg)`,
        opacity: 0.6,
      }} />

      {/* Node stages */}
      {stages.map((stage, si) => {
        const stageEntry = spring({
          frame: frame - stage.start * fps,
          fps,
          config: { damping: 15, stiffness: 80 },
        });

        if (stageEntry <= 0.01) return null;

        const nodes = getNodePositions(stage.count, cx, cy, stage.radius * stageEntry);

        return (
          <React.Fragment key={si}>
            {nodes.map((node, ni) => {
              const nodeEntry = spring({
                frame: frame - (stage.start + ni * 0.05) * fps,
                fps,
                config: { damping: 20 },
              });

              // Connection line to center
              if (stage.radius > 0 && nodeEntry > 0.1) {
                const lineOpacity = nodeEntry * 0.3;
                const dx = node.x - cx;
                const dy = node.y - cy;
                const len = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                return (
                  <React.Fragment key={ni}>
                    {/* Connection line */}
                    <div style={{
                      position: 'absolute', left: cx, top: cy,
                      width: len * nodeEntry, height: 1,
                      backgroundColor: COLORS.aurora,
                      opacity: lineOpacity,
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '0 0',
                      boxShadow: `0 0 4px ${COLORS.aurora}`,
                    }} />
                    {/* Node */}
                    <div style={{
                      position: 'absolute',
                      left: node.x - 8, top: node.y - 8,
                      width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: `${COLORS.aurora}${Math.round(nodeEntry * 200).toString(16).padStart(2, '0')}`,
                      border: `1px solid ${COLORS.aurora}`,
                      transform: `scale(${nodeEntry})`,
                      boxShadow: `0 0 12px ${COLORS.nodeGlow}`,
                    }} />
                  </React.Fragment>
                );
              }
              return null;
            })}
          </React.Fragment>
        );
      })}

      {/* Hash text (typewriter effect) */}
      {hashes.map((hash, i) => {
        const charCount = interpolate(
          frame, [hash.start * fps, (hash.start + 1) * fps],
          [0, hash.text.length],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const displayText = hash.text.slice(0, Math.floor(charCount));
        if (displayText.length === 0) return null;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0, right: 0, top: hash.y,
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: 16, color: `${COLORS.aurora}80`,
              letterSpacing: '0.1em',
              opacity: 0.7,
            }}
          >
            {displayText}
            <span style={{ opacity: Math.sin(frame / fps * 6) > 0 ? 1 : 0 }}>_</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
