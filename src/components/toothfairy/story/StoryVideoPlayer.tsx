'use client'

import { Player } from '@remotion/player'
import { StoryComposition, storyTotalFrames } from '@/remotion/StoryComposition'
import { StoryConfig } from '@/data/stories/types'
import { FPS } from '@/remotion/styles'

interface StoryVideoPlayerProps {
  story: StoryConfig
  /** Aspect ratio: 'landscape' (16:9) or 'vertical' (9:16) */
  aspect?: 'landscape' | 'vertical'
  /** Auto-play on mount */
  autoPlay?: boolean
  /** Show player controls */
  controls?: boolean
  /** CSS class for container */
  className?: string
}

export default function StoryVideoPlayer({
  story,
  aspect = 'vertical',
  autoPlay = false,
  controls = true,
  className = '',
}: StoryVideoPlayerProps) {
  const isVertical = aspect === 'vertical'
  const width = isVertical ? 1080 : 1920
  const height = isVertical ? 1920 : 1080

  return (
    <div className={`w-full ${className}`}>
      <Player
        component={StoryComposition}
        inputProps={{ story }}
        durationInFrames={storyTotalFrames(story)}
        compositionWidth={width}
        compositionHeight={height}
        fps={FPS}
        autoPlay={autoPlay}
        controls={controls}
        loop={false}
        style={{
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      />
    </div>
  )
}
