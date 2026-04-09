'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ─── Fade-in on scroll ──────────────────────────────────────────────────── */
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
    <div ref={ref} className={`opacity-0 translate-y-4 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

/* ─── CTA Button ─────────────────────────────────────────────────────────── */
function CTA({ className = '' }: { className?: string }) {
  return (
    <a
      href="/toothfairy/app"
      className={`inline-block px-10 py-4 bg-[#C8952E] text-white font-semibold text-lg rounded-full
        hover:bg-[#A67A1E] transition-all duration-200 shadow-lg shadow-[#C8952E]/20
        active:scale-[0.98] transform ${className}`}
      style={{ fontFamily: 'var(--font-landing-sans)' }}
    >
      Make your child&apos;s first keepsake
    </a>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Concept2() {
  /* Subtle parallax on hero image */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main style={{ fontFamily: 'var(--font-landing-sans)' }} className="overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/toothfairy/concept-b/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Cream overlay for text readability */}
          <div className="absolute inset-0 bg-[#FDF8F0]/70" />
          {/* Left side stronger overlay so text pops */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F0]/90 via-[#FDF8F0]/60 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-center w-full py-16 md:py-0">

            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-sm uppercase tracking-[0.2em] text-[#C8952E] mb-6" style={{ fontFamily: 'var(--font-landing-sans)' }}>
                Tooth Fairy Network
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight text-[#2D2418] mb-3"
                style={{ fontFamily: 'var(--font-landing-serif)' }}
              >
                Your child just lost a tooth.
              </h1>
              <h2
                className="italic text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] text-[#C8952E] mb-8"
                style={{ fontFamily: 'var(--font-landing-serif)' }}
              >
                Let&apos;s make it the first thing they ever own.
              </h2>
              <p
                className="text-lg sm:text-xl leading-relaxed text-[#5C4D3C] mb-10 max-w-lg"
                style={{ fontFamily: 'var(--font-landing-body)' }}
              >
                A photo. A story. A note from grandma. A few dollars from uncle.
                All of it — theirs. Still there when they&apos;re 18.
              </p>
              <CTA />
            </div>

            {/* Hero photo */}
            <div className="order-1 md:order-2 flex justify-center">
              <div
                className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[#2D2418]/15"
                style={{ transform: `translateY(${scrollY * -0.08}px)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/toothfairy/concept-b/hero.png"
                  alt="A child smiling with a missing tooth"
                  className="w-full h-full object-cover"
                />
                {/* Soft bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDF8F0]/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL CORE + TRADITIONS ─────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3E8] via-[#FDF8F0] to-[#FAF3E8]" />

        <div className="relative max-w-3xl mx-auto">
          <Fade>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl text-[#2D2418] mb-10"
              style={{ fontFamily: 'var(--font-landing-serif)' }}
            >
              Every family on earth marks this moment.
            </h3>
          </Fade>

          <Fade delay={100}>
            <p className="text-lg leading-[1.8] text-[#5C4D3C] mb-6" style={{ fontFamily: 'var(--font-landing-body)' }}>
              In Korea, children sing to magpies on rooftops. In Spain, a mouse collects teeth behind a bakery. In Jamaica, they shake tin cans under moonlight. Your family&apos;s version starts here.
            </p>
          </Fade>

          <Fade delay={200}>
            <p className="text-lg leading-[1.8] text-[#5C4D3C] mb-6" style={{ fontFamily: 'var(--font-landing-body)' }}>
              Your child takes a photo of that gap-toothed smile, names the tooth, tells the story of how it fell out. Then the people who love them show up — grandma writes a note, uncle adds to their savings, dad sends a message. Every person who touches it makes it richer.
            </p>
          </Fade>

          <Fade delay={300}>
            <p className="text-lg leading-[1.8] text-[#5C4D3C]" style={{ fontFamily: 'var(--font-landing-body)' }}>
              It&apos;s not stored on your phone where it gets lost in 10,000 photos. It&apos;s not in a drawer. It lives on a network no company controls, and when your child is ready, everything in it is theirs.
            </p>
          </Fade>
        </div>

        {/* Traditions banner — full width, no crop */}
        <Fade delay={400} className="mt-16 max-w-5xl mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toothfairy/concept-b/traditions-banner.png"
              alt="Tooth fairy traditions from around the world — Korea, Spain, Jamaica, Turkey"
              className="w-full h-auto block"
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF3E8]/80 to-transparent flex items-end justify-center pb-3">
              <a
                href="/toothfairy/stories"
                className="inline-block px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm text-[#C8952E] font-medium hover:bg-white transition-colors shadow-md"
                style={{ fontFamily: 'var(--font-landing-sans)' }}
              >
                Explore traditions from 50+ cultures &rarr;
              </a>
            </div>
          </div>
        </Fade>
      </section>

      {/* ── KEEPSAKE + PARENT CONTROL ──────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Fade>
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl">
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
                className="text-2xl sm:text-3xl text-[#2D2418] mb-6"
                style={{ fontFamily: 'var(--font-landing-serif)' }}
              >
                You control it until they&apos;re ready.
              </h3>
              <p className="text-lg leading-[1.8] text-[#5C4D3C] mb-6" style={{ fontFamily: 'var(--font-landing-body)' }}>
                You choose what&apos;s locked, what&apos;s accessible, and when to hand it over. Your child&apos;s whole tribe — celebrating every milestone, securely, at their fingertips.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'No app to download',
                  'No bank account required',
                  'Works on any phone, anywhere in the world',
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8952E] flex-shrink-0" />
                    <span className="text-[#5C4D3C]" style={{ fontFamily: 'var(--font-landing-body)' }}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
              <CTA />
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8DDD0] py-10 px-6 text-center bg-[#FAF3E8]">
        <p
          className="text-[#8A7B6B] text-sm leading-relaxed max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-landing-body)' }}
        >
          Your child&apos;s keepsake will be theirs forever. You hold the keys.
        </p>
      </footer>
    </main>
  );
}
