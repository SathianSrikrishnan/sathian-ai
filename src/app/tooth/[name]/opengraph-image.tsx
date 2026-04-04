import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Tooth Fairy Network"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: { name: string } }) {
  const childName = decodeURIComponent(params.name).replace(/-/g, " ")
  const capitalized = childName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1026",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 30%, #1A1040 0%, #0B1026 70%)" }} />

        {/* Sparkle dots */}
        {[
          { x: "15%", y: "20%", s: 3, o: 0.6 }, { x: "80%", y: "15%", s: 2, o: 0.4 },
          { x: "25%", y: "75%", s: 4, o: 0.5 }, { x: "85%", y: "70%", s: 3, o: 0.7 },
          { x: "50%", y: "10%", s: 2, o: 0.3 }, { x: "70%", y: "85%", s: 3, o: 0.4 },
          { x: "10%", y: "50%", s: 2, o: 0.5 }, { x: "90%", y: "40%", s: 2, o: 0.3 },
        ].map((dot, i) => (
          <div key={i} style={{
            position: "absolute", left: dot.x, top: dot.y,
            width: dot.s, height: dot.s, borderRadius: "50%",
            background: i % 3 === 0 ? "#4FD1C5" : "#F0C456",
            opacity: dot.o,
            boxShadow: `0 0 ${dot.s * 3}px ${i % 3 === 0 ? "rgba(79,209,197,0.5)" : "rgba(240,196,86,0.5)"}`,
          }} />
        ))}

        {/* Main card — glassmorphism with golden glow */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 60px",
          borderRadius: 28,
          background: "rgba(22, 36, 71, 0.7)",
          border: "2px solid rgba(240, 196, 86, 0.35)",
          boxShadow: "0 0 40px rgba(240, 196, 86, 0.15), 0 0 100px rgba(240, 196, 86, 0.05), 0 25px 50px rgba(0,0,0,0.5)",
          position: "relative",
        }}>
          {/* Tooth icon */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #FFF8F0, #E8DDD0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(240,196,86,0.3)",
            marginBottom: 24,
            fontSize: 32,
          }}>
            🦷
          </div>

          {/* Child's name — golden */}
          <div style={{
            fontSize: 64, fontWeight: 900, letterSpacing: -2,
            color: "#F0C456",
            textShadow: "0 0 30px rgba(240,196,86,0.4)",
            marginBottom: 8,
          }}>
            {capitalized}
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 22, color: "#4FD1C5",
            letterSpacing: 2, textTransform: "uppercase",
            fontWeight: 600,
          }}>
            Tooth Fairy Digital Wallet
          </div>
        </div>

        {/* Footer branding */}
        <div style={{
          position: "absolute", bottom: 36,
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 16, color: "rgba(245,240,255,0.3)",
        }}>
          <span>toothfairy.network</span>
          <span style={{ color: "rgba(240,196,86,0.4)" }}>✦</span>
          <span>Secured by Solana</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
