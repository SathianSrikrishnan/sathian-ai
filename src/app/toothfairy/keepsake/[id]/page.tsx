'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { KeepsakeData } from '@/lib/toothfairy/keepsake-data';
import { KeepsakeCard } from '@/components/toothfairy/keepsake/keepsake-card';
import { ShareButtons } from '@/components/toothfairy/keepsake/share-buttons';
import { motionSpringFast } from '@/components/toothfairy/tokens';

const c = {
  cream: 'oklch(97.5% 0.01 80)',
  creamDeep: 'oklch(95% 0.015 75)',
  paper: 'oklch(99% 0.006 82 / 0.82)',
  ink: '#11234a',
  inkSoft: '#334260',
  inkMuted: '#6b7280',
  purple: '#6d45a8',
  purpleSoft: 'rgba(109, 69, 168, 0.10)',
  teal: '#178f7b',
  tealSoft: 'rgba(23, 143, 123, 0.10)',
  gold: 'oklch(72% 0.145 75)',
  goldHover: 'oklch(62% 0.13 72)',
  goldSoft: 'oklch(72% 0.145 75 / 0.12)',
  border: 'oklch(88% 0.015 75)',
};

type FetchState =
  | { kind: 'loading' }
  | { kind: 'success'; data: KeepsakeData }
  | { kind: 'error' };

function formatSol(amount: number) {
  if (amount >= 1) return amount.toFixed(2);
  if (amount > 0) return amount.toFixed(3);
  return '0.000';
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2Zm7 10 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" />
    </svg>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{
        background: c.paper,
        border: `1px solid ${c.border}`,
        color: c.inkSoft,
        fontFamily: 'var(--font-body)',
      }}
    >
      <SparkleIcon />
      {children}
    </span>
  );
}

export default function KeepsakePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [state, setState] = useState<FetchState>({ kind: 'loading' });
  const [origin, setOrigin] = useState('');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
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
      className="min-h-screen w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 86% 2%, rgba(216,164,60,0.18), transparent 17rem), radial-gradient(circle at 10% 0%, rgba(109,69,168,0.11), transparent 16rem), radial-gradient(circle at 50% 34%, rgba(23,143,123,0.06), transparent 26rem), ' +
          c.creamDeep,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')}), transform 0.6s cubic-bezier(${motionSpringFast.ease.join(', ')})`,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-8 md:py-14">
        {state.kind === 'loading' && <LoadingState />}
        {state.kind === 'error' && <ErrorState />}
        {state.kind === 'success' && (
          <KeepsakeExperience
            data={state.data}
            milestoneId={id}
            keepsakeUrl={origin ? `${origin}/toothfairy/keepsake/${id}` : ''}
          />
        )}

        <footer className="pt-12 pb-4 text-center">
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.inkMuted,
              letterSpacing: '0.03em',
            }}
          >
            Made with love on{' '}
            <Link href="/toothfairy" style={{ color: c.gold, textDecoration: 'none' }}>
              Tooth Fairy Network
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function KeepsakeExperience({
  data,
  milestoneId,
  keepsakeUrl,
}: {
  data: KeepsakeData;
  milestoneId: string;
  keepsakeUrl: string;
}) {
  const mintDate = data.mintDate instanceof Date ? data.mintDate : new Date(data.mintDate);

  const headline = `${data.childName}'s first forever memory`;
  const subhead =
    'A lost tooth, a little note, and a drawing saved as something your family can come back to.';

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(430px,1.04fr)] lg:items-center">
        <div className="order-2 lg:order-2">
          <div className="flex flex-wrap gap-2">
            <Pill>Forever memory</Pill>
            <Pill>Parent controlled</Pill>
          </div>

          <p
            className="mt-10 text-xs uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.gold,
              letterSpacing: '0.22em',
              fontWeight: 700,
            }}
          >
            First forever memory
          </p>
          <h1
            className="mt-4 max-w-2xl text-4xl leading-[1.02] md:text-6xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: c.ink,
              fontWeight: 700,
              letterSpacing: '0',
            }}
          >
            {headline}
          </h1>
          <p
            className="mt-5 max-w-[39rem] text-lg leading-relaxed md:text-xl"
            style={{ fontFamily: 'var(--font-body)', color: c.inkSoft }}
          >
            {subhead}
          </p>

          <div
            className="mt-7 rounded-lg p-5"
            style={{
              background: c.paper,
              border: `1px solid ${c.border}`,
              boxShadow: '0 16px 36px oklch(30% 0.035 65 / 0.06)',
            }}
          >
            <p
              className="text-xs uppercase"
              style={{
                color: c.gold,
                letterSpacing: '0.16em',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
              }}
            >
              Tanda's note
            </p>
            <p
              className="mt-3 text-lg leading-relaxed"
              style={{ color: c.ink, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              What a bright and beautiful smile you are growing, {data.childName}.
              Keep this memory close. Small things can become big things.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="#share"
              className="inline-flex min-h-14 items-center justify-center rounded-full px-7 text-base font-semibold"
              style={{
                background: c.purple,
                color: c.cream,
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                boxShadow: '0 16px 36px rgba(109, 69, 168, 0.24)',
              }}
            >
              Share with family
            </a>
            <Link
              href={`/toothfairy/app/gift/${milestoneId}`}
              className="inline-flex min-h-14 items-center justify-center rounded-full px-7 text-base font-semibold"
              style={{
                background: c.paper,
                border: `1px solid ${c.border}`,
                color: c.ink,
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
              }}
            >
              Add a gift
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-1">
          <div className="relative mx-auto max-w-xl">
            <div
              className="absolute -left-10 top-10 hidden h-36 w-36 rounded-full md:block"
              style={{ background: c.goldSoft, filter: 'blur(4px)' }}
              aria-hidden
            />
            <div
              className="absolute -right-10 bottom-16 hidden h-28 w-28 rounded-full md:block"
              style={{ background: c.purpleSoft, filter: 'blur(4px)' }}
              aria-hidden
            />
            <div className="relative">
              <KeepsakeCard
                childName={data.childName}
                toothType={data.toothType}
                storyOrigin={data.storyOrigin}
                drawingUrl={data.drawingUrl}
                smilePhotoUrl={data.smilePhotoUrl}
                mintDate={mintDate}
                deposits={data.deposits}
                message={data.message}
                toothStory={data.toothStory}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[0.96fr_1.04fr]">
        <section
          id="share"
          className="rounded-lg p-6 md:p-8"
          style={{
            background: c.paper,
            border: `1px solid ${c.border}`,
            boxShadow: '0 18px 44px oklch(30% 0.035 65 / 0.06)',
          }}
        >
          <p
            className="text-xs uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.gold,
              letterSpacing: '0.18em',
              fontWeight: 700,
            }}
          >
            Family link
          </p>
          <h2
            className="mt-3 text-3xl leading-tight md:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: c.ink,
              fontWeight: 700,
            }}
          >
            Share the memory first.
          </h2>
          <p
            className="mt-3 text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: c.inkSoft }}
          >
            Send one link to grandparents and loved ones. They can see the tooth story,
            read the note, and add a small gift only if they want to.
          </p>
          <div className="mt-6">
            <ShareButtons keepsakeUrl={keepsakeUrl} childName={data.childName} />
          </div>
        </section>
        <SmileFundPanel data={data} milestoneId={milestoneId} />
      </section>
    </>
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
  const hasDeposits = contributionCount > 0;

  return (
    <section
      className="rounded-lg p-6 md:p-8"
      style={{
        background: c.paper,
        border: `1px solid ${c.border}`,
        boxShadow: '0 18px 44px oklch(30% 0.035 65 / 0.06)',
      }}
    >
      <p
        className="text-xs uppercase"
        style={{
          fontFamily: 'var(--font-body)',
          color: c.gold,
          letterSpacing: '0.18em',
          fontWeight: 700,
        }}
      >
        Smile Fund
      </p>
      <div className="mt-4 flex items-start justify-between gap-5">
        <div>
          <h2
            className="text-5xl leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: c.ink,
              fontWeight: 800,
            }}
          >
            {formatSol(total)}
          </h2>
          <p
            className="mt-1 text-sm font-semibold uppercase"
            style={{ color: c.inkMuted, letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}
          >
            SOL saved
          </p>
        </div>
        <div
          className="rounded-lg px-4 py-3 text-center"
          style={{ background: c.goldSoft, color: c.gold }}
        >
          <div
            className="text-2xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
          >
            {lockedCount || '10'}
          </div>
          <div className="text-[10px] uppercase" style={{ letterSpacing: '0.12em' }}>
            {lockedCount ? 'locked' : 'age default'}
          </div>
        </div>
      </div>

      <p
        className="mt-5 text-base leading-relaxed"
        style={{ fontFamily: 'var(--font-body)', color: c.inkSoft }}
      >
        {hasDeposits
          ? `${contributionCount} loved one${contributionCount === 1 ? '' : 's'} helped start this fund.`
          : 'No gifts yet. Share the keepsake first; the fund can grow whenever family is ready.'}
      </p>

      {hasDeposits && (
        <div className="mt-5 space-y-2">
          {data.deposits.slice(0, 4).map((deposit, index) => (
            <div
              key={`${deposit.name}-${index}`}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm"
              style={{ background: c.cream, border: `1px solid ${c.border}` }}
            >
              <span style={{ color: c.ink, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                {deposit.name}
              </span>
              <span style={{ color: deposit.locked ? c.gold : c.inkSoft, fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                {formatSol(deposit.amount)} SOL
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/toothfairy/app/gift/${milestoneId}`}
        className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full px-6 text-base font-semibold"
        style={{
          background: c.purple,
          color: c.cream,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          boxShadow: '0 12px 30px rgba(109, 69, 168, 0.22)',
        }}
      >
        {hasDeposits ? 'Add another gift' : 'Add first gift'}
      </Link>

      <p
        className="mt-3 text-center text-xs leading-relaxed"
        style={{
          fontFamily: 'var(--font-body)',
          color: c.inkMuted,
        }}
      >
        Parent-controlled. Default unlock: age 10.
      </p>
    </section>
  );
}

function LoadingState() {
  return (
    <div
      className="mx-auto w-full max-w-md py-24 text-center"
      style={{
        fontFamily: 'var(--font-display)',
        color: c.inkSoft,
        fontSize: '1.125rem',
        fontStyle: 'italic',
      }}
    >
      <span className="inline-block" style={{ animation: 'keepsakePulse 2.2s ease-in-out infinite' }}>
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

function ErrorState() {
  return (
    <div
      className="mx-auto w-full max-w-md rounded-lg px-8 py-16 text-center"
      style={{
        background: c.paper,
        border: `1px solid ${c.border}`,
        fontFamily: 'var(--font-body)',
        color: c.inkSoft,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          color: c.ink,
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          lineHeight: 1.3,
        }}
      >
        This memory is still on its way.
      </p>
      <p className="mb-8" style={{ lineHeight: 1.6 }}>
        The link may still be saving, or it may have expired.
      </p>
      <Link
        href="/toothfairy"
        className="inline-block rounded-full px-6 py-3 font-semibold"
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
