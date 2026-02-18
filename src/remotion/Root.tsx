import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { ToothFairyVideo } from './ToothFairyVideo';
import { TOTAL_FRAMES_V3, FPS } from './styles';

const RemotionRoot: React.FC = () => {
  return (
    <>
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
    </>
  );
};

registerRoot(RemotionRoot);
