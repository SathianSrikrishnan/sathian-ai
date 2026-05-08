import type { Metadata } from 'next';
import TandaRitualHeroVideo from '@/components/toothfairy/home/tanda-ritual-hero-video';

export const metadata: Metadata = {
  title: 'Hero Ritual Preview - Tooth Fairy Network',
  description:
    'Safe preview of the homepage-integrated Tanda ritual animation for Tooth Fairy Network.',
};

export default function TandaHeroRitualPreviewPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(0.8rem, 2vw, 1.5rem)',
        background:
          'radial-gradient(circle at 76% 8%, rgba(216, 164, 60, 0.18), transparent 20rem), radial-gradient(circle at 16% 4%, rgba(138, 99, 201, 0.14), transparent 18rem), linear-gradient(180deg, #fff8ed, #f8ecd9)',
      }}
    >
      <section
        style={{
          width: 'min(100%, 1080px)',
          color: '#1f1d4f',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: '0 0 0.45rem',
            color: '#8b63c9',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Integrated Hero Video Review
        </p>
        <h1
          style={{
            margin: '0 0 clamp(1rem, 2.6vw, 2rem)',
            fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
            lineHeight: 1,
          }}
        >
          Tanda&apos;s Hero Ritual
        </h1>
        <TandaRitualHeroVideo controls />
      </section>
    </main>
  );
}
