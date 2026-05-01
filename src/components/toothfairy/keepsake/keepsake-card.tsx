'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
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
      className="w-full max-w-md mx-auto rounded-3xl overflow-hidden"
      style={{
        background: c.cream,
        border: `1px solid ${c.goldTint}`,
        boxShadow: '0 20px 44px oklch(30% 0.035 65 / 0.1)',
      }}
    >
      {/* Header: child's name */}
      <Fade delay={0} className="px-8 pt-10 pb-6" as="header">
        <h1
          className="text-4xl md:text-5xl leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            color: c.brown,
            fontWeight: 500,
            letterSpacing: '-0.01em',
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
            className="inline-block mt-4 px-3 py-1 text-xs rounded-full"
            style={{
              fontFamily: 'var(--font-body)',
              background: c.goldSoft,
              color: c.gold,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {storyOrigin}
          </span>
        )}
      </Fade>

      {/* Drawing area */}
      <Fade delay={150} className="px-8 pb-6">
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden"
          style={{
            background: c.creamDeep,
            boxShadow: 'inset 0 2px 16px oklch(30% 0.035 65 / 0.08)',
          }}
        >
          {drawingUrl ? (
            <Image
              src={drawingUrl}
              alt={`${childName}'s drawing`}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              style={{ objectFit: 'cover' }}
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

      {/* The Tell: child's narrative about this tooth */}
      {hasToothStory && (
        <Fade delay={200} className="px-8 pb-6">
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: c.creamDeep,
              border: `1px solid ${c.border}`,
            }}
          >
            <h2
              className="text-xs uppercase mb-2"
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brownMuted,
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}
            >
              In their words
            </h2>
            <p
              className="text-base italic"
              style={{
                fontFamily: 'var(--font-display)',
                color: c.brown,
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            >
              &ldquo;{toothStory}&rdquo;
            </p>
          </div>
        </Fade>
      )}

      {/* Mint date */}
      <Fade delay={250} className="px-8 pb-4">
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

      {/* Family contributions: gift-card signatures, not a table */}
      {deposits.length > 0 && (
        <Fade delay={350} className="px-8 pb-6">
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

      {/* Family message */}
      {message && (
        <Fade delay={450} className="px-8 pb-10">
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
    </article>
  );
}
