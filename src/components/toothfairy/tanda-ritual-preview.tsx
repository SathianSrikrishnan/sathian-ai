"use client"

import Link from "next/link"
import TandaRitualHeroVideo from "./home/tanda-ritual-hero-video"

export default function TandaRitualPreview() {
  return (
    <section className="ritual-preview">
      <div className="ritual-copy">
        <h1>
          A lost tooth becomes
          <span>their first forever memory.</span>
        </h1>
        <p>
          Capture the story, invite family to contribute, and start a parent-controlled Smile Fund they can grow into.
        </p>
        <div className="ritual-actions">
          <Link href="/toothfairy/app/draw?from=ritual" className="ritual-button primary">
            Create their memory
          </Link>
          <Link href="#how-it-works" className="ritual-button secondary">
            See how it works
          </Link>
        </div>
      </div>

      <div className="ritual-video">
        <TandaRitualHeroVideo controls />
      </div>

      <style jsx>{`
        .ritual-preview {
          display: grid;
          min-height: min(700px, calc(100vh - 72px));
          grid-template-columns: minmax(0, 0.86fr) minmax(540px, 1.14fr);
          gap: clamp(1.6rem, 4vw, 3.4rem);
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(2.5rem, 6vw, 4.6rem) 1.25rem clamp(2.4rem, 5vw, 3.4rem);
        }

        .ritual-copy {
          max-width: 675px;
        }

        h1 {
          margin: 0;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(3.15rem, 6.5vw, 5.55rem);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 0.92;
        }

        h1 span {
          display: block;
          color: #6d45a8;
        }

        p {
          max-width: 39rem;
          margin: 1.5rem 0 0;
          color: #334260;
          font-size: clamp(1.04rem, 2vw, 1.22rem);
          line-height: 1.7;
        }

        .ritual-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-top: 2.1rem;
        }

        .ritual-button {
          display: inline-flex;
          min-height: 3.25rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.35rem;
          font-weight: 900;
          text-decoration: none;
        }

        .primary {
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          box-shadow: 0 18px 42px rgba(109, 69, 168, 0.26);
        }

        .secondary {
          border: 1px solid #e3d9c4;
          background: rgba(255, 252, 246, 0.64);
          color: #11234a;
        }

        .ritual-video {
          min-width: 0;
        }

        @media (max-width: 1060px) {
          .ritual-preview {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .ritual-preview {
            min-height: auto;
            padding-top: 2rem;
            gap: 1.35rem;
          }

          .ritual-actions,
          .ritual-button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
