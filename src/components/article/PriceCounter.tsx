'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

export function PriceCounter({
  startPrice = 0.97,
  endPrice = 2.49,
  startYear = 2019,
  endYear = 2026,
  accent = '#DC2626',
}: {
  startPrice?: number
  endPrice?: number
  startYear?: number
  endYear?: number
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [currentPrice, setCurrentPrice] = useState(startPrice)
  const [currentYear, setCurrentYear] = useState(startYear)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const totalSteps = 60
    const priceStep = (endPrice - startPrice) / totalSteps
    const yearSteps = endYear - startYear
    let step = 0

    const interval = setInterval(() => {
      step++
      const progress = step / totalSteps

      // Eased progress — slow start, fast end ("gradually then suddenly")
      const eased = progress < 0.6
        ? progress * 0.5
        : 0.3 + (progress - 0.6) * 1.75

      const price = startPrice + (endPrice - startPrice) * Math.min(eased, 1)
      setCurrentPrice(Math.min(price, endPrice))
      setCurrentYear(Math.min(startYear + Math.round(yearSteps * progress), endYear))

      if (step >= totalSteps) {
        clearInterval(interval)
        setCurrentPrice(endPrice)
        setCurrentYear(endYear)
        setDone(true)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [isInView, startPrice, endPrice, startYear, endYear])

  const percentIncrease = Math.round(((endPrice - startPrice) / startPrice) * 100)

  return (
    <motion.div
      ref={ref}
      className="my-12 mx-auto max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden p-8 text-center"
        style={{
          background: `linear-gradient(135deg, rgba(10,10,18,0.95), rgba(10,10,18,0.8))`,
          border: `1px solid ${accent}20`,
          boxShadow: done ? `0 0 40px ${accent}15` : 'none',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* Year */}
        <div className="text-xs font-mono mb-1" style={{ color: `${accent}88` }}>
          {currentYear}
        </div>

        {/* Price */}
        <div
          className="text-5xl font-bold font-mono tabular-nums transition-colors duration-200"
          style={{
            color: done ? accent : '#E6EDF3',
            textShadow: done ? `0 0 30px ${accent}44` : 'none',
          }}
        >
          ${currentPrice.toFixed(2)}
        </div>

        {/* Label */}
        <div className="text-xs font-mono mt-2 text-gray-600">
          No Name Spaghetti
        </div>

        {/* Percentage badge — appears when done */}
        {done && (
          <motion.div
            className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{
              background: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}33`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            +{percentIncrease}%
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="mt-4 h-px w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: accent }}
            initial={{ width: '0%' }}
            animate={isInView ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}
