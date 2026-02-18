import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../styles';

interface ImageSceneProps {
  image: string;
  title?: string;
  subtitle?: string;
  textPosition?: 'bottom' | 'center' | 'top';
  /** Ken Burns: zoom direction */
  zoomFrom?: number;
  zoomTo?: number;
  /** Ken Burns: pan direction (pixels) */
  panX?: number;
  panY?: number;
  /** Vignette overlay intensity 0-1 */
  vignette?: number;
  /** Delay text entry in seconds */
  textDelay?: number;
}

export const ImageScene: React.FC<ImageSceneProps> = ({
  image,
  title,
  subtitle,
  textPosition = 'bottom',
  zoomFrom = 1.0,
  zoomTo = 1.15,
  panX = 0,
  panY = 0,
  vignette = 0.4,
  textDelay = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns: smooth zoom + pan over the full scene duration
  const zoom = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateRight: 'clamp',
  });
  const translateX = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateRight: 'clamp',
  });

  // Text animation
  const textEntry = spring({
    frame: frame - textDelay * fps,
    fps,
    config: { damping: 30, stiffness: 80 },
  });
  const textExit = interpolate(frame, [durationInFrames - fps, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textOpacity = Math.min(textEntry, textExit);
  const textY = interpolate(textEntry, [0, 1], [30, 0]);

  // Subtle floating particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 7919;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 1103 + 27077) % 111953) / 111953;
    const speed = 0.3 + (i % 5) * 0.15;
    const size = 2 + (i % 3) * 1.5;
    const drift = Math.sin((frame / fps) * speed + i * 0.8) * 20;
    const float = Math.cos((frame / fps) * speed * 0.7 + i * 1.2) * 15;
    const pulse = 0.3 + 0.4 * Math.sin((frame / fps) * 1.5 + i);

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
          backgroundColor: i % 3 === 0 ? COLORS.stardust : i % 3 === 1 ? COLORS.aurora : COLORS.plasma,
          opacity: pulse * 0.5,
          transform: `translate(${drift}px, ${float}px)`,
          boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? COLORS.stardust : COLORS.aurora}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  const textTopMap = {
    top: '12%',
    center: '42%',
    bottom: '72%',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {/* Background image with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
          willChange: 'transform',
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Vignette overlay */}
      {vignette > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 40%, ${COLORS.bg} 100%)`,
            opacity: vignette,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Floating particles */}
      {particles}

      {/* Text overlay */}
      {title && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: textTopMap[textPosition],
            textAlign: 'center',
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: COLORS.white,
              fontFamily: "'Outfit', system-ui, sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textShadow: `0 2px 40px ${COLORS.bg}, 0 0 80px ${COLORS.bg}`,
              padding: '0 80px',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 300,
                color: COLORS.dimWhite,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.08em',
                marginTop: 16,
                textShadow: `0 2px 20px ${COLORS.bg}`,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
