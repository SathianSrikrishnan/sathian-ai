import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS } from '../styles';

export const SceneText: React.FC<{
  text: string;
  enterAt?: number; // seconds
  exitAt?: number;  // seconds
  fontSize?: number;
  color?: string;
  bottom?: number;
  fontFamily?: string;
}> = ({
  text,
  enterAt = 1.5,
  exitAt = 4,
  fontSize = 42,
  color = COLORS.dimWhite,
  bottom = 80,
  fontFamily = 'system-ui, -apple-system, sans-serif',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrame = enterAt * fps;
  const exitFrame = exitAt * fps;

  const enterProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 200 },
  });

  const exitProgress = spring({
    frame: frame - exitFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = enterProgress - exitProgress;
  const translateY = interpolate(enterProgress, [0, 1], [20, 0]) +
    interpolate(exitProgress, [0, 1], [0, -20]);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: Math.max(0, opacity),
        transform: `translateY(${translateY}px)`,
        fontSize,
        fontWeight: 300,
        color,
        fontFamily,
        letterSpacing: '0.05em',
        textShadow: `0 0 30px ${COLORS.bg}`,
      }}
    >
      {text}
    </div>
  );
};
