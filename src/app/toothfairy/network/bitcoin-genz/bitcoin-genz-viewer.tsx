"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import * as pdfjsLib from "pdfjs-dist"

// Set up pdf.js worker (local copy in /public)
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

const C = {
  bg: "#050510",
  surface: "#0F0F2D",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

const PDF_URL = "/bitcoin-genz.pdf"

const PAGE_TITLES = [
  "Abstract & Introduction",
  "Transactions",
  "Timestamp Server",
  "Proof-of-Work",
  "Network",
  "Incentive",
  "Reclaiming Disk Space",
  "SPV & Privacy",
  "Calculations & Conclusion",
]

const PAGE_ACCENTS = [
  C.stardust, C.aurora, C.nebula, C.stardust, C.aurora,
  C.nebula, C.stardust, C.aurora, C.nebula,
]

function PdfThumbnail({ pageNum, onClick, accent, title }: {
  pageNum: number
  onClick: () => void
  accent: string
  title: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const pdf = await pdfjsLib.getDocument(PDF_URL).promise
        const page = await pdf.getPage(pageNum)
        const targetWidth = 320 // render at 2x for retina
        const unscaledViewport = page.getViewport({ scale: 1 })
        const scale = targetWidth / unscaledViewport.width
        const viewport = page.getViewport({ scale })

        if (cancelled || !canvasRef.current) return
        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        await page.render({ canvas: canvas, canvasContext: ctx, viewport } as any).promise
        if (!cancelled) setLoaded(true)
      } catch (e) {
        console.error("PDF thumbnail render error:", e)
      }
    }
    render()
    return () => { cancelled = true }
  }, [pageNum])

  return (
    <motion.button
      onClick={onClick}
      className="rounded-xl relative overflow-hidden cursor-pointer group"
      style={{ border: `1px solid ${accent}20` }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + (pageNum - 1) * 0.06, duration: 0.4 }}
    >
      {/* Canvas thumbnail */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
      />

      {/* Loading placeholder */}
      {!loaded && (
        <div className="aspect-[3/4] w-full animate-pulse" style={{
          background: `linear-gradient(145deg, ${C.surface}f0, ${C.bg}e0)`,
        }} />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to top, ${C.bg}e0 0%, ${C.bg}60 40%, transparent 70%)`,
      }} />

      {/* Page number */}
      <div className="absolute top-2 right-2.5">
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
          color: accent,
          background: `${C.bg}cc`,
        }}>{pageNum}</span>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-[10px] md:text-[11px] font-display font-semibold leading-tight" style={{ color: C.text + "cc" }}>
          {title}
        </p>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" style={{
        boxShadow: `inset 0 0 30px ${accent}15, 0 0 20px ${accent}10`,
      }} />
    </motion.button>
  )
}

function PdfFullPage({ pageNum, width }: { pageNum: number; width: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const pdf = await pdfjsLib.getDocument(PDF_URL).promise
        const page = await pdf.getPage(pageNum)
        const unscaledViewport = page.getViewport({ scale: 1 })
        const scale = (width * 2) / unscaledViewport.width // 2x for retina
        const viewport = page.getViewport({ scale })

        if (cancelled || !canvasRef.current) return
        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        await page.render({ canvas: canvas, canvasContext: ctx, viewport } as any).promise
        if (!cancelled) setLoaded(true)
      } catch (e) {
        console.error("PDF full page render error:", e)
      }
    }
    render()
    return () => { cancelled = true }
  }, [pageNum, width])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "auto", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
      />
      {!loaded && (
        <div className="w-full aspect-[3/4] animate-pulse rounded-lg" style={{
          background: `linear-gradient(145deg, ${C.surface}, ${C.bg})`,
        }} />
      )}
    </>
  )
}

export default function BitcoinGenZViewer() {
  const [selectedPage, setSelectedPage] = useState<number | null>(null)

  const modalWidth = typeof window !== "undefined" ? Math.min(520, window.innerWidth - 80) : 520

  // Keyboard navigation for PDF modal
  useEffect(() => {
    if (selectedPage === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedPage((p) => (p !== null && p > 0 ? p - 1 : p))
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedPage((p) => (p !== null && p < 8 ? p + 1 : p))
      } else if (e.key === "Escape") {
        setSelectedPage(null)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedPage])

  return (
    <div className="min-h-screen relative" style={{ background: C.bg, color: C.text }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4" style={{ backdropFilter: "blur(20px)", background: `${C.bg}cc` }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/toothfairy/network/about" className="text-sm font-mono hover:underline" style={{ color: C.muted + "80" }}>
            &larr; Back to About
          </Link>
          <Link href="/toothfairy/network" className="text-sm font-mono" style={{ color: C.muted + "60" }}>Network</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Header quote */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.blockquote
            className="max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl italic leading-relaxed font-display" style={{ color: C.text + "dd" }}>
              &ldquo;A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.&rdquo;
            </p>
            <p className="text-xs font-mono mt-3" style={{ color: C.muted + "60" }}>&mdash; Satoshi Nakamoto, 2008</p>
          </motion.blockquote>

          <div className="h-px max-w-xs mx-auto mb-10" style={{ background: `linear-gradient(90deg, transparent, ${C.stardust}30, transparent)` }} />

          <div className="space-y-3 max-w-xl mx-auto" style={{ color: C.text + "99" }}>
            <p className="text-sm leading-relaxed">
              Published <span style={{ color: C.stardust }}>October 31, 2008</span>. Nine pages. Written by <span style={{ color: C.text + "cc" }}>Satoshi Nakamoto</span> &mdash; whose identity remains unknown to this day.
            </p>
            <p className="text-sm leading-relaxed">
              Many consider Nakamoto one of the greatest thinkers, innovators, and changemakers of our time.
              This 9-page document forever altered history, power structures, and what&rsquo;s possible for humanity.
            </p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-2xl md:text-3xl font-bold text-center mb-3"
        >
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
            Bitcoin: A Homie-to-Homie Digital Cash Vibe
          </span>
        </motion.h1>
        <p className="text-center text-xs font-mono mb-10" style={{ color: C.muted + "50" }}>
          Gen Z translation &middot; adapted from{" "}
          <a href="https://bitcoinforgenz.org/Bitcoin-Whitepaper-For-Gen-Z.pdf" target="_blank" rel="noopener noreferrer"
            className="underline hover:opacity-80" style={{ color: C.aurora + "70" }}>
            bitcoinforgenz.org
          </a>
        </p>

        {/* 3x3 Grid of PDF page thumbnails */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <PdfThumbnail
              key={i}
              pageNum={i + 1}
              onClick={() => setSelectedPage(i)}
              accent={PAGE_ACCENTS[i]}
              title={PAGE_TITLES[i]}
            />
          ))}
        </motion.div>

        {/* Full page modal */}
        <AnimatePresence>
          {selectedPage !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPage(null)} />

              {/* Content */}
              <motion.div
                className="relative max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{
                  background: `linear-gradient(145deg, ${C.surface}, ${C.bg})`,
                  border: `1px solid ${PAGE_ACCENTS[selectedPage]}30`,
                  boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 40px ${PAGE_ACCENTS[selectedPage]}10`,
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Accent bar */}
                <div className="h-[3px] w-full" style={{
                  background: `linear-gradient(90deg, ${PAGE_ACCENTS[selectedPage]}, ${PAGE_ACCENTS[selectedPage]}40)`,
                }} />

                {/* Close */}
                <button onClick={() => setSelectedPage(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all z-10" style={{ color: C.muted, background: `${C.bg}cc` }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2L10 10M10 2L2 10" /></svg>
                </button>

                {/* Page header */}
                <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{
                    color: PAGE_ACCENTS[selectedPage],
                    background: PAGE_ACCENTS[selectedPage] + "10",
                    border: `1px solid ${PAGE_ACCENTS[selectedPage]}20`,
                  }}>Page {selectedPage + 1} of 9</span>
                  <span className="text-xs font-display" style={{ color: C.text + "aa" }}>{PAGE_TITLES[selectedPage]}</span>
                </div>

                {/* Full page render */}
                <div className="px-4 pb-4 flex justify-center">
                  <PdfFullPage pageNum={selectedPage + 1} width={modalWidth} />
                </div>

                {/* Page navigation */}
                <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <button
                    onClick={() => setSelectedPage(Math.max(0, selectedPage - 1))}
                    disabled={selectedPage === 0}
                    className="text-xs font-mono cursor-pointer disabled:opacity-20 hover:underline transition-all"
                    style={{ color: C.muted }}
                  >
                    &larr; Previous
                  </button>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 9 }, (_, i) => (
                      <button key={i} onClick={() => setSelectedPage(i)}
                        className="w-2 h-2 rounded-full cursor-pointer transition-all"
                        style={{
                          background: i === selectedPage ? PAGE_ACCENTS[i] : "rgba(255,255,255,0.15)",
                          boxShadow: i === selectedPage ? `0 0 6px ${PAGE_ACCENTS[i]}60` : "none",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedPage(Math.min(8, selectedPage + 1))}
                    disabled={selectedPage === 8}
                    className="text-xs font-mono cursor-pointer disabled:opacity-20 hover:underline transition-all"
                    style={{ color: C.muted }}
                  >
                    Next &rarr;
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document hash */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-mono" style={{ color: C.muted + "25" }}>
            SHA-256: f5dab73f2e77780df1c5b90398a275a18082950cf98c7d350fe95074184d1c92
          </p>
        </div>
      </main>

      <footer className="py-8 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-mono" style={{ color: C.muted + "40" }}>The Tooth Fairy Network &copy; 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/toothfairy/network" className="text-[11px] font-mono hover:underline" style={{ color: C.muted + "40" }}>Network</Link>
            <Link href="/toothfairy/network/about" className="text-[11px] font-mono hover:underline" style={{ color: C.muted + "40" }}>About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
