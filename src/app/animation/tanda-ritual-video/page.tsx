import type { Metadata } from 'next';
import { tandaRitualAssets } from '@/components/toothfairy/home/tanda-ritual-assets';

export const metadata: Metadata = {
  title: 'Tanda Hero Ritual Video Review - Tooth Fairy Network',
  description: 'Clean review page for the exported Tanda hero ritual video loop.',
};

export default function TandaRitualVideoReviewPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        background:
          'radial-gradient(circle at 76% 8%, rgba(216, 164, 60, 0.18), transparent 20rem), radial-gradient(circle at 16% 4%, rgba(138, 99, 201, 0.14), transparent 18rem), linear-gradient(180deg, #fff8ed, #f8ecd9)',
      }}
    >
      <section
        style={{
          width: 'min(100%, 980px)',
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

        <figure
          aria-label="Tanda saves a tooth story and starts a tiny gift in the Smile Fund piggy bank."
          style={{
            margin: 0,
            overflow: 'hidden',
            border: '1px solid rgba(41, 31, 82, 0.08)',
            borderRadius: 8,
            background: 'rgba(255, 249, 238, 0.74)',
            boxShadow: '0 28px 72px rgba(47, 33, 92, 0.13)',
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster={tandaRitualAssets.poster}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 10',
              objectFit: 'contain',
            }}
          >
            <source src={tandaRitualAssets.webm} type="video/webm" />
            <source src={tandaRitualAssets.mp4} type="video/mp4" />
          </video>
        </figure>
      </section>
    </main>
  );
}
