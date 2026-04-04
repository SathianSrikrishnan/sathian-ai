import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { ToothFairyVideo } from './ToothFairyVideo';
import { StoryComposition, storyTotalFrames } from './StoryComposition';
import { ALL_STORIES } from '../data/stories';
import { TOTAL_FRAMES_V3, FPS } from './styles';

const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Story Videos (one per tradition) ── */}
      {ALL_STORIES.filter((s) => s.available).map((story) => (
        <React.Fragment key={story.id}>
          {/* Landscape (16:9) */}
          <Composition
            id={`Story-${story.id}`}
            component={StoryComposition}
            durationInFrames={storyTotalFrames(story)}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{ story }}
          />
          {/* Vertical (9:16 — mobile/reels) */}
          <Composition
            id={`Story-${story.id}-Vertical`}
            component={StoryComposition}
            durationInFrames={storyTotalFrames(story)}
            fps={FPS}
            width={1080}
            height={1920}
            defaultProps={{ story }}
          />
        </React.Fragment>
      ))}

      {/* ── Marketing Video (existing — uses TransitionSeries, currently broken) ── */}
      {/*
      <Composition
        id="ToothFairyNetwork"
        component={ToothFairyVideo}
        durationInFrames={TOTAL_FRAMES_V3}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="ToothFairyNetwork-Square"
        component={ToothFairyVideo}
        durationInFrames={TOTAL_FRAMES_V3}
        fps={FPS}
        width={1080}
        height={1080}
      />
      <Composition
        id="ToothFairyNetwork-Vertical"
        component={ToothFairyVideo}
        durationInFrames={TOTAL_FRAMES_V3}
        fps={FPS}
        width={1080}
        height={1920}
      />
      */}
    </>
  );
};

registerRoot(RemotionRoot);
