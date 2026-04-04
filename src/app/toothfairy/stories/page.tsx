"use client"

import Link from "next/link"

const EPISODES = [
  {
    number: 1,
    title: "The Promise That Almost Broke",
    description: "Tanda and her team are stretched thin. Forty-seven teeth. Six cities. One night. Something has to change.",
    slug: "the-promise-that-almost-broke",
    status: "available" as const,
    image: "/stories/episode-1/ep1-page-18-messages-fly.jpg",
  },
  {
    number: 2,
    title: "The Mouse Who Wouldn't Ask",
    description: "In Madrid, a proud mouse has been failing silently. Pride is the last thing to break.",
    slug: "the-mouse-who-wouldnt-ask",
    status: "coming-soon" as const,
    image: "/story-assets/characters/char-perez.jpg",
  },
  {
    number: 3,
    title: "The Magpie's Song",
    description: "The fastest messenger in the world learns that some things aren't meant to be opened.",
    slug: "the-magpies-song",
    status: "coming-soon" as const,
    image: "/story-assets/characters/char-magpie.jpg",
  },
  {
    number: 4,
    title: "The Cave and the Lodge",
    description: "Two collectors who love preservation face each other. One hoards. One connects. Same impulse, different futures.",
    slug: "the-cave-and-the-lodge",
    status: "coming-soon" as const,
    image: "/story-assets/characters/char-finnish-troll.jpg",
  },
  {
    number: 5,
    title: "Your Tooth",
    description: "You lost a tooth. We know. We've been waiting.",
    slug: "your-tooth",
    status: "coming-soon" as const,
    image: "/story-assets/characters/char-beaver.jpg",
  },
]

export default function StoriesIndex() {
  return (
    <div className="min-h-screen" style={{ background: "#060B18", color: "#F0ECFF" }}>
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(240,196,86,0.08)" }}>
        <Link href="/" className="text-sm font-semibold" style={{ color: "rgba(240,236,255,0.7)" }}>
          ✦ Tooth Fairy Network
        </Link>
        <Link href="/about" className="text-xs" style={{ color: "rgba(240,236,255,0.4)" }}>
          About
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-3xl font-extrabold text-center mb-3"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "#F0C456",
            textShadow: "0 0 30px rgba(240,196,86,0.15)",
          }}
        >
          The Tooth Fairy Network
        </h1>
        <p className="text-center text-sm mb-12" style={{ color: "rgba(240,236,255,0.45)" }}>
          Season 1 — The Network Connects
        </p>

        <div className="flex flex-col gap-4">
          {EPISODES.map((ep) => {
            const isAvailable = ep.status === "available"
            const Wrapper = isAvailable ? Link : "div"
            const wrapperProps = isAvailable ? { href: `/stories/${ep.slug}` } : {}

            return (
              <Wrapper
                key={ep.number}
                {...(wrapperProps as any)}
                className={`flex gap-4 p-4 rounded-2xl transition-all ${isAvailable ? "hover:scale-[1.01] cursor-pointer" : "opacity-50"}`}
                style={{
                  background: "rgba(14,21,48,0.6)",
                  border: `1px solid ${isAvailable ? "rgba(240,196,86,0.15)" : "rgba(240,236,255,0.05)"}`,
                }}
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(240,196,86,0.1)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: "rgba(240,196,86,0.6)" }}>
                      EP {ep.number}
                    </span>
                    {!isAvailable && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(240,236,255,0.05)", color: "rgba(240,236,255,0.3)" }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold mb-1 truncate" style={{ color: isAvailable ? "#F0ECFF" : "rgba(240,236,255,0.5)", fontFamily: "'Nunito', sans-serif" }}>
                    {ep.title}
                  </h3>
                  <p className="text-xs line-clamp-2" style={{ color: "rgba(240,236,255,0.35)" }}>
                    {ep.description}
                  </p>
                </div>

                {/* Arrow */}
                {isAvailable && (
                  <div className="flex items-center" style={{ color: "#F0C456" }}>
                    <span className="text-lg">→</span>
                  </div>
                )}
              </Wrapper>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #F0C456, #E0A830)",
              color: "#060B18",
              boxShadow: "0 0 20px rgba(240,196,86,0.15)",
            }}
          >
            ✦ Create Your Child's Keepsake
          </Link>
        </div>

        <p className="text-center text-[11px] mt-8" style={{ color: "rgba(240,236,255,0.15)" }}>
          Tooth Fairy Network — Permanently stored
        </p>
      </main>
    </div>
  )
}
