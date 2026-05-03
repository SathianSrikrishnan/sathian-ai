'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  paper:      'oklch(99% 0.006 82 / 0.90)',
  ink:        '#11234a',
  inkSoft:    '#334260',
  purple:     '#6d45a8',
  purpleSoft: 'rgba(109, 69, 168, 0.10)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldLight:  'oklch(82% 0.1 78)',
  goldSoft:   'oklch(72% 0.145 75 / 0.1)',
  goldTint:   'oklch(72% 0.145 75 / 0.2)',
  border:     'oklch(88% 0.015 75)',
};

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('opacity-100', 'translate-y-0');
            el.classList.remove('opacity-0', 'translate-y-4');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

function Fade({
  children,
  className = '',
  delay = 0,
  as: As = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'header' | 'footer';
}) {
  const ref = useFadeIn(delay);
  return (
    <As
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`opacity-0 translate-y-4 ${className}`}
      style={{
        transition:
          'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </As>
  );
}

export interface KeepsakeDeposit {
  name: string;
  amount: number;
  locked: boolean;
}

export interface KeepsakeCardProps {
  childName: string;
  toothType: string;
  storyOrigin?: string;
  drawingUrl?: string | null;
  smilePhotoUrl?: string | null;
  mintDate: Date;
  deposits: KeepsakeDeposit[];
  message?: string;
  /**
   * The Tell: child's narrative about this specific tooth.
   * Rendered below the drawing in italic with a soft cream card background.
   * When null/absent/empty: render nothing; silence is the right empty state.
   */
  toothStory?: string | null;
}

function formatMintDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatSol(amount: number): string {
  if (amount >= 1) return `${amount.toFixed(2)} SOL`;
  return `${amount.toFixed(3)} SOL`;
}

export function KeepsakeCard(props: KeepsakeCardProps) {
  const {
    childName,
    storyOrigin,
    drawingUrl,
    mintDate,
    deposits,
    message,
    toothStory,
  } = props;

  const hasToothStory = typeof toothStory === 'string' && toothStory.trim().length > 0;

  return (
    <article
      className="relative mx-auto w-full max-w-lg overflow-hidden rounded-lg"
      style={{
        background:
          'linear-gradient(180deg, oklch(99% 0.006 82 / 0.94), oklch(97.5% 0.01 80 / 0.96))',
        border: `1px solid ${c.goldTint}`,
        boxShadow: '0 22px 54px oklch(30% 0.035 65 / 0.12)',
      }}
    >
      <div
        className="absolute -right-10 -top-8 h-32 w-32 rounded-full"
        style={{ background: c.purpleSoft, filter: 'blur(6px)' }}
        aria-hidden
      />
      <div
        className="absolute -left-10 bottom-24 h-28 w-28 rounded-full"
        style={{ background: c.goldSoft, filter: 'blur(6px)' }}
        aria-hidden
      />

      <Fade delay={0} className="relative px-6 pt-7 pb-5 md:px-8" as="header">
        <p
          className="mb-3 text-[10px] font-bold uppercase"
          style={{
            color: c.gold,
            letterSpacing: '0.18em',
            fontFamily: 'var(--font-body)',
          }}
        >
          Tooth fairy keepsake
        </p>
        <h1
          className="text-4xl leading-none md:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            color: c.ink,
            fontWeight: 700,
            letterSpacing: '0',
          }}
        >
          {childName}
        </h1>
        <div
          className="mt-3 h-px w-12"
          style={{ background: c.gold }}
          aria-hidden
        />
        {storyOrigin && (
          <span
            className="mt-4 inline-block rounded-md px-3 py-1 text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              background: c.purpleSoft,
              color: c.purple,
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          >
            {storyOrigin}
          </span>
        )}
      </Fade>

      <Fade delay={150} className="relative px-6 pb-6 md:px-8">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, oklch(100% 0 0), oklch(96% 0.012 78))',
            border: `1px solid ${c.border}`,
            boxShadow: 'inset 0 2px 18px oklch(30% 0.035 65 / 0.06)',
          }}
        >
          {drawingUrl ? (
            <Image
              src={drawingUrl}
              alt={`${childName}'s drawing`}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brownMuted,
                fontStyle: 'italic',
                fontSize: '0.95rem',
              }}
            >
              Drawing coming soon
            </div>
          )}
        </div>
      </Fade>

      {hasToothStory && (
        <Fade delay={200} className="relative px-6 pb-6 md:px-8">
          <div
            className="rounded-lg px-5 py-4"
            style={{
              background: c.paper,
              border: `1px solid ${c.border}`,
            }}
          >
            <h2
              className="text-xs uppercase mb-2"
              style={{
                fontFamily: 'var(--font-body)',
                color: c.inkSoft,
                letterSpacing: '0.15em',
                fontWeight: 700,
              }}
            >
              In their words
            </h2>
            <p
              className="text-base italic"
              style={{
                fontFamily: 'var(--font-display)',
                color: c.ink,
                fontWeight: 500,
                lineHeight: 1.55,
              }}
            >
              &ldquo;{toothStory}&rdquo;
            </p>
          </div>
        </Fade>
      )}

      <Fade delay={250} className="relative px-6 pb-4 md:px-8">
        <p
          className="text-sm"
          style={{
            fontFamily: 'var(--font-body)',
            color: c.brownSoft,
          }}
        >
          Created {formatMintDate(mintDate)}
        </p>
      </Fade>

      {deposits.length > 0 && (
        <Fade delay={350} className="relative px-6 pb-6 md:px-8">
          <div
            className="h-px w-full mb-5"
            style={{ background: c.border }}
            aria-hidden
          />
          <h2
            className="text-xs uppercase mb-4"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.brownMuted,
              letterSpacing: '0.15em',
              fontWeight: 500,
            }}
          >
            With love from
          </h2>
          <ul className="space-y-3">
            {deposits.map((deposit, i) => (
              <li
                key={`${deposit.name}-${i}`}
                className="flex items-baseline justify-between"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: c.brown,
                    fontSize: '1.125rem',
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  {deposit.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: deposit.locked ? c.gold : c.brownSoft,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {formatSol(deposit.amount)}
                  {deposit.locked && (
                    <span
                      className="ml-2"
                      style={{
                        color: c.goldLight,
                        fontSize: '0.65rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                      aria-label="locked"
                    >
                      locked
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Fade>
      )}

      {message && (
        <Fade delay={450} className="relative px-6 pb-7 md:px-8">
          <div
            className="h-px w-full mb-5"
            style={{ background: c.border }}
            aria-hidden
          />
          <div className="relative pl-6">
            <span
              className="absolute left-0 top-0 text-3xl leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: c.gold,
                lineHeight: 1,
              }}
              aria-hidden
            >
              &ldquo;
            </span>
            <p
              className="text-base italic"
              style={{
                fontFamily: 'var(--font-display)',
                color: c.brown,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          </div>
        </Fade>
      )}

      <Fade delay={500} className="relative px-6 pb-7 md:px-8">
        <div
          className="flex items-center justify-between rounded-lg px-4 py-3"
          style={{ background: c.purpleSoft, border: `1px solid rgba(109, 69, 168, 0.16)` }}
        >
          <span
            className="text-xs font-bold uppercase"
            style={{ color: c.purple, letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}
          >
            Protected in the Network
          </span>
          <span aria-hidden style={{ color: c.gold, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            *
          </span>
        </div>
      </Fade>
    </article>
  );
}
