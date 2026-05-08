import type { Metadata } from 'next';
import Image from 'next/image';
import TandaRitualLayered from '@/components/toothfairy/home/tanda-ritual-layered';
import TandaRitualHeroVideo from '@/components/toothfairy/home/tanda-ritual-hero-video';

export const metadata: Metadata = {
  title: "Tanda's Keepsake Studio - Tooth Fairy Network",
  description:
    "Layered motion preview for Tanda's keepsake-to-Smile-Fund animation.",
};

export default function TandaRitualPreviewPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
        background:
          'radial-gradient(circle at 78% 10%, rgba(216, 164, 60, 0.18), transparent 20rem), radial-gradient(circle at 18% 4%, rgba(138, 99, 201, 0.14), transparent 18rem), linear-gradient(180deg, #fff8ed, #f8ecd9)',
      }}
    >
      <div style={{ width: 'min(100%, 1180px)' }}>
        <header
          style={{
            margin: '0 auto clamp(1rem, 3vw, 2rem)',
            maxWidth: '780px',
            textAlign: 'center',
            color: '#1f1d4f',
          }}
        >
          <p
            style={{
              margin: '0 0 0.45rem',
              color: '#8b63c9',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Exported Hero Loop
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              lineHeight: 1,
            }}
          >
            Tanda&apos;s Keepsake Studio
          </h1>
          <p
            style={{
              margin: '0.85rem auto 0',
              maxWidth: '640px',
              color: '#565174',
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            lineHeight: 1.55,
            }}
          >
            The approved layered motion pass rendered as a real homepage video asset.
            The live layer source remains below for comparison and future tuning.
          </p>
        </header>

        <TandaRitualHeroVideo controls />

        <section
          aria-label="Live layered source"
          style={{
            marginTop: 'clamp(1rem, 3vw, 2rem)',
          }}
        >
          <p
            style={{
              margin: '0 0 0.75rem',
              color: '#706687',
              fontSize: '0.95rem',
              textAlign: 'center',
            }}
          >
            Live layered source
          </p>
          <TandaRitualLayered />
        </section>

        <figure
          style={{
            margin: 'clamp(1rem, 3vw, 2rem) 0 0',
            overflow: 'hidden',
            border: '1px solid rgba(31, 29, 79, 0.08)',
            borderRadius: '8px',
            background: '#fffaf3',
            boxShadow: '0 24px 70px rgba(55, 39, 98, 0.16)',
          }}
        >
          <Image
            src="/toothfairy/animation/tanda-keepsake-studio-styleframes-v3-old-tanda.png"
            alt="Six-frame production storyboard showing the approved older Tanda saving a tooth as a protected story keepsake, then sending a coin into a smiling piggy bank."
            width={1774}
            height={887}
            priority
            sizes="(min-width: 1200px) 1180px, 96vw"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
            }}
          />
        </figure>

        <section
          aria-label="Production art direction"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            alignItems: 'stretch',
            marginTop: 'clamp(1rem, 3vw, 2rem)',
          }}
        >
          <figure
            style={{
              margin: 0,
              overflow: 'hidden',
              border: '1px solid rgba(31, 29, 79, 0.08)',
              borderRadius: '8px',
              background: '#fffaf3',
              boxShadow: '0 18px 48px rgba(55, 39, 98, 0.12)',
            }}
          >
            <Image
              src="/toothfairy/animation/tanda-cartoon-mvp.png"
              alt="Approved Tanda character reference with white dress, loose brown hair, iridescent wings, and a glowing tooth."
              width={450}
              height={450}
              sizes="(min-width: 900px) 380px, 92vw"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </figure>

          <div
            style={{
              border: '1px solid rgba(31, 29, 79, 0.08)',
              borderRadius: '8px',
              background: 'rgba(255, 250, 243, 0.82)',
              boxShadow: '0 18px 48px rgba(55, 39, 98, 0.1)',
              color: '#272252',
              padding: 'clamp(1rem, 2.5vw, 2rem)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.4rem',
                color: '#8b63c9',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Character Lock
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.45rem, 2.5vw, 2.4rem)',
                lineHeight: 1.08,
              }}
            >
              Use the older Tanda. Keep the six-frame story.
            </h2>
            <p
              style={{
                margin: '1rem 0 0',
                color: '#5d5778',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              Next production frames should preserve Tanda&apos;s softer hair, white dress,
              iridescent wings, tooth-holding pose language, and warm expression. The piggy
              keeps the glossy pink body and Solana-style side mark; the coin uses a clear
              dollar sign so the parent takeaway stays simple.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
