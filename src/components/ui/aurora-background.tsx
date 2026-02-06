'use client'

export function AuroraBackground({
  colors = ['#7C3AED', '#06B6D4', '#EC4899'],
  className = '',
  intensity = 'medium',
  children,
}: {
  colors?: string[]
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
  children?: React.ReactNode
}) {
  const opacityMap = { subtle: 0.12, medium: 0.2, strong: 0.3 }
  const blurMap = { subtle: '100px', medium: '80px', strong: '60px' }
  const sizeMap = { subtle: '500px', medium: '650px', strong: '800px' }
  const opacity = opacityMap[intensity]
  const blur = blurMap[intensity]
  const blobSize = sizeMap[intensity]

  // Blob placement configs — varied positions for organic feel
  const placements = [
    { x: '15%', y: '10%', delay: '0s' },
    { x: '65%', y: '25%', delay: '-7s' },
    { x: '35%', y: '70%', delay: '-14s' },
  ]

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {colors.map((color, i) => {
          const p = placements[i % placements.length]
          return (
            <div
              key={i}
              className={i % 2 === 0 ? 'animate-aurora-drift' : 'animate-aurora-drift-reverse'}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: blobSize,
                height: blobSize,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                opacity,
                filter: `blur(${blur})`,
                animationDelay: p.delay,
                willChange: 'transform',
              }}
            />
          )
        })}
      </div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

/**
 * Standalone aurora blobs for layering behind specific elements.
 * Use position: absolute on parent container.
 */
export function AuroraBlob({
  color = '#7C3AED',
  size = 600,
  blur = 80,
  opacity = 0.15,
  className = '',
}: {
  color?: string
  size?: number
  blur?: number
  opacity?: number
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none animate-aurora-breathe ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${blur}px)`,
        willChange: 'opacity',
      }}
    />
  )
}
