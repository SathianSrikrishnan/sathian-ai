'use client';

import { useState, useEffect } from 'react';
import { ToothState, saveToothState, getToothStates } from '@/lib/supabase';

// Baby teeth positions (20 total)
// Upper: 10 teeth (positions 0-9)
// Lower: 10 teeth (positions 10-19)
const TOOTH_NAMES = [
  // Upper row (right to left from viewer perspective)
  'Second Molar', 'First Molar', 'Canine', 'Lateral Incisor', 'Central Incisor',
  'Central Incisor', 'Lateral Incisor', 'Canine', 'First Molar', 'Second Molar',
  // Lower row (right to left from viewer perspective)
  'Second Molar', 'First Molar', 'Canine', 'Lateral Incisor', 'Central Incisor',
  'Central Incisor', 'Lateral Incisor', 'Canine', 'First Molar', 'Second Molar',
];

const TOOTH_SHORT_NAMES = [
  'M2', 'M1', 'C', 'LI', 'CI', 'CI', 'LI', 'C', 'M1', 'M2',
  'M2', 'M1', 'C', 'LI', 'CI', 'CI', 'LI', 'C', 'M1', 'M2',
];

// Tooth widths vary by type - molars wider, incisors narrower, canines medium
const TOOTH_WIDTHS: Record<string, number> = {
  'M2': 22,
  'M1': 20,
  'C': 16,
  'LI': 15,
  'CI': 16,
};

const TOOTH_HEIGHTS: Record<string, number> = {
  'M2': 20,
  'M1': 19,
  'C': 22,
  'LI': 20,
  'CI': 20,
};

// Compute U-shaped arch positions for 10 teeth
// The arch is a parabolic/horseshoe curve
// Upper arch: opens downward (teeth crowns face down toward mouth center)
// Lower arch: opens upward (teeth crowns face up toward mouth center)
function computeArchPositions(
  cx: number,
  cy: number,
  archWidth: number,
  archDepth: number,
  isUpper: boolean
): { x: number; y: number; angle: number }[] {
  // Place teeth along a U-shape using parameterized positions
  // The U goes from left molar around the front to right molar
  // We use a parabola: y = a*x^2 shifted and scaled
  //
  // For 10 teeth, parameter t goes from -1 to 1 (left to right)
  // Spacing is tighter at front (incisors) and wider at back (molars)
  const positions: { x: number; y: number; angle: number }[] = [];

  // Non-uniform spacing: molars need more room, incisors less
  // Teeth order: M2, M1, C, LI, CI | CI, LI, C, M1, M2
  // Cumulative angular positions along the arch
  const toothAngles = [
    -82, -65, -48, -28, -12, // right side: M2, M1, C, LI, CI
    12, 28, 48, 65, 82,      // left side: CI, LI, C, M1, M2
  ];

  for (let i = 0; i < 10; i++) {
    const angleDeg = toothAngles[i];
    const angleRad = (angleDeg * Math.PI) / 180;

    // Elliptical arch
    const halfW = archWidth / 2;
    const x = cx + halfW * Math.sin(angleRad);
    // For upper arch: back teeth higher (smaller y), front teeth lower (larger y)
    // For lower arch: back teeth lower (larger y), front teeth higher (smaller y)
    const archY = archDepth * (1 - Math.cos(angleRad));
    const y = isUpper ? cy - archDepth + archY : cy + archDepth - archY;

    // Tooth rotation: teeth angle outward from center of arch
    // Upper teeth: roots point up, crown points down
    // Lower teeth: roots point down, crown points up
    const rotAngle = isUpper
      ? angleDeg * 0.4 // slight outward tilt
      : -angleDeg * 0.4;

    positions.push({ x, y, angle: rotAngle });
  }

  return positions;
}

interface TeethMouthProps {
  childName: string;
  onLostTeethChange?: (count: number) => void;
}

export default function TeethMouth({ childName, onLostTeethChange }: TeethMouthProps) {
  const [teethStates, setTeethStates] = useState<ToothState[]>(
    Array(20).fill('healthy')
  );
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [sparkle, setSparkle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const records = await getToothStates(childName);
        if (records.length > 0) {
          const newStates: ToothState[] = Array(20).fill('healthy');
          records.forEach((r) => {
            if (r.tooth_position >= 0 && r.tooth_position < 20) {
              newStates[r.tooth_position] = r.state;
            }
          });
          setTeethStates(newStates);

          // Notify parent of lost teeth count
          const lostCount = newStates.filter(s => s === 'lost').length;
          onLostTeethChange?.(lostCount);
        }
      } catch (error) {
        console.error('Error loading tooth states:', error);
      }
      setLoading(false);
    }
    loadStates();
  }, [childName, onLostTeethChange]);

  const cycleToothState = async (index: number) => {
    const currentState = teethStates[index];
    const nextState: ToothState =
      currentState === 'healthy' ? 'wiggly' :
      currentState === 'wiggly' ? 'lost' : 'healthy';

    const newStates = [...teethStates];
    newStates[index] = nextState;
    setTeethStates(newStates);

    // Sparkle effect when marking as lost
    if (nextState === 'lost') {
      setSparkle(index);
      setTimeout(() => setSparkle(null), 800);
    }

    // Save to Supabase
    await saveToothState(childName, index, nextState);

    // Update lost count
    const lostCount = newStates.filter(s => s === 'lost').length;
    onLostTeethChange?.(lostCount);
  };

  const getToothColor = (state: ToothState) => {
    switch (state) {
      case 'healthy': return '#FFFEF5';
      case 'wiggly': return '#FFE4B5';
      case 'lost': return 'transparent';
    }
  };

  const getToothStroke = (state: ToothState) => {
    switch (state) {
      case 'healthy': return '#C4B5A0';
      case 'wiggly': return '#DDA853';
      case 'lost': return '#9DC183';
    }
  };

  // SVG center and arch parameters
  const SVG_W = 460;
  const SVG_H = 440;
  const CX = SVG_W / 2;
  const CY = SVG_H / 2;

  // Compute arch positions
  const upperPositions = computeArchPositions(CX, CY - 20, 220, 100, true);
  const lowerPositions = computeArchPositions(CX, CY + 20, 210, 95, false);

  // Build a tooth shape path. Molars are boxy/rounded, canines are pointy, incisors are flat-topped.
  const toothPath = (
    w: number,
    h: number,
    toothType: string,
    isUpper: boolean
  ): string => {
    const hw = w / 2;
    const hh = h / 2;

    // Crown is the visible part (faces mouth interior)
    // Root faces gums (we don't draw roots, just crown + body)
    // For upper teeth: crown at bottom, root at top
    // For lower teeth: crown at top, root at bottom

    if (toothType === 'C') {
      // Canine: pointed crown
      if (isUpper) {
        return `
          M ${-hw + 2} ${-hh}
          Q ${-hw - 1} ${-hh + 2}, ${-hw} ${0}
          Q ${-hw + 1} ${hh - 4}, ${0} ${hh + 2}
          Q ${hw - 1} ${hh - 4}, ${hw} ${0}
          Q ${hw + 1} ${-hh + 2}, ${hw - 2} ${-hh}
          Q ${0} ${-hh - 3}, ${-hw + 2} ${-hh}
        `;
      } else {
        return `
          M ${-hw + 2} ${hh}
          Q ${-hw - 1} ${hh - 2}, ${-hw} ${0}
          Q ${-hw + 1} ${-hh + 4}, ${0} ${-hh - 2}
          Q ${hw - 1} ${-hh + 4}, ${hw} ${0}
          Q ${hw + 1} ${hh - 2}, ${hw - 2} ${hh}
          Q ${0} ${hh + 3}, ${-hw + 2} ${hh}
        `;
      }
    } else if (toothType.startsWith('M')) {
      // Molar: wider, more boxy/rounded
      const r = 4;
      if (isUpper) {
        return `
          M ${-hw + r} ${-hh}
          Q ${-hw} ${-hh}, ${-hw} ${-hh + r}
          L ${-hw} ${hh - r}
          Q ${-hw} ${hh}, ${-hw + r} ${hh}
          Q ${-hw/3} ${hh + 3}, ${0} ${hh + 1}
          Q ${hw/3} ${hh + 3}, ${hw - r} ${hh}
          Q ${hw} ${hh}, ${hw} ${hh - r}
          L ${hw} ${-hh + r}
          Q ${hw} ${-hh}, ${hw - r} ${-hh}
          Q ${0} ${-hh - 2}, ${-hw + r} ${-hh}
        `;
      } else {
        return `
          M ${-hw + r} ${hh}
          Q ${-hw} ${hh}, ${-hw} ${hh - r}
          L ${-hw} ${-hh + r}
          Q ${-hw} ${-hh}, ${-hw + r} ${-hh}
          Q ${-hw/3} ${-hh - 3}, ${0} ${-hh - 1}
          Q ${hw/3} ${-hh - 3}, ${hw - r} ${-hh}
          Q ${hw} ${-hh}, ${hw} ${-hh + r}
          L ${hw} ${hh - r}
          Q ${hw} ${hh}, ${hw - r} ${hh}
          Q ${0} ${hh + 2}, ${-hw + r} ${hh}
        `;
      }
    } else {
      // Incisor: flat/rectangular with rounded top
      if (isUpper) {
        return `
          M ${-hw + 2} ${-hh}
          Q ${-hw - 1} ${-hh}, ${-hw} ${-hh + 4}
          L ${-hw + 1} ${hh - 3}
          Q ${-hw + 1} ${hh + 1}, ${0} ${hh + 2}
          Q ${hw - 1} ${hh + 1}, ${hw - 1} ${hh - 3}
          L ${hw} ${-hh + 4}
          Q ${hw + 1} ${-hh}, ${hw - 2} ${-hh}
          Q ${0} ${-hh - 2}, ${-hw + 2} ${-hh}
        `;
      } else {
        return `
          M ${-hw + 2} ${hh}
          Q ${-hw - 1} ${hh}, ${-hw} ${hh - 4}
          L ${-hw + 1} ${-hh + 3}
          Q ${-hw + 1} ${-hh - 1}, ${0} ${-hh - 2}
          Q ${hw - 1} ${-hh - 1}, ${hw - 1} ${-hh + 3}
          L ${hw} ${hh - 4}
          Q ${hw + 1} ${hh}, ${hw - 2} ${hh}
          Q ${0} ${hh + 2}, ${-hw + 2} ${hh}
        `;
      }
    }
  };

  // Render a single tooth
  const renderTooth = (
    index: number,
    pos: { x: number; y: number; angle: number },
    isUpper: boolean
  ) => {
    const state = teethStates[index];
    const isSelected = selectedTooth === index;
    const isSparkle = sparkle === index;
    const shortName = TOOTH_SHORT_NAMES[index];
    const w = TOOTH_WIDTHS[shortName] || 16;
    const h = TOOTH_HEIGHTS[shortName] || 20;

    const isMolar = shortName.startsWith('M');
    const isCanine = shortName === 'C';

    // Scale up slightly for touch targets
    const scale = isSelected ? 1.1 : 1.0;

    return (
      <g
        key={index}
        transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`}
        onClick={() => cycleToothState(index)}
        onMouseEnter={() => setSelectedTooth(index)}
        onMouseLeave={() => setSelectedTooth(null)}
        style={{ cursor: 'pointer' }}
        className="tooth-group"
      >
        <g transform={`scale(${scale})`} style={{ transition: 'transform 0.2s ease' }}>
          {state !== 'lost' ? (
            <>
              {/* Watercolor wash behind tooth */}
              <ellipse
                cx={0}
                cy={0}
                rx={w / 2 + 4}
                ry={h / 2 + 4}
                fill={state === 'healthy' ? '#FFF9E8' : '#FFEDCC'}
                opacity={0.35}
              />
              {/* Main tooth shape */}
              <path
                d={toothPath(w, h, shortName, isUpper)}
                fill={getToothColor(state)}
                stroke={getToothStroke(state)}
                strokeWidth={isSelected ? 2.5 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={state === 'wiggly' ? '3,2' : 'none'}
                style={{ filter: 'url(#pencilTexture)' }}
              />

              {/* Face - scaled down for smaller teeth */}
              {state === 'healthy' && !isMolar && (
                <>
                  {/* Dot eyes */}
                  <circle cx={-3} cy={-2} r={1.3} fill="#6B5B4F" />
                  <circle cx={3} cy={-2} r={1.3} fill="#6B5B4F" />
                  {/* Tiny smile */}
                  <path
                    d={`M ${-2.5} ${2.5} Q ${0} ${5} ${2.5} ${2.5}`}
                    stroke="#6B5B4F"
                    strokeWidth={1}
                    fill="none"
                  />
                </>
              )}
              {state === 'healthy' && isMolar && (
                <>
                  {/* Wider-set eyes for molars */}
                  <circle cx={-4} cy={-2} r={1.5} fill="#6B5B4F" />
                  <circle cx={4} cy={-2} r={1.5} fill="#6B5B4F" />
                  {/* Happy grin */}
                  <path
                    d={`M ${-3.5} ${3} Q ${0} ${6} ${3.5} ${3}`}
                    stroke="#6B5B4F"
                    strokeWidth={1.2}
                    fill="none"
                  />
                </>
              )}

              {/* Worried face for wiggly teeth */}
              {state === 'wiggly' && (
                <>
                  <circle cx={-3.5} cy={-2} r={1.5} fill="#8B6914" />
                  <circle cx={3.5} cy={-2} r={1.5} fill="#8B6914" />
                  {/* Worried eyebrows */}
                  <path d={`M ${-5.5} ${-6} L ${-1.5} ${-4.5}`} stroke="#8B6914" strokeWidth={1} />
                  <path d={`M ${5.5} ${-6} L ${1.5} ${-4.5}`} stroke="#8B6914" strokeWidth={1} />
                  {/* Wavy worried mouth */}
                  <path
                    d={`M ${-3} ${4} Q ${-1} ${2} ${0} ${4} Q ${1} ${6} ${3} ${4}`}
                    stroke="#8B6914"
                    strokeWidth={1}
                    fill="none"
                  />
                </>
              )}
            </>
          ) : (
            /* Lost tooth - magical gap with sprout */
            <>
              {/* Soft gap */}
              <ellipse
                cx={0}
                cy={0}
                rx={w / 2 - 1}
                ry={h / 2 - 2}
                fill="#FFE4E1"
                stroke="#9DC183"
                strokeWidth={1.5}
                strokeDasharray="3,2"
                opacity={0.5}
              />
              {/* Growing sprout */}
              <path
                d={`M 0 ${5} Q ${-2} ${0} ${0} ${-4}`}
                stroke="#9DC183"
                strokeWidth={1.5}
                fill="none"
              />
              <ellipse cx={-3} cy={-1} rx={3} ry={2} fill="#B8E6B8" opacity={0.8} />
              <ellipse cx={3} cy={-3.5} rx={2.5} ry={1.8} fill="#B8E6B8" opacity={0.8} />
              {/* Sparkles on lost */}
              {isSparkle && (
                <>
                  <text x={-10} y={-12} fontSize="10" className="sparkle-anim">&#x2728;</text>
                  <text x={6} y={-8} fontSize="8" className="sparkle-anim" style={{ animationDelay: '0.1s' }}>&#x2B50;</text>
                  <text x={-2} y={-18} fontSize="11" className="sparkle-anim" style={{ animationDelay: '0.2s' }}>&#x2728;</text>
                </>
              )}
            </>
          )}
        </g>
      </g>
    );
  };

  // Build the lip outline path - a soft organic mouth shape
  // Upper lip: M-shaped with cupid's bow
  // Lower lip: gentle U
  const lipOuterPath = `
    M ${CX - 140} ${CY - 10}
    Q ${CX - 155} ${CY - 60}, ${CX - 120} ${CY - 110}
    Q ${CX - 90} ${CY - 145}, ${CX - 40} ${CY - 150}
    Q ${CX - 15} ${CY - 153}, ${CX} ${CY - 148}
    Q ${CX + 15} ${CY - 153}, ${CX + 40} ${CY - 150}
    Q ${CX + 90} ${CY - 145}, ${CX + 120} ${CY - 110}
    Q ${CX + 155} ${CY - 60}, ${CX + 140} ${CY - 10}
    Q ${CX + 155} ${CY + 50}, ${CX + 120} ${CY + 100}
    Q ${CX + 80} ${CY + 145}, ${CX} ${CY + 150}
    Q ${CX - 80} ${CY + 145}, ${CX - 120} ${CY + 100}
    Q ${CX - 155} ${CY + 50}, ${CX - 140} ${CY - 10}
    Z
  `;

  // Inner lip line (inside the mouth opening)
  const innerMouthPath = `
    M ${CX - 125} ${CY - 5}
    Q ${CX - 135} ${CY - 50}, ${CX - 105} ${CY - 95}
    Q ${CX - 75} ${CY - 125}, ${CX} ${CY - 130}
    Q ${CX + 75} ${CY - 125}, ${CX + 105} ${CY - 95}
    Q ${CX + 135} ${CY - 50}, ${CX + 125} ${CY - 5}
    Q ${CX + 135} ${CY + 45}, ${CX + 105} ${CY + 85}
    Q ${CX + 70} ${CY + 120}, ${CX} ${CY + 125}
    Q ${CX - 70} ${CY + 120}, ${CX - 105} ${CY + 85}
    Q ${CX - 135} ${CY + 45}, ${CX - 125} ${CY - 5}
    Z
  `;

  // Upper gum arch path
  const upperGumPath = `
    M ${CX - 120} ${CY - 5}
    Q ${CX - 130} ${CY - 50}, ${CX - 100} ${CY - 90}
    Q ${CX - 70} ${CY - 120}, ${CX} ${CY - 125}
    Q ${CX + 70} ${CY - 120}, ${CX + 100} ${CY - 90}
    Q ${CX + 130} ${CY - 50}, ${CX + 120} ${CY - 5}
    L ${CX + 115} ${CY - 30}
    Q ${CX + 90} ${CY - 65}, ${CX} ${CY - 70}
    Q ${CX - 90} ${CY - 65}, ${CX - 115} ${CY - 30}
    Z
  `;

  // Lower gum arch path
  const lowerGumPath = `
    M ${CX - 115} ${CY + 5}
    Q ${CX - 125} ${CY + 45}, ${CX - 95} ${CY + 80}
    Q ${CX - 65} ${CY + 115}, ${CX} ${CY + 120}
    Q ${CX + 65} ${CY + 115}, ${CX + 95} ${CY + 80}
    Q ${CX + 125} ${CY + 45}, ${CX + 115} ${CY + 5}
    L ${CX + 110} ${CY + 25}
    Q ${CX + 85} ${CY + 60}, ${CX} ${CY + 65}
    Q ${CX - 85} ${CY + 60}, ${CX - 110} ${CY + 25}
    Z
  `;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" style={{ color: '#8B7355', fontFamily: 'Georgia, serif' }}>
          Loading your teeth...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          50% { opacity: 1; transform: scale(1.2) translateY(-5px); }
          100% { opacity: 0; transform: scale(0) translateY(-15px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        .sparkle-anim {
          animation: sparkle 0.8s ease-out forwards;
        }
        .tooth-group:hover {
          filter: brightness(1.05);
        }
      `}</style>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-md mx-auto"
        style={{ touchAction: 'manipulation' }}
      >
        {/* SVG Filters for hand-drawn watercolor feel */}
        <defs>
          <filter id="pencilTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" />
          </filter>
          <filter id="watercolor">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial gradient for mouth interior */}
          <radialGradient id="mouthInterior" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B3A4A" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#6B2A3A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4A1A2A" stopOpacity="0.6" />
          </radialGradient>
          {/* Gum gradient */}
          <linearGradient id="upperGumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4A0A8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFB8C0" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lowerGumGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#F4A0A8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFB8C0" stopOpacity="0.4" />
          </linearGradient>
          {/* Lip color gradient */}
          <radialGradient id="lipGrad" cx="50%" cy="50%" r="55%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="85%" stopColor="#F0B0B8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E89CA8" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* Soft warm background */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="#FFFDF7" rx="24" />

        {/* Lip fill - soft watercolor wash */}
        <path
          d={lipOuterPath}
          fill="url(#lipGrad)"
          stroke="none"
        />

        {/* Mouth interior - dark pinkish */}
        <path
          d={innerMouthPath}
          fill="url(#mouthInterior)"
          stroke="none"
        />

        {/* Upper gums */}
        <path
          d={upperGumPath}
          fill="url(#upperGumGrad)"
          stroke="none"
          style={{ filter: 'url(#watercolor)' }}
        />

        {/* Lower gums */}
        <path
          d={lowerGumPath}
          fill="url(#lowerGumGrad)"
          stroke="none"
          style={{ filter: 'url(#watercolor)' }}
        />

        {/* Lip outline - organic, hand-drawn feel */}
        <path
          d={lipOuterPath}
          fill="none"
          stroke="#E8A0A8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
          style={{ filter: 'url(#pencilTexture)' }}
        />

        {/* Cupid's bow accent on upper lip */}
        <path
          d={`M ${CX - 25} ${CY - 148} Q ${CX - 8} ${CY - 155}, ${CX} ${CY - 148} Q ${CX + 8} ${CY - 155}, ${CX + 25} ${CY - 148}`}
          fill="none"
          stroke="#D8909A"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Lower lip highlight */}
        <path
          d={`M ${CX - 60} ${CY + 140} Q ${CX} ${CY + 158}, ${CX + 60} ${CY + 140}`}
          fill="none"
          stroke="#D8909A"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Render upper teeth (positions 0-9) */}
        {upperPositions.map((pos, i) => renderTooth(i, pos, true))}

        {/* Render lower teeth (positions 10-19) */}
        {lowerPositions.map((pos, i) => renderTooth(i + 10, pos, false))}

        {/* Soft corner decorations - watercolor splotches */}
        <circle cx="40" cy="40" r="15" fill="#FFE4E1" opacity="0.3" style={{ filter: 'url(#watercolor)' }} />
        <circle cx={SVG_W - 40} cy="40" r="12" fill="#E8F0E8" opacity="0.3" style={{ filter: 'url(#watercolor)' }} />
        <circle cx="45" cy={SVG_H - 40} r="10" fill="#FFF0E0" opacity="0.3" style={{ filter: 'url(#watercolor)' }} />
        <circle cx={SVG_W - 38} cy={SVG_H - 38} r="14" fill="#F0E0F0" opacity="0.25" style={{ filter: 'url(#watercolor)' }} />
      </svg>

      {/* Tooth labels */}
      <div className="mt-4 px-4">
        <div className="flex justify-center gap-1 text-xs mb-2" style={{ color: '#A0937D', fontFamily: 'Georgia, serif' }}>
          <span>M2</span>
          <span>M1</span>
          <span className="text-amber-700">C</span>
          <span>LI</span>
          <span className="font-semibold">CI</span>
          <span className="mx-2">|</span>
          <span className="font-semibold">CI</span>
          <span>LI</span>
          <span className="text-amber-700">C</span>
          <span>M1</span>
          <span>M2</span>
        </div>
        <div className="text-center text-xs" style={{ color: '#B8A990', fontFamily: 'Georgia, serif' }}>
          CI = Central Incisor &nbsp;&middot;&nbsp; LI = Lateral Incisor &nbsp;&middot;&nbsp; C = Canine &nbsp;&middot;&nbsp; M = Molar
        </div>
      </div>

      {/* Selected tooth info */}
      {selectedTooth !== null && (
        <div
          className="mt-4 p-3 rounded-lg text-center"
          style={{
            background: '#FFF9F0',
            border: '2px solid #E8D5C4',
            fontFamily: 'Georgia, serif'
          }}
        >
          <div className="font-semibold" style={{ color: '#6B5B4F' }}>
            {TOOTH_NAMES[selectedTooth]}
          </div>
          <div className="text-sm mt-1" style={{ color: '#A0937D' }}>
            {selectedTooth < 10 ? 'Upper' : 'Lower'} {selectedTooth < 5 || (selectedTooth >= 10 && selectedTooth < 15) ? 'Right' : 'Left'}
            <span className="mx-2">&middot;</span>
            Status: <span className="font-medium" style={{
              color: teethStates[selectedTooth] === 'healthy' ? '#6B8E23' :
                     teethStates[selectedTooth] === 'wiggly' ? '#DAA520' : '#E8B4B8'
            }}>
              {teethStates[selectedTooth] === 'healthy' ? 'Healthy' :
               teethStates[selectedTooth] === 'wiggly' ? 'Wiggly!' : 'Lost & Growing!'}
            </span>
          </div>
          <div className="text-xs mt-2" style={{ color: '#C4B5A0' }}>
            Tap to change: Healthy &rarr; Wiggly &rarr; Lost
          </div>
        </div>
      )}
    </div>
  );
}
