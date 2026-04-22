'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { KeepsakeData } from '@/lib/toothfairy/keepsake-data';
import { KeepsakeCard } from '@/components/toothfairy/keepsake/keepsake-card';
import { ShareButtons } from '@/components/toothfairy/keepsake/share-buttons';
import { motionSpringFast } from '@/components/toothfairy/tokens';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
};

type FetchState =
  | { kind: 'loading' }
  | { kind: 'success'; data: KeepsakeData }
  | { kind: 'error' };

export default function KeepsakePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [state, setState] = useState<FetchState>({ kind: 'loading' });
  const [origin, setOrigin] = useState<string>('');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    // Entrance fade — awww-moment tuning: springy, not abrupt
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setState({ kind: 'error' });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/toothfairy/keepsake/${id}`);
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: 'error' });
          return;
        }
        const data: KeepsakeData = await res.json();
        if (data.mintDate) data.mintDate = new Date(data.mintDate);
        setState({ kind: 'success', data });
      } catch {
        if (!cancelled) setState({ kind: 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: c.creamDeep,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')}), transform 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')})`,
      }}
    >
      <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">
        {/* Wordmark */}
        <header className="text-center pb-10">
          <p
            className="text-xs uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.gold,
              letterSpacing: '0.2em',
              fontWeight: 500,
            }}
          >
            Tooth Fairy Network
          </p>
        </header>

        {state.kind === 'loading' && <LoadingState />}

        {state.kind === 'error' && <ErrorState />}

        {state.kind === 'success' && (
          <>
            <div className="mb-10">
              <KeepsakeCard
                childName={state.data.childName}
                toothType={state.data.toothType}
                storyOrigin={state.data.storyOrigin}
                drawingUrl={state.data.drawingUrl}
                smilePhotoUrl={state.data.smilePhotoUrl}
                mintDate={state.data.mintDate}
                deposits={state.data.deposits}
                message={state.data.message}
                toothStory={state.data.toothStory}
              />
            </div>

            <div className="max-w-md mx-auto">
              <ShareButtons
                keepsakeUrl={origin ? `${origin}/toothfairy/keepsake/${id}` : ''}
                childName={state.data.childName}
              />
            </div>
          </>
        )}

        <footer className="text-center pt-16 pb-4">
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.brownMuted,
              letterSpacing: '0.05em',
            }}
          >
            Made with love on{' '}
            <Link
              href="/toothfairy/concept-b"
              style={{ color: c.gold, textDecoration: 'none' }}
            >
              Tooth Fairy Network
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div
      className="w-full max-w-md mx-auto py-24 text-center"
      style={{
        fontFamily: 'var(--font-display)',
        color: c.brownSoft,
        fontSize: '1.125rem',
        fontStyle: 'italic',
      }}
    >
      <span
        className="inline-block"
        style={{
          animation: 'keepsakePulse 2.2s ease-in-out infinite',
        }}
      >
        Loading keepsake…
      </span>
      <style jsx>{`
        @keyframes keepsakePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      className="w-full max-w-md mx-auto rounded-3xl px-8 py-16 text-center"
      style={{
        background: c.cream,
        border: '1px solid oklch(88% 0.015 75)',
        fontFamily: 'var(--font-body)',
        color: c.brownSoft,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          color: c.brown,
          fontSize: '1.5rem',
          fontWeight: 500,
          marginBottom: '1rem',
          lineHeight: 1.3,
        }}
      >
        This keepsake is still on its way.
      </p>
      <p className="mb-8" style={{ lineHeight: 1.6 }}>
        The tooth fairy may not have visited yet, or this link may have expired.
      </p>
      <Link
        href="/toothfairy/concept-b"
        className="inline-block px-6 py-3 rounded-full"
        style={{
          background: c.gold,
          color: c.cream,
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Learn about the network
      </Link>
    </div>
  );
}
