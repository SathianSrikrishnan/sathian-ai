'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldTint:   'oklch(72% 0.145 75 / 0.25)',
  border:     'oklch(88% 0.015 75)',
};

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const LATEST_ENHANCED_KEY = 'toothfairy-latest-enhanced';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function generateSparkles(count: number, width: number, height: number): Sparkle[] {
  const result: Sparkle[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 600,
    });
  }
  return result;
}

export default function DrawResultPage() {
  const router = useRouter();
  const [original, setOriginal] = useState<string | null>(null);
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== 'undefined' && window.matchMedia) {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    try {
      setOriginal(localStorage.getItem(LATEST_DRAWING_KEY));
      setEnhanced(localStorage.getItem(LATEST_ENHANCED_KEY));
    } catch {
      // Private browsing
    }
  }, []);

  // Trigger reveal animation
  useEffect(() => {
    if (!enhanced || !hydrated) return;
    if (reducedMotion.current) {
      setRevealed(true);
      setShowButtons(true);
      return;
    }
    const t1 = setTimeout(() => {
      setRevealed(true);
      const frame = frameRef.current;
      if (frame) {
        setSparkles(generateSparkles(10, frame.offsetWidth, frame.offsetHeight));
      }
    }, 200);
    const t2 = setTimeout(() => setShowButtons(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [enhanced, hydrated]);

  const handleKeep = () => {
    try {
      localStorage.setItem('toothfairy-final-drawing', enhanced || original || '');
    } catch {
      // ignore
    }
    router.push('/toothfairy/app');
  };

  if (!hydrated) return null;

  if (!original || !enhanced) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center px-5" style={{ background: c.creamDeep }}>
        <div className="max-w-md w-full rounded-3xl px-8 py-12 text-center" style={{ background: c.cream, border: `1px solid ${c.border}` }}>
          <p style={{ fontFamily: 'var(--font-display)', color: c.brown, fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem' }}>No enhanced drawing found</p>
          <button type="button" onClick={() => router.push('/toothfairy/app/draw')} className="px-6 py-3 rounded-full" style={{ background: c.gold, color: c.cream, fontFamily: 'var(--font-body)', fontWeight: 500, border: 'none' }}>Start drawing</button>
        </div>
      </main>
    );
  }

  const isUrl = enhanced.startsWith('http');

  return (
    <main className="min-h-screen w-full" style={{ background: c.creamDeep }}>
      <div className="max-w-md mx-auto px-5 py-12">
        <header className="text-center mb-8">
          <p className="text-xs uppercase mb-2" style={{ fontFamily: 'var(--font-body)', color: c.gold, letterSpacing: '0.2em', fontWeight: 500 }}>
            Tooth Fairy Network
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', color: c.brown, fontSize: '1.75rem', fontWeight: 500 }}>
            Look what the fairy made
          </h1>
        </header>

        {/* Reveal frame */}
        <div
          ref={frameRef}
          className="rounded-2xl overflow-hidden mb-8 relative"
          style={{
            background: c.cream,
            border: `1px solid ${c.goldTint}`,
            boxShadow: '0 12px 40px oklch(30% 0.035 65 / 0.1)',
            aspectRatio: '1 / 1',
          }}
        >
          {/* Original (underneath) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={original}
            alt="Your original drawing"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: c.cream,
              zIndex: 1,
            }}
          />

          {/* Enhanced (on top, crossfade) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isUrl ? enhanced : original}
            alt="Enhanced by the tooth fairy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: c.cream,
              zIndex: showOriginal ? 0 : 2,
              opacity: revealed && !showOriginal ? 1 : 0,
              transition: reducedMotion.current
                ? 'opacity 0.1s'
                : 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Sparkle particles */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute pointer-events-none"
              style={{
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                zIndex: 3,
                color: c.gold,
                animation: `tfnRevealSparkle 1s cubic-bezier(0.16, 1, 0.3, 1) ${s.delay}ms forwards`,
                opacity: 0,
                filter: 'drop-shadow(0 0 4px oklch(72% 0.145 75 / 0.6))',
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none">
                <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="currentColor" />
              </svg>
            </span>
          ))}

          <style jsx>{`
            @keyframes tfnRevealSparkle {
              0% { opacity: 0; transform: scale(0.3); }
              30% { opacity: 1; transform: scale(1.3); }
              100% { opacity: 0; transform: scale(0.8) translateY(-12px); }
            }
          `}</style>
        </div>

        {/* See original toggle */}
        <div className="text-center mb-6">
          <button
            type="button"
            onPointerDown={() => setShowOriginal(true)}
            onPointerUp={() => setShowOriginal(false)}
            onPointerLeave={() => setShowOriginal(false)}
            className="text-sm underline"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.brownMuted,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Hold to see original
          </button>
        </div>

        {/* Buttons (slide up after reveal) */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? 'translateY(0)' : 'translateY(16px)',
            transition: reducedMotion.current
              ? 'opacity 0.1s'
              : 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <button
            type="button"
            onClick={handleKeep}
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 64,
              background: c.gold,
              color: c.cream,
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 500,
              border: 'none',
              boxShadow: '0 4px 24px oklch(72% 0.145 75 / 0.2)',
            }}
          >
            Keep this one
          </button>
          <button
            type="button"
            onClick={() => router.push('/toothfairy/app/draw/preview')}
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 56,
              background: 'transparent',
              color: c.brown,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              border: `1px solid ${c.border}`,
            }}
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
