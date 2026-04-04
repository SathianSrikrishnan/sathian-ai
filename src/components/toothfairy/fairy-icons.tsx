// Inline SVG icons — replace ALL emojis with custom fairy-themed icons

export function SparkleIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" fill="url(#sparkle-grad)" filter="url(#sparkle-glow)" />
      <defs>
        <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#F0C456" />
        </radialGradient>
        <filter id="sparkle-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export function ToothIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  const h = size * (28 / 24)
  return (
    <svg width={size} height={h} viewBox="0 0 24 28" fill="none" className={className}>
      <path
        d="M12 2C7.5 2 4 5 4 9C4 13 6 16 7 20C7.5 22 8 26 9.5 26C11 26 11 22 12 22C13 22 13 26 14.5 26C16 26 16.5 22 17 20C18 16 20 13 20 9C20 5 16.5 2 12 2Z"
        fill="url(#tooth-grad)" stroke="rgba(240,196,86,0.3)" strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="tooth-grad" x1="12" y1="2" x2="12" y2="26">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#E8DDD0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LockIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <rect x="2" y="6" width="10" height="7" rx="2" fill="none" stroke="#4FD1C5" strokeWidth="1.2" />
      <path d="M4.5 6V4.5C4.5 3.12 5.62 2 7 2C8.38 2 9.5 3.12 9.5 4.5V6" stroke="#4FD1C5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function ShareIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M4.5 7.5L9.5 4.5M4.5 7.5L9.5 10.5" stroke="#4FD1C5" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="3.5" cy="7.5" r="1.5" fill="none" stroke="#4FD1C5" strokeWidth="1" />
      <circle cx="10.5" cy="4" r="1.5" fill="none" stroke="#4FD1C5" strokeWidth="1" />
      <circle cx="10.5" cy="11" r="1.5" fill="none" stroke="#4FD1C5" strokeWidth="1" />
    </svg>
  )
}
