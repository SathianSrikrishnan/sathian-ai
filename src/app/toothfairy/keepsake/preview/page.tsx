'use client';

import { KeepsakeCard } from '@/components/toothfairy/keepsake/keepsake-card';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldHover:  'oklch(62% 0.13 72)',
  goldLight:  'oklch(82% 0.1 78)',
  border:     'oklch(88% 0.015 75)',
};

const timmy = {
  childName: 'Timmy',
  toothType: 'First front tooth',
  storyOrigin: 'Tanda \u00b7 the Origin',
  drawingUrl: '/story-assets/tanda/frame-07.png',
  mintDate: new Date('2026-04-15'),
  deposits: [
    { name: 'Grandma', amount: 0.5, locked: true },
    { name: 'Uncle Ben', amount: 0.25, locked: true },
    { name: 'Mom & Dad', amount: 0.1, locked: false },
  ],
  message:
    "One of the brightest teeth I\u2019ve ever carried. Your drawing made it glow even brighter. I\u2019m keeping it safe on the chain \u2014 forever, like you asked. \u2014Tanda",
};

export default function KeepsakePreviewPage() {
  return (
    <main
      className="min-h-screen w-full"
      style={{ background: c.creamDeep, fontFamily: 'var(--font-body)', color: c.brown }}
    >
      <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
        <header className="text-center mb-12">
          <p
            className="text-xs uppercase mb-5"
            style={{ color: c.gold, letterSpacing: '0.25em' }}
          >
            Tooth Fairy Network
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', color: c.brown }}
          >
            This is what Timmy got.
          </h1>
          <p
            className="text-base sm:text-lg leading-[1.75] mx-auto"
            style={{ color: c.brownSoft, maxWidth: '42ch' }}
          >
            A permanent keepsake. His drawing, his story, his family&rsquo;s love &mdash; all in one place. Still there when he&rsquo;s eighteen.
          </p>
        </header>

        <KeepsakeCard {...timmy} />

        <div className="text-center mt-16">
          <a
            href="/toothfairy/app"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-full active:scale-[0.98]"
            style={{
              background: c.gold,
              color: 'oklch(98% 0.005 80)',
              boxShadow: `0 4px 24px oklch(72% 0.145 75 / 0.25)`,
              transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = c.gold; }}
          >
            Make your child&apos;s keepsake
          </a>
          <p className="text-sm mt-5" style={{ color: c.brownMuted }}>
            Free to start. Takes two minutes. No app to install.
          </p>
        </div>
      </div>

      <footer
        className="py-10 px-6 text-center mt-10"
        style={{ borderTop: `1px solid ${c.border}`, background: c.cream }}
      >
        <p className="text-sm max-w-md mx-auto" style={{ color: c.brownMuted }}>
          Your child&rsquo;s keepsake will be theirs forever. You hold the keys.
        </p>
      </footer>
    </main>
  );
}
