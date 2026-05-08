import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const TANDA_RITUAL_FPS = 30;
export const TANDA_RITUAL_DURATION_FRAMES = 288;
export const TANDA_RITUAL_WIDTH = 1440;
export const TANDA_RITUAL_HEIGHT = 900;

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const soft = Easing.bezier(0.2, 0.84, 0.24, 1);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const pct = (frame: number) => (frame / TANDA_RITUAL_DURATION_FRAMES) * 100;
const k = (frame: number, input: number[], output: number[], easing = soft) =>
  interpolate(pct(frame), input, output, { ...clamp, easing });
const ko = (frame: number, input: number[], output: number[]) =>
  interpolate(pct(frame), input, output, clamp);

function Tooth({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={(size / 74) * 84} viewBox="0 0 74 84">
      <path
        d="M36.7 6.4c9.8-5.5 24.6 1 27.7 13.6 2.8 11.3-3.5 24.9-7.2 35.2-2.5 7-3.5 20.2-11.1 20.7-5.4.4-4.2-13.5-9.6-13.5-5.2 0-4.8 13.5-10.5 13.1-7.9-.5-8.6-13.1-11.2-20.2C10.8 44.7 4.6 31.1 7.5 19.9 10.8 7.2 26.8 1 36.7 6.4Z"
        fill="url(#tandaRitualTooth)"
      />
      <path
        d="M21.7 15.3c5.9-4.2 13.8 1.2 15 1.9 5.4-4.7 13.3-5.4 18.4-.2"
        fill="none"
        stroke="rgba(255,255,255,.78)"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <defs>
        <radialGradient id="tandaRitualTooth" cx="32%" cy="22%" r="82%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="48%" stopColor="#fff4ce" />
          <stop offset="100%" stopColor="#d9a94f" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function StoryCard({ compact = false }: { compact?: boolean }) {
  const w = compact ? 132 : 150;
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        justifyItems: 'center',
        alignContent: 'center',
        gap: compact ? 10 : 12,
        width: w,
        height: compact ? 184 : 210,
        padding: 18,
        border: '1px solid rgba(255,239,186,.9)',
        borderRadius: 20,
        background:
          'linear-gradient(160deg, rgba(255,255,255,.3), rgba(139,103,206,.25)), linear-gradient(180deg, rgba(71,54,150,.62), rgba(141,112,205,.46))',
        boxShadow:
          'inset 0 0 0 7px rgba(255,244,203,.13), 0 0 28px rgba(255,221,137,.62)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,238,165,.25), transparent 66%)',
        }}
      />
      <Tooth size={compact ? 42 : 48} />
      <div
        style={{
          color: '#ffe99c',
          fontSize: compact ? 13 : 15,
          fontWeight: 800,
          letterSpacing: '0.04em',
        }}
      >
        TOOTH STORY
      </div>
      {[78, 70, 62].map((width) => (
        <div
          key={width}
          style={{
            width: `${width}%`,
            height: 4,
            borderRadius: 999,
            background: 'rgba(255,230,154,.78)',
          }}
        />
      ))}
      <div
        style={{
          width: 18,
          height: 16,
          background: 'rgba(255,229,157,.8)',
          clipPath: 'polygon(50% 100%, 0 42%, 18% 5%, 50% 24%, 82% 5%, 100% 42%)',
        }}
      />
    </div>
  );
}

function Sparkles({ frame }: { frame: number }) {
  const points = [
    [170, 190],
    [260, 610],
    [410, 150],
    [510, 720],
    [610, 250],
    [705, 525],
    [795, 175],
    [930, 650],
    [1010, 230],
    [1190, 140],
    [1270, 630],
    [1125, 735],
    [345, 455],
    [835, 400],
    [965, 480],
    [1305, 330],
  ];

  return (
    <>
      {points.map(([left, top], index) => {
        const local = ((frame / TANDA_RITUAL_FPS + index * 0.23) % 2.9) / 2.9;
        const opacity =
          local < 0.42 ? local / 0.42 : local < 0.7 ? 0.9 - ((local - 0.42) / 0.28) * 0.62 : 0;
        return (
          <div
            key={`${left}-${top}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#fff4c7',
              boxShadow: '0 0 14px rgba(255,225,139,.85)',
              opacity,
              transform: `scale(${0.55 + opacity * 0.65})`,
            }}
          />
        );
      })}
    </>
  );
}

export const TandaRitualHero: React.FC = () => {
  const frame = useCurrentFrame();
  const ambientOpacity = k(frame, [0, 50, 82, 100], [0.58, 0.88, 0.88, 0.58]);
  const ambientScale = k(frame, [0, 50, 82, 100], [1, 1.035, 1.035, 1]);

  const trailOpacity = ko(frame, [0, 5, 16, 58, 88, 100], [0, 0, 0.9, 0.9, 0, 0]);
  const trailX = k(frame, [0, 74, 100], [-78, 115, 205]);
  const trailY = k(frame, [0, 74, 100], [76, -32, -54]);
  const trailRotate = k(frame, [0, 74, 100], [-28, 8, 22]);
  const trailScale = k(frame, [0, 74, 100], [0.58, 1.04, 1.14]);

  const toothOpacity = ko(frame, [0, 11, 20, 46, 55, 100], [0, 1, 1, 1, 0, 0]);
  const toothX = k(frame, [0, 20, 32, 46, 55], [-260, -230, 0, 20, 20]);
  const toothY = k(frame, [0, 20, 32, 46, 55], [-132, -118, 0, -126, -126]);
  const toothScale = k(frame, [0, 20, 32, 46, 55], [0.58, 0.62, 1, 0.58, 0.18]);
  const toothRotate = k(frame, [0, 20, 32, 46], [-14, -10, 0, 5]);

  const cardOpacity = ko(frame, [0, 31, 43, 55, 65, 100], [0, 0, 1, 1, 0, 0]);
  const cardY = k(frame, [31, 43, 65], [50, 0, 0]);
  const cardRotate = k(frame, [31, 43, 65], [-6, 2, 1]);
  const cardScale = k(frame, [31, 43, 65], [0.48, 1, 0.92]);

  const vaultOpacity = ko(frame, [0, 47, 58, 90, 100], [0, 0, 1, 1, 0]);
  const vaultScale = k(frame, [47, 58, 90, 100], [0.78, 1, 1.02, 0.96]);

  const coinOpacity = ko(frame, [0, 60, 64, 83, 88, 100], [0, 0, 1, 0.86, 0, 0]);
  const coinX = k(frame, [60, 64, 74, 83, 88], [0, 30, 345, 504, 520]);
  const coinY = k(frame, [60, 64, 74, 83, 88], [0, -36, -144, 0, 36]);
  const coinScale = k(frame, [60, 64, 74, 83, 88], [0.4, 0.72, 0.98, 0.62, 0.08]);
  const coinRotate = k(frame, [60, 64, 74, 83, 88], [0, 120, 280, 420, 540]);

  const piggyOpacity = ko(frame, [0, 65, 72, 92, 100], [0, 0, 1, 1, 0]);
  const piggyX = k(frame, [65, 72, 92, 100], [44, 0, 0, 18]);
  const piggyY = k(frame, [65, 72, 85, 92, 100], [14, 0, -7, 0, 4]);
  const piggyScale = k(frame, [65, 72, 85, 92, 100], [0.88, 1, 1.035, 1, 0.96]);
  const piggyGlowOpacity = ko(frame, [0, 75, 84, 93, 100], [0, 0, 0.9, 0.9, 0]);
  const piggyGlowScale = k(frame, [75, 84, 100], [0.72, 1.02, 1.08]);

  const tandaOpacity = ko(frame, [0, 8, 92, 100], [0, 1, 1, 0]);
  const tandaX = k(frame, [0, 8, 18, 28, 33, 48, 63, 72, 80, 92, 100], [-128, -24, 162, 294, 354, 360, 312, 414, 582, 618, 684]);
  const tandaY = k(frame, [0, 8, 18, 28, 33, 48, 63, 72, 80, 92, 100], [54, 4, -28, 21, 76, -45, -6, 24, 69, 24, -24]);
  const tandaRotate = k(frame, [0, 8, 18, 33, 48, 63, 72, 80, 92, 100], [-9, -5, 3, 2, -2, -6, 2, 7, 0, 4]);
  const tandaScale = k(frame, [0, 18, 33, 48, 72, 100], [0.7, 0.84, 0.76, 0.7, 0.68, 0.64]);
  const tandaWithToothOpacity = tandaOpacity * ko(frame, [0, 34, 37, 100], [1, 1, 0, 0]);
  const tandaAfterOpacity = tandaOpacity * ko(frame, [0, 34, 38, 92, 100], [0, 0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 78% 16%, rgba(252,207,112,.32), transparent 320px), radial-gradient(circle at 16% 20%, rgba(172,134,231,.28), transparent 360px), linear-gradient(135deg, #fff8ed 0%, #f5e9df 48%, #f1e8ff 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          opacity: ambientOpacity,
          transform: `scale(${ambientScale})`,
          background:
            'radial-gradient(circle at 50% 56%, rgba(255,231,162,.32), transparent 380px), linear-gradient(115deg, transparent 0 34%, rgba(255,255,255,.23) 45%, transparent 56% 100%)',
        }}
      />
      <div style={{ position: 'absolute', right: 100, top: 150, width: 230, height: 72, borderRadius: 999, background: 'rgba(255,255,255,.38)', filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', left: 110, bottom: 150, width: 330, height: 88, borderRadius: 999, background: 'rgba(255,255,255,.32)', filter: 'blur(1px)' }} />

      <div style={{ position: 'absolute', left: 72, top: 135, width: 922, height: 486, border: '2px solid rgba(255,224,145,.38)', borderLeftColor: 'rgba(255,246,201,.86)', borderTopColor: 'rgba(255,235,179,.7)', borderRadius: '50%', filter: 'drop-shadow(0 0 14px rgba(255,214,118,.52))', opacity: trailOpacity, transform: `translate3d(${trailX}px, ${trailY}px, 0) rotate(${trailRotate}deg) scale(${trailScale})` }} />

      <div style={{ position: 'absolute', left: 562, top: 522, width: 288, height: 63, border: '1px solid rgba(175,130,68,.28)', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 28%, rgba(255,249,218,.96), rgba(255,205,99,.28) 47%, transparent 72%), linear-gradient(180deg, rgba(255,255,255,.72), rgba(190,164,211,.32))', boxShadow: 'inset 0 0 0 4px rgba(255,238,178,.38), 0 24px 40px rgba(117,82,140,.18)', opacity: ko(frame, [0, 15, 24, 63, 73, 100], [0, 0, 1, 1, 0, 0]), transform: `translateY(${k(frame, [15, 24, 73], [24, 0, 7])}px) scale(${k(frame, [15, 24, 73], [0.72, 1, 0.92])})` }} />

      <div style={{ position: 'absolute', left: 671, top: 441, width: 80, opacity: toothOpacity, filter: 'drop-shadow(0 0 12px rgba(255,237,176,.94)) drop-shadow(0 0 24px rgba(239,184,70,.46))', transform: `translate3d(${toothX}px, ${toothY}px, 0) rotate(${toothRotate}deg) scale(${toothScale})`, transformOrigin: '50% 76%' }}>
        <Tooth size={80} />
      </div>

      <div style={{ position: 'absolute', left: 610, top: 234, opacity: cardOpacity, transform: `translateY(${cardY}px) rotate(${cardRotate}deg) scale(${cardScale})` }}>
        <StoryCard />
      </div>

      <div style={{ position: 'absolute', left: 512, top: 216, width: 318, height: 362, opacity: vaultOpacity, transform: `scale(${vaultScale})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,246,210,.72)', borderRadius: '42% 42% 12% 12% / 30% 30% 12% 12%', background: 'linear-gradient(115deg, rgba(255,255,255,.38), transparent 32% 64%, rgba(255,255,255,.22)), rgba(255,243,198,.14)', boxShadow: 'inset 0 0 22px rgba(255,255,255,.36), 0 0 34px rgba(255,214,116,.62)' }} />
        <div style={{ position: 'absolute', left: 73, top: 43 }}>
          <StoryCard compact />
        </div>
        <div style={{ position: 'absolute', right: 30, bottom: 52, width: 68, height: 68, borderRadius: '50%', background: 'radial-gradient(circle at 36% 28%, #fff1a8, #d79b32 58%, #9b621d)', boxShadow: '0 0 18px rgba(255,213,104,.62)' }} />
      </div>

      <div style={{ position: 'absolute', left: 690, top: 378, display: 'grid', placeItems: 'center', width: 78, height: 78, borderRadius: '50%', border: '3px solid rgba(161,104,28,.38)', background: 'radial-gradient(circle at 36% 26%, #fff3b2, #e6ad3f 54%, #b87525)', color: 'rgba(125,75,18,.8)', fontSize: 40, fontWeight: 900, boxShadow: 'inset 0 0 0 6px rgba(255,235,154,.28), 0 0 18px rgba(255,205,94,.68)', opacity: coinOpacity, transform: `translate3d(${coinX}px, ${coinY}px, 0) rotateY(${coinRotate}deg) scale(${coinScale})` }}>$</div>

      <div style={{ position: 'absolute', right: 100, bottom: 135, width: 360, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,105,.72), transparent 68%)', filter: 'blur(15px)', opacity: piggyGlowOpacity, transform: `scale(${piggyGlowScale})` }} />
      <Img src={staticFile('toothfairy/animation/layered/piggy-cutout-soft.png')} style={{ position: 'absolute', right: 86, bottom: 90, width: 368, opacity: piggyOpacity, transform: `translate3d(${piggyX}px, ${piggyY}px, 0) scale(${piggyScale})`, transformOrigin: '50% 82%' }} />

      <Img src={staticFile('toothfairy/animation/layered/tanda-cutout-soft.png')} style={{ position: 'absolute', left: 86, top: 198, width: 304, opacity: tandaWithToothOpacity, filter: 'drop-shadow(0 18px 28px rgba(55,39,98,.14)) drop-shadow(0 0 13px rgba(255,230,150,.42))', transform: `translate3d(${tandaX}px, ${tandaY}px, 0) rotate(${tandaRotate}deg) scale(${tandaScale})`, transformOrigin: '54% 58%' }} />
      <Img src={staticFile('toothfairy/animation/layered/tanda-cutout-soft-no-tooth.png')} style={{ position: 'absolute', left: 86, top: 198, width: 304, opacity: tandaAfterOpacity, filter: 'drop-shadow(0 18px 28px rgba(55,39,98,.14)) drop-shadow(0 0 13px rgba(255,230,150,.42))', transform: `translate3d(${tandaX}px, ${tandaY}px, 0) rotate(${tandaRotate}deg) scale(${tandaScale})`, transformOrigin: '54% 58%' }} />

      <Sparkles frame={frame} />
    </AbsoluteFill>
  );
};
