import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Video } from '@remotion/media';
import {
  COLOSSEUM_HEIGHT,
  COLOSSEUM_WIDTH,
  colosseumStoryboards,
  framesForSeconds,
} from './storyboards';
import type { ColosseumScene, ColosseumVideoKind } from './types';

const palette = {
  bg: '#0f1020',
  ink: '#1b1630',
  cream: '#fffaf0',
  creamSoft: '#f8edd8',
  gold: '#f4bd4a',
  rose: '#e88aa8',
  cyan: '#56cfe1',
  green: '#67d391',
  violet: '#7c5cff',
  line: 'rgba(83, 61, 36, 0.18)',
  darkLine: 'rgba(255, 250, 240, 0.2)',
};

const statusColor = {
  outline: palette.violet,
  'needs-assets': palette.gold,
  'draft-ready': palette.cyan,
  approved: palette.green,
};

const slotColor = {
  needed: palette.gold,
  queued: palette.rose,
  captured: palette.cyan,
  approved: palette.green,
};

type StoryboardProps = {
  kind: ColosseumVideoKind;
};

export const ColosseumStoryboard: React.FC<StoryboardProps> = ({ kind }) => {
  const storyboard = colosseumStoryboards[kind];
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      {storyboard.scenes.map((scene, index) => {
        const duration = framesForSeconds(scene.durationSeconds);
        const from = cursor;
        cursor += duration;
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={duration}
            premountFor={30}
          >
            <StoryboardScene
              scene={scene}
              index={index}
              total={storyboard.scenes.length}
              kind={kind}
              deckTitle={storyboard.title}
              deckSubtitle={storyboard.subtitle}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const ColosseumPitchStoryboard: React.FC = () => (
  <ColosseumStoryboard kind="pitch" />
);

export const ColosseumTechnicalStoryboard: React.FC = () => (
  <ColosseumStoryboard kind="technical" />
);

type StoryboardSceneProps = {
  scene: ColosseumScene;
  index: number;
  total: number;
  kind: ColosseumVideoKind;
  deckTitle: string;
  deckSubtitle: string;
};

const StoryboardScene: React.FC<StoryboardSceneProps> = ({
  scene,
  index,
  total,
  kind,
  deckTitle,
  deckSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
  const opacity = Math.min(enter, exit);
  const slide = interpolate(enter, [0, 1], [32, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          kind === 'pitch'
            ? `linear-gradient(135deg, ${palette.cream} 0%, #fff2dc 48%, #f4e8ff 100%)`
            : `linear-gradient(135deg, #0f1020 0%, #191a33 52%, #132f38 100%)`,
        color: kind === 'pitch' ? palette.ink : palette.cream,
        fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Arial',
        overflow: 'hidden',
        opacity,
      }}
    >
      <BackgroundTexture dark={kind === 'technical'} />
      <div
        style={{
          position: 'absolute',
          inset: 72,
          display: 'grid',
          gridTemplateColumns: '1fr 620px',
          gap: 54,
          transform: `translateY(${slide}px)`,
        }}
      >
        <main>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 38,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <span>{deckTitle}</span>
            <span style={{ opacity: 0.48 }}>/</span>
            <span style={{ opacity: 0.68, fontWeight: 500 }}>
              {deckSubtitle}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                fontSize: 64,
                lineHeight: 1,
                fontWeight: 800,
                color:
                  kind === 'pitch'
                    ? palette.violet
                    : statusColor[scene.approval],
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 72,
                lineHeight: 0.95,
                maxWidth: 980,
              }}
            >
              {scene.title}
            </h1>
          </div>

          <SceneMeta scene={scene} kind={kind} />

          <section style={{ marginTop: 40, maxWidth: 1050 }}>
            <Label>Objective</Label>
            <p style={paragraphStyle(kind, 34)}>{scene.objective}</p>
          </section>

          <section style={{ marginTop: 34, maxWidth: 1120 }}>
            <Label>Narration</Label>
            <p
              style={{
                ...paragraphStyle(kind, 42),
                fontWeight: 650,
                lineHeight: 1.18,
              }}
            >
              {scene.narration}
            </p>
          </section>

          <section style={{ marginTop: 36 }}>
            <Label>Production Notes</Label>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {scene.productionNotes.map((note) => (
                <Pill key={note} dark={kind === 'technical'}>
                  {note}
                </Pill>
              ))}
            </div>
          </section>
        </main>

        <aside>
          <PreviewPanel scene={scene} kind={kind} />
          <SlotList scene={scene} dark={kind === 'technical'} />
        </aside>
      </div>

      <ProgressBar current={index + 1} total={total} kind={kind} />
    </AbsoluteFill>
  );
};

const SceneMeta: React.FC<{
  scene: ColosseumScene;
  kind: ColosseumVideoKind;
}> = ({ scene, kind }) => (
  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
    <Tag dark={kind === 'technical'}>speaker: {scene.speaker}</Tag>
    <Tag dark={kind === 'technical'}>{scene.durationSeconds}s</Tag>
    <Tag dark={kind === 'technical'} color={statusColor[scene.approval]}>
      {scene.approval}
    </Tag>
  </div>
);

const PreviewPanel: React.FC<{
  scene: ColosseumScene;
  kind: ColosseumVideoKind;
}> = ({ scene, kind }) => {
  const previewSlot = scene.slots.find((slot) => slot.path);
  const usesTanda =
    scene.speaker === 'tanda' ||
    scene.slots.some((slot) => slot.kind === 'avatar');

  return (
    <div
      style={{
        height: 440,
        borderRadius: 26,
        border: `1px solid ${
          kind === 'pitch' ? palette.line : palette.darkLine
        }`,
        background:
          kind === 'pitch'
            ? 'rgba(255,255,255,0.58)'
            : 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow:
          kind === 'pitch'
            ? '0 28px 80px rgba(86, 61, 20, 0.16)'
            : '0 28px 80px rgba(0, 0, 0, 0.32)',
      }}
    >
      {previewSlot?.path ? (
        <AssetPreview slotPath={previewSlot.path} />
      ) : usesTanda ? (
        <TandaPreview />
      ) : (
        <PlaceholderPreview scene={scene} dark={kind === 'technical'} />
      )}
      <div
        style={{
          position: 'absolute',
          left: 26,
          right: 26,
          bottom: 24,
          padding: '18px 20px',
          borderRadius: 18,
          background:
            kind === 'pitch'
              ? 'rgba(255, 250, 240, 0.86)'
              : 'rgba(11, 14, 30, 0.82)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Label>Visual Plan</Label>
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            lineHeight: 1.22,
            color: kind === 'pitch' ? palette.ink : palette.cream,
          }}
        >
          {scene.visualPlan}
        </div>
      </div>
    </div>
  );
};

const AssetPreview: React.FC<{ slotPath: string }> = ({ slotPath }) => {
  const isVideo = /\.(mp4|webm|mov)$/i.test(slotPath);

  if (isVideo) {
    return (
      <Video
        src={staticFile(slotPath)}
        loop
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <Img
      src={staticFile(slotPath)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
};

const TandaPreview: React.FC = () => (
  <>
    <Video
      src={staticFile(
        'toothfairy/animation/tfn-tanda-hero-integrated-loop-v32.mp4',
      )}
      loop
      muted
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.86,
      }}
    />
    <Img
      src={staticFile('toothfairy/tanda-v2-reference.jpg')}
      style={{
        position: 'absolute',
        right: 18,
        top: 18,
        width: 150,
        height: 214,
        objectFit: 'cover',
        borderRadius: 16,
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 18px 44px rgba(55, 36, 8, 0.24)',
      }}
    />
  </>
);

const PlaceholderPreview: React.FC<{
  scene: ColosseumScene;
  dark: boolean;
}> = ({ scene, dark }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      padding: 34,
      background: dark
        ? 'linear-gradient(135deg, rgba(86,207,225,0.18), rgba(124,92,255,0.14))'
        : 'linear-gradient(135deg, rgba(244,189,74,0.22), rgba(232,138,168,0.2))',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 20,
    }}
  >
    <div
      style={{
        fontSize: 28,
        fontWeight: 800,
        opacity: 0.68,
      }}
    >
      CAPTURE SLOT
    </div>
    <div
      style={{
        fontSize: 46,
        lineHeight: 1.04,
        fontWeight: 850,
        maxWidth: 500,
      }}
    >
      {scene.captureDirection}
    </div>
  </div>
);

const SlotList: React.FC<{ scene: ColosseumScene; dark: boolean }> = ({
  scene,
  dark,
}) => (
  <div style={{ marginTop: 24 }}>
    <Label>Asset Slots</Label>
    <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
      {scene.slots.map((slot) => (
        <div
          key={slot.id}
          style={{
            borderRadius: 18,
            padding: '16px 18px',
            border: `1px solid ${dark ? palette.darkLine : palette.line}`,
            background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.7)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 23, fontWeight: 800 }}>{slot.label}</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 850,
                color: '#101122',
                background: slotColor[slot.status],
                borderRadius: 999,
                padding: '5px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              {slot.status}
            </div>
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.28, opacity: 0.74 }}>
            {slot.kind} - {slot.notes}
          </div>
          {slot.path ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 15,
                lineHeight: 1.2,
                opacity: 0.56,
              }}
            >
              {slot.path}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

const ProgressBar: React.FC<{
  current: number;
  total: number;
  kind: ColosseumVideoKind;
}> = ({ current, total, kind }) => (
  <div
    style={{
      position: 'absolute',
      left: 72,
      right: 72,
      bottom: 42,
      height: 9,
      borderRadius: 999,
      background:
        kind === 'pitch' ? 'rgba(27, 22, 48, 0.12)' : 'rgba(255,255,255,0.16)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${(current / total) * 100}%`,
        height: '100%',
        borderRadius: 999,
        background:
          kind === 'pitch'
            ? `linear-gradient(90deg, ${palette.violet}, ${palette.rose}, ${palette.gold})`
            : `linear-gradient(90deg, ${palette.cyan}, ${palette.violet})`,
      }}
    />
  </div>
);

const BackgroundTexture: React.FC<{ dark: boolean }> = ({ dark }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        width: 620,
        height: 620,
        right: -180,
        top: -240,
        borderRadius: '50%',
        background: dark
          ? 'rgba(86,207,225,0.13)'
          : 'rgba(244,189,74,0.26)',
        filter: 'blur(90px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 480,
        height: 480,
        left: -150,
        bottom: -190,
        borderRadius: '50%',
        background: dark
          ? 'rgba(124,92,255,0.13)'
          : 'rgba(232,138,168,0.22)',
        filter: 'blur(80px)',
      }}
    />
  </AbsoluteFill>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 15,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: 0,
      opacity: 0.55,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{
  children: React.ReactNode;
  dark: boolean;
  color?: string;
}> = ({ children, dark, color }) => (
  <div
    style={{
      padding: '9px 14px',
      borderRadius: 999,
      background: color ?? (dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.72)'),
      color: color ? '#111222' : 'inherit',
      border: `1px solid ${dark ? palette.darkLine : palette.line}`,
      fontSize: 18,
      fontWeight: 750,
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; dark: boolean }> = ({
  children,
  dark,
}) => (
  <div
    style={{
      padding: '13px 16px',
      borderRadius: 14,
      maxWidth: 520,
      background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.68)',
      border: `1px solid ${dark ? palette.darkLine : palette.line}`,
      fontSize: 20,
      lineHeight: 1.22,
      fontWeight: 650,
    }}
  >
    {children}
  </div>
);

const paragraphStyle = (kind: ColosseumVideoKind, fontSize: number) => ({
  margin: '8px 0 0',
  fontSize,
  lineHeight: 1.22,
  color: kind === 'pitch' ? palette.ink : palette.cream,
});

export const COLOSSEUM_STORYBOARD_SIZE = {
  width: COLOSSEUM_WIDTH,
  height: COLOSSEUM_HEIGHT,
};
