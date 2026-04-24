"use client"

import Link from "next/link"

export function TFNFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="w-full"
      style={{
        borderTop: "1px solid var(--tfn-gold)",
        backgroundColor: "var(--tfn-surface-alt)",
        color: "var(--tfn-ink-muted)",
        transition:
          "background-color 400ms cubic-bezier(0.4, 0, 0.2, 1), color 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-8 text-center sm:flex-row sm:justify-between sm:py-10"
        style={{
          fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        }}
      >
        <p className="text-[12px] sm:text-[13px]" style={{ lineHeight: 1.5 }}>
          © {year} Tooth Fairy Network.
        </p>

        <div className="flex items-center gap-5 text-[12px] sm:text-[13px]">
          <Link
            href="/toothfairy/stories"
            className="transition-opacity hover:opacity-80"
            style={{ color: "var(--tfn-ink-soft)" }}
          >
            Stories
          </Link>
          <Link
            href="/toothfairy/app"
            className="transition-opacity hover:opacity-80"
            style={{ color: "var(--tfn-ink-soft)" }}
          >
            Start a keepsake
          </Link>
        </div>
      </div>
    </footer>
  )
}
