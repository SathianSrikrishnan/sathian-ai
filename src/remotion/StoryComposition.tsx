import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  spring,
  interpolate,
} from 'remotion';
import { StorySceneRenderer } from './scenes/StorySceneRenderer';
import { StoryConfig, StoryScene } from '../data/stories/types';
import { COLORS, FPS } from './styles';

// Calculate frame duration per scene based on dialogue length
function sceneDuration(scene: StoryScene): number {
  const baseFrames = FPS * 2; // 2s minimum per scene
  const readingFrames = Math.ceil(scene.dialogue.text.length / 1.2); // typewriter speed
  const holdFrames = FPS * 1.5; // 1.5s hold after typewriter completes
  const charEntryFrames = scene.character ? FPS * 0.5 : 0; // extra time for character entrance

  return Math.min(
    Math.max(baseFrames + readingFrames + holdFrames + charEntryFrames, FPS * 4), // min 4s
    FPS * 12 // max 12s
  );
}

// Calculate total frames for a story
export function storyTotalFrames(story: StoryConfig): number {
  const transitionFrames = 15; // 0.5s fade between scenes
  const introFrames = FPS * 2; // 2s title card
  const outroFrames = FPS * 3; // 3s outro

  const scenesTotal = story.scenes
    .filter((s) => !s.isChoice) // skip CTA scenes
    .reduce((sum, scene) => sum + sceneDuration(scene), 0);

  const transitions = (story.scenes.filter((s) => !s.isChoice).length - 1) * transitionFrames;

  return introFrames + scenesTotal - transitions + outroFrames;
}

// Resolve story asset paths for Remotion's staticFile
// Story data uses paths like "/story-assets/tooth-fairy/tf-01-bedroom.jpg"
// These live in /public/ so they work with staticFile when we strip the leading /
function resolveAsset(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

export interface StoryVideoProps {
  story: StoryConfig;
  [key: string]: unknown;
}

export const StoryComposition: React.FC<StoryVideoProps> = ({ story }) => {
  const { fps } = useVideoConfig();
  const transitionFrames = 15;

  const playableScenes = story.scenes.filter((s) => !s.isChoice);
  const introFrames = fps * 2;
  const outroFrames = fps * 3;

  // Build scene timing map
  let currentFrame = introFrames;
  const sceneTimings = playableScenes.map((scene, i) => {
    const duration = sceneDuration(scene);
    const from = currentFrame;
    currentFrame += duration - (i < playableScenes.length - 1 ? transitionFrames : 0);
    return { scene, from, duration };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ── Intro Title Card ── */}
      <Sequence from={0} durationInFrames={introFrames + transitionFrames}>
        <StoryTitleCard story={story} />
      </Sequence>

      {/* ── Story Scenes ── */}
      {sceneTimings.map(({ scene, from, duration }, i) => (
        <Sequence
          key={scene.id}
          from={from}
          durationInFrames={duration}
        >
          <StorySceneRenderer
            background={resolveAsset(scene.background)}
            dialogueText={scene.dialogue.text}
            speaker={scene.dialogue.speaker}
            speakerColor={scene.dialogue.speakerColor}
            character={
              scene.character
                ? {
                    image: resolveAsset(scene.character.image),
                    position: scene.character.position,
                    enter: scene.character.enter,
                  }
                : undefined
            }
            isFirstScene={i === 0}
          />
        </Sequence>
      ))}

      {/* ── Outro ── */}
      <Sequence
        from={currentFrame}
        durationInFrames={outroFrames}
      >
        <StoryOutroCard story={story} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ── Title Card ──
const StoryTitleCard: React.FC<{ story: StoryConfig }> = ({ story }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleEntry = spring({
    frame: frame - fps * 0.3,
    fps,
    config: { damping: 25, stiffness: 60 },
  });
  const subtitleEntry = spring({
    frame: frame - fps * 0.8,
    fps,
    config: { damping: 30, stiffness: 80 },
  });
  const exitFade = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Particles
  const particles = Array.from({ length: 20 }, (_, i) => {
    const seed = i * 3571;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 1103 + 27077) % 111953) / 111953;
    const size = 1.5 + (i % 3) * 1.2;
    const drift = Math.sin((frame / fps) * 0.3 + i * 0.8) * 12;
    const float = Math.cos((frame / fps) * 0.25 + i * 1.1) * 10;
    const pulse = 0.2 + 0.3 * Math.sin((frame / fps) * 1.2 + i);

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
          backgroundColor: story.color,
          opacity: pulse * exitFade,
          transform: `translate(${drift}px, ${float}px)`,
          boxShadow: `0 0 ${size * 4}px ${story.color}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {particles}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          width: 500,
          height: 500,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${story.color}30 0%, transparent 70%)`,
          opacity: 0.5 * exitFade,
        }}
      />

      {/* Emoji */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '28%',
          transform: 'translate(-50%, -50%)',
          fontSize: 72,
          opacity: titleEntry * exitFade,
        }}
      >
        {story.emoji}
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '42%',
          textAlign: 'center',
          opacity: titleEntry * exitFade,
          transform: `translateY(${interpolate(titleEntry, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: "'Quicksand', 'Outfit', system-ui, sans-serif",
            letterSpacing: '-0.02em',
            textShadow: `0 0 60px ${story.color}40`,
          }}
        >
          {story.title}
        </div>
      </div>

      {/* Region subtitle */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '58%',
          textAlign: 'center',
          opacity: subtitleEntry * exitFade,
          transform: `translateY(${interpolate(subtitleEntry, [0, 1], [15, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.dimWhite,
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: '0.08em',
          }}
        >
          {story.region}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Outro Card ──
const StoryOutroCard: React.FC<{ story: StoryConfig }> = ({ story }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entry = spring({
    frame: frame - fps * 0.3,
    fps,
    config: { damping: 25, stiffness: 60 },
  });
  const ctaEntry = spring({
    frame: frame - fps * 1.0,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  const particles = Array.from({ length: 15 }, (_, i) => {
    const seed = i * 8191;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 1103 + 27077) % 111953) / 111953;
    const size = 1.5 + (i % 3);
    const drift = Math.sin((frame / fps) * 0.25 + i) * 10;
    const float = Math.cos((frame / fps) * 0.2 + i * 0.8) * 8;
    const pulse = 0.15 + 0.25 * Math.sin((frame / fps) * 1.1 + i);

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
          backgroundColor: i % 2 === 0 ? COLORS.aurora : COLORS.stardust,
          opacity: pulse,
          transform: `translate(${drift}px, ${float}px)`,
          boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? COLORS.aurora : COLORS.stardust}`,
          pointerEvents: 'none' as const,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {particles}

      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          width: 400,
          height: 400,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.purpleGlow} 0%, transparent 70%)`,
          opacity: 0.4,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '32%',
          textAlign: 'center',
          opacity: entry,
          transform: `translateY(${interpolate(entry, [0, 1], [25, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: "'Quicksand', system-ui, sans-serif",
            textShadow: `0 0 40px ${COLORS.purpleGlow}`,
          }}
        >
          The Tooth Fairy Network
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '48%',
          textAlign: 'center',
          opacity: entry,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: COLORS.dimWhite,
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: '0.06em',
          }}
        >
          Every tradition. Every tooth. Forever on chain.
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '62%',
          textAlign: 'center',
          opacity: ctaEntry,
          transform: `translateY(${interpolate(ctaEntry, [0, 1], [15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: 22,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${COLORS.aurora}, ${COLORS.nebula})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          toothfairy.network
        </div>
      </div>
    </AbsoluteFill>
  );
};

