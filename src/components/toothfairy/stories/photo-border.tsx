"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { C } from "@/components/toothfairy/tokens"

export interface PhotoBorderThumbnail {
  slug: string
  src: string
  alt: string
  active: boolean
  featured: boolean
}

interface PhotoBorderProps {
  thumbnails: PhotoBorderThumbnail[]
  children: React.ReactNode
  /** Number of thumbnails along the top/bottom rows (desktop) — defaults to 12 */
  cols?: number
}

/**
 * PhotoBorder wraps a centered child element (the globe) with a frame of
 * thumbnail tiles. On desktop, the frame is 4 rows × N columns with the globe
 * occupying the middle. On mobile, thumbnails collapse into a horizontal scroll
 * strip above the globe.
 */
export function PhotoBorder({
  thumbnails,
  children,
  cols = 12,
}: PhotoBorderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        {/* Mobile: horizontal scroll strip */}
        <div
          className="w-full overflow-x-auto py-2 -mx-4 px-4"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="flex gap-2 min-w-max">
            {thumbnails.map((t) => (
              <Thumb key={t.slug} t={t} size={56} />
            ))}
          </div>
        </div>
        {/* Globe */}
        <div className="flex justify-center">{children}</div>
      </div>
    )
  }

  // Desktop layout
  // Use 50 thumbnails: split into top/bottom (12 each) + left/right columns (13 each)
  // Total = 12 + 12 + 13 + 13 = 50
  const TOP = thumbnails.slice(0, 12)
  const BOTTOM = thumbnails.slice(12, 24)
  const LEFT = thumbnails.slice(24, 37)
  const RIGHT = thumbnails.slice(37, 50)

  return (
    <div className="w-full flex justify-center">
      <div
        className="grid w-full max-w-[920px]"
        style={{
          gridTemplateColumns: "auto 1fr auto",
          gridTemplateRows: "auto 1fr auto",
          gap: "12px",
        }}
      >
        {/* Top-left corner spacer */}
        <div />

        {/* Top row */}
        <div
          className="flex items-center justify-center gap-2"
          style={{ gridColumn: "2", gridRow: "1" }}
        >
          {TOP.map((t) => (
            <Thumb key={t.slug} t={t} size={56} />
          ))}
        </div>

        {/* Top-right corner spacer */}
        <div />

        {/* Left column */}
        <div
          className="flex flex-col items-center justify-center gap-2"
          style={{ gridColumn: "1", gridRow: "2" }}
        >
          {LEFT.map((t) => (
            <Thumb key={t.slug} t={t} size={56} />
          ))}
        </div>

        {/* Center: globe */}
        <div
          className="flex items-center justify-center"
          style={{ gridColumn: "2", gridRow: "2", padding: "16px" }}
        >
          {children}
        </div>

        {/* Right column */}
        <div
          className="flex flex-col items-center justify-center gap-2"
          style={{ gridColumn: "3", gridRow: "2" }}
        >
          {RIGHT.map((t) => (
            <Thumb key={t.slug} t={t} size={56} />
          ))}
        </div>

        {/* Bottom-left spacer */}
        <div />

        {/* Bottom row */}
        <div
          className="flex items-center justify-center gap-2"
          style={{ gridColumn: "2", gridRow: "3" }}
        >
          {BOTTOM.map((t) => (
            <Thumb key={t.slug} t={t} size={56} />
          ))}
        </div>

        {/* Bottom-right spacer */}
        <div />
      </div>
    </div>
  )
}

function Thumb({ t, size }: { t: PhotoBorderThumbnail; size: number }) {
  // Both derive from C.gold — active = 35% alpha (stronger presence),
  // dim = 10% alpha (near-ghost). Palette changes cascade through color-mix.
  const borderColor = t.active
    ? `color-mix(in oklch, ${C.gold} 35%, transparent)`
    : `color-mix(in oklch, ${C.gold} 10%, transparent)`
  const opacity = t.active ? 1 : 0.55

  return (
    <Link
      href={`/toothfairy/stories/${t.slug}`}
      className="group block shrink-0 transition-all duration-300 hover:scale-105"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
        background: C.surface,
        opacity,
      }}
      aria-label={`Story: ${t.alt}`}
    >
      <Image
        src={t.src}
        alt={t.alt}
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:brightness-110"
        style={{ display: "block" }}
        unoptimized={t.src.endsWith(".svg")}
      />
    </Link>
  )
}

export default PhotoBorder
