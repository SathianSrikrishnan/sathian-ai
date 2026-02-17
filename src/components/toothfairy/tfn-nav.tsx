"use client"

import { useEffect, useState } from "react"
import { C } from "./tokens"

type ActivePage = "story" | "technical" | "market"

export function TfnNav({ activePage }: { activePage: ActivePage }) {
  const [scrolled, setScrolled] = useState(false)
  const [isSubdomain, setIsSubdomain] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    setIsSubdomain(window.location.hostname === "toothfairy.sathian.ai")
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const base = isSubdomain ? "" : "/toothfairy/network"
  const links = [
    { label: "Story", page: "story" as const, href: `${base}/` },
    { label: "Technical", page: "technical" as const, href: `${base}/technical` },
    { label: "Market", page: "market" as const, href: `${base}/market` },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? `${C.bg}e6` : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href={`${base}/`} className="text-base font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Tooth Fairy Network
        </a>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                activePage === link.page ? "text-white bg-white/[0.05]" : "hover:bg-white/[0.05]"
              }`}
              style={activePage !== link.page ? { color: C.muted } : undefined}
            >
              {link.label}
            </a>
          ))}
          <a
            href={activePage === "story" ? "#feedback" : `${base}/#feedback`}
            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hidden sm:inline-flex"
            style={{ background: C.rose }}
          >
            Share Feedback
          </a>
        </div>
      </div>
    </nav>
  )
}
