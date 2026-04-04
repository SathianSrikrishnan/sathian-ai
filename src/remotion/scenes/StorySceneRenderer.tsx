import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../styles';

interface StorySceneRendererProps {
  background: string;
  dialogueText: string;
  speaker?: string;
  speakerColor?: string;
  character?: {
    image: string;
    position: 'left' | 'center' | 'right';
    enter?: 'left' | 'right' | 'top' | 'bottom' | 'fade';
  };
  isFirstScene?: boolean;
}

export const StorySceneRenderer: React.FC<StorySceneRendererProps> = ({
  background,
  dialogueText,
  speaker,
  speakerColor = COLORS.stardust,
  character,
  isFirstScene = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Ken Burns on background ──
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  // ── Scene entry fade ──
  const entryOpacity = isFirstScene
    ? interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' })
    : 1;

  // ── Character animation ──
  const charEntry = character
    ? spring({ frame: frame - fps * 0.3, fps, config: { damping: 22, stiffness: 120 } })
    : 0;

  const charStartX =
    character?.enter === 'left' ? -300 :
    character?.enter === 'right' ? 300 : 0;
  const charStartY =
    character?.enter === 'top' ? -200 :
    character?.enter === 'bottom' ? 200 : 0;

  const charX = interpolate(charEntry, [0, 1], [charStartX, 0]);
  const charY = interpolate(charEntry, [0, 1], [charStartY, 0]);
  const charOpacity = character?.enter === 'fade'
    ? charEntry
    : interpolate(charEntry, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Character float (gentle bobbing once visible)
  const charFloat = character
    ? Math.sin((frame / fps) * 1.2) * 6
    : 0;

  // Character position mapping
  const charLeft =
    character?.position === 'left' ? '5%' :
    character?.position === 'right' ? '55%' : '15%';
  const charWidth = character?.position === 'center' ? '70%' : '40%';

  // ── Typewriter text ──
  const typewriterDelay = character ? fps * 0.8 : fps * 0.4;
  const charsPerFrame = 1.2; // ~36 chars/sec at 30fps
  const typedChars = Math.floor(
    Math.max(0, (frame - typewriterDelay) * charsPerFrame)
  );
  const displayText = dialogueText.slice(0, Math.min(typedChars, dialogueText.length));
  const typewriterDone = typedChars >= dialogueText.length;

  // Cursor blink
  const cursorOpacity = typewriterDone
    ? 0
    : frame % (fps * 0.5) < fps * 0.25 ? 1 : 0;

  // ── Dialogue box animation ──
  const dialogueEntry = spring({
    frame: frame - (character ? fps * 0.5 : fps * 0.2),
    fps,
    config: { damping: 30, stiffness: 80 },
  });
  const dialogueY = interpolate(dialogueEntry, [0, 1], [40, 0]);

  // ── Particles ──
  const particles = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 6131;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 1103 + 27077) % 111953) / 111953;
    const speed = 0.2 + (i % 5) * 0.1;
    const size = 1.5 + (i % 3) * 1.2;
    const drift = Math.sin((frame / fps) * speed + i * 0.7) * 15;
    const float = Math.cos((frame / fps) * speed * 0.7 + i * 1.1) * 12;
    const pulse = 0.2 + 0.35 * Math.sin((frame / fps) * 1.3 + i);
    const color =
      i % 3 === 0 ? COLORS.stardust :
      i % 3 === 1 ? COLORS.aurora : COLORS.plasma;

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
          backgroundColor: color,
          opacity: pulse * 0.5,
          transform: `translate(${drift}px, ${float}px)`,
          boxShadow: `0 0 ${size * 3}px ${color}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, overflow: 'hidden', opacity: entryOpacity }}
    >
      {/* Background with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: '-8%',
          transform: `scale(${zoom})`,
          willChange: 'transform',
        }}
      >
        <Img
          src={background}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Gradient overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${COLORS.bg} 0%, ${COLORS.bg}66 40%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, ${COLORS.bg} 100%)`,
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      {/* Particles */}
      {particles}

      {/* Character sprite */}
      {character && (
        <div
          style={{
            position: 'absolute',
            left: charLeft,
            top: '10%',
            width: charWidth,
            maxHeight: '45%',
            opacity: charOpacity,
            transform: `translate(${charX}px, ${charY + charFloat}px)`,
            filter: `drop-shadow(0 0 20px ${speakerColor}50)`,
            zIndex: 20,
          }}
        >
          <Img
            src={character.image}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 16,
            }}
          />
        </div>
      )}

      {/* Dialogue box */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 24,
          right: 24,
          zIndex: 30,
          opacity: dialogueEntry,
          transform: `translateY(${dialogueY}px)`,
        }}
      >
        <div
          style={{
            background: 'rgba(11, 16, 38, 0.88)',
            borderRadius: 20,
            padding: '20px 24px',
            border: '1px solid rgba(240, 196, 86, 0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Speaker name */}
          {speaker && (
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: speakerColor,
                fontFamily: "'Quicksand', 'Nunito', sans-serif",
                letterSpacing: '0.06em',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              {speaker}
            </div>
          )}

          {/* Dialogue text with typewriter */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.white,
              fontFamily: "'Nunito', 'Quicksand', sans-serif",
              lineHeight: 1.6,
              minHeight: 48,
            }}
          >
            {displayText}
            <span
              style={{
                opacity: cursorOpacity,
                color: COLORS.stardust,
                marginLeft: 2,
              }}
            >
              |
            </span>
          </div>
        </div>
      </div>

      {/* Scene counter (bottom right) */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          fontFamily: "'JetBrains Mono', monospace",
          zIndex: 40,
        }}
      >
        {/* Will be filled by parent with scene index */}
      </div>
    </AbsoluteFill>
  );
};
