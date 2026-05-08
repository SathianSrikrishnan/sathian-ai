import type { Metadata } from 'next';
import { tandaPoseSpecs } from '@/lib/toothfairy/tanda-pose-pack';

export const metadata: Metadata = {
  title: 'Tanda Pose Pack - Tooth Fairy Network',
  description: 'Production pose-pack review sheet for the Tanda ritual animation.',
};

export default function TandaPosePackPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 78% 8%, rgba(216, 164, 60, 0.16), transparent 18rem), radial-gradient(circle at 12% 10%, rgba(138, 99, 201, 0.14), transparent 20rem), linear-gradient(180deg, #fff8ed, #f8ecd9)',
        color: '#211d50',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
      }}
    >
      <section
        style={{
          width: 'min(100%, 1180px)',
          margin: '0 auto',
        }}
      >
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 340px)',
            gap: 'clamp(1rem, 3vw, 2rem)',
            alignItems: 'end',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 0.45rem',
                color: '#8b63c9',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              V5 Production Pack
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                lineHeight: 0.95,
              }}
            >
              Tanda Pose Pack
            </h1>
            <p
              style={{
                maxWidth: '680px',
                margin: '1rem 0 0',
                color: '#5c5578',
                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                lineHeight: 1.55,
              }}
            >
              These are the exact pose assets needed to move the ritual loop from a
              moving cutout to character-led animation. Each slot expects the same
              Tanda identity on a transparent PNG.
            </p>
          </div>

          <figure
            style={{
              margin: 0,
              overflow: 'hidden',
              border: '1px solid rgba(31, 29, 79, 0.08)',
              borderRadius: 8,
              background: '#fffaf3',
              boxShadow: '0 18px 48px rgba(55, 39, 98, 0.12)',
            }}
          >
            <img
              src="/toothfairy/animation/layered/tanda-cutout-soft.png"
              alt="Approved Tanda reference for pose-pack identity."
              width={418}
              height={418}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
            />
          </figure>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1rem, 2vw, 1.35rem)',
          }}
        >
          {tandaPoseSpecs.map((pose, index) => (
              <article
                key={pose.id}
                style={{
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                  overflow: 'hidden',
                  border: '1px solid rgba(31, 29, 79, 0.08)',
                  borderRadius: 8,
                  background: 'rgba(255, 250, 243, 0.86)',
                  boxShadow: '0 18px 48px rgba(55, 39, 98, 0.1)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                    minHeight: 250,
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.74), rgba(241,232,255,0.55))',
                  }}
                >
                  <img
                    src={pose.path}
                    alt={`${pose.title} generated pose asset.`}
                    width={520}
                    height={520}
                    style={{
                      display: 'block',
                      width: 'min(86%, 250px)',
                      height: 'auto',
                    }}
                  />
                </div>

                <div style={{ padding: '1rem' }}>
                  <p
                    style={{
                      margin: '0 0 0.45rem',
                      color: '#3f9f86',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Pose asset / Pose {index + 1}
                  </p>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      lineHeight: 1.15,
                    }}
                  >
                    {pose.title}
                  </h2>
                  <p
                    style={{
                      margin: '0.7rem 0 0',
                      color: '#5d5778',
                      fontSize: '0.94rem',
                      lineHeight: 1.48,
                    }}
                  >
                    {pose.beat}
                  </p>
                  <p
                    style={{
                      margin: '0.75rem 0 0',
                      color: '#827a96',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                      fontSize: '0.78rem',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {pose.filename}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
