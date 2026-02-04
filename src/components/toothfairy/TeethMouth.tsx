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

  // Render a single tooth with Oliver Jeffers style
  const renderTooth = (index: number, x: number, y: number, isUpper: boolean) => {
    const state = teethStates[index];
    const isSelected = selectedTooth === index;
    const isSparkle = sparkle === index;

    // Different sizes for different tooth types
    const isMolar = TOOTH_SHORT_NAMES[index].startsWith('M');
    const isCanine = TOOTH_SHORT_NAMES[index] === 'C';
    const width = isMolar ? 38 : isCanine ? 28 : 30;
    const height = isMolar ? 36 : isCanine ? 40 : 34;

    return (
      <g
        key={index}
        onClick={() => cycleToothState(index)}
        onMouseEnter={() => setSelectedTooth(index)}
        onMouseLeave={() => setSelectedTooth(null)}
        style={{ cursor: 'pointer' }}
        className="tooth-group"
      >
        {/* Tooth body */}
        {state !== 'lost' ? (
          <>
            {/* Watercolor wash effect - multiple layers */}
            <ellipse
              cx={x}
              cy={y}
              rx={width/2 + 3}
              ry={height/2 + 3}
              fill={state === 'healthy' ? '#FFF9E8' : '#FFEDCC'}
              opacity={0.5}
            />
            {/* Main tooth shape - slightly wobbly for hand-drawn feel */}
            <path
              d={`M ${x - width/2} ${y - height/4}
                  Q ${x - width/2 - 2} ${y + height/3}, ${x} ${y + height/2}
                  Q ${x + width/2 + 2} ${y + height/3}, ${x + width/2} ${y - height/4}
                  Q ${x + width/4} ${y - height/2 - 3}, ${x} ${y - height/2}
                  Q ${x - width/4} ${y - height/2 - 3}, ${x - width/2} ${y - height/4}`}
              fill={getToothColor(state)}
              stroke={getToothStroke(state)}
              strokeWidth={isSelected ? 3 : 2}
              strokeLinecap="round"
              strokeDasharray={state === 'wiggly' ? '4,2' : 'none'}
              style={{
                filter: 'url(#pencilTexture)',
                transform: isSelected ? 'scale(1.05)' : 'none',
                transformOrigin: `${x}px ${y}px`,
                transition: 'transform 0.2s ease'
              }}
            />
            {/* Simple dot eyes for healthy teeth */}
            {state === 'healthy' && (
              <>
                <circle cx={x - 6} cy={y - 5} r={2} fill="#6B5B4F" />
                <circle cx={x + 6} cy={y - 5} r={2} fill="#6B5B4F" />
                {/* Tiny smile */}
                <path
                  d={`M ${x - 4} ${y + 3} Q ${x} ${y + 7} ${x + 4} ${y + 3}`}
                  stroke="#6B5B4F"
                  strokeWidth={1.5}
                  fill="none"
                />
              </>
            )}
            {/* Worried face for wiggly teeth */}
            {state === 'wiggly' && (
              <>
                <circle cx={x - 6} cy={y - 5} r={2.5} fill="#8B6914" />
                <circle cx={x + 6} cy={y - 5} r={2.5} fill="#8B6914" />
                {/* Worried eyebrows */}
                <path d={`M ${x - 9} ${y - 10} L ${x - 3} ${y - 8}`} stroke="#8B6914" strokeWidth={1.5} />
                <path d={`M ${x + 9} ${y - 10} L ${x + 3} ${y - 8}`} stroke="#8B6914" strokeWidth={1.5} />
                {/* Wavy worried mouth */}
                <path
                  d={`M ${x - 5} ${y + 5} Q ${x - 2} ${y + 2} ${x} ${y + 5} Q ${x + 2} ${y + 8} ${x + 5} ${y + 5}`}
                  stroke="#8B6914"
                  strokeWidth={1.5}
                  fill="none"
                />
              </>
            )}
          </>
        ) : (
          /* Lost tooth - magical gap with growing sprout */
          <>
            {/* Gap outline */}
            <ellipse
              cx={x}
              cy={y}
              rx={width/2}
              ry={height/2 - 5}
              fill="#FFE4E1"
              stroke="#9DC183"
              strokeWidth={2}
              strokeDasharray="4,3"
              opacity={0.6}
            />
            {/* Growing sprout */}
            <path
              d={`M ${x} ${y + 8} Q ${x - 3} ${y} ${x} ${y - 5}`}
              stroke="#9DC183"
              strokeWidth={2}
              fill="none"
            />
            <ellipse cx={x - 4} cy={y - 3} rx={4} ry={3} fill="#B8E6B8" opacity={0.8} />
            <ellipse cx={x + 4} cy={y - 6} rx={3} ry={2.5} fill="#B8E6B8" opacity={0.8} />
            {/* Sparkles */}
            {isSparkle && (
              <>
                <text x={x - 12} y={y - 15} fontSize="12" className="sparkle-anim">✨</text>
                <text x={x + 8} y={y - 10} fontSize="10" className="sparkle-anim" style={{animationDelay: '0.1s'}}>⭐</text>
                <text x={x} y={y - 20} fontSize="14" className="sparkle-anim" style={{animationDelay: '0.2s'}}>✨</text>
              </>
            )}
          </>
        )}
      </g>
    );
  };

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
        .sparkle-anim {
          animation: sparkle 0.8s ease-out forwards;
        }
        .tooth-group:hover {
          filter: brightness(1.05);
        }
      `}</style>

      <svg
        viewBox="0 0 440 320"
        className="w-full max-w-lg mx-auto"
        style={{ touchAction: 'manipulation' }}
      >
        {/* SVG Filters for hand-drawn effect */}
        <defs>
          <filter id="pencilTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>

        {/* Soft cream background */}
        <rect x="0" y="0" width="440" height="320" fill="#FFFDF7" rx="20"/>

        {/* Lips - simplified Oliver Jeffers style */}
        <ellipse cx="220" cy="160" rx="180" ry="130" fill="none" stroke="#E8B4B8" strokeWidth="8" opacity="0.6"/>

        {/* Gum areas - soft watercolor wash */}
        <ellipse cx="220" cy="90" rx="160" ry="45" fill="#FFDDD5" opacity="0.4"/>
        <ellipse cx="220" cy="230" rx="160" ry="45" fill="#FFDDD5" opacity="0.4"/>

        {/* Upper teeth (positions 0-9) */}
        {[0,1,2,3,4,5,6,7,8,9].map((i) => {
          const baseX = 60 + i * 40;
          const curve = Math.sin((i - 4.5) / 5 * Math.PI) * 15;
          return renderTooth(i, baseX, 85 - curve, true);
        })}

        {/* Lower teeth (positions 10-19) */}
        {[0,1,2,3,4,5,6,7,8,9].map((i) => {
          const baseX = 60 + i * 40;
          const curve = Math.sin((i - 4.5) / 5 * Math.PI) * 15;
          return renderTooth(i + 10, baseX, 235 + curve, false);
        })}
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
          CI = Central Incisor &nbsp;·&nbsp; LI = Lateral Incisor &nbsp;·&nbsp; C = Canine &nbsp;·&nbsp; M = Molar
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
            <span className="mx-2">·</span>
            Status: <span className="font-medium" style={{
              color: teethStates[selectedTooth] === 'healthy' ? '#6B8E23' :
                     teethStates[selectedTooth] === 'wiggly' ? '#DAA520' : '#E8B4B8'
            }}>
              {teethStates[selectedTooth] === 'healthy' ? 'Healthy' :
               teethStates[selectedTooth] === 'wiggly' ? 'Wiggly!' : 'Lost & Growing!'}
            </span>
          </div>
          <div className="text-xs mt-2" style={{ color: '#C4B5A0' }}>
            Tap to change: Healthy → Wiggly → Lost
          </div>
        </div>
      )}
    </div>
  );
}
