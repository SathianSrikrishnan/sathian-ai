'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DrawingCanvasV2 from '@/components/toothfairy/app/drawing-canvas-v2';
import { getStoryById } from '@/data/stories';

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const STORY_CONTEXT_KEY = 'tfn-story-context';
const LATEST_TRADITION_KEY = 'toothfairy-latest-tradition';

type StoryContext = {
  traditionSlug: string;
  storyId: string;
  storyTitle: string;
};

export default function DrawPage() {
  const router = useRouter();
  const [storyContext, setStoryContext] = useState<StoryContext | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);

  // Read story context on mount. We never trust URL params alone because
  // Phantom mobile deep-link redirects strip query strings — localStorage
  // is the source of truth.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORY_CONTEXT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoryContext;
      if (!parsed?.traditionSlug || !parsed?.storyTitle) return;
      setStoryContext(parsed);
      // Pipe the tradition into the enhance pipeline too so the fairy
      // enhancement picks up the cultural flavor automatically.
      try {
        localStorage.setItem(LATEST_TRADITION_KEY, parsed.traditionSlug);
      } catch {
        // ignore
      }
      // Look up accent color from story metadata
      const story = getStoryById(parsed.traditionSlug);
      if (story) setAccentColor(story.colors?.accent || story.color);
    } catch {
      // Corrupt JSON — ignore and proceed without a banner
    }
  }, []);

  const handleDone = (dataUrl: string) => {
    try {
      localStorage.setItem(LATEST_DRAWING_KEY, dataUrl);
    } catch {
      // localStorage may be unavailable in private browsing — navigate anyway
    }
    router.push('/toothfairy/app/draw/preview');
  };

  const handleBack = () => {
    router.push('/toothfairy/app');
  };

  return (
    <>
      {storyContext && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: accentColor
              ? `${accentColor}22`
              : 'oklch(72% 0.145 75 / 0.15)',
            borderBottom: `1px solid ${accentColor || 'oklch(72% 0.145 75 / 0.35)'}`,
            color: 'oklch(30% 0.035 65)',
            fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            fontSize: 13,
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor || 'oklch(72% 0.145 75)',
            }}
          />
          <span>
            Drawing a tooth for{' '}
            <strong style={{ fontWeight: 600 }}>
              {storyContext.storyTitle}
            </strong>
          </span>
        </div>
      )}
      <DrawingCanvasV2 onDone={handleDone} onBack={handleBack} />
    </>
  );
}
