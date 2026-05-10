import React from 'react';
import { Composition, Folder, registerRoot } from 'remotion';
import { StoryComposition, storyTotalFrames } from './StoryComposition';
import { ALL_STORIES } from '../data/stories';
import { FPS } from './styles';
import {
  TandaRitualHero,
  TANDA_RITUAL_DURATION_FRAMES,
  TANDA_RITUAL_FPS,
  TANDA_RITUAL_HEIGHT,
  TANDA_RITUAL_WIDTH,
} from './TandaRitualHero';
import {
  TandaHeroIntegratedRitual,
  TANDA_HERO_INTEGRATED_DURATION_FRAMES,
  TANDA_HERO_INTEGRATED_FPS,
  TANDA_HERO_INTEGRATED_HEIGHT,
  TANDA_HERO_INTEGRATED_WIDTH,
} from './TandaHeroIntegratedRitual';
import {
  COLOSSEUM_FPS,
  COLOSSEUM_HEIGHT,
  COLOSSEUM_WIDTH,
  framesForStoryboard,
} from './colosseum/storyboards';
import {
  ColosseumPitchStoryboard,
  ColosseumTechnicalStoryboard,
} from './colosseum/ColosseumStoryboard';

const RemotionRoot: React.FC = () => {
  return (
    <>
      {ALL_STORIES.filter((story) => story.available).map((story) => (
        <React.Fragment key={story.id}>
          <Composition
            id={`Story-${story.id}`}
            component={StoryComposition}
            durationInFrames={storyTotalFrames(story)}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{ story }}
          />
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

      <Composition
        id="TandaRitualHero"
        component={TandaRitualHero}
        durationInFrames={TANDA_RITUAL_DURATION_FRAMES}
        fps={TANDA_RITUAL_FPS}
        width={TANDA_RITUAL_WIDTH}
        height={TANDA_RITUAL_HEIGHT}
      />
      <Composition
        id="TandaHeroIntegratedRitual"
        component={TandaHeroIntegratedRitual}
        durationInFrames={TANDA_HERO_INTEGRATED_DURATION_FRAMES}
        fps={TANDA_HERO_INTEGRATED_FPS}
        width={TANDA_HERO_INTEGRATED_WIDTH}
        height={TANDA_HERO_INTEGRATED_HEIGHT}
      />

      <Folder name="Colosseum">
        <Composition
          id="Colosseum-Pitch-Storyboard"
          component={ColosseumPitchStoryboard}
          durationInFrames={framesForStoryboard('pitch')}
          fps={COLOSSEUM_FPS}
          width={COLOSSEUM_WIDTH}
          height={COLOSSEUM_HEIGHT}
        />
        <Composition
          id="Colosseum-Technical-Storyboard"
          component={ColosseumTechnicalStoryboard}
          durationInFrames={framesForStoryboard('technical')}
          fps={COLOSSEUM_FPS}
          width={COLOSSEUM_WIDTH}
          height={COLOSSEUM_HEIGHT}
        />
      </Folder>
    </>
  );
};

registerRoot(RemotionRoot);
