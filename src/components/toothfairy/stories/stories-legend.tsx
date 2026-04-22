"use client"

import Link from "next/link"
import Image from "next/image"
import { C, ds } from "@/components/toothfairy/tokens"
import type { WallCard } from "@/data/wall-cards"

interface StoriesLegendProps {
  stories: WallCard[]
}

export function StoriesLegend({ stories }: StoriesLegendProps) {
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "12px",
        maxWidth: 920,
        margin: "0 auto",
      }}
    >
      {stories.map((s) => (
        <LegendCard key={s.id} story={s} />
      ))}
    </div>
  )
}

function LegendCard({ story }: { story: WallCard }) {
  const href = story.linkedFullStory
    ? `/toothfairy/story/${story.linkedFullStory}`
    : `/toothfairy/explore/${story.slug}`

  return (
    <Link
      href={href}
      className="group block transition-all duration-300"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: ds.borderRadius.md,
        padding: 8,
        textDecoration: "none",
      }}
      aria-label={`Read story: ${story.title} from ${story.region}`}
    >
      <div className="flex items-center gap-3" style={{ minHeight: 72 }}>
        {/* Photo */}
        <div
          className="shrink-0"
          style={{
            width: 56,
            height: 56,
            borderRadius: ds.borderRadius.sm,
            overflow: "hidden",
            border: `1px solid ${C.borderGold}`,
            background: C.bgAlt,
          }}
        >
          <Image
            src={story.image}
            alt={story.title}
            width={112}
            height={112}
            className="w-full h-full object-cover"
            unoptimized={story.image.endsWith(".svg")}
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: ds.fonts.body,
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 2,
            }}
          >
            {story.region}
          </div>
          <div
            style={{
              fontFamily: ds.fonts.headline,
              fontSize: "0.95rem",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.2,
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {story.title}
          </div>
          <div
            style={{
              fontFamily: ds.fonts.body,
              fontSize: "0.75rem",
              fontStyle: "italic",
              color: C.dim,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {story.characterName}
          </div>
        </div>
      </div>

      {/* Hover styles */}
      <style jsx>{`
        a:hover {
          border-color: ${C.gold} !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px oklch(78% 0.14 80 / 0.12);
        }
        a:focus-visible {
          outline: 2px solid ${C.gold};
          outline-offset: 2px;
        }
      `}</style>
    </Link>
  )
}

export default StoriesLegend
