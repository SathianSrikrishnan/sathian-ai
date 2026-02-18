import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { SceneText } from '../components/SceneText';
import { COLORS } from '../styles';

export const TheExchange: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;

  // All nodes flash gold simultaneously
  const flashProgress = spring({
    frame: frame - 0.5 * fps,
    fps,
    config: { damping: 200 },
  });
  const flashOpacity = interpolate(flashProgress, [0, 1], [0, 0.4]);

  // NFT card materializes
  const nftEntry = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const nftRotation = interpolate(frame, [1.5 * fps, 3 * fps], [180, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Split: NFT goes left (parent), Crypto goes right (child)
  const splitProgress = spring({
    frame: frame - 3 * fps,
    fps,
    config: { damping: 30 },
  });

  const nftX = interpolate(splitProgress, [0, 1], [cx, cx - 280]);
  const cryptoX = interpolate(splitProgress, [0, 1], [cx, cx + 280]);

  // ETH diamond
  const ethEntry = spring({
    frame: frame - 2 * fps,
    fps,
    config: { damping: 20 },
  });
  const ethRotation = (frame / fps) * 30;

  // Parent silhouette (left)
  const parentOpacity = interpolate(splitProgress, [0.3, 1], [0, 0.6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Child silhouette (right)
  const childOpacity = parentOpacity;

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.nebula} glowIntensity={0.12} />

      {/* Gold flash overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${COLORS.toothGlow}${Math.round(flashOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
      }} />

      {/* Parent silhouette (left) */}
      <div style={{
        position: 'absolute', left: cx - 380, top: cy - 120,
        opacity: parentOpacity,
      }}>
        {/* Head */}
        <div style={{
          width: 50, height: 55, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          margin: '0 auto 8px',
        }} />
        {/* Body */}
        <div style={{
          width: 70, height: 90, borderRadius: '35px 35px 10px 10px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          margin: '0 auto',
        }} />
        <div style={{
          textAlign: 'center', marginTop: 12,
          fontSize: 14, color: COLORS.dimWhite,
          fontFamily: 'system-ui', letterSpacing: '0.1em',
        }}>
          PARENT
        </div>
      </div>

      {/* Child silhouette (right) */}
      <div style={{
        position: 'absolute', right: cx - 380, top: cy - 80,
        opacity: childOpacity,
      }}>
        {/* Head */}
        <div style={{
          width: 40, height: 42, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          margin: '0 auto 6px',
        }} />
        {/* Body (smaller) */}
        <div style={{
          width: 50, height: 65, borderRadius: '25px 25px 8px 8px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          margin: '0 auto',
        }} />
        <div style={{
          textAlign: 'center', marginTop: 12,
          fontSize: 14, color: COLORS.dimWhite,
          fontFamily: 'system-ui', letterSpacing: '0.1em',
        }}>
          CHILD
        </div>
      </div>

      {/* NFT Card (moves to parent side) */}
      <div style={{
        position: 'absolute', left: nftX - 60, top: cy - 80,
        width: 120, height: 160,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        transform: `scale(${nftEntry}) rotateY(${nftRotation}deg)`,
        boxShadow: `0 0 30px ${COLORS.purpleGlow}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 10,
      }}>
        {/* Tooth icon on card */}
        <svg viewBox="0 0 40 48" width={35} height={42} style={{ marginBottom: 8 }}>
          <path
            d="M20 2 C12 2 4 8 4 18 C4 28 8 36 12 44 C14 48 16 48 18 44 C19 42 21 42 22 44 C24 48 26 48 28 44 C32 36 36 28 36 18 C36 8 28 2 20 2Z"
            fill={COLORS.toothGlow}
            opacity={0.8}
          />
        </svg>
        <div style={{
          fontSize: 10, color: COLORS.dimWhite,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.05em',
        }}>
          NFT KEEPSAKE
        </div>
      </div>

      {/* ETH symbol (moves to child side) */}
      <div style={{
        position: 'absolute', left: cryptoX - 30, top: cy - 40,
        transform: `scale(${ethEntry}) rotate(${ethRotation}deg)`,
      }}>
        <svg viewBox="0 0 60 60" width={60} height={60}>
          {/* Diamond shape */}
          <polygon
            points="30,5 55,30 30,55 5,30"
            fill="none"
            stroke={COLORS.aurora}
            strokeWidth={1.5}
            opacity={0.8}
          />
          <polygon
            points="30,12 48,30 30,48 12,30"
            fill={`${COLORS.aurora}20`}
            stroke={COLORS.aurora}
            strokeWidth={0.5}
            opacity={0.6}
          />
          {/* ETH symbol */}
          <text x="30" y="35" textAnchor="middle" fill={COLORS.aurora}
            fontSize="18" fontFamily="system-ui" fontWeight="bold">
            ETH
          </text>
        </svg>
        <div style={{
          textAlign: 'center', marginTop: 8,
          fontSize: 10, color: `${COLORS.aurora}aa`,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          CRYPTO
        </div>
      </div>

      {/* Arrow indicators during split */}
      {splitProgress > 0.3 && (
        <>
          <div style={{
            position: 'absolute', left: cx - 50, top: cy - 5,
            fontSize: 24, color: `${COLORS.toothGlow}${Math.round(splitProgress * 150).toString(16).padStart(2, '0')}`,
            fontFamily: 'system-ui',
          }}>
            {'<'}
          </div>
          <div style={{
            position: 'absolute', left: cx + 35, top: cy - 5,
            fontSize: 24, color: `${COLORS.aurora}${Math.round(splitProgress * 150).toString(16).padStart(2, '0')}`,
            fontFamily: 'system-ui',
          }}>
            {'>'}
          </div>
        </>
      )}

      <SceneText
        text="You keep it. They learn from it."
        enterAt={4} exitAt={5.5} fontSize={38}
      />
    </AbsoluteFill>
  );
};
