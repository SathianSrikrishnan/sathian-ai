import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CosmicBackground } from '../components/CosmicBackground';
import { SceneText } from '../components/SceneText';
import { COLORS, seededPosition } from '../styles';

export const TheReturn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Split composition: bedroom left, globe right through window
  const bedroomW = width * 0.55;

  // Wallet settling onto nightstand
  const walletDescent = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 40 },
  });
  const walletY = interpolate(walletDescent, [0, 1], [height * 0.1, height * 0.48]);
  const walletX = bedroomW * 0.35;

  // Globe network through window
  const globeNodes = Array.from({ length: 30 }, (_, i) => {
    const pos = seededPosition(i + 150);
    // Map to a rough circle (globe shape)
    const angle = (pos.x / 100) * Math.PI * 2;
    const latFactor = Math.sin((pos.y / 100) * Math.PI);
    const globeR = 120;
    const gx = width * 0.78 + Math.cos(angle + frame / fps * 0.1) * globeR * latFactor;
    const gy = height * 0.35 + (pos.y / 100 - 0.5) * globeR * 1.8;
    const pulse = 0.5 + 0.5 * Math.sin(frame / fps * 2 + i * 0.5);

    return { x: gx, y: gy, pulse, size: 3 + pulse * 3 };
  });

  // Brand lockup fade in
  const brandEntry = spring({
    frame: frame - 3 * fps,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <CosmicBackground accentColor={COLORS.stardust} glowIntensity={0.15} />

      {/* Window frame divider */}
      <div style={{
        position: 'absolute', left: bedroomW - 1, top: height * 0.08,
        width: 2, height: height * 0.6,
        backgroundColor: 'rgba(255,255,255,0.1)',
      }} />
      <div style={{
        position: 'absolute', left: bedroomW - 80, top: height * 0.08,
        width: 160, height: 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
      }} />

      {/* LEFT SIDE: Bedroom */}
      {/* Bed */}
      <div style={{
        position: 'absolute', left: bedroomW * 0.15, top: height * 0.55,
        width: bedroomW * 0.6, height: 10,
        backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5,
      }} />
      {/* Blanket */}
      <div style={{
        position: 'absolute', left: bedroomW * 0.18, top: height * 0.5,
        width: bedroomW * 0.54, height: 55,
        backgroundColor: 'rgba(124,58,237,0.08)',
        borderRadius: '15px 15px 4px 4px',
      }} />
      {/* Girl silhouette */}
      <div style={{
        position: 'absolute', left: bedroomW * 0.45, top: height * 0.43,
        width: 45, height: 40, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.06)',
      }} />
      <div style={{
        position: 'absolute', left: bedroomW * 0.42, top: height * 0.41,
        width: 48, height: 22, borderRadius: '50%',
        backgroundColor: 'rgba(30,20,40,0.6)',
      }} />

      {/* Nightstand */}
      <div style={{
        position: 'absolute', left: walletX - 25, top: height * 0.52,
        width: 50, height: 40,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.05)',
      }} />

      {/* Wallet on nightstand */}
      <div style={{
        position: 'absolute', left: walletX - 22, top: walletY,
        width: 44, height: 56,
        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(124,58,237,0.15))',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 8,
        boxShadow: `0 0 30px ${COLORS.amberGlow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${walletDescent})`,
      }}>
        <div style={{
          fontSize: 8, color: COLORS.dimWhite,
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: 'center',
        }}>
          0.142<br/>ETH
        </div>
      </div>

      {/* Wallet glow on girl's face */}
      <div style={{
        position: 'absolute',
        left: walletX - 80, top: height * 0.38,
        width: 200, height: 150,
        background: `radial-gradient(ellipse at 30% 60%, ${COLORS.amberGlow} 0%, transparent 70%)`,
        opacity: walletDescent * 0.3,
      }} />

      {/* RIGHT SIDE: Globe network through window */}
      {globeNodes.map((node, i) => (
        <React.Fragment key={i}>
          <div style={{
            position: 'absolute', left: node.x - node.size / 2, top: node.y - node.size / 2,
            width: node.size, height: node.size, borderRadius: '50%',
            backgroundColor: i % 3 === 0 ? COLORS.aurora : i % 3 === 1 ? COLORS.nebula : COLORS.stardust,
            opacity: node.pulse * 0.7,
            boxShadow: `0 0 ${node.size * 2}px ${i % 3 === 0 ? COLORS.nodeGlow : COLORS.purpleGlow}`,
          }} />
          {/* Connection to nearest neighbors */}
          {i > 0 && i % 3 === 0 && (
            <div style={{
              position: 'absolute',
              left: globeNodes[i - 1].x, top: globeNodes[i - 1].y,
              width: Math.sqrt(
                Math.pow(node.x - globeNodes[i - 1].x, 2) +
                Math.pow(node.y - globeNodes[i - 1].y, 2)
              ),
              height: 1,
              backgroundColor: COLORS.aurora,
              opacity: 0.15,
              transform: `rotate(${Math.atan2(
                node.y - globeNodes[i - 1].y,
                node.x - globeNodes[i - 1].x
              ) * 180 / Math.PI}deg)`,
              transformOrigin: '0 0',
            }} />
          )}
        </React.Fragment>
      ))}

      {/* Globe outline */}
      <div style={{
        position: 'absolute',
        left: width * 0.78 - 130, top: height * 0.35 - 130,
        width: 260, height: 260, borderRadius: '50%',
        border: '1px solid rgba(6,182,212,0.12)',
      }} />

      {/* Brand lockup */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        textAlign: 'center', opacity: brandEntry,
        transform: `translateY(${interpolate(brandEntry, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{
          fontSize: 38, color: COLORS.white,
          fontFamily: 'system-ui', fontWeight: 600,
          letterSpacing: '0.04em',
          textShadow: `0 0 40px ${COLORS.bg}`,
        }}>
          The Tooth Fairy Network
        </div>
        <div style={{
          fontSize: 16, color: COLORS.dimWhite,
          fontFamily: 'system-ui', fontWeight: 300,
          letterSpacing: '0.15em', marginTop: 8,
        }}>
          sathian.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};
