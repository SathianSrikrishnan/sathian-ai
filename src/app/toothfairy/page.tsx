'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_STORIES } from '@/data/stories';

/* ─── Color tokens (OKLCH, no pure black/white) ────────────────────────── */
const c = {
  cream:      'oklch(97.5% 0.01 80)',       // page base
  creamDeep:  'oklch(95% 0.015 75)',         // section alternate
  brown:      'oklch(30% 0.035 65)',         // primary text
  brownSoft:  'oklch(42% 0.03 65)',          // secondary text
  brownMuted: 'oklch(58% 0.025 65)',         // tertiary/footer
  gold:       'oklch(72% 0.145 75)',         // CTA, accent
  goldHover:  'oklch(62% 0.13 72)',          // CTA hover
  goldLight:  'oklch(82% 0.1 78)',           // subtle accent
  border:     'oklch(88% 0.015 75)',         // dividers
};

/* ─── Fade-in on scroll ─────────────────────────────────────────────────── */
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

function Fade({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeIn(delay);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 ${className}`}
      style={{
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

/* ─── CTA Button ────────────────────────────────────────────────────────── */
function CTA({ className = '' }: { className?: string }) {
  return (
    <a
      href="/toothfairy/app"
      className={`inline-block px-10 py-4 text-lg font-semibold rounded-full active:scale-[0.98] ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        background: c.gold,
        color: 'oklch(98% 0.005 80)',
        boxShadow: `0 4px 24px oklch(72% 0.145 75 / 0.2)`,
        transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = c.gold; }}
    >
      Make your child&apos;s first keepsake
    </a>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function ToothFairyLanding() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: c.cream, minHeight: '100vh' }}>
      <main
        className="overflow-x-hidden"
        style={{ fontFamily: 'var(--font-body)', color: c.brown }}
      >

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/toothfairy/concept-b/hero-bg.png"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: `${c.cream}cc` }} />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${c.cream}e6, ${c.cream}99, transparent)`,
              }}
            />
          </div>

          <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-center w-full py-16 md:py-0">

              <div className="order-2 md:order-1">
                <p
                  className="text-sm uppercase tracking-[0.2em] mb-6 font-medium"
                  style={{ color: c.gold, fontFamily: 'var(--font-body)' }}
                >
                  Tooth Fairy Network
                </p>
                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: c.brown }}
                >
                  Your child just lost a tooth.
                </h1>
                <h2
                  className="italic text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] mb-10"
                  style={{ fontFamily: 'var(--font-display)', color: c.gold }}
                >
                  Every culture in the world has a story for this.
                </h2>
                <CTA />
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div
                  className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden"
                  style={{
                    transform: `translateY(${scrollY * -0.08}px)`,
                    boxShadow: `0 24px 48px oklch(30% 0.035 65 / 0.12)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/toothfairy/concept-b/hero.png"
                    alt="A child smiling with a missing tooth"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THREE DOORWAYS ─────────────────────────────────────────────── */}
        <section
          id="stories"
          className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
          style={{ scrollMarginTop: '80px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${c.cream}, ${c.creamDeep} 20%, ${c.creamDeep})` }}
          />

          <div className="relative max-w-5xl mx-auto">
            <Fade>
              <p
                className="text-xs uppercase tracking-[0.32em] mb-16 md:mb-20 font-medium text-center"
                style={{ color: c.gold }}
              >
                Tonight&apos;s bedtime stories
              </p>
            </Fade>
            <div className="space-y-20 md:space-y-28">
              {FEATURED_STORIES.map((story, i) => {
                const reverse = i % 2 === 1;
                const meta = [
                  { cover: '/story-assets/tanda/tf-05-tanda.png',           minutes: '4 min read together' },
                  { cover: '/story-assets/viking-origin/vo-01-village.png', minutes: '5 min read together' },
                  { cover: '/story-assets/ratoncito-perez/rp-02-mouse.png', minutes: '4 min read together' },
                ][i] || { cover: story.scenes[0]?.background || '', minutes: '' };

                return (
                  <Fade key={story.id} delay={100}>
                    <article
                      className={`grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 md:gap-16 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}
                    >
                      {/* Storybook cover — click-through */}
                      <Link
                        href={`/toothfairy/story/${story.id}`}
                        className="group block md:[direction:ltr]"
                        aria-label={`Begin reading ${story.title}`}
                      >
                        <div
                          className="storybook-cover relative w-full aspect-[9/16] max-h-[640px] mx-auto rounded-[28px] overflow-hidden"
                          style={{
                            boxShadow: `0 28px 70px oklch(30% 0.035 65 / 0.2), 0 4px 14px oklch(30% 0.035 65 / 0.12)`,
                            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) rotate(-0.5deg) scale(1.015)';
                            e.currentTarget.style.boxShadow = `0 40px 90px oklch(30% 0.035 65 / 0.26), 0 8px 24px oklch(30% 0.035 65 / 0.14)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) rotate(0deg) scale(1)';
                            e.currentTarget.style.boxShadow = `0 28px 70px oklch(30% 0.035 65 / 0.2), 0 4px 14px oklch(30% 0.035 65 / 0.12)`;
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={meta.cover}
                            alt={`${story.title} — ${story.region}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Bottom gradient for legibility of title */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(to top, ${c.brown}e0 0%, ${c.brown}66 30%, transparent 55%)`,
                            }}
                          />
                          {/* Bottom: title on the cover itself */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <h3
                              className="text-3xl md:text-4xl leading-[1.05] mb-2"
                              style={{
                                fontFamily: 'var(--font-display)',
                                color: 'oklch(98% 0.005 80)',
                                textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                                fontWeight: 700,
                              }}
                            >
                              {story.title}
                            </h3>
                            <p
                              className="text-sm italic"
                              style={{
                                color: 'oklch(92% 0.02 80)',
                                textShadow: '0 1px 10px rgba(0,0,0,0.6)',
                                fontFamily: 'var(--font-display)',
                              }}
                            >
                              {story.region}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Text column */}
                      <div className="md:[direction:ltr]">
                        <p
                          className="text-xs uppercase tracking-[0.24em] mb-4 font-semibold"
                          style={{ color: c.gold }}
                        >
                          {story.region}
                        </p>
                        <h4
                          className="text-4xl sm:text-5xl leading-[1.05] mb-5"
                          style={{ fontFamily: 'var(--font-display)', color: c.brown }}
                        >
                          {story.title}
                        </h4>
                        <p
                          className="text-lg leading-[1.75] mb-7"
                          style={{ color: c.brownSoft, maxWidth: '48ch' }}
                        >
                          {story.description}
                        </p>
                        <div className="flex items-center gap-5 flex-wrap">
                          <Link
                            href={`/toothfairy/story/${story.id}`}
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold active:scale-[0.98]"
                            style={{
                              background: c.gold,
                              color: 'oklch(98% 0.005 80)',
                              boxShadow: `0 8px 24px oklch(72% 0.145 75 / 0.3)`,
                              fontFamily: 'var(--font-body)',
                              transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = c.goldHover; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = c.gold; }}
                          >
                            Begin reading
                            <span aria-hidden>&rarr;</span>
                          </Link>
                          {meta.minutes && (
                            <span
                              className="text-sm"
                              style={{ color: c.brownMuted, fontFamily: 'var(--font-body)' }}
                            >
                              &middot; {meta.minutes}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Fade>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── THE WORLD BEHIND ─────────────────────────────────────────── */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-[54ch] mx-auto text-center">
            <Fade>
              <p
                className="text-xs uppercase tracking-[0.32em] mb-8 font-medium"
                style={{ color: c.gold }}
              >
                A world of traditions
              </p>
            </Fade>
            <Fade delay={120}>
              <h3
                className="text-3xl sm:text-4xl leading-[1.2] mb-7"
                style={{ fontFamily: 'var(--font-display)', color: c.brown }}
              >
                Three stories tonight. Dozens more across the world.
              </h3>
            </Fade>
            <Fade delay={240}>
              <p
                className="text-lg sm:text-xl leading-[1.75] mb-10 italic"
                style={{ fontFamily: 'var(--font-display)', color: c.brownSoft }}
              >
                In Spain, a mouse. In Korea, a magpie. In Ethiopia, a hyena.
                One ritual, a hundred shapes. Tanda knows them all &mdash; and one day, so will your child.
              </p>
            </Fade>
            <Fade delay={360}>
              <Link
                href="/toothfairy/stories"
                className="inline-flex items-center gap-2 text-base font-medium"
                style={{
                  color: c.gold,
                  fontFamily: 'var(--font-body)',
                  transition: 'gap 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.75rem'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.5rem'; }}
              >
                Enter the world
                <span aria-hidden>&rarr;</span>
              </Link>
            </Fade>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer
          className="py-10 px-6 text-center"
          style={{ borderTop: `1px solid ${c.border}`, background: c.creamDeep }}
        >
          <p
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: c.brownMuted }}
          >
            Every tooth tells a story. This is where they&apos;re kept.
          </p>
        </footer>
      </main>
    </div>
  );
}
