type TFNGlowingToothLogoProps = {
  className?: string
  size?: number
}

export function TFNGlowingToothLogo({ className = "", size = 42 }: TFNGlowingToothLogoProps) {
  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: "grid",
        position: "relative",
        width: size,
        height: size,
        flex: "0 0 auto",
        placeItems: "center",
        overflow: "visible",
        transform: "translateZ(0)",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "-10%",
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(255, 244, 190, 0.78), rgba(247, 193, 74, 0.28) 52%, transparent 72%)",
          filter: "drop-shadow(0 0 12px rgba(255, 224, 119, 0.82)) drop-shadow(0 0 24px rgba(216, 164, 60, 0.44))",
        }}
      />
      <svg
        viewBox="0 0 64 76"
        fill="none"
        style={{
          position: "relative",
          zIndex: 1,
          width: "61%",
          height: "74%",
          overflow: "visible",
          filter:
            "drop-shadow(0 0 5px rgba(255, 253, 229, 0.72)) drop-shadow(0 4px 8px rgba(122, 83, 32, 0.22))",
        }}
      >
        <path
          d="M32 5.5c-10.2 0-18.6 7.7-19.5 18.1-.6 6.5 1.3 12.4 3.2 18.5 1.4 4.6 2 10.9 3.2 17.1.9 4.5 3.2 8.8 6.8 8.8 3.3 0 4.4-4.8 5.1-11.1.3-2.9.8-5.4 1.2-6.7.4 1.3.9 3.8 1.2 6.7.8 6.3 1.9 11.1 5.2 11.1 3.6 0 5.9-4.3 6.8-8.8 1.2-6.2 1.8-12.5 3.2-17.1 1.9-6.1 3.8-12 3.2-18.5C50.6 13.2 42.2 5.5 32 5.5Z"
          fill="url(#tfnLogoToothFill)"
          stroke="#c7963e"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
        <path d="M20 26c6 3.1 17.2 3.7 24 0" stroke="#fff3bd" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="tfnLogoToothFill" x1="18" y1="8" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffefa" />
            <stop offset="0.42" stopColor="#fff2c6" />
            <stop offset="0.72" stopColor="#eec25b" />
            <stop offset="1" stopColor="#b9781b" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}
