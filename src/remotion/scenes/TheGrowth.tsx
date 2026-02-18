import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { COLORS } from '../styles';

export const TheGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;

  // Wallet visualization
  const walletEntry = spring({
    frame,
    fps,
    config: { damping: 30 },
  });

  // Milestone counter ticking up
  const milestoneCount = Math.floor(interpolate(frame, [fps, 4 * fps], [1, 12], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  // Crypto balance growing
  const balance = interpolate(frame, [fps, 4 * fps], [0.001, 0.142], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Milestone icons appearing in a grid
  const milestones = [
    { icon: 'First tooth', emoji: '', delay: 0.5 },
    { icon: 'Second tooth', emoji: '', delay: 1 },
    { icon: 'Bike ride', emoji: '', delay: 1.5 },
    { icon: 'Swimming', emoji: '', delay: 2 },
    { icon: 'First word', emoji: '', delay: 2.5 },
    { icon: 'School day', emoji: '', delay: 3 },
  ];

  // Color shift: cool → warm returning
  const warmth = interpolate(frame, [2 * fps, 4 * fps], [0, 0.3], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.aurora} glowIntensity={0.12 + warmth * 0.1} />

      {/* Wallet card (glassmorphism) */}
      <div style={{
        position: 'absolute',
        left: cx - 180, top: cy - 130,
        width: 360, height: 260,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(124,58,237,0.08))',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        backdropFilter: 'blur(20px)',
        transform: `scale(${walletEntry})`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        padding: 24,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 14, color: COLORS.dimWhite,
            fontFamily: 'system-ui', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Child's Wallet
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: '#34D399',
            boxShadow: '0 0 8px #34D399',
          }} />
        </div>

        {/* Balance */}
        <div style={{
          fontSize: 42, color: COLORS.white,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 'bold',
          marginBottom: 4,
        }}>
          {balance.toFixed(3)} ETH
        </div>
        <div style={{
          fontSize: 14, color: `${COLORS.aurora}aa`,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 24,
        }}>
          ${(balance * 3200).toFixed(2)} USD
        </div>

        {/* Milestone grid */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          {milestones.map((m, i) => {
            const mEntry = spring({
              frame: frame - m.delay * fps,
              fps,
              config: { damping: 20, stiffness: 100 },
            });
            if (mEntry < 0.01) return null;

            return (
              <div
                key={i}
                style={{
                  width: 100, height: 32,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: COLORS.dimWhite,
                  fontFamily: 'system-ui',
                  transform: `scale(${mEntry})`,
                  opacity: mEntry,
                }}
              >
                {m.icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone counter */}
      <div style={{
        position: 'absolute', left: cx - 60, top: cy + 160,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 48, color: COLORS.stardust,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 'bold',
        }}>
          {milestoneCount}
        </div>
        <div style={{
          fontSize: 14, color: COLORS.dimWhite,
          fontFamily: 'system-ui', letterSpacing: '0.15em',
        }}>
          MILESTONES
        </div>
      </div>
    </AbsoluteFill>
  );
};
