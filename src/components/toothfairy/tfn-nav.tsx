"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { C } from "./tokens"

type ActivePage = "story" | "technical" | "market" | "app"

export function TfnNav({ activePage }: { activePage: ActivePage }) {
  const [scrolled, setScrolled] = useState(false)
  const [isTfnDomain, setIsTfnDomain] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    const host = window.location.hostname
    setIsTfnDomain(host === "toothfairy.network" || host === "www.toothfairy.network" || host === "toothfairy.sathian.ai")
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // On toothfairy.network: / = landing, /app/draw = app, /network/technical = technical
  // On sathian.ai: /toothfairy/network/ = landing, /toothfairy/app/draw = app
  const base = isTfnDomain ? "/network" : "/toothfairy/network"
  const homeHref = isTfnDomain ? "/" : "/toothfairy/network"
  const appHref = isTfnDomain ? "/app/draw?from=legacy-nav" : "/toothfairy/app/draw?from=legacy-nav"

  const links = [
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
        <Link href={homeHref} className="text-base font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          <span className="hidden sm:inline">Tooth Fairy Network</span>
          <span className="sm:hidden">TFN</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.page}
              href={link.href}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                activePage === link.page ? "text-white bg-white/[0.05]" : "hover:bg-white/[0.05]"
              }`}
              style={activePage !== link.page ? { color: C.muted } : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={appHref}
            className="ml-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ background: C.rose }}
          >
            Try It Free
          </Link>
        </div>
      </div>
    </nav>
  )
}
