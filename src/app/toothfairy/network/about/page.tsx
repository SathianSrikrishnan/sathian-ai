"use client"

import Link from "next/link"
import { FairyWorld } from "@/components/toothfairy/fairy-world"
import { SparkleIcon, ToothIcon } from "@/components/toothfairy/fairy-icons"

const steps = [
  {
    num: "1",
    title: "Record the moment",
    desc: "Take a photo of your child's gap-toothed smile, then photo or draw the tooth. Your child can turn their tooth into art.",
  },
  {
    num: "2",
    title: "The fairy mints it",
    desc: "Your child's tooth art is permanently stored on Arweave and minted as a compressed NFT on Solana. No crypto knowledge needed.",
  },
  {
    num: "3",
    title: "Family contributes",
    desc: "Share your child's page with grandparents and family. Anyone can gift SOL that locks until your child turns 18.",
  },
  {
    num: "4",
    title: "Savings grow quietly",
    desc: "Each lost tooth adds to the collection. The art gallery grows, the savings compound. By 18, they have a real nest egg.",
  },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen" style={{ color: "#F0ECFF" }}>
      <FairyWorld />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <SparkleIcon size={14} />
          <span className="text-sm font-semibold" style={{ color: "rgba(240,236,255,0.7)" }}>
            Tooth Fairy Network
          </span>
        </Link>
      </nav>

      <main className="relative z-10 max-w-lg mx-auto px-6 pb-20">
        {/* Header */}
        <div className="text-center mb-12 pt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{
            fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
            fontWeight: 900,
            color: "#F0ECFF",
          }}>
            How It Works
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(240,236,255,0.5)" }}>
            Above the clouds, an ancient network of light collects children&apos;s lost teeth
            and transforms them into permanent digital keepsakes. We just built the app that lets you see it.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{
                background: "rgba(240,196,86,0.1)",
                border: "1px solid rgba(240,196,86,0.2)",
                color: "#F0C456",
              }}>
                {s.num}
              </div>
              <div>
                <h3 className="text-base font-bold mb-1" style={{ color: "#F0ECFF", fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,236,255,0.45)" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The vision */}
        <div className="rounded-2xl p-6 mb-10" style={{
          background: "rgba(14,21,48,0.5)",
          border: "1px solid rgba(240,196,86,0.1)",
          backdropFilter: "blur(12px)",
        }}>
          <div className="flex items-center gap-2 mb-3">
            <ToothIcon size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(240,236,255,0.4)" }}>
              The Vision
            </h2>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(240,236,255,0.55)" }}>
            Every child loses 20 teeth between ages 5 and 13. That&apos;s 20 milestones,
            20 moments of wonder, 20 opportunities for family to contribute to a child&apos;s future.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(240,236,255,0.55)" }}>
            The Tooth Fairy Network turns those moments into a permanent art gallery and savings
            account that unlocks when your child turns 18. The art is the invitation.
            The savings is the product.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/app" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02]" style={{
            background: "linear-gradient(135deg, #F0C456, #E0A830)",
            color: "#060B18",
            boxShadow: "0 0 25px rgba(240,196,86,0.2)",
            fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
          }}>
            <SparkleIcon size={16} /> Create Your Child&apos;s First Keepsake
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] mt-12" style={{ color: "rgba(240,236,255,0.2)" }}>
          Secured by Solana &middot; Built by{" "}
          <a href="https://sathian.ai" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
            Sathian S.
          </a>
        </p>
      </main>
    </div>
  )
}
