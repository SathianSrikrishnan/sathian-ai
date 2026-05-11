type TFNGlowingToothLogoProps = {
  className?: string
  size?: number
}

const logoSrc = "/toothfairy/brand/toothfairy-glow-mark.png"

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
      <img
        src={logoSrc}
        alt=""
        draggable={false}
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter:
            "drop-shadow(0 0 9px rgba(255, 214, 92, 0.48)) drop-shadow(0 5px 12px rgba(18, 31, 58, 0.16))",
        }}
      />
    </span>
  )
}
