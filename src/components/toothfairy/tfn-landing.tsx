"use client"

import Link from "next/link"
import { FairyWorld } from "./fairy-world"
import { SparkleIcon } from "./fairy-icons"

export function TfnLanding() {
  return (
    <div className="relative min-h-screen" style={{ color: "#F0ECFF" }}>
      <FairyWorld />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <SparkleIcon size={14} />
          <span className="text-sm font-semibold" style={{ color: "rgba(240,236,255,0.7)", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>
            Tooth Fairy Network
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/story" className="text-xs" style={{ color: "rgba(240,236,255,0.45)" }}>
            Stories
          </Link>
          <Link href="/about" className="text-xs" style={{ color: "rgba(240,236,255,0.45)" }}>
            About
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-8 sm:pt-16 pb-20 max-w-lg mx-auto text-center">

        {/* Fairy image */}
        <div className="relative mb-6" style={{ width: 90, height: 144 }}>
          <div className="absolute inset-0 animate-pulse" style={{
            background: "radial-gradient(circle, rgba(240,196,86,0.15) 0%, transparent 60%)",
            transform: "scale(2)",
            filter: "blur(10px)",
          }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fairy-assets/fairy-hover.png"
            alt="Tooth Fairy"
            className="relative w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 0 15px rgba(240,196,86,0.3))" }}
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3" style={{
          fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #F0C456 0%, #FFE0A0 30%, #F0C456 55%, #FFD700 80%, #F0C456 100%)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer-name 5s ease-in-out infinite",
          filter: "drop-shadow(0 0 16px rgba(240,196,86,0.2))",
        }}>
          Welcome to the Tooth Fairy Network
        </h1>

        <p className="text-sm sm:text-base mb-10 leading-relaxed max-w-sm" style={{ color: "rgba(240,236,255,0.55)" }}>
          Tooth fairy traditions from six continents. Every story ends with a keepsake your child owns forever.
        </p>

        {/* Primary CTA — explore stories first */}
        <Link href="/story" className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]" style={{
          background: "linear-gradient(135deg, #F0C456, #E0A830)",
          color: "#060B18",
          boxShadow: "0 0 25px rgba(240,196,86,0.2)",
          fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
        }}>
          <SparkleIcon size={16} /> Explore the Stories
        </Link>
        <Link href="/toothfairy/app/draw?from=legacy-landing" className="block text-xs mt-3 hover:underline transition-opacity" style={{ color: "rgba(240,236,255,0.35)" }}>
          or create a keepsake directly &rarr;
        </Link>

        {/* Footer note */}
        <p className="text-[11px] mt-10" style={{ color: "rgba(240,236,255,0.2)" }}>
          Permanently stored &middot; Built by{" "}
          <a href="https://sathian.ai" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
            Sathian S.
          </a>
        </p>
      </main>

      <style>{`
        @keyframes shimmer-name { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>
    </div>
  )
}
