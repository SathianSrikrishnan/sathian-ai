'use client'

import { motion } from 'motion/react'

const PAGE_LABELS = [
  'Abstract',
  'Introduction',
  'Transactions',
  'Timestamp Server',
  'Proof-of-Work',
  'Network',
  'Incentive',
  'Disk Space & SPV',
  'Calculations',
]

export function NinePageStack({ accent = '#F7931A' }: { accent?: string }) {
  return (
    <div className="relative w-full flex justify-center items-end" style={{ height: 340 }}>
      {/* Glow underneath */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[80px] rounded-full blur-[60px] opacity-30"
        style={{ background: accent }}
      />

      {/* Stack container with perspective */}
      <div
        className="relative"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 80%',
          width: 240,
          height: 320,
        }}
      >
        {PAGE_LABELS.map((label, i) => {
          const total = PAGE_LABELS.length
          const reverseIdx = total - 1 - i
          // Each page fans upward and slightly back
          const yOffset = reverseIdx * -6
          const zOffset = reverseIdx * -8
          const rotateX = reverseIdx * 1.5
          const scale = 1 - reverseIdx * 0.012
          const opacity = 1 - reverseIdx * 0.06

          return (
            <motion.div
              key={i}
              className="absolute bottom-0 left-0 right-0 rounded-lg overflow-hidden"
              style={{
                height: 310,
                transformStyle: 'preserve-3d',
                background: `linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid rgba(255,255,255,${0.06 + i * 0.01})`,
                backdropFilter: 'blur(4px)',
                boxShadow: i === total - 1
                  ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${accent}15`
                  : `0 2px 8px rgba(0,0,0,0.2)`,
              }}
              initial={{
                opacity: 0,
                y: 60,
                rotateX: 15,
                scale: 0.9,
              }}
              animate={{
                opacity,
                y: yOffset,
                z: zOffset,
                rotateX: -rotateX,
                scale,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Page content — subtle lines to suggest text */}
              <div className="p-5 h-full flex flex-col">
                {/* Page number */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: accent,
                      background: `${accent}12`,
                      border: `1px solid ${accent}20`,
                    }}
                  >
                    {i + 1}/9
                  </span>
                  {i === total - 1 && (
                    <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      Satoshi Nakamoto, 2008
                    </span>
                  )}
                </div>

                {/* Section title */}
                <p
                  className="text-[11px] font-display font-semibold mb-3"
                  style={{ color: `rgba(255,255,255,${0.3 + i * 0.06})` }}
                >
                  {label}
                </p>

                {/* Fake text lines */}
                <div className="flex-1 flex flex-col gap-[6px]">
                  {Array.from({ length: 8 + (i % 3) }, (_, j) => (
                    <div
                      key={j}
                      className="rounded-full"
                      style={{
                        height: 2,
                        width: `${55 + ((i + j) * 17) % 45}%`,
                        background: `rgba(255,255,255,${0.04 + (i === total - 1 ? 0.03 : 0)})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
