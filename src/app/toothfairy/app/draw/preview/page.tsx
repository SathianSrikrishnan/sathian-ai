'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  callEnhance,
  type EnhanceCharm,
  type EnhanceTradition,
} from '@/lib/toothfairy/enhance-client';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldSoft:   'oklch(72% 0.145 75 / 0.15)',
  goldTint:   'oklch(72% 0.145 75 / 0.25)',
  border:     'oklch(88% 0.015 75)',
};

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const LATEST_ENHANCED_KEY = 'toothfairy-latest-enhanced';
const LATEST_TRADITION_KEY = 'toothfairy-latest-tradition';

type CharmDef = { key: EnhanceCharm; icon: string; label: string };
const CHARMS: CharmDef[] = [
  { key: 'sparkle', icon: '✨', label: 'Sparkle' },
  { key: 'glow', icon: '🌟', label: 'Glow' },
  { key: 'magic', icon: '🌀', label: 'Magic' },
];

const LOADING_MESSAGES = [
  'The fairy is working her magic…',
  'Sprinkling a little fairy dust…',
  'Almost ready…',
  "This one's taking a little longer than usual\u2026",
];

type EnhanceState =
  | { kind: 'idle' }
  | { kind: 'loading'; startedAt: number }
  | { kind: 'error'; message: string; retryable: boolean }
  | { kind: 'success' };

export default function DrawPreviewPage() {
  const router = useRouter();
  const [drawing, setDrawing] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [selectedCharms, setSelectedCharms] = useState<Set<EnhanceCharm>>(
    new Set()
  );
  const [enhanceState, setEnhanceState] = useState<EnhanceState>({
    kind: 'idle',
  });
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    setHydrated(true);
    try {
      const fromLocal = localStorage.getItem(LATEST_DRAWING_KEY);
      const fromSession = sessionStorage.getItem(LATEST_DRAWING_KEY);
      setDrawing(fromLocal || fromSession || null);
    } catch {
      try { setDrawing(sessionStorage.getItem(LATEST_DRAWING_KEY)); } catch { setDrawing(null); }
    }
  }, []);

  // Rotate loading messages
  useEffect(() => {
    if (enhanceState.kind !== 'loading') return;
    const timer = setInterval(() => {
      setLoadingMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [enhanceState.kind]);

  const toggleCharm = (charm: EnhanceCharm) => {
    setSelectedCharms((prev) => {
      const next = new Set(prev);
      if (next.has(charm)) next.delete(charm);
      else next.add(charm);
      return next;
    });
  };

  const handleEnhance = async () => {
    if (!drawing || !drawing.startsWith('data:image/')) {
      setEnhanceState({
        kind: 'error',
        message: 'Your drawing was lost. Please go back and redraw it.',
        retryable: false,
      });
      return;
    }

    const tradition: EnhanceTradition = (() => {
      try {
        return (localStorage.getItem(LATEST_TRADITION_KEY) as EnhanceTradition) || 'default';
      } catch {
        return 'default';
      }
    })();

    setEnhanceState({ kind: 'loading', startedAt: Date.now() });
    setLoadingMsgIdx(0);

    const outcome = await callEnhance({
      drawingDataUrl: drawing,
      tradition,
      charms: Array.from(selectedCharms),
    });

    if (outcome.ok) {
      try {
        localStorage.setItem(LATEST_ENHANCED_KEY, outcome.result.enhancedImageUrl);
      } catch {
        // localStorage might be full
      }
      setEnhanceState({ kind: 'success' });
      router.push('/toothfairy/app/draw/result');
    } else {
      const messages: Record<string, string> = {
        rate_limit: `Take a break! You can enhance again in ${outcome.retryAfter ?? 'a few'} seconds.`,
        moderation_block:
          'The fairy dust is still settling — try again in a moment.',
        service_unavailable: 'The fairy network is busy. Please try again.',
        invalid_input: 'Something went wrong with the drawing. Try redoing it.',
        network: 'Check your internet connection and try again.',
      };
      setEnhanceState({
        kind: 'error',
        message: messages[outcome.error] || messages.service_unavailable,
        retryable: outcome.error !== 'invalid_input',
      });
    }
  };

  const continueWithOriginal = () => {
    if (!drawing) return;
    try {
      localStorage.setItem(LATEST_ENHANCED_KEY, drawing);
      localStorage.setItem(LATEST_DRAWING_KEY, drawing);
    } catch {
      // localStorage might be full or blocked; the main app can still start fresh.
    }
    router.push('/toothfairy/app');
  };

  if (!hydrated) return null;

  if (!drawing) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center px-5"
        style={{ background: c.creamDeep }}
      >
        <div className="max-w-md w-full rounded-3xl px-8 py-12 text-center" style={{ background: c.cream, border: `1px solid ${c.border}` }}>
          <p style={{ fontFamily: 'var(--font-display)', color: c.brown, fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem' }}>No drawing yet</p>
          <button type="button" onClick={() => router.push('/toothfairy/app/draw')} className="px-6 py-3 rounded-full" style={{ background: c.gold, color: c.cream, fontFamily: 'var(--font-body)', fontWeight: 500, border: 'none' }}>Start drawing</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full" style={{ background: c.creamDeep }}>
      <div className="max-w-md mx-auto px-5 py-12">
        <header className="text-center mb-8">
          <p className="text-xs uppercase mb-2" style={{ fontFamily: 'var(--font-body)', color: c.gold, letterSpacing: '0.2em', fontWeight: 500 }}>
            Your drawing
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', color: c.brown, fontSize: '1.75rem', fontWeight: 500 }}>
            Look what you made
          </h1>
        </header>

        {/* Drawing in frame */}
        <div
          className="rounded-2xl overflow-hidden mb-8 relative"
          style={{
            background: c.cream,
            border: `1px solid ${c.goldTint}`,
            boxShadow: enhanceState.kind === 'loading'
              ? `0 0 0 3px ${c.gold}, 0 0 40px 8px oklch(72% 0.145 75 / 0.35)`
              : '0 12px 40px oklch(30% 0.035 65 / 0.1)',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={drawing} alt="Your drawing" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1 / 1', objectFit: 'contain', background: c.cream }} />

          {/* Loading shimmer overlay */}
          {enhanceState.kind === 'loading' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, oklch(72% 0.145 75 / 0.12) 50%, transparent 100%)',
                  animation: 'tfnShimmer 2.5s ease-in-out infinite',
                }}
              />
              <style jsx>{`
                @keyframes tfnShimmer {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(50%); }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Loading state */}
        {enhanceState.kind === 'loading' && (
          <div className="text-center mb-8">
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                color: c.brownSoft,
                fontSize: '1.1rem',
                animation: 'keepsakePulse 2.2s ease-in-out infinite',
              }}
            >
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
            <style jsx>{`
              @keyframes keepsakePulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* Error state */}
        {enhanceState.kind === 'error' && (
          <div className="text-center mb-8 rounded-2xl px-6 py-5" style={{ background: c.cream, border: `1px solid ${c.border}` }}>
            <p className="mb-4" style={{ fontFamily: 'var(--font-body)', color: c.brownSoft, lineHeight: 1.6 }}>{enhanceState.message}</p>
            {enhanceState.retryable && (
              <button type="button" onClick={handleEnhance} className="px-6 py-3 rounded-full" style={{ background: c.gold, color: c.cream, fontFamily: 'var(--font-body)', fontWeight: 500, border: 'none' }}>Try again</button>
            )}
            <button type="button" onClick={continueWithOriginal} className="px-6 py-3 rounded-full" style={{ marginTop: '0.75rem', background: 'transparent', color: c.brown, fontFamily: 'var(--font-body)', fontWeight: 500, border: `1px solid ${c.border}` }}>Continue with original</button>
          </div>
        )}

        {/* Charms + actions (hide while loading) */}
        {enhanceState.kind !== 'loading' && enhanceState.kind !== 'success' && (
          <>
            {/* Charm picker */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {CHARMS.map((charm) => {
                const active = selectedCharms.has(charm.key);
                return (
                  <button
                    key={charm.key}
                    type="button"
                    onClick={() => toggleCharm(charm.key)}
                    aria-pressed={active}
                    aria-label={charm.label}
                    className="rounded-3xl active:scale-95 flex flex-col items-center justify-center gap-1"
                    style={{
                      width: 80,
                      height: 80,
                      background: active ? c.goldSoft : c.cream,
                      border: `2px solid ${active ? c.gold : c.border}`,
                      fontSize: 28,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    <span>{charm.icon}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        color: active ? c.gold : c.brownMuted,
                        fontWeight: 500,
                      }}
                    >
                      {charm.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleEnhance}
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
                Enhance
              </button>
              <button
                type="button"
                onClick={continueWithOriginal}
                className="w-full rounded-full active:scale-[0.98]"
                style={{
                  height: 56,
                  background: c.cream,
                  color: c.brown,
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 500,
                  border: `1px solid ${c.border}`,
                }}
              >
                Continue with original
              </button>
              <button
                type="button"
                onClick={() => router.push('/toothfairy/app/draw')}
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
                Redo
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
