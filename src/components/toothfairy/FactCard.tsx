'use client';

import { useState, useEffect } from 'react';
import { AnimalFact } from './facts';

interface FactCardProps {
  facts: AnimalFact[];
  unlockedCount: number;
}

export default function FactCard({ facts, unlockedCount }: FactCardProps) {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Animate when a new fact is unlocked
  useEffect(() => {
    if (unlockedCount > 0) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unlockedCount]);

  if (unlockedCount === 0) {
    return (
      <div
        className="p-6 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(180deg, #FFFEF5 0%, #FFF8F0 100%)',
          border: '2px dashed #E8D5C4',
          fontFamily: 'Georgia, serif'
        }}
      >
        <div className="text-4xl mb-3">📚</div>
        <div className="font-semibold" style={{ color: '#6B5B4F' }}>
          The Tooth Fairy&apos;s Secret Notebook
        </div>
        <div className="text-sm mt-2" style={{ color: '#A0937D' }}>
          Mark a tooth as lost to unlock your first animal teeth fact!
        </div>
      </div>
    );
  }

  const unlockedFacts = facts.slice(0, unlockedCount);

  return (
    <div>
      <div
        className="mb-4 text-center"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <span className="text-lg font-semibold" style={{ color: '#6B5B4F' }}>
          The Tooth Fairy&apos;s Secret Notebook
        </span>
        <div className="text-sm" style={{ color: '#A0937D' }}>
          {unlockedCount} secret{unlockedCount !== 1 ? 's' : ''} unlocked!
        </div>
      </div>

      <div className="space-y-4">
        {unlockedFacts.map((fact, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              showAnimation && index === unlockedCount - 1 ? 'animate-bounce' : ''
            }`}
            style={{
              background: revealedIndex === index
                ? 'linear-gradient(135deg, #FFFEF5 0%, #FFF4E6 100%)'
                : '#FFFDF7',
              border: '2px solid #E8D5C4',
              transform: revealedIndex === index ? 'rotate(-1deg)' : 'rotate(0deg)',
              boxShadow: revealedIndex === index
                ? '4px 4px 12px rgba(139, 115, 85, 0.15)'
                : '2px 2px 6px rgba(139, 115, 85, 0.08)',
              fontFamily: 'Georgia, serif'
            }}
            onClick={() => setRevealedIndex(revealedIndex === index ? null : index)}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{fact.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold" style={{ color: '#6B5B4F' }}>
                  {fact.animal} Teeth
                </div>
                {revealedIndex === index ? (
                  <div
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: '#5D4E37' }}
                  >
                    <p>{fact.fact}</p>
                    <p
                      className="mt-2 italic"
                      style={{ color: '#A0937D' }}
                    >
                      {fact.funNote}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm" style={{ color: '#A0937D' }}>
                    Tap to read...
                  </div>
                )}
              </div>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: revealedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                {revealedIndex === index ? '📖' : '📕'}
              </span>
            </div>
          </div>
        ))}

        {/* Locked facts preview */}
        {unlockedCount < facts.length && (
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: '#F5F0E8',
              border: '2px dashed #D4C4A8',
              fontFamily: 'Georgia, serif'
            }}
          >
            <span className="text-2xl">🔒</span>
            <div className="text-sm mt-1" style={{ color: '#A0937D' }}>
              {facts.length - unlockedCount} more secret{facts.length - unlockedCount !== 1 ? 's' : ''} waiting...
            </div>
            <div className="text-xs mt-1" style={{ color: '#C4B5A0' }}>
              Mark another tooth as lost to unlock!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
