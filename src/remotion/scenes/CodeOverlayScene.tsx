import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../styles';

const CODE_LINES = [
  { text: 'contract ToothFairyNetwork {', color: COLORS.aurora, indent: 0 },
  { text: '  milestone.verify(toothId)', color: COLORS.dimWhite, indent: 1 },
  { text: '  nft = mint(keepsake, parent)', color: COLORS.stardust, indent: 1 },
  { text: '  crypto = allocate(child.wallet)', color: COLORS.cryptoGreen, indent: 1 },
  { text: '  emit Transfer(', color: COLORS.dimWhite, indent: 1 },
  { text: '    nft → parent.soulbound', color: COLORS.nebula, indent: 2 },
  { text: '    crypto → child.wallet', color: COLORS.cryptoGreen, indent: 2 },
  { text: '  )', color: COLORS.dimWhite, indent: 1 },
  { text: '}', color: COLORS.aurora, indent: 0 },
];

export const CodeOverlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background Ken Burns
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  // Title: "Verified and immutable"
  const titleEntry = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  // Code lines appear sequentially
  const lineStartFrame = 0.8 * fps;
  const lineInterval = 0.25 * fps;

  // VERIFIED stamp — appears after all code lines
  const verifiedStartFrame = lineStartFrame + CODE_LINES.length * lineInterval + 0.5 * fps;
  const verifiedSpring = spring({
    frame: frame - verifiedStartFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const verifiedScale = interpolate(verifiedSpring, [0, 1], [3, 1]);
  const verifiedRotation = interpolate(verifiedSpring, [0, 1], [-8, -3]);

  // Glow pulse on VERIFIED
  const verifiedGlow = verifiedSpring > 0.5
    ? 0.6 + 0.3 * Math.sin((frame - verifiedStartFrame) / fps * 3)
    : 0;

  // Data stream particles
  const streamParticles = Array.from({ length: 20 }, (_, i) => {
    const seed = i * 3571;
    const baseX = 50 + ((seed * 9301 + 49297) % 233280) / 233280 * 40 - 20;
    const speed = 0.8 + (i % 4) * 0.3;
    const yProgress = ((frame / fps * speed + i * 0.4) % 3) / 3;
    const opacity = yProgress < 0.1 ? yProgress * 10 : yProgress > 0.9 ? (1 - yProgress) * 10 : 0.6;
    const size = 2 + (i % 3);
    const isGold = i < 7;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${baseX}%`,
          top: `${(1 - yProgress) * 100}%`,
          width: size,
          height: size * 3,
          borderRadius: size,
          backgroundColor: isGold ? COLORS.stardust : COLORS.aurora,
          opacity: opacity * 0.7,
          boxShadow: `0 0 ${size * 4}px ${isGold ? COLORS.amberGlow : COLORS.nodeGlow}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [durationInFrames - fps, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {/* Background image with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          transform: `scale(${zoom})`,
          opacity: 0.35,
        }}
      >
        <Img
          src={staticFile('v2-storyboard/backgrounds/bg-04-station-interior.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Data stream particles */}
      {streamParticles}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${COLORS.bg} 100%)`,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Title: "Verified and immutable" */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleEntry * exitOpacity,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.white,
            fontFamily: "'Outfit', system-ui, sans-serif",
            letterSpacing: '-0.02em',
            textShadow: `0 0 40px ${COLORS.bg}, 0 0 80px ${COLORS.bg}`,
          }}
        >
          Verified and immutable
        </div>
      </div>

      {/* Code block */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '24%',
          transform: 'translateX(-50%)',
          opacity: exitOpacity,
        }}
      >
        <div
          style={{
            background: 'rgba(5, 5, 16, 0.85)',
            border: `1px solid rgba(6, 182, 212, 0.2)`,
            borderRadius: 12,
            padding: '24px 36px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 60px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {CODE_LINES.map((line, i) => {
            const lineFrame = lineStartFrame + i * lineInterval;
            const lineSpring = spring({
              frame: frame - lineFrame,
              fps,
              config: { damping: 25, stiffness: 100 },
            });
            const lineX = interpolate(lineSpring, [0, 1], [20, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: lineSpring,
                  transform: `translateX(${lineX}px)`,
                  fontSize: 20,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: line.color,
                  lineHeight: 1.7,
                  paddingLeft: line.indent * 24,
                  whiteSpace: 'pre',
                  letterSpacing: '0.02em',
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* ── VERIFIED STAMP ───────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            bottom: -20,
            opacity: verifiedSpring * exitOpacity,
            transform: `scale(${verifiedScale}) rotate(${verifiedRotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              fontFamily: "'Outfit', system-ui, sans-serif",
              color: COLORS.verified,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              padding: '8px 28px',
              border: `4px solid ${COLORS.verified}`,
              borderRadius: 12,
              textShadow: `0 0 30px ${COLORS.verified}, 0 0 60px ${COLORS.verified}50`,
              boxShadow: `0 0 40px ${COLORS.verified}30, inset 0 0 20px ${COLORS.verified}10`,
            }}
          >
            VERIFIED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
