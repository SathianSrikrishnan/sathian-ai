'use client';

import Image from 'next/image';

type TandaRitualLoopProps = {
  className?: string;
};

export default function TandaRitualLoop({ className = '' }: TandaRitualLoopProps) {
  return (
    <section
      className={`tanda-ritual-loop ${className}`}
      role="region"
      aria-label="Tanda ritual loop preview"
    >
      <div className="tanda-ritual-cloud cloud-one" aria-hidden="true" />
      <div className="tanda-ritual-cloud cloud-two" aria-hidden="true" />
      <div className="tanda-ritual-cloud cloud-three" aria-hidden="true" />

      <svg
        className="tanda-ritual-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="memory-line" d="M 13 43 C 27 24, 40 29, 49 49" pathLength="1" />
        <path className="fund-line" d="M 48 51 C 61 30, 76 32, 86 58" pathLength="1" />
      </svg>

      <div className="tanda-ritual-sparkles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <figure className="tanda-ritual-asset asset-tanda">
        <Image
          src="/toothfairy/animation/tanda-cartoon-mvp.png"
          alt="Tanda carries a glowing tooth through the Tooth Fairy Network ritual"
          fill
          priority
          sizes="(min-width: 1024px) 330px, 56vw"
          className="tanda-ritual-img"
        />
      </figure>

      <figure className="tanda-ritual-asset asset-keepsake" aria-hidden="true">
        <Image
          src="/toothfairy/animation/keepsake-pedestal-mvp.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 270px, 44vw"
          className="tanda-ritual-img"
        />
      </figure>

      <figure className="tanda-ritual-asset asset-piggy" aria-hidden="true">
        <Image
          src="/toothfairy/animation/piggy-cartoon-mvp.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 330px, 58vw"
          className="tanda-ritual-img"
        />
      </figure>

      <div className="tooth-memory-glow" aria-hidden="true" />
      <div className="ritual-coin coin-one" aria-hidden="true" />
      <div className="ritual-coin coin-two" aria-hidden="true" />

      <div className="tanda-ritual-tags" aria-label="Animation outcome">
        <p className="tanda-ritual-tag state-memory">Memory saved</p>
        <p className="tanda-ritual-tag state-fund">Smile Fund started</p>
      </div>

      <p className="sr-only">
        Tanda flies in with a glowing tooth, saves it as a keepsake, and guides
        a small coin of light into a parent-controlled Smile Fund piggy bank.
      </p>
    </section>
  );
}
