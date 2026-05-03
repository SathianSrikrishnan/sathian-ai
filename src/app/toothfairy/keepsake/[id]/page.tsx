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
  ink:        '#11234a',
  inkSoft:    '#334260',
  inkMuted:   '#6b7280',
  purple:     '#6d45a8',
  gold:       'oklch(72% 0.145 75)',
  goldSoft:   'oklch(72% 0.145 75 / 0.12)',
  border:     'oklch(88% 0.015 75)',
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
    // Entrance fade: warm enough to feel celebratory without slowing the page.
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
        background:
          'radial-gradient(circle at 84% 4%, rgba(216,164,60,0.16), transparent 16rem), radial-gradient(circle at 14% 0%, rgba(109,69,168,0.10), transparent 14rem), ' + c.creamDeep,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')}), transform 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')})`,
      }}
    >
      <div className="max-w-3xl mx-auto px-5 py-10 md:py-16">
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
            <section className="text-center max-w-xl mx-auto mb-8">
              <p
                className="text-xs uppercase mb-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: c.gold,
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                }}
              >
                Family keepsake
              </p>
              <h1
                className="text-3xl md:text-5xl leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: c.ink,
                  fontWeight: 600,
                }}
              >
                {state.data.childName}&apos;s tooth story
              </h1>
              <p
                className="mt-4 text-base md:text-lg"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: c.inkSoft,
                  lineHeight: 1.6,
                }}
              >
                A tiny milestone saved as a memory, a family link, and the
                beginning of a parent-controlled Smile Fund.
              </p>
            </section>

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

            <div className="max-w-md mx-auto mb-6">
              <SmileFundPanel data={state.data} milestoneId={id} />
            </div>

            <div className="max-w-md mx-auto">
              <p
                className="text-center text-xs uppercase mb-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: c.inkMuted,
                  letterSpacing: '0.16em',
                  fontWeight: 600,
                }}
              >
                Send the family link
              </p>
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
              color: 'var(--tfn-ink-muted)',
              letterSpacing: '0.05em',
            }}
          >
            Made with love on{' '}
            <Link
              href="/toothfairy"
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
        color: c.inkSoft,
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
        Loading keepsake...
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

function SmileFundPanel({
  data,
  milestoneId,
}: {
  data: KeepsakeData;
  milestoneId: string;
}) {
  const lockedCount = data.deposits.filter((deposit) => deposit.locked).length;
  const contributionCount = data.deposits.length;
  const total =
    data.totalEscrowed ??
    data.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);

  return (
    <section
      className="rounded-lg p-6 md:p-7"
      style={{
        background: c.cream,
        border: `1px solid ${c.border}`,
        boxShadow: '0 18px 40px oklch(30% 0.035 65 / 0.08)',
      }}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p
            className="text-xs uppercase mb-2"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.inkMuted,
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            Smile Fund
          </p>
          <h2
            className="text-3xl leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: c.ink,
              fontWeight: 600,
            }}
          >
            {total.toFixed(total >= 1 ? 2 : 3)} SOL
          </h2>
          <p
            className="mt-2 text-sm"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.inkSoft,
              lineHeight: 1.5,
            }}
          >
            {contributionCount > 0
              ? `${contributionCount} family gift${contributionCount === 1 ? '' : 's'} saved for this milestone.`
              : 'No family gifts yet. Invite someone to add the first one.'}
          </p>
        </div>
        <div
          className="rounded-lg px-3 py-2 text-center"
          style={{ background: c.goldSoft, color: c.gold }}
        >
          <div
            className="text-xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            {lockedCount}
          </div>
          <div className="text-[10px] uppercase" style={{ letterSpacing: '0.12em' }}>
            locked
          </div>
        </div>
      </div>

      <Link
        href={`/toothfairy/app/gift/${milestoneId}`}
        className="mt-6 flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold"
        style={{
          background: c.purple,
          color: c.cream,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          boxShadow: '0 10px 26px rgba(109, 69, 168, 0.22)',
        }}
      >
        Add a gift to the Smile Fund
      </Link>

      <p
        className="mt-3 text-center text-xs"
        style={{
          fontFamily: 'var(--font-body)',
          color: c.inkMuted,
          lineHeight: 1.5,
        }}
      >
        Card gifts are being connected. Wallet gifts work now for controlled testing.
      </p>
    </section>
  );
}

function ErrorState() {
  return (
    <div
      className="w-full max-w-md mx-auto rounded-lg px-8 py-16 text-center"
      style={{
        background: c.cream,
        border: '1px solid oklch(88% 0.015 75)',
        fontFamily: 'var(--font-body)',
        color: c.inkSoft,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          color: c.ink,
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
        href="/toothfairy"
        className="inline-block px-6 py-3 rounded-full font-semibold"
        style={{
          background: c.gold,
          color: 'oklch(98% 0.005 80)',
          boxShadow: '0 6px 18px oklch(72% 0.145 75 / 0.28)',
          textDecoration: 'none',
        }}
      >
        Learn about the network
      </Link>
    </div>
  );
}
