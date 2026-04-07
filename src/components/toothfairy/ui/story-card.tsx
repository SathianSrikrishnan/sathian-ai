"use client"

import { useViewMode } from "../view-mode-context"
import { C, ds, glass, glow } from "../tokens"
import { PC } from "../parent-theme"

interface StoryCardProps {
  title: string
  origin: string
  description: string
  image?: string
  onClick?: () => void
  className?: string
}

export function StoryCard({ title, origin, description, image, onClick, className = "" }: StoryCardProps) {
  const { isParent } = useViewMode()

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl overflow-hidden transition-all group ${className}`}
      style={{
        background: isParent ? "#ffffff" : glass.card,
        border: `1px solid ${isParent ? PC.border : C.border}`,
        boxShadow: isParent ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
        backdropFilter: isParent ? "none" : `blur(${glass.blur})`,
        cursor: "pointer",
      }}
    >
      {/* Image */}
      {image && (
        <div className="w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        {/* Origin badge */}
        <span
          className="inline-block text-[10px] uppercase tracking-widest font-bold mb-2 px-2 py-0.5 rounded-full"
          style={{
            background: isParent ? PC.tealSoft : C.tealGlow,
            color: isParent ? PC.teal : C.teal,
          }}
        >
          {origin}
        </span>

        <h3
          className="font-bold mb-1"
          style={{
            fontFamily: ds.fonts.headline,
            color: isParent ? PC.text : C.textWarm,
            fontSize: "1rem",
          }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{
            color: isParent ? PC.muted : C.muted,
            fontFamily: isParent ? ds.fonts.body : ds.fonts.story,
          }}
        >
          {description}
        </p>
      </div>
    </button>
  )
}
