'use client';

import { useState } from 'react';
import Link from 'next/link';
import TeethMouth from '@/components/toothfairy/TeethMouth';
import FactCard from '@/components/toothfairy/FactCard';
import { isaFacts } from '@/components/toothfairy/facts';

export default function IsaPage() {
  const [lostTeethCount, setLostTeethCount] = useState(0);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <header
        className="p-4 sticky top-0 z-10"
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/toothfairy"
            className="text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐧</span>
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Isa&apos;s Teeth
            </span>
          </div>
          <div className="w-12" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome message */}
        <div
          className="p-4 rounded-2xl mb-6 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid #4A5568'
          }}
        >
          <p style={{ fontFamily: 'Georgia, serif', color: '#2D3748' }}>
            Hi Isa! Tap your teeth to show the Tooth Fairy
            which ones have fallen out! 🦷✨
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="flex justify-around p-3 rounded-xl mb-6"
          style={{
            background: '#1E293B',
            color: 'white'
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">{lostTeethCount}</div>
            <div className="text-xs opacity-70">Lost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{20 - lostTeethCount}</div>
            <div className="text-xs opacity-70">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{lostTeethCount}</div>
            <div className="text-xs opacity-70">Secrets</div>
          </div>
        </div>

        {/* Interactive teeth */}
        <div
          className="p-4 rounded-2xl mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '3px solid #4A5568',
            boxShadow: '4px 4px 0px #2D3748'
          }}
        >
          <TeethMouth
            childName="isa"
            onLostTeethChange={setLostTeethCount}
          />
        </div>

        {/* Legend */}
        <div
          className="flex justify-center gap-6 mb-6 p-3 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'Georgia, serif',
            fontSize: '0.85rem'
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: '#FFFEF5', border: '2px solid #C4B5A0' }}
            />
            <span style={{ color: '#4A5568' }}>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: '#FFE4B5', border: '2px dashed #DDA853' }}
            />
            <span style={{ color: '#4A5568' }}>Wiggly</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: '#E8FFE8', border: '2px dotted #9DC183' }}
            />
            <span style={{ color: '#4A5568' }}>Lost</span>
          </div>
        </div>

        {/* Facts section */}
        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid #64748B'
          }}
        >
          <FactCard
            facts={isaFacts}
            unlockedCount={lostTeethCount}
          />
        </div>

        {/* Penguin encouragement */}
        {lostTeethCount > 0 && (
          <div
            className="mt-6 p-4 rounded-2xl text-center"
            style={{
              background: '#1E293B',
              color: 'white'
            }}
          >
            <div className="text-3xl mb-2">🐧</div>
            <p style={{ fontFamily: 'Georgia, serif' }}>
              {lostTeethCount === 1 && "Your first tooth! The Tooth Fairy is so excited!"}
              {lostTeethCount === 2 && "Two teeth! You're becoming a big kid!"}
              {lostTeethCount === 3 && "Three teeth! Wow, you're doing great!"}
              {lostTeethCount >= 4 && `${lostTeethCount} teeth! The Tooth Fairy is so proud of you!`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
