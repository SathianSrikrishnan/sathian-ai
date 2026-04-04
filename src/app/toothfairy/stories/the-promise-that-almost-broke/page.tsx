"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

// ─── Story Data ─────────────────────────────────────────────────
const PAGES = [
  {
    image: "/stories/episode-1/ep1-page-01-bedroom.jpg",
    text: "It's the quietest time of night. The house is still. But under a pillow, something is waiting.",
  },
  {
    image: "/stories/episode-1/ep1-page-02-tooth-closeup.jpg",
    text: "A tooth. YOUR tooth. The one that wiggled for weeks and finally let go today.",
  },
  {
    image: "/stories/episode-1/ep1-page-03-stardust.jpg",
    text: "And somewhere in the dark, someone is coming for it.",
  },
  {
    image: "/stories/episode-1/ep1-page-04-tanda-windowsill.jpg",
    text: "This is Tanda. She runs the Tooth Fairy Network. Well — she runs her team. There's a difference, and she's only just figuring that out.",
  },
  {
    image: "/stories/episode-1/ep1-page-05-satchel-scrolls.jpg",
    text: "Tonight she has forty-seven teeth to collect. In six cities. Before sunrise. She's already behind.",
  },
  {
    image: "/stories/episode-1/ep1-page-06-tanda-lifts-tooth.jpg",
    text: "She lifts the tooth gently. It's warm. It hums with a tiny, perfect story — everything this child lived while it grew.",
  },
  {
    image: "/stories/episode-1/ep1-page-07-tooth-story-montage.jpg",
    text: "She sees: a first day of school. A best friend named Maya. A song about a caterpillar. A night when the power went out and everyone told stories by flashlight.",
  },
  {
    image: "/stories/episode-1/ep1-page-08-tanda-worried.jpg",
    text: "She saves the tooth. She leaves the gift. But she doesn't smile. She's thinking about the forty-six she still has to reach tonight. And the three from last week that she didn't.",
  },
  {
    image: "/stories/episode-1/ep1-page-09-headquarters.jpg",
    text: "Back at headquarters, the team is already struggling.",
  },
  {
    image: "/stories/episode-1/ep1-page-10-flicker-emergency.jpg",
    text: `Flicker — the fastest fairy alive — bursts in. "Emergency! A tooth in Vancouver — the mom is about to VACUUM!"`,
  },
  {
    image: "/stories/episode-1/ep1-page-11-brume-reading.jpg",
    text: `Brume — the one who reads the stories in the teeth — is behind. Again. "This one..." she sniffles. "This child's grandmother taught her to bake bread. I can't rush this."`,
  },
  {
    image: "/stories/episode-1/ep1-page-12-clink-drops-scrolls.jpg",
    text: `And Clink — the newest fairy, still learning — has just dropped tomorrow's entire Western route on the floor. "Sorry! Sorry sorry sorry!"`,
  },
  {
    image: "/stories/episode-1/ep1-page-04-tanda-windowsill.jpg",
    text: "Tanda lands. She doesn't yell. She never yells. She just looks at the map on the wall and counts the dots that are going dark. There are more every week.",
  },
  {
    image: "/stories/episode-1/ep1-page-14-globe-closeup.jpg",
    text: "The fairy team covers their part of the world. But the world is bigger than their part.",
  },
  {
    image: "/stories/episode-1/ep1-page-14-globe-closeup.jpg",
    text: `She's always known there were others. A mouse in Spain. A magpie in Korea. A beaver in a forest. They all work alone. Just like her.`,
  },
  {
    image: "/stories/episode-1/ep1-page-16-team-meeting.jpg",
    text: `"What if we didn't do this alone?" Tanda asks. Flicker frowns. "You mean... ask THEM for help?" Brume's eyes go wide. "Do you think they'd say yes?" Clink raises her hand. "Um, who are 'them' exactly?"`,
  },
  {
    image: "/stories/episode-1/ep1-page-17-writing-messages.jpg",
    text: "That night, after the last tooth is collected, after Brume finishes crying over a particularly beautiful story about a boy and his dog, after Clink re-organizes the scrolls she dropped — Tanda sits down and writes three messages.",
  },
  {
    image: "/stories/episode-1/ep1-page-18-messages-fly.jpg",
    text: "The messages leave at dawn. She doesn't know if any of them will say yes. She only knows that doing this alone isn't working anymore. And that's enough to try.",
  },
]

const TITLE = "The Promise That Almost Broke"
const SUBTITLE = "Episode 1 — The Tooth Fairy Network"

// ─── Component ──────────────────────────────────────────────────
export default function StoryPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const totalPages = PAGES.length

  const goTo = useCallback((page: number) => {
    if (page < 0 || page >= totalPages || transitioning) return
    setTransitioning(true)
    setImageLoaded(false)
    setTimeout(() => {
      setCurrentPage(page)
      setTransitioning(false)
    }, 300)
  }, [totalPages, transitioning])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo(currentPage + 1) }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(currentPage - 1) }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [currentPage, goTo])

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (diff > 50) goTo(currentPage + 1) // swipe left → next
    if (diff < -50) goTo(currentPage - 1) // swipe right → prev
    setTouchStart(null)
  }

  const page = PAGES[currentPage]
  const isLastPage = currentPage === totalPages - 1

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#060B18", color: "#F0ECFF" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between relative z-10" style={{ borderBottom: "1px solid rgba(240,196,86,0.08)" }}>
        <Link href="/" className="text-xs" style={{ color: "rgba(240,236,255,0.4)" }}>
          ← Tooth Fairy Network
        </Link>
        <span className="text-xs font-mono" style={{ color: "rgba(240,236,255,0.25)" }}>
          {currentPage + 1} / {totalPages}
        </span>
      </header>

      {/* Title (first page only) */}
      {currentPage === 0 && (
        <div className="text-center pt-6 pb-2 px-4">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(240,196,86,0.5)" }}>
            {SUBTITLE}
          </p>
          <h1
            className="text-2xl sm:text-3xl font-extrabold"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "#F0C456",
              textShadow: "0 0 30px rgba(240,196,86,0.2)",
            }}
          >
            {TITLE}
          </h1>
        </div>
      )}

      {/* Image */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden mb-6 transition-opacity duration-300"
          style={{
            opacity: transitioning ? 0 : imageLoaded ? 1 : 0.3,
            boxShadow: "0 0 40px rgba(240,196,86,0.08), 0 8px 32px rgba(0,0,0,0.5)",
            border: "1px solid rgba(240,196,86,0.1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.image}
            alt={`Episode 1, page ${currentPage + 1}`}
            className="w-full aspect-[16/10] object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Text */}
        <div
          className="w-full max-w-xl text-center transition-opacity duration-500"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{
              fontFamily: "'Nunito', sans-serif",
              color: "rgba(240,236,255,0.85)",
              lineHeight: 1.8,
            }}
          >
            {page.text}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-6 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all disabled:opacity-20"
          style={{
            background: "transparent",
            color: "rgba(240,236,255,0.5)",
            border: "1px solid rgba(240,236,255,0.1)",
          }}
        >
          ← Back
        </button>

        {/* Progress dots */}
        <div className="flex gap-1">
          {PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: i === currentPage
                  ? "#F0C456"
                  : i < currentPage
                  ? "rgba(240,196,86,0.3)"
                  : "rgba(240,236,255,0.1)",
                transform: i === currentPage ? "scale(1.5)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {isLastPage ? (
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #F0C456, #E0A830)",
              color: "#060B18",
              boxShadow: "0 0 20px rgba(240,196,86,0.2)",
            }}
          >
            Create yours →
          </Link>
        ) : (
          <button
            onClick={() => goTo(currentPage + 1)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(240,196,86,0.12)",
              color: "#F0C456",
              border: "1px solid rgba(240,196,86,0.2)",
            }}
          >
            Next →
          </button>
        )}
      </div>

      {/* Teaser on last page */}
      {isLastPage && (
        <div className="text-center pb-8 px-4">
          <p className="text-sm italic mb-2" style={{ color: "rgba(79,209,197,0.6)" }}>
            In Madrid, a mouse finds a golden scroll on his doorstep...
          </p>
          <p className="text-xs" style={{ color: "rgba(240,236,255,0.2)" }}>
            Episode 2: The Mouse Who Wouldn't Ask — Coming Soon
          </p>
        </div>
      )}
    </div>
  )
}
