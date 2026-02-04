'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ToothFairyLanding() {
  const [sparkles, setSparkles] = useState<{x: number, y: number, delay: number}[]>([]);

  // Generate floating sparkles
  useEffect(() => {
    const newSparkles = Array(8).fill(null).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFFEF8 0%, #FFF8F0 50%, #FFEEDD 100%)',
        minHeight: '100%'
      }}
    >
      {/* Animated sparkles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .sparkle {
          animation: float 4s ease-in-out infinite, twinkle 2s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .fade-in-delay-1 { animation-delay: 0.2s; opacity: 0; }
        .fade-in-delay-2 { animation-delay: 0.4s; opacity: 0; }
        .fade-in-delay-3 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      {sparkles.map((s, i) => (
        <div
          key={i}
          className="sparkle absolute text-2xl pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`
          }}
        >
          ✨
        </div>
      ))}

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 fade-in">
          <div className="text-6xl mb-4">🦷</div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'Georgia, serif',
              color: '#5D4E37',
              textShadow: '2px 2px 4px rgba(139, 115, 85, 0.1)'
            }}
          >
            The Tooth Fairy&apos;s
            <br />
            <span style={{ color: '#E8B4B8' }}>Secret Project</span>
          </h1>
        </header>

        {/* Story intro */}
        <div
          className="p-8 rounded-3xl mb-8 fade-in fade-in-delay-1"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            border: '2px solid #E8D5C4',
            boxShadow: '0 8px 32px rgba(139, 115, 85, 0.1)'
          }}
        >
          <p
            className="text-lg leading-relaxed mb-4"
            style={{ fontFamily: 'Georgia, serif', color: '#6B5B4F' }}
          >
            Psst... I&apos;m working on something <em>special</em> for the Tooth Fairy.
          </p>
          <p
            className="text-lg leading-relaxed mb-4"
            style={{ fontFamily: 'Georgia, serif', color: '#6B5B4F' }}
          >
            First, I need to know which teeth you&apos;ve lost so far.
            The Tooth Fairy wants to keep track! Plus, she&apos;ll share some
            <span style={{ color: '#E8B4B8' }}> secret facts </span>
            about animal teeth with you...
          </p>
          <p
            className="text-sm italic"
            style={{ fontFamily: 'Georgia, serif', color: '#A0937D' }}
          >
            (More surprises are coming soon... maybe even something you can hold in your hand!)
          </p>
        </div>

        {/* Character selection */}
        <div className="text-center mb-8 fade-in fade-in-delay-2">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: 'Georgia, serif', color: '#6B5B4F' }}
          >
            Who are you?
          </h2>

          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {/* Isa Card */}
            <Link href="/toothfairy/isa">
              <div
                className="p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(180deg, #F0F4F8 0%, #E8EEF4 100%)',
                  border: '3px solid #4A5568',
                  boxShadow: '4px 4px 0px #2D3748'
                }}
              >
                <div className="text-5xl mb-3">🐧</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Georgia, serif', color: '#2D3748' }}
                >
                  Isa
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: '#4A5568' }}
                >
                  Penguin Explorer
                </div>
              </div>
            </Link>

            {/* Sia Card */}
            <Link href="/toothfairy/sia">
              <div
                className="p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
                  border: '3px solid #D97706',
                  boxShadow: '4px 4px 0px #92400E'
                }}
              >
                <div className="text-5xl mb-3">🦒</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Georgia, serif', color: '#92400E' }}
                >
                  Sia
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: '#B45309' }}
                >
                  Giraffe Friend
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Teaser footer */}
        <div
          className="text-center p-6 rounded-2xl fade-in fade-in-delay-3"
          style={{
            background: 'rgba(232, 180, 184, 0.15)',
            border: '2px dashed #E8B4B8'
          }}
        >
          <div className="text-3xl mb-2">🪄 🦷 💰</div>
          <p
            className="text-sm"
            style={{ fontFamily: 'Georgia, serif', color: '#A0937D' }}
          >
            Coming soon: The Tooth Fairy&apos;s Magic Wallet
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: '#C4B5A0' }}
          >
            A special way to save the treasures from each tooth...
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p
            className="text-xs"
            style={{ color: '#C4B5A0', fontFamily: 'Georgia, serif' }}
          >
            Made with love by Dad ❤️
          </p>
        </footer>
      </div>
    </div>
  );
}
