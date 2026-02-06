'use client'

export function BackgroundBeams({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle radial gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.07]"
        style={{
          background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        }}
      />
      {/* Animated beam lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="0" x2="40%" y2="100%" stroke="url(#beam1)" strokeWidth="1">
          <animate attributeName="x1" values="10%;30%;10%" dur="20s" repeatCount="indefinite" />
          <animate attributeName="x2" values="40%;60%;40%" dur="20s" repeatCount="indefinite" />
        </line>
        <line x1="60%" y1="0" x2="80%" y2="100%" stroke="url(#beam2)" strokeWidth="1">
          <animate attributeName="x1" values="60%;40%;60%" dur="25s" repeatCount="indefinite" />
          <animate attributeName="x2" values="80%;65%;80%" dur="25s" repeatCount="indefinite" />
        </line>
        <line x1="85%" y1="0" x2="55%" y2="100%" stroke="url(#beam1)" strokeWidth="0.5">
          <animate attributeName="x1" values="85%;70%;85%" dur="30s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}
