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
      <svg
        viewBox="0 0 64 64"
        role="presentation"
        focusable="false"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          filter:
            "drop-shadow(0 0 10px rgba(255, 214, 92, 0.46)) drop-shadow(0 8px 18px rgba(4, 9, 20, 0.32))",
        }}
      >
        <circle cx="32" cy="32" r="29" fill="rgba(7, 16, 34, 0.92)" stroke="#f0c456" strokeWidth="2" />
        <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255, 250, 241, 0.22)" strokeWidth="1.4" />
        <path
          d="M32.2 15.4c-6.7 0-12 5-12.5 11.8-.3 4.2.9 8 2.3 11.9 1 2.9 1.5 7.1 2 11.2.5 3.8 1.9 7.2 4.4 7.2 2.2 0 3.1-3.1 3.6-7.2.2-2 .5-3.8.8-4.6.3.8.6 2.6.8 4.6.5 4.1 1.4 7.2 3.6 7.2 2.5 0 3.9-3.4 4.4-7.2.5-4.1 1-8.3 2-11.2 1.4-3.9 2.6-7.7 2.3-11.9-.5-6.8-6.1-11.8-13.7-11.8Z"
          fill="#fff8de"
          stroke="#f0c456"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M23.9 29.1c4.3 2 12.6 2.1 17.1 0"
          fill="none"
          stroke="#d8a43c"
          strokeLinecap="round"
          strokeWidth="1.4"
          opacity="0.62"
        />
        <path
          d="M15.7 23.4c4.8-7.3 12.6-11.2 22.4-10.1 5.2.6 9.2 2.9 12.4 6.3"
          fill="none"
          stroke="#fff1a7"
          strokeLinecap="round"
          strokeWidth="1.2"
          opacity="0.58"
        />
        <circle cx="49.2" cy="18.1" r="2.1" fill="#fff1a7" />
        <circle cx="14.6" cy="41.9" r="1.7" fill="#4fd1c5" opacity="0.82" />
        <circle cx="50.6" cy="46.4" r="1.35" fill="#ffb68a" opacity="0.9" />
      </svg>
    </span>
  )
}
