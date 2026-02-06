'use client';

import { useState } from 'react';

// Color palette inspired by hitoothfairy.com
const colors = {
  pink: '#df537b',
  pinkLight: '#f8e1e7',
  pinkSoft: '#fdf2f5',
  blue: '#083d77',
  blueLight: '#d0eff2',
  blueSky: '#87ceeb',
  cream: '#fff8f0',
  gold: '#ffd700',
  sparkle: '#fff5cc',
};

// Baby teeth data
const BABY_TEETH = {
  top: [
    { id: 1, name: 'Second Molar', position: 'Upper Right' },
    { id: 2, name: 'First Molar', position: 'Upper Right' },
    { id: 3, name: 'Canine', position: 'Upper Right' },
    { id: 4, name: 'Lateral Incisor', position: 'Upper Right' },
    { id: 5, name: 'Central Incisor', position: 'Upper Right' },
    { id: 6, name: 'Central Incisor', position: 'Upper Left' },
    { id: 7, name: 'Lateral Incisor', position: 'Upper Left' },
    { id: 8, name: 'Canine', position: 'Upper Left' },
    { id: 9, name: 'First Molar', position: 'Upper Left' },
    { id: 10, name: 'Second Molar', position: 'Upper Left' },
  ],
  bottom: [
    { id: 11, name: 'Second Molar', position: 'Lower Right' },
    { id: 12, name: 'First Molar', position: 'Lower Right' },
    { id: 13, name: 'Canine', position: 'Lower Right' },
    { id: 14, name: 'Lateral Incisor', position: 'Lower Right' },
    { id: 15, name: 'Central Incisor', position: 'Lower Right' },
    { id: 16, name: 'Central Incisor', position: 'Lower Left' },
    { id: 17, name: 'Lateral Incisor', position: 'Lower Left' },
    { id: 18, name: 'Canine', position: 'Lower Left' },
    { id: 19, name: 'First Molar', position: 'Lower Left' },
    { id: 20, name: 'Second Molar', position: 'Lower Left' },
  ],
};

type ToothState = 'healthy' | 'wiggly' | 'lost';

// Tooth SVG component - actual tooth shape
function ToothIcon({
  state,
  isSelected,
  isMolar = false,
  isTop = true,
}: {
  state: ToothState;
  isSelected: boolean;
  isMolar?: boolean;
  isTop?: boolean;
}) {
  const getFill = () => {
    if (state === 'lost') return '#fce4ec';
    if (state === 'wiggly') return '#fff9c4';
    return '#ffffff';
  };

  const getStroke = () => {
    if (isSelected) return colors.pink;
    if (state === 'wiggly') return '#ffb74d';
    return '#e0e0e0';
  };

  // Different shapes for molars vs incisors
  if (isMolar) {
    return (
      <svg viewBox="0 0 50 60" className="w-full h-full">
        {/* Molar tooth shape */}
        <path
          d={isTop
            ? "M10 5 C5 5, 2 15, 5 25 L8 55 C8 58, 12 58, 15 55 L18 40 L22 55 C22 58, 26 58, 28 55 L32 40 L35 55 C35 58, 40 58, 42 55 L45 25 C48 15, 45 5, 40 5 C35 2, 25 2, 25 5 C25 2, 15 2, 10 5 Z"
            : "M10 55 C5 55, 2 45, 5 35 L8 5 C8 2, 12 2, 15 5 L18 20 L22 5 C22 2, 26 2, 28 5 L32 20 L35 5 C35 2, 40 2, 42 5 L45 35 C48 45, 45 55, 40 55 C35 58, 25 58, 25 55 C25 58, 15 58, 10 55 Z"
          }
          fill={getFill()}
          stroke={getStroke()}
          strokeWidth="2.5"
          className="drop-shadow-sm"
        />
        {state === 'lost' && (
          <text x="25" y="35" textAnchor="middle" fontSize="20" fill={colors.pink}>✨</text>
        )}
      </svg>
    );
  }

  // Incisor/Canine tooth shape
  return (
    <svg viewBox="0 0 40 60" className="w-full h-full">
      <path
        d={isTop
          ? "M8 8 C4 8, 2 18, 4 28 L10 52 C12 56, 18 56, 20 52 C22 56, 28 56, 30 52 L36 28 C38 18, 36 8, 32 8 C28 4, 22 4, 20 6 C18 4, 12 4, 8 8 Z"
          : "M8 52 C4 52, 2 42, 4 32 L10 8 C12 4, 18 4, 20 8 C22 4, 28 4, 30 8 L36 32 C38 42, 36 52, 32 52 C28 56, 22 56, 20 54 C18 56, 12 56, 8 52 Z"
        }
        fill={getFill()}
        stroke={getStroke()}
        strokeWidth="2.5"
        className="drop-shadow-sm"
      />
      {state === 'lost' && (
        <text x="20" y="35" textAnchor="middle" fontSize="16" fill={colors.pink}>✨</text>
      )}
    </svg>
  );
}

// Sparkle decoration component
function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-6 h-6 text-yellow-400 ${className}`} fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}

// Tooth Fairy Avatar
function ToothFairyAvatar({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-pink-200">
      {/* Fairy character */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg border-4 border-white">
          {/* Simple fairy face */}
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            {/* Face */}
            <circle cx="40" cy="40" r="28" fill="#ffecd2" />
            {/* Blush */}
            <circle cx="25" cy="45" r="6" fill="#ffb6c1" opacity="0.6" />
            <circle cx="55" cy="45" r="6" fill="#ffb6c1" opacity="0.6" />
            {/* Eyes */}
            <ellipse cx="30" cy="38" rx="4" ry="5" fill="#4a4a4a" />
            <ellipse cx="50" cy="38" rx="4" ry="5" fill="#4a4a4a" />
            {/* Eye sparkles */}
            <circle cx="31" cy="36" r="1.5" fill="white" />
            <circle cx="51" cy="36" r="1.5" fill="white" />
            {/* Smile */}
            <path d="M32 50 Q40 58 48 50" stroke="#e57373" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Crown/tiara */}
            <path d="M22 22 L28 12 L34 20 L40 8 L46 20 L52 12 L58 22" stroke="#ffd700" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Crown jewels */}
            <circle cx="40" cy="14" r="3" fill="#ff69b4" />
            <circle cx="28" cy="18" r="2" fill="#87ceeb" />
            <circle cx="52" cy="18" r="2" fill="#87ceeb" />
          </svg>
        </div>
        {/* Wings */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-12 bg-gradient-to-r from-sky-200/80 to-transparent rounded-full blur-[1px] -rotate-12" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-12 bg-gradient-to-l from-sky-200/80 to-transparent rounded-full blur-[1px] rotate-12" />
        {/* Sparkles around fairy */}
        <Sparkle className="absolute -top-2 -right-2 animate-pulse" />
        <Sparkle className="absolute -bottom-1 -left-3 w-4 h-4 animate-pulse delay-300" />
      </div>

      {/* Speech bubble */}
      <div className="flex-1">
        <p
          className="text-lg leading-relaxed"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            color: colors.blue,
          }}
        >
          {message}
        </p>
        <p
          className="text-sm mt-2 opacity-70"
          style={{
            fontFamily: "'Atma', cursive",
            color: colors.pink,
          }}
        >
          ~ Twinkle, your Tooth Fairy friend ✨
        </p>
      </div>
    </div>
  );
}

export default function TeethPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [teethStates, setTeethStates] = useState<Record<number, ToothState>>({});

  const getToothInfo = (id: number) => {
    const allTeeth = [...BABY_TEETH.top, ...BABY_TEETH.bottom];
    return allTeeth.find((t) => t.id === id);
  };

  const handleToothClick = (id: number) => {
    setSelectedTooth(id);
  };

  const cycleToothState = (id: number) => {
    const currentState = teethStates[id] || 'healthy';
    const nextState: ToothState =
      currentState === 'healthy' ? 'wiggly' : currentState === 'wiggly' ? 'lost' : 'healthy';
    setTeethStates((prev) => ({ ...prev, [id]: nextState }));
  };

  const selectedInfo = selectedTooth ? getToothInfo(selectedTooth) : null;
  const selectedState = selectedTooth ? (teethStates[selectedTooth] || 'healthy') : null;

  const getFairyMessage = () => {
    if (!selectedInfo) {
      return "Hi there, little one! Tap on any tooth to learn about it. Double-tap to tell me if it's wiggly!";
    }
    if (selectedState === 'lost') {
      return `Oh how wonderful! You lost your ${selectedInfo.name}! I'll be visiting soon to leave you something special under your pillow! 🧚‍♀️`;
    }
    if (selectedState === 'wiggly') {
      return `Ooh, your ${selectedInfo.name} is wiggly! That's so exciting! Keep wiggling it gently, and soon it'll be ready for me to collect!`;
    }
    return `That's your ${selectedInfo.name} on the ${selectedInfo.position} side! This tooth helps you ${
      selectedInfo.name.includes('Molar') ? 'chew your yummy food' :
      selectedInfo.name.includes('Canine') ? 'tear through tough foods like a little wolf' :
      'bite into apples and smile big'
    }! 🦷`;
  };

  const isMolar = (id: number) => {
    return [1, 2, 9, 10, 11, 12, 19, 20].includes(id);
  };

  const lostCount = Object.values(teethStates).filter(s => s === 'lost').length;
  const wigglyCount = Object.values(teethStates).filter(s => s === 'wiggly').length;

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        background: `linear-gradient(180deg, ${colors.pinkSoft} 0%, ${colors.blueLight} 50%, ${colors.cream} 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{
              fontFamily: "'Atma', cursive",
              color: colors.pink,
              textShadow: '2px 2px 0 white, -1px -1px 0 white',
            }}
          >
            My Tooth Journey
          </h1>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div
              className="px-4 py-2 rounded-full bg-white/80 shadow-md"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              <span className="text-2xl">🦷</span>
              <span className="ml-2 font-semibold" style={{ color: colors.blue }}>
                {20 - lostCount} teeth
              </span>
            </div>
            {wigglyCount > 0 && (
              <div
                className="px-4 py-2 rounded-full bg-yellow-100 shadow-md animate-bounce"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <span className="text-2xl">〰️</span>
                <span className="ml-2 font-semibold text-yellow-700">
                  {wigglyCount} wiggly!
                </span>
              </div>
            )}
            {lostCount > 0 && (
              <div
                className="px-4 py-2 rounded-full bg-pink-100 shadow-md"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <span className="text-2xl">✨</span>
                <span className="ml-2 font-semibold" style={{ color: colors.pink }}>
                  {lostCount} visited!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tooth Fairy Avatar */}
        <div className="mb-6">
          <ToothFairyAvatar message={getFairyMessage()} />
        </div>

        {/* Mouth Container */}
        <div
          className="rounded-[40px] shadow-2xl p-6 md:p-8 mb-6"
          style={{
            background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)',
            border: `3px solid ${colors.pinkLight}`,
          }}
        >
          {/* Upper Lip hint */}
          <div
            className="h-3 rounded-full mb-4 mx-8"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.pinkLight}, transparent)` }}
          />

          {/* Top Teeth Row */}
          <div className="flex justify-center items-end gap-1 mb-2">
            {BABY_TEETH.top.map((tooth) => (
              <button
                key={tooth.id}
                onClick={() => handleToothClick(tooth.id)}
                onDoubleClick={() => cycleToothState(tooth.id)}
                className={`
                  relative transition-all duration-300 ease-out
                  ${selectedTooth === tooth.id ? 'scale-125 z-20 -translate-y-2' : 'hover:scale-110 hover:-translate-y-1'}
                  ${(teethStates[tooth.id] || 'healthy') === 'wiggly' ? 'animate-wiggle' : ''}
                  ${(teethStates[tooth.id] || 'healthy') === 'lost' ? 'opacity-60' : ''}
                `}
                style={{
                  width: isMolar(tooth.id) ? '48px' : '38px',
                  height: isMolar(tooth.id) ? '56px' : '50px',
                }}
              >
                <ToothIcon
                  state={teethStates[tooth.id] || 'healthy'}
                  isSelected={selectedTooth === tooth.id}
                  isMolar={isMolar(tooth.id)}
                  isTop={true}
                />
              </button>
            ))}
          </div>

          {/* Gum Line - Upper */}
          <div
            className="h-6 rounded-b-3xl shadow-inner mx-4"
            style={{
              background: `linear-gradient(180deg, #ffb6c1 0%, #ff91a4 100%)`,
            }}
          />

          {/* Tongue Area */}
          <div
            className="h-12 my-2 mx-8 rounded-full"
            style={{
              background: `linear-gradient(180deg, #ffb6c1 0%, #ff8fab 50%, #ffb6c1 100%)`,
            }}
          />

          {/* Gum Line - Lower */}
          <div
            className="h-6 rounded-t-3xl shadow-inner mx-4"
            style={{
              background: `linear-gradient(180deg, #ff91a4 0%, #ffb6c1 100%)`,
            }}
          />

          {/* Bottom Teeth Row */}
          <div className="flex justify-center items-start gap-1 mt-2">
            {BABY_TEETH.bottom.map((tooth) => (
              <button
                key={tooth.id}
                onClick={() => handleToothClick(tooth.id)}
                onDoubleClick={() => cycleToothState(tooth.id)}
                className={`
                  relative transition-all duration-300 ease-out
                  ${selectedTooth === tooth.id ? 'scale-125 z-20 translate-y-2' : 'hover:scale-110 hover:translate-y-1'}
                  ${(teethStates[tooth.id] || 'healthy') === 'wiggly' ? 'animate-wiggle' : ''}
                  ${(teethStates[tooth.id] || 'healthy') === 'lost' ? 'opacity-60' : ''}
                `}
                style={{
                  width: isMolar(tooth.id) ? '48px' : '38px',
                  height: isMolar(tooth.id) ? '56px' : '50px',
                }}
              >
                <ToothIcon
                  state={teethStates[tooth.id] || 'healthy'}
                  isSelected={selectedTooth === tooth.id}
                  isMolar={isMolar(tooth.id)}
                  isTop={false}
                />
              </button>
            ))}
          </div>

          {/* Lower Lip hint */}
          <div
            className="h-3 rounded-full mt-4 mx-8"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.pinkLight}, transparent)` }}
          />
        </div>

        {/* Legend */}
        <div
          className="flex justify-center gap-4 md:gap-8 text-sm p-4 bg-white/60 rounded-2xl backdrop-blur-sm"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm" />
            <span style={{ color: colors.blue }}>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-sm animate-wiggle" />
            <span className="text-yellow-700">Wiggly!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-100 border-2 border-pink-300 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
            <span style={{ color: colors.pink }}>Visited!</span>
          </div>
        </div>

        {/* Instructions */}
        <p
          className="text-center mt-4 text-sm opacity-70"
          style={{ fontFamily: "'Josefin Sans', sans-serif", color: colors.blue }}
        >
          Tap a tooth to learn about it • Double-tap to change its status
        </p>
      </div>
    </div>
  );
}
