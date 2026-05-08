import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const TANDA_HERO_INTEGRATED_FPS = 30;
export const TANDA_HERO_INTEGRATED_DURATION_FRAMES = 600;
export const TANDA_HERO_INTEGRATED_WIDTH = 1280;
export const TANDA_HERO_INTEGRATED_HEIGHT = 800;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const soft = Easing.bezier(0.22, 0.82, 0.2, 1);
const pct = (frame: number) => frame / TANDA_HERO_INTEGRATED_DURATION_FRAMES;
const mix = (
  frame: number,
  input: number[],
  output: number[],
  easing = soft,
) => interpolate(pct(frame), input, output, { ...clamp, easing });
const linear = (frame: number, input: number[], output: number[]) =>
  interpolate(pct(frame), input, output, clamp);
const fadeIn = (frame: number, start: number, end: number) =>
  linear(frame, [start, end], [0, 1]);
const fadeOut = (frame: number, start: number, end: number) =>
  linear(frame, [start, end], [1, 0]);
const reveal = (frame: number, start: number, end: number) =>
  Math.max(0, Math.min(1, fadeIn(frame, start, end)));
const bezier = (
  a: number,
  b: number,
  c: number,
  d: number,
  t: number,
) => {
  const v = Math.max(0, Math.min(1, t));
  const u = 1 - v;
  return u * u * u * a + 3 * u * u * v * b + 3 * u * v * v * c + v * v * v * d;
};
const limit01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothProgress = (progress: number, start: number, end: number) =>
  soft(limit01((progress - start) / Math.max(0.001, end - start)));
const holdFade = (
  frame: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
) =>
  Math.max(
    0,
    Math.min(
      1,
      fadeIn(frame, enterStart, enterEnd),
      fadeOut(frame, exitStart, exitEnd),
    ),
  );

type PoseCue = {
  at: number;
  src: string;
};

const preToothPoses = [
  '01-entry-no-tooth-wing-up',
  '02-entry-no-tooth-wing-down',
  '03-searching',
  '04-spots-tooth',
  '05-reach-empty-hand',
  '06-grab-tooth',
  '07-lift-tooth-close',
  '08-carry-tooth-glow',
].map(
  (name) =>
    `toothfairy/animation/hero-pose-pack-v22-pre/tanda-hero-v22-pre-${name}.png`,
);

const ritualPoses = [
  '01-entry-wing-up',
  '02-entry-wing-down',
  '03-brake-near-photo',
  '04-phone-emerging',
  '05-phone-ready',
  '06-place-tooth',
  '07-photo-flash-empty-hand',
  '08-magic-pause',
  '09-two-hand-photo',
  '10-phone-tap',
  '11-two-thumb-type',
  '12-capture-complete',
  '13-notices-coin',
  '14-pickup-coin',
  '15-carry-coin',
  '16-release-coin',
  '17-empty-hand-after-release',
  '18-pig-glow-reaction',
  '19-turn-front',
  '20-wave-start',
  '21-wave-open',
  '22-wave-finish',
  '23-exit-wing-up',
  '24-exit-wing-down',
].map((name) => `toothfairy/animation/hero-pose-pack-v21/tanda-hero-v21-${name}.png`);

const poseCues: PoseCue[] = [
  [0.0, preToothPoses[0]],
  [0.145, preToothPoses[0]],
  [0.18, preToothPoses[1]],
  [0.214, preToothPoses[3]],
  [0.248, preToothPoses[4]],
  [0.275, preToothPoses[5]],
  [0.305, preToothPoses[6]],
  [0.36, preToothPoses[6]],
  [0.43, preToothPoses[6]],
  [0.49, ritualPoses[3]],
  [0.55, ritualPoses[4]],
  [0.61, ritualPoses[8]],
  [0.66, ritualPoses[10]],
  [0.715, ritualPoses[17]],
  [0.76, ritualPoses[17]],
  [0.815, ritualPoses[17]],
  [0.865, ritualPoses[17]],
  [0.905, ritualPoses[17]],
  [0.93, ritualPoses[17]],
  [0.955, ritualPoses[17]],
  [0.97, ritualPoses[18]],
  [0.982, ritualPoses[19]],
  [0.99, ritualPoses[20]],
  [0.996, ritualPoses[21]],
  [0.999, ritualPoses[23]],
].map(([at, src]) => ({ at: at as number, src: src as string }));

function usePosePair(frame: number) {
  const p = pct(frame);
  let index = 0;

  for (let i = 0; i < poseCues.length; i += 1) {
    if (p >= poseCues[i].at) {
      index = i;
    }
  }

  const current = poseCues[index];
  const next = poseCues[Math.min(index + 1, poseCues.length - 1)];
  const span = Math.max(0.001, next.at - current.at);
  const local = Math.max(0, Math.min(1, (p - current.at) / span));
  const blend = soft(
    Math.max(0, Math.min(1, (local - 0.1) / 0.9)),
  );

  return {
    current,
    next,
    currentOpacity: 1 - blend,
    nextOpacity: next.src === current.src ? 0 : blend,
  };
}

function ToothIcon({
  className,
  size = 54,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={(size / 64) * 76}
      viewBox="0 0 64 76"
      fill="none"
    >
      <path
        d="M32 5.5c-10.2 0-18.6 7.7-19.5 18.1-.6 6.5 1.3 12.4 3.2 18.5 1.4 4.6 2 10.9 3.2 17.1.9 4.5 3.2 8.8 6.8 8.8 3.3 0 4.4-4.8 5.1-11.1.3-2.9.8-5.4 1.2-6.7.4 1.3.9 3.8 1.2 6.7.8 6.3 1.9 11.1 5.2 11.1 3.6 0 5.9-4.3 6.8-8.8 1.2-6.2 1.8-12.5 3.2-17.1 1.9-6.1 3.8-12 3.2-18.5C50.6 13.2 42.2 5.5 32 5.5Z"
        fill="url(#heroIntegratedToothFill)"
        stroke="#d8bd93"
        strokeLinejoin="round"
        strokeWidth="2.3"
      />
      <path
        d="M21 25.5c6.4 2.7 15.8 2.7 22.2 0"
        stroke="#efdec4"
        strokeLinecap="round"
        strokeWidth="2.1"
      />
      <defs>
        <linearGradient
          id="heroIntegratedToothFill"
          x1="18"
          x2="50"
          y1="8"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffefa" />
          <stop offset="0.58" stopColor="#fff4df" />
          <stop offset="1" stopColor="#ead1a8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MemoryCard({ frame }: { frame: number }) {
  const opacity = holdFade(frame, 0.952, 0.982, 0.997, 1);
  const y = mix(frame, [0.952, 0.982, 0.994, 1], [46, 0, -4, 8]);
  const scale = mix(frame, [0.952, 0.982, 1], [0.72, 1, 0.98]);

  return (
    <article
      style={{
        position: 'absolute',
        right: 84,
        top: 138,
        zIndex: 8,
        width: 240,
        padding: 14,
        border: '1px solid rgba(227, 217, 196, 0.86)',
        borderRadius: 8,
        background:
          'linear-gradient(180deg, rgba(255,252,246,0.92), rgba(250,241,225,0.88))',
        boxShadow: '0 28px 54px rgba(47, 35, 80, 0.17)',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: '50% 72%',
      }}
    >
      <div
        style={{
          display: 'grid',
          aspectRatio: '1.08 / 1',
          placeItems: 'center',
          borderRadius: 6,
          background:
            'radial-gradient(circle at 50% 42%, rgba(255, 232, 154, 0.66), transparent 34%), linear-gradient(135deg, rgba(242, 230, 255, 0.92), rgba(255, 252, 246, 0.95))',
          boxShadow: 'inset 0 0 0 1px rgba(112,72,173,0.1)',
        }}
      >
        <ToothIcon size={64} />
      </div>
      <p
        style={{
          margin: '12px 0 0',
          color: '#687188',
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Live Memory
      </p>
      <strong
        style={{
          display: 'block',
          marginTop: 6,
          color: '#11234a',
          fontFamily: 'Georgia, serif',
          fontSize: 26,
          lineHeight: 1,
        }}
      >
        Saved
      </strong>
    </article>
  );
}

function SmileFundCard({ frame }: { frame: number }) {
  const opacity = holdFade(frame, 0.958, 0.986, 0.997, 1);
  const y = mix(frame, [0.958, 0.986, 0.995, 1], [56, 0, -5, 7]);
  const scale = mix(frame, [0.958, 0.986, 1], [0.72, 1, 0.985]);

  return (
    <article
      style={{
        position: 'absolute',
        right: 168,
        bottom: 52,
        zIndex: 9,
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 16,
        width: 470,
        minHeight: 142,
        alignItems: 'center',
        padding: 18,
        border: '1px solid rgba(227, 217, 196, 0.9)',
        borderRadius: 8,
        background:
          'linear-gradient(180deg, rgba(255,252,246,0.94), rgba(248,239,224,0.9))',
        boxShadow: '0 30px 58px rgba(47, 35, 80, 0.16)',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: '42% 80%',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: '#80889c',
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
          }}
        >
          Little Smile Fund
        </p>
        <strong
          style={{
            display: 'block',
            marginTop: 12,
            color: '#11234a',
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            lineHeight: 1,
          }}
        >
          $360
        </strong>
        <span
          style={{
            display: 'block',
            marginTop: 8,
            color: '#9aa1b1',
            fontSize: 15,
          }}
        >
          6 family gifts saved
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 104,
          border: '1px solid rgba(227,217,196,0.9)',
          borderRadius: 8,
          background: 'rgba(255,252,246,0.74)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 'auto 16px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 9,
            alignItems: 'end',
            height: '68%',
          }}
        >
          {[34, 48, 60, 82, 100].map((height) => (
            <span
              key={height}
              style={{
                display: 'block',
                height: `${height}%`,
                borderRadius: '999px 999px 0 0',
                background: 'linear-gradient(180deg, #5fd0b4, rgba(95,208,180,0.28))',
              }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function Tanda({ frame }: { frame: number }) {
  const { current, next, currentOpacity, nextOpacity } = usePosePair(frame);
  const progress = pct(frame);
  const entrada = Math.max(0, Math.min(1, (progress - 0.015) / 0.24));
  let baseX = bezier(-280, -118, 104, 228, entrada);
  let baseY = bezier(142, 78, 98, 184, entrada);

  if (progress >= 0.255 && progress < 0.34) {
    const t = soft((progress - 0.255) / 0.085);
    baseX = interpolate(t, [0, 1], [228, 238]);
    baseY = 184 + Math.sin(t * Math.PI) * -8;
  } else if (progress >= 0.34 && progress < 0.43) {
    const t = soft((progress - 0.34) / 0.09);
    baseX = bezier(238, 270, 284, 292, t);
    baseY = bezier(184, 246, 338, 398, t);
  } else if (progress >= 0.43 && progress < 0.755) {
    const t = soft((progress - 0.43) / 0.325);
    baseX = bezier(292, 278, 304, 336, t);
    baseY = bezier(398, 388, 382, 388, t);
  } else if (progress >= 0.755 && progress < 0.935) {
    const t = soft((progress - 0.755) / 0.18);
    baseX = bezier(336, 470, 694, 902, t);
    baseY = bezier(388, 330, 378, 386, t);
  } else if (progress >= 0.935 && progress < 0.982) {
    const t = soft((progress - 0.935) / 0.047);
    baseX = interpolate(t, [0, 1], [902, 930]);
    baseY = interpolate(t, [0, 1], [386, 332]);
  } else if (progress >= 0.982) {
    const t = soft((progress - 0.982) / 0.018);
    baseX = bezier(930, 1018, 1124, 1220, t);
    baseY = bezier(332, 250, 190, 132, t);
  }

  const x = baseX + Math.cos(progress * Math.PI * 3) * 1.6;
  const y = baseY + Math.sin(progress * Math.PI * 5) * 3.2;
  const scale = mix(
    frame,
    [0, 0.212, 0.34, 0.64, 0.835, 0.935, 1],
    [0.55, 0.68, 0.7, 0.67, 0.64, 0.66, 0.52],
  );
  const rotate = mix(
    frame,
    [0, 0.168, 0.255, 0.43, 0.64, 0.755, 0.935, 0.975, 1],
    [-7, -2, 3, -1, 1, -2, 4, -1, -8],
  ) + Math.sin(progress * Math.PI * 6) * 0.55;
  const opacity = holdFade(frame, 0.015, 0.08, 0.985, 1);
  const wingGlow = holdFade(frame, 0.56, 0.69, 0.8, 0.89) * 0.78 +
    holdFade(frame, 0.89, 0.97, 0.998, 1) * 0.68;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 14,
        width: 330,
        height: 330,
        opacity,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: '50% 58%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 28,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,232,150,0.46), transparent 64%)',
          filter: 'blur(10px)',
          opacity: wingGlow,
        }}
      />
      <Img
        src={staticFile(current.src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: currentOpacity,
          filter:
            'drop-shadow(0 22px 30px rgba(47,35,80,0.18)) drop-shadow(0 0 18px rgba(244,200,101,0.18))',
        }}
      />
      <Img
        src={staticFile(next.src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: nextOpacity,
          filter:
            'drop-shadow(0 22px 30px rgba(47,35,80,0.18)) drop-shadow(0 0 18px rgba(244,200,101,0.18))',
        }}
      />
    </div>
  );
}

function getTandaOverlayMotion(frame: number) {
  const progress = pct(frame);
  const entrada = limit01((progress - 0.015) / 0.24);
  let baseX = bezier(-280, -118, 104, 228, entrada);
  let baseY = bezier(142, 78, 98, 184, entrada);

  if (progress >= 0.255 && progress < 0.34) {
    const t = smoothProgress(progress, 0.255, 0.34);
    baseX = interpolate(t, [0, 1], [228, 238]);
    baseY = 184 + Math.sin(t * Math.PI) * -8;
  } else if (progress >= 0.34 && progress < 0.43) {
    const t = smoothProgress(progress, 0.34, 0.43);
    baseX = bezier(238, 270, 284, 292, t);
    baseY = bezier(184, 246, 338, 398, t);
  } else if (progress >= 0.43 && progress < 0.755) {
    const t = smoothProgress(progress, 0.43, 0.755);
    baseX = bezier(292, 278, 304, 336, t);
    baseY = bezier(398, 388, 382, 388, t);
  } else if (progress >= 0.755 && progress < 0.935) {
    const t = smoothProgress(progress, 0.755, 0.935);
    baseX = bezier(336, 470, 694, 902, t);
    baseY = bezier(388, 330, 378, 386, t);
  } else if (progress >= 0.935 && progress < 0.982) {
    const t = smoothProgress(progress, 0.935, 0.982);
    baseX = interpolate(t, [0, 1], [902, 930]);
    baseY = interpolate(t, [0, 1], [386, 332]);
  } else if (progress >= 0.982) {
    const t = smoothProgress(progress, 0.982, 1);
    baseX = bezier(930, 1018, 1124, 1220, t);
    baseY = bezier(332, 250, 190, 132, t);
  }

  const scale = mix(
    frame,
    [0, 0.212, 0.34, 0.64, 0.835, 0.935, 1],
    [0.55, 0.68, 0.7, 0.67, 0.64, 0.66, 0.52],
  );
  return {
    x: baseX + Math.cos(progress * Math.PI * 3) * 1.6,
    y: baseY + Math.sin(progress * Math.PI * 5) * 3.2,
    scale,
    size: 330 * scale,
  };
}

function CoinToken({
  opacity,
  rotate,
  scale,
}: {
  opacity: number;
  rotate: number;
  scale: number;
}) {
  return (
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        color: '#87531d',
        fontFamily: 'Georgia, serif',
        fontSize: 30,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #fff0a9, #a66420)',
        border: '4px solid rgba(133,78,19,0.64)',
        boxShadow: '0 0 34px rgba(255,220,103,0.72)',
        opacity,
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      $
    </div>
  );
}

function HeroToothOverlay({ frame }: { frame: number }) {
  const progress = pct(frame);
  const opacity = holdFade(frame, 0.47, 0.54, 0.792, 0.842);
  if (opacity <= 0.001) {
    return null;
  }

  const motion = getTandaOverlayMotion(frame);
  const settle = smoothProgress(progress, 0.73, 0.81);
  const phoneX = motion.x + motion.size * 0.665;
  const phoneY = motion.y + motion.size * 0.43;
  const handX = motion.x + motion.size * 0.585;
  const handY = motion.y + motion.size * 0.515;
  const toothX = interpolate(settle, [0, 1], [phoneX, handX]);
  const toothY = interpolate(settle, [0, 1], [phoneY, handY]);
  const scale = mix(frame, [0.47, 0.56, 0.76, 0.842], [0.76, 1.05, 1, 0.58]);

  return (
    <div
      style={{
        position: 'absolute',
        left: toothX - 18,
        top: toothY - 22,
        zIndex: 16,
        opacity,
        transform: `scale(${scale})`,
        filter: 'drop-shadow(0 0 16px rgba(255,232,150,0.76))',
      }}
    >
      <ToothIcon size={36} />
    </div>
  );
}

function HeroCoinOverlay({ frame }: { frame: number }) {
  const progress = pct(frame);
  const holdOpacity = holdFade(frame, 0.682, 0.76, 0.925, 0.946);
  const dropOpacity = holdFade(frame, 0.925, 0.94, 0.954, 0.964);
  const opacity = Math.max(holdOpacity, dropOpacity);
  if (opacity <= 0.001) {
    return null;
  }

  const motion = getTandaOverlayMotion(frame);
  const preX = motion.x + motion.size * 0.55;
  const preY = motion.y + motion.size * 0.49;
  const carryX = motion.x + motion.size * 0.55;
  const carryY = motion.y + motion.size * 0.49;
  const carryBlend = smoothProgress(progress, 0.855, 0.915);
  let coinX = interpolate(carryBlend, [0, 1], [preX, carryX]);
  let coinY = interpolate(carryBlend, [0, 1], [preY, carryY]);

  if (progress >= 0.925) {
    const drop = smoothProgress(progress, 0.925, 0.95);
    coinX = bezier(coinX, 1048, 1128, 1148, drop);
    coinY = bezier(coinY, 444, 498, 528, drop);
  }

  const scale = mix(frame, [0.682, 0.76, 0.915, 0.95, 0.964], [0.18, 0.98, 0.88, 0.56, 0.18]);
  const rotate = mix(frame, [0.682, 0.89, 0.95, 0.99], [-14, 5, 82, 92]);
  const coinBirth = holdFade(frame, 0.68, 0.76, 0.8, 0.86);

  return (
    <div
      style={{
        position: 'absolute',
        left: coinX - 29,
        top: coinY - 29,
        zIndex: 16,
        filter: `drop-shadow(0 0 ${18 + coinBirth * 20}px rgba(255,220,103,${0.72 + coinBirth * 0.18}))`,
      }}
    >
      <CoinToken opacity={opacity} rotate={rotate} scale={scale} />
    </div>
  );
}

function Sparkles({ frame }: { frame: number }) {
  const sparkles = [
    [225, 290, 0],
    [315, 535, 0.17],
    [410, 614, 0.31],
    [580, 372, 0.47],
    [700, 620, 0.62],
    [900, 250, 0.21],
    [1000, 555, 0.74],
    [1110, 425, 0.38],
  ];
  const burst = Math.max(
    holdFade(frame, 0.48, 0.56, 0.66, 0.72),
    holdFade(frame, 0.68, 0.76, 0.84, 0.89),
    holdFade(frame, 0.86, 0.9, 0.98, 1) * 0.8,
  );

  return (
    <>
      {sparkles.map(([left, top, offset]) => {
        const local = ((pct(frame) + offset) % 0.34) / 0.34;
        const twinkle = local < 0.44 ? local / 0.44 : (1 - local) / 0.56;
        return (
          <span
            key={`${left}-${top}`}
            style={{
              position: 'absolute',
              left,
              top,
              zIndex: 13,
              width: 8,
              height: 8,
              borderRadius: 2,
              background: '#fff1a7',
              boxShadow: '0 0 14px rgba(244, 200, 101, 0.9)',
              opacity: 0.18 + burst * 0.58 + twinkle * 0.22,
              transform: `rotate(45deg) scale(${0.55 + burst * 0.65 + twinkle * 0.28})`,
            }}
          />
        );
      })}
    </>
  );
}

export const TandaHeroIntegratedRitual: React.FC = () => {
  const frame = useCurrentFrame();
  const p = pct(frame);
  const sourcePickup = reveal(frame, 0.225, 0.268);
  const sourceOpacity = 1 - sourcePickup;
  const phoneMagic = holdFade(frame, 0.52, 0.675, 0.75, 0.835);
  const photoFlash = holdFade(frame, 0.61, 0.65, 0.695, 0.745);
  const pigPulse = Math.max(
    holdFade(frame, 0.68, 0.76, 0.89, 0.935),
    holdFade(frame, 0.895, 0.955, 0.996, 1),
  );
  const ambient = 0.8 + Math.sin(p * Math.PI * 2) * 0.04;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 88% 7%, rgba(216, 164, 60, 0.22), transparent 310px), radial-gradient(circle at 9% 4%, rgba(112, 72, 173, 0.13), transparent 330px), linear-gradient(180deg, #fbf7ee 0%, #f5efe2 100%)',
        color: '#11234a',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -60,
          opacity: ambient,
          background:
            'radial-gradient(circle at 44% 54%, rgba(255,230,152,0.2), transparent 360px), radial-gradient(circle at 63% 62%, rgba(112,72,173,0.08), transparent 340px)',
        }}
      />
      <svg
        viewBox="0 0 1280 800"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.54 }}
      >
        <path
          d="M-110 610 C 165 472, 340 475, 528 362 S 884 170, 1370 232"
          fill="none"
          stroke="rgba(216,164,60,.26)"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M-40 680 C 180 548, 408 584, 620 454 S 964 310, 1300 348"
          fill="none"
          stroke="rgba(112,72,173,.12)"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 286,
          top: 70,
          width: 858,
          height: 560,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.74)',
          borderRadius: 8,
          boxShadow: '0 32px 72px rgba(47,35,80,0.16)',
        }}
      >
        <Img
          src={staticFile('toothfairy/visual-system/hero-family-v1.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 16% 12%, rgba(255,252,246,0.88), transparent 250px), linear-gradient(90deg, rgba(251,247,238,0.78), transparent 48%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 405,
          top: 236,
          zIndex: 5,
          display: 'grid',
          width: 38,
          height: 44,
          placeItems: 'center',
          filter: 'drop-shadow(0 0 18px rgba(216,164,60,0.68))',
          opacity: sourceOpacity,
          transform: `scale(${1 + sourcePickup * 0.12})`,
        }}
      >
        <ToothIcon size={38} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 182,
          top: 276,
          zIndex: 11,
          width: 480,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,241,178,0.56), transparent 62%), radial-gradient(circle, rgba(138,99,201,0.2), transparent 72%)',
          filter: 'blur(18px)',
          opacity: Math.max(phoneMagic * 0.7, photoFlash),
        }}
      />

      <MemoryCard frame={frame} />
      <SmileFundCard frame={frame} />

      <div
        style={{
          position: 'absolute',
          right: 22,
          bottom: 70,
          zIndex: 8,
          width: 260,
          transform: `translateY(${mix(frame, [0.895, 0.955, 0.992, 1], [0, -8, 0, 0])}px) scale(${mix(frame, [0.895, 0.955, 0.992], [1, 1.045, 1])})`,
          transformOrigin: '50% 82%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '8% 2% 2% 4%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,220,103,0.74), rgba(255,190,70,0.2) 52%, transparent 74%)',
            filter: 'blur(14px)',
            opacity: pigPulse,
            transform: `scale(${0.9 + pigPulse * 0.18})`,
          }}
        />
        <Img
          src={staticFile('toothfairy/animation/layered/piggy-cutout-soft-no-coin.png')}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            width: '100%',
            filter: 'drop-shadow(0 24px 34px rgba(47,35,80,0.18))',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '43%',
            top: '17%',
            zIndex: 2,
            width: 56,
            height: 22,
            borderRadius: '50%',
            border: '3px solid rgba(255,240,169,0.72)',
            background: 'rgba(255,220,103,0.36)',
            opacity: pigPulse,
          }}
        />
      </div>

      <Tanda frame={frame} />
      <HeroCoinOverlay frame={frame} />
      <Sparkles frame={frame} />
    </AbsoluteFill>
  );
};
