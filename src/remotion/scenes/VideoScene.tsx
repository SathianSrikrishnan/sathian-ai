import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Video } from '@remotion/media';
import { COLORS } from '../styles';

interface VideoSceneProps {
  video: string;
  title?: string;
  subtitle?: string;
  textPosition?: 'bottom' | 'center' | 'top';
  textDelay?: number;
  vignette?: number;
}

export const VideoScene: React.FC<VideoSceneProps> = ({
  video,
  title,
  subtitle,
  textPosition = 'bottom',
  textDelay = 1.5,
  vignette = 0.25,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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

  const textTopMap = {
    top: '12%',
    center: '42%',
    bottom: '72%',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {/* Veo video clip */}
      <Video
        src={staticFile(video)}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

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
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.white,
              fontFamily: "'Outfit', system-ui, sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textShadow: `0 2px 40px ${COLORS.bg}, 0 0 80px ${COLORS.bg}, 0 0 120px rgba(0,0,0,0.8)`,
              padding: '0 80px',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 20,
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
