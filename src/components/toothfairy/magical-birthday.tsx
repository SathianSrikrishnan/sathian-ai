"use client"

export function MagicalBirthday({ dateStr }: { dateStr: string }) {
  const date = new Date(dateStr + "T00:00:00")
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
  const day = date.getDate().toString()
  const year = date.getFullYear().toString()

  return (
    <div className="inline-flex flex-col items-center" style={{
      background: "rgba(14, 21, 48, 0.5)",
      border: "1px solid rgba(240, 196, 86, 0.15)",
      borderRadius: 14,
      padding: "10px 22px 8px",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 0 20px rgba(240, 196, 86, 0.04), inset 0 0 16px rgba(240, 196, 86, 0.03), 0 0 0 1px rgba(240, 196, 86, 0.06)",
    }}>
      <span style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "2.5px",
        color: "#4FD1C5",
        fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
      }}>
        {month} {year}
      </span>
      <span style={{
        fontSize: 36,
        fontWeight: 800,
        color: "#F5F0FF",
        lineHeight: 1,
        textShadow: "0 0 18px rgba(245, 240, 255, 0.12)",
        fontFamily: "var(--font-nunito, 'Nunito', sans-serif)",
      }}>
        {day}
      </span>
      <span style={{
        fontSize: 8,
        color: "rgba(245, 240, 255, 0.3)",
        fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
      }}>
        born
      </span>
    </div>
  )
}
