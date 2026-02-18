import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { staticFile } from 'remotion';
import { SCENE_V3, TOTAL_FRAMES_V3, COLORS } from './styles';
import { ImageScene } from './scenes/ImageScene';
import { VideoScene } from './scenes/VideoScene';
import { CodeOverlayScene } from './scenes/CodeOverlayScene';
import { TitleCardScene } from './scenes/TitleCardScene';

const T = SCENE_V3.transition;

export const ToothFairyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#050510' }}>
      {/* ── SOUNDTRACK ────────────────────────────────────────────────── */}
      <Audio
        src={staticFile('tfn-soundtrack.mp3')}
        volume={(f) => {
          // Fade in over first 2 seconds
          const fadeIn = interpolate(f, [0, 2 * fps], [0, 0.7], { extrapolateRight: 'clamp' });
          // Fade out over last 3 seconds
          const fadeOut = interpolate(f, [TOTAL_FRAMES_V3 - 3 * fps, TOTAL_FRAMES_V3], [0.7, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return Math.min(fadeIn, fadeOut);
        }}
      />

      <TransitionSeries>
        {/* ── Scene 01: Fairy Enters Bedroom (Veo) — OPENING ─────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s01_fairyEnters}>
          <VideoScene video="v2-storyboard/veo/veo-scene02-fairy-enters.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 02: Fairy Lifts Tooth (Veo) ──────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s02_fairyLifts}>
          <VideoScene
            video="v2-storyboard/veo/veo-scene03-fairy-lifts-tooth.mp4"
            title="Each tooth lost is a milestone"
            textPosition="top"
            textDelay={1.5}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 03: Fairy Ascends (Veo) ──────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s03_fairyAscends}>
          <VideoScene video="v2-storyboard/veo/veo-scene04-fairy-ascends.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 04: Fairy at Station — Transformation (Veo) ──────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s04_fairyStation}>
          <VideoScene
            video="v2-storyboard/veo/veo-scene05-fairy-station.mp4"
            title="From milestone to data"
            textPosition="bottom"
            textDelay={2}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 05: Processing Chamber (Veo) ─────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s05_processing}>
          <VideoScene video="v2-storyboard/veo/veo-scene06-processing.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 06: Blockchain Code + VERIFIED Stamp (Still) ─────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s06_blockchainCode}>
          <CodeOverlayScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 07: Two Streams Split (Veo) ─────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s07_twoStreams}>
          <VideoScene
            video="v2-storyboard/veo/veo-scene08-two-streams.mp4"
            title="One moment. Two paths."
            subtitle="NFT keepsake  ·  Crypto payment"
            textPosition="bottom"
            textDelay={1}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 08: Parent Receives NFT (Still) ──────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s08_parentNFT}>
          <ImageScene
            image="v2-storyboard/compositions/comp-04-parent-receives-nft-v2.png"
            textPosition="bottom"
            zoomFrom={1.05}
            zoomTo={1.0}
            panX={-5}
            panY={3}
            vignette={0.3}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 09: Child in Second Home (Still) ─────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s09_childAsset}>
          <ImageScene
            image="v2-storyboard/characters/char-02-girl-sleeping-b.png"
            title="Your child's first digital asset"
            textPosition="bottom"
            zoomFrom={1.0}
            zoomTo={1.06}
            panX={3}
            panY={-5}
            textDelay={1.2}
            vignette={0.35}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 10: Finale — Let Image Breathe (Still, NO TEXT) ──── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s10_finale}>
          <ImageScene
            image="v2-storyboard/compositions/comp-05-finale-v2.png"
            zoomFrom={1.0}
            zoomTo={1.04}
            panX={0}
            panY={0}
            vignette={0.35}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 11: Title Card ───────────────────────────────────── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_V3.s11_titleCard}>
          <TitleCardScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
