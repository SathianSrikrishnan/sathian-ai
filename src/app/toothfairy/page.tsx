'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
                  className="italic text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] mb-8"
                  style={{ fontFamily: 'var(--font-display)', color: c.gold }}
                >
                  Let&apos;s make it the first thing they ever own.
                </h2>
                <p
                  className="text-lg sm:text-xl leading-relaxed mb-10"
                  style={{ color: c.brownSoft, maxWidth: '65ch' }}
                >
                  A photo. A story. A note from grandma. A few dollars from uncle.
                  All of it — theirs. Still there when they&apos;re 18.
                </p>
                <CTA />
                <div className="mt-5">
                  <a
                    href="/toothfairy/story/tanda"
                    className="inline-flex items-center gap-2 text-base font-medium"
                    style={{
                      color: c.gold,
                      fontFamily: 'var(--font-body)',
                      borderBottom: `1px solid ${c.goldLight}`,
                      paddingBottom: '2px',
                      transition: 'color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = c.goldHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = c.gold; }}
                  >
                    Or read the origin story first &rarr;
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div
                  className="relative w-full max-w-sm aspect-[3:4] rounded-3xl overflow-hidden"
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

        {/* ── EMOTIONAL CORE + TRADITIONS ────────────────────────────────── */}
        <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${c.creamDeep}, ${c.cream}, ${c.creamDeep})` }}
          />

          <div className="relative max-w-[65ch] mx-auto">
            <Fade>
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl mb-10"
                style={{ fontFamily: 'var(--font-display)', color: c.brown }}
              >
                Every family on earth marks this moment.
              </h3>
            </Fade>

            <Fade delay={100}>
              <p className="text-lg leading-[1.85] mb-6" style={{ color: c.brownSoft }}>
                In Korea, children sing to magpies on rooftops. In Spain, a mouse collects teeth behind a bakery. In Jamaica, they shake tin cans under moonlight. Your family&apos;s version starts here.
              </p>
            </Fade>

            <Fade delay={200}>
              <p className="text-lg leading-[1.85] mb-6" style={{ color: c.brownSoft }}>
                Your child takes a photo of that gap-toothed smile, names the tooth, tells the story of how it fell out. Then the people who love them show up — grandma writes a note, uncle adds to their savings, dad sends a message. Every person who touches it makes it richer.
              </p>
            </Fade>

            <Fade delay={300}>
              <p className="text-lg leading-[1.85]" style={{ color: c.brownSoft }}>
                It&apos;s not stored on your phone where it gets lost in 10,000 photos. It&apos;s not in a drawer. It lives on a network no company controls, and when your child is ready, everything in it is theirs.
              </p>
            </Fade>
          </div>

          <Fade delay={400} className="mt-16 max-w-5xl mx-auto">
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ boxShadow: `0 16px 40px oklch(30% 0.035 65 / 0.1)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/toothfairy/concept-b/traditions-banner.png"
                alt="Tooth fairy traditions from around the world — Korea, Spain, Jamaica, and the classic fairy"
                className="w-full h-auto block"
              />
            </div>
          </Fade>

          <Fade delay={500} className="mt-10 flex justify-center">
            <a
              href="/toothfairy/stories"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full active:scale-[0.98]"
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
              Read the stories
            </a>
          </Fade>
        </section>

        {/* ── KEEPSAKE + PARENT CONTROL ─────────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <Fade>
              <div
                className="relative w-full aspect-square rounded-3xl overflow-hidden"
                style={{ boxShadow: `0 20px 44px oklch(30% 0.035 65 / 0.1)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/toothfairy/concept-b/keepsake-mockup.png"
                  alt="A digital keepsake with photos, notes, and savings"
                  className="w-full h-full object-cover"
                />
              </div>
            </Fade>

            <Fade delay={150}>
              <div>
                <h3
                  className="text-2xl sm:text-3xl mb-6"
                  style={{ fontFamily: 'var(--font-display)', color: c.brown }}
                >
                  You control it until they&apos;re ready.
                </h3>
                <p className="text-lg leading-[1.85] mb-6" style={{ color: c.brownSoft, maxWidth: '55ch' }}>
                  You choose what&apos;s locked, what&apos;s accessible, and when to hand it over. Your child&apos;s whole tribe — celebrating every milestone, securely, at their fingertips.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    'No app to download',
                    'No bank account required',
                    'Works on any phone, anywhere in the world',
                  ].map((line) => (
                    <div key={line} className="flex items-center gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: c.gold }}
                      />
                      <span style={{ color: c.brownSoft }}>{line}</span>
                    </div>
                  ))}
                </div>
                <CTA />
              </div>
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
            Your child&apos;s keepsake will be theirs forever. You hold the keys.
          </p>
        </footer>
      </main>
    </div>
  );
}
