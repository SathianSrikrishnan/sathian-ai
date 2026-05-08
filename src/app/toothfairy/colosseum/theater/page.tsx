"use client"

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import {
  captureClipSets,
  type CaptureClip,
} from "@/remotion/colosseum/captureRunner"
import type { ColosseumVideoKind } from "@/remotion/colosseum/types"

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

function totalDuration(clips: CaptureClip[]) {
  return clips.reduce((total, clip) => total + clip.durationSeconds, 0)
}

const stageVisualStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
  borderRadius: 0,
  overflow: "hidden",
  background: "#f8fafc",
}

function startFor(clips: CaptureClip[], index: number) {
  return clips
    .slice(0, index)
    .reduce((total, clip) => total + clip.durationSeconds, 0)
}

function BrowserFrame({ clip }: { clip: CaptureClip }) {
  const ref = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        ref.current?.contentWindow?.scrollTo({
          top: clip.scrollY || 0,
          behavior: "smooth",
        })
      } catch {
        // Local app pages should be same origin; ignore if blocked.
      }
    }, 850)
    return () => window.clearTimeout(timeout)
  }, [clip])

  if (!clip.browserPath) return null

  return (
    <div className="browserFrame" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <div className="chrome">
        <span />
        <span />
        <span />
        <strong>{clip.browserPath}</strong>
      </div>
      <iframe
        ref={ref}
        key={clip.id}
        src={clip.browserPath}
        title={clip.title}
        style={{ width: "100%", height: "calc(100% - 34px)", border: 0 }}
      />
    </div>
  )
}

function AssetImage({ clip }: { clip: CaptureClip }) {
  if (!clip.assetPath) return null
  return (
    <img
      className="assetImage"
      src={clip.assetPath}
      alt={clip.title}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: clip.kind === "tanda" ? "center 44%" : "center center",
        display: "block",
      }}
    />
  )
}

function TheaterVisual({ clip }: { clip: CaptureClip }) {
  if (clip.kind === "browser") {
    return (
      <div className="visual browserVisual" style={stageVisualStyle}>
        <BrowserFrame clip={clip} />
      </div>
    )
  }

  if (clip.kind === "hybrid") {
    return (
      <div className="visual hybridVisual" style={{ ...stageVisualStyle, background: "#101728" }}>
        <div className="hybridFrame">
          <BrowserFrame clip={clip} />
        </div>
        {clip.assetPath ? (
          <div className="tandaInset">
            <AssetImage clip={clip} />
            <div className="voicePulse" />
          </div>
        ) : null}
      </div>
    )
  }

  if (clip.assetPath) {
    return (
      <div
        className={`visual assetVisual ${clip.kind === "tanda" ? "tandaVisual" : ""}`}
        style={stageVisualStyle}
      >
        <AssetImage clip={clip} />
        {clip.kind === "tanda" ? (
          <>
            <div className="voicePulse large" />
            <div className="speakerGlow" />
          </>
        ) : null}
      </div>
    )
  }

  return (
    <div className="visual proofVisual" style={stageVisualStyle}>
      <div>
        <span>Proof slot</span>
        <strong>{clip.title}</strong>
        <p>{clip.operatorNote}</p>
      </div>
    </div>
  )
}

export default function ColosseumTheaterPage() {
  const [kind, setKind] = useState<ColosseumVideoKind>("pitch")
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [recordMode, setRecordMode] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const clips = captureClipSets[kind]
  const clip = clips[Math.min(index, clips.length - 1)]
  const total = totalDuration(clips)
  const start = startFor(clips, index)
  const overall = Math.min(total, start + elapsed)
  const progress = useMemo(() => (overall / total) * 100, [overall, total])

  useEffect(() => {
    document.body.classList.add("colosseumTheaterActive")
    const hiddenChrome = Array.from(
      document.querySelectorAll<HTMLElement>('header, [role="banner"], footer'),
    ).map((element) => {
      const display = element.style.display
      element.style.display = "none"
      return { element, display }
    })

    return () => {
      document.body.classList.remove("colosseumTheaterActive")
      hiddenChrome.forEach(({ element, display }) => {
        element.style.display = display
      })
    }
  }, [])

  const selectClip = (nextIndex: number) => {
    setIndex(Math.max(0, Math.min(clips.length - 1, nextIndex)))
    setElapsed(0)
  }

  const switchKind = (nextKind: ColosseumVideoKind) => {
    setKind(nextKind)
    setIndex(0)
    setElapsed(0)
    setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    const audio = audioRef.current
    if (audio && clip.audioPath) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    const startTime = Date.now()
    const interval = window.setInterval(() => {
      setElapsed(Math.min(clip.durationSeconds, (Date.now() - startTime) / 1000))
    }, 100)
    const timeout = window.setTimeout(() => {
      if (index < clips.length - 1) {
        selectClip(index + 1)
      } else {
        setPlaying(false)
        setElapsed(clip.durationSeconds)
      }
    }, clip.durationSeconds * 1000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [clip, clips.length, index, playing])

  return (
    <main className={`theater ${recordMode ? "recordMode" : ""}`}>
      <section className="screen">
        <TheaterVisual clip={clip} />

        <div className="storyHeader">
          <span>{kind === "pitch" ? "Pitch rough cut" : "Technical rough cut"}</span>
          <strong>{clip.title}</strong>
        </div>

        <div className="caption">
          <span>{clip.lowerThird}</span>
          <p>{clip.narration}</p>
        </div>

        <div className="timeBar">
          <div style={{ width: `${progress}%` }} />
        </div>

        {clip.audioPath ? <audio key={clip.id} ref={audioRef} src={clip.audioPath} /> : null}
      </section>

      <aside className="controls">
        <div className="brandBlock">
          <span>Tooth Fairy Network</span>
          <h1>Colosseum Rough Cut</h1>
          <p>
            Watchable shell for shaping Tanda, the product thesis, and the
            technical proof before final captures are ready.
          </p>
        </div>

        <div className="modeRow">
          <button
            type="button"
            className={kind === "pitch" ? "active" : ""}
            onClick={() => switchKind("pitch")}
          >
            Pitch
          </button>
          <button
            type="button"
            className={kind === "technical" ? "active" : ""}
            onClick={() => switchKind("technical")}
          >
            Technical
          </button>
        </div>

        <div className="transport">
          <button type="button" onClick={() => selectClip(index - 1)}>
            Back
          </button>
          <button type="button" className="primary" onClick={() => setPlaying((value) => !value)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => selectClip(index + 1)}>
            Next
          </button>
        </div>

        <button
          type="button"
          className={`recordToggle ${recordMode ? "active" : ""}`}
          onClick={() => setRecordMode((value) => !value)}
        >
          {recordMode ? "Show controls" : "Record mode"}
        </button>

        <div className="runtime">
          <strong>{formatTime(overall)}</strong>
          <span>/ {formatTime(total)}</span>
        </div>

        <div className="clipRail">
          {clips.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={itemIndex === index ? "active" : ""}
              onClick={() => selectClip(itemIndex)}
            >
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <em>{formatTime(item.durationSeconds)}</em>
            </button>
          ))}
        </div>

        <div className="note">
          <span>Current note</span>
          <p>{clip.operatorNote}</p>
        </div>
      </aside>

      <style jsx global>{`
        .theater {
          --ink: #172033;
          --muted: #69768a;
          --line: #dce5f0;
          --gold: #d7a84a;
          --violet: #6e5ae6;
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          background: #0d1321;
          color: var(--ink);
          font-family: var(--font-body), "Alegreya Sans", system-ui, sans-serif;
        }

        .screen {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 18%, rgba(215, 168, 74, 0.16), transparent 36%),
            radial-gradient(circle at 80% 18%, rgba(110, 90, 230, 0.18), transparent 32%),
            linear-gradient(135deg, #121a2b, #0b101c);
        }

        .visual {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 0;
          overflow: hidden;
          background: #f8fafc;
          animation: stageIn 700ms ease both;
        }

        @keyframes stageIn {
          from {
            opacity: 0;
            transform: scale(1.025) translateY(14px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .assetImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          animation: slowZoom 12s ease both;
        }

        @keyframes slowZoom {
          from {
            transform: scale(1.06);
          }
          to {
            transform: scale(1);
          }
        }

        .tandaVisual {
          background: #fff2da;
        }

        .tandaVisual .assetImage {
          object-fit: cover;
          object-position: center 44%;
        }

        .speakerGlow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 42%, transparent 30%, rgba(255, 244, 222, 0.42) 70%);
          pointer-events: none;
        }

        .voicePulse {
          position: absolute;
          right: 22px;
          bottom: 22px;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid rgba(215, 168, 74, 0.82);
          box-shadow: 0 0 0 0 rgba(215, 168, 74, 0.55);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .voicePulse.large {
          right: 42px;
          bottom: 42px;
          width: 110px;
          height: 110px;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(215, 168, 74, 0.4);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 24px rgba(215, 168, 74, 0);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(215, 168, 74, 0);
          }
        }

        .browserFrame {
          width: 100%;
          height: 100%;
          background: #ffffff;
        }

        .chrome {
          height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-bottom: 1px solid #d9e1ec;
          background: #eef2f7;
        }

        .chrome span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #c7d1de;
        }

        .chrome strong {
          margin-left: 8px;
          color: #445064;
          font-size: 12px;
        }

        iframe {
          width: 100%;
          height: calc(100% - 34px);
          border: 0;
        }

        .hybridVisual {
          background: #101728;
        }

        .hybridFrame {
          position: absolute;
          inset: 34px 230px 34px 34px;
          border-radius: 8px;
          overflow: hidden;
        }

        .tandaInset {
          position: absolute;
          right: 34px;
          bottom: 34px;
          width: 250px;
          aspect-ratio: 9 / 14;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.36);
          background: #fff2da;
        }

        .proofVisual {
          display: grid;
          place-items: center;
          padding: 70px;
          text-align: center;
          background:
            linear-gradient(135deg, rgba(110, 90, 230, 0.2), rgba(215, 168, 74, 0.18)),
            #f8fbff;
        }

        .proofVisual span {
          color: var(--violet);
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .proofVisual strong {
          display: block;
          margin-top: 12px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 56px;
          line-height: 1;
        }

        .proofVisual p {
          max-width: 560px;
          margin: 16px auto 0;
          color: var(--muted);
          font-size: 19px;
          line-height: 1.4;
        }

        .storyHeader {
          position: absolute;
          left: 46px;
          top: 30px;
          color: #ffffff;
        }

        .storyHeader span {
          display: block;
          color: #f4d58c;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .storyHeader strong {
          display: block;
          margin-top: 5px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 28px;
          line-height: 1;
        }

        .caption {
          position: absolute;
          left: 46px;
          right: 386px;
          bottom: 44px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          background: rgba(12, 18, 31, 0.88);
          color: #ffffff;
          padding: 18px 20px;
          backdrop-filter: blur(12px);
        }

        .caption span {
          display: block;
          color: #f4d58c;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .caption p {
          margin: 8px 0 0;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 760;
        }

        .timeBar {
          position: absolute;
          left: 46px;
          right: 386px;
          bottom: 22px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          overflow: hidden;
        }

        .timeBar div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #d7a84a, #e4839f, #6e5ae6);
        }

        .controls {
          min-height: 100vh;
          border-left: 1px solid var(--line);
          background: #ffffff;
          padding: 18px;
          overflow-y: auto;
        }

        .brandBlock span,
        .note span {
          display: block;
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        h1,
        p {
          margin: 0;
        }

        h1 {
          margin-top: 6px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 31px;
          line-height: 1;
        }

        .brandBlock p,
        .note p {
          margin-top: 10px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.42;
        }

        .modeRow,
        .transport {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 16px;
        }

        .transport {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 10px;
        }

        button {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #ffffff;
          color: var(--ink);
          padding: 10px 12px;
          font: inherit;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
        }

        button.active,
        button.primary {
          border-color: var(--ink);
          background: var(--ink);
          color: #ffffff;
        }

        .recordToggle {
          width: 100%;
          margin-top: 10px;
          border-color: #e8d39a;
          background: #fff8e6;
        }

        .recordToggle.active {
          background: var(--gold);
          color: var(--ink);
        }

        .runtime {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-top: 16px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 14px;
          background: #f7f9fc;
        }

        .runtime strong {
          font-size: 31px;
        }

        .runtime span {
          color: var(--muted);
          font-size: 15px;
          font-weight: 800;
        }

        .clipRail {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }

        .clipRail button {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          text-align: left;
        }

        .clipRail span {
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
        }

        .clipRail strong {
          font-size: 14px;
          line-height: 1.2;
        }

        .clipRail em {
          color: var(--muted);
          font-size: 12px;
          font-style: normal;
          font-weight: 800;
        }

        .note {
          margin-top: 16px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fffaf0;
          padding: 14px;
        }

        .recordMode {
          grid-template-columns: 1fr;
        }

        .recordMode .controls {
          display: none;
        }

        .recordMode .caption,
        .recordMode .timeBar {
          right: 46px;
        }

        @media (max-width: 1050px) {
          .theater {
            grid-template-columns: 1fr;
          }

          .controls {
            min-height: auto;
            border-left: 0;
            border-top: 1px solid var(--line);
          }

          .caption,
          .timeBar {
            right: 46px;
          }
        }
      `}</style>
      <style jsx global>{`
        body.colosseumTheaterActive header,
        body.colosseumTheaterActive [role="banner"],
        body.colosseumTheaterActive footer {
          display: none !important;
        }
      `}</style>
    </main>
  )
}
