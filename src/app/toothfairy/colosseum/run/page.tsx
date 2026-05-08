"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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

function clipStart(clips: CaptureClip[], index: number) {
  return clips
    .slice(0, index)
    .reduce((total, clip) => total + clip.durationSeconds, 0)
}

function ClipVisual({ clip }: { clip: CaptureClip }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !clip.browserPath) return

    const scrollFrame = () => {
      try {
        frame.contentWindow?.scrollTo({
          top: clip.scrollY || 0,
          behavior: "smooth",
        })
      } catch {
        // Same-origin pages should allow this; if not, the capture still works.
      }
    }

    const id = window.setTimeout(scrollFrame, 900)
    return () => window.clearTimeout(id)
  }, [clip])

  if (clip.kind === "browser") {
    return (
      <div className="browserShell">
        <div className="browserChrome">
          <span />
          <span />
          <span />
          <strong>{clip.browserPath}</strong>
        </div>
        <iframe
          key={clip.id}
          ref={frameRef}
          src={clip.browserPath}
          title={clip.title}
        />
      </div>
    )
  }

  if (clip.kind === "hybrid") {
    return (
      <div className="hybridStage">
        <div className="hybridBrowser">
          {clip.browserPath ? (
            <div className="browserShell">
              <div className="browserChrome">
                <span />
                <span />
                <span />
                <strong>{clip.browserPath}</strong>
              </div>
              <iframe
                key={clip.id}
                ref={frameRef}
                src={clip.browserPath}
                title={clip.title}
              />
            </div>
          ) : null}
        </div>
        {clip.assetPath ? (
          <div className="tandaGuide">
            <img src={clip.assetPath} alt="Tanda Faye guide" />
          </div>
        ) : null}
      </div>
    )
  }

  if (clip.assetPath) {
    return (
      <div className={`assetStage ${clip.kind === "tanda" ? "tandaOnly" : ""}`}>
        <img src={clip.assetPath} alt={clip.title} />
      </div>
    )
  }

  return (
    <div className="proofPlaceholder">
      <span>Proof capture slot</span>
      <strong>{clip.title}</strong>
      <p>{clip.operatorNote}</p>
    </div>
  )
}

export default function ColosseumCaptureRunnerPage() {
  const [kind, setKind] = useState<ColosseumVideoKind>("pitch")
  const [voiceId, setVoiceId] = useState("")
  const [voicePin, setVoicePin] = useState("")
  const [voiceStatus, setVoiceStatus] = useState("Voice generation is idle.")
  const [generatingVoice, setGeneratingVoice] = useState(false)
  const clips = captureClipSets[kind]
  const [indexByKind, setIndexByKind] = useState<Record<ColosseumVideoKind, number>>({
    pitch: 0,
    technical: 0,
  })
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const index = Math.min(indexByKind[kind], clips.length - 1)
  const clip = clips[index]
  const total = totalDuration(clips)
  const start = clipStart(clips, index)
  const overall = start + elapsed

  const progress = useMemo(
    () => Math.min(100, (overall / total) * 100),
    [overall, total],
  )

  const goTo = (nextIndex: number) => {
    setIndexByKind((current) => ({
      ...current,
      [kind]: Math.max(0, Math.min(clips.length - 1, nextIndex)),
    }))
    setElapsed(0)
  }

  const generateVoice = async () => {
    setGeneratingVoice(true)
    setVoiceStatus("Generating voice chunks...")
    try {
      const response = await fetch("/api/toothfairy/colosseum/voiceover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-voice-pin": voicePin,
        },
        body: JSON.stringify({
          kind,
          voiceId: voiceId.trim() || undefined,
          limit: kind === "pitch" ? 6 : 6,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || "Voice generation failed.")
      }
      setVoiceStatus(`Generated ${data.count || 0} ${kind} clips. Refresh playback to use them.`)
    } catch (error) {
      setVoiceStatus(error instanceof Error ? error.message : "Voice generation failed.")
    } finally {
      setGeneratingVoice(false)
    }
  }

  useEffect(() => {
    setElapsed(0)
  }, [kind])

  useEffect(() => {
    if (!playing) return

    const audio = audioRef.current
    if (audio && clip.audioPath) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Audio files may not exist yet; visual playback should continue.
      })
    }

    const startTime = Date.now()
    const interval = window.setInterval(() => {
      const nextElapsed = (Date.now() - startTime) / 1000
      setElapsed(Math.min(clip.durationSeconds, nextElapsed))
    }, 120)
    const timeout = window.setTimeout(() => {
      if (index < clips.length - 1) {
        goTo(index + 1)
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
    <main className="captureRunner">
      <section className="stage">
        <ClipVisual clip={clip} />

        <div className="tandaCaption">
          <span>{clip.lowerThird}</span>
          <p>{clip.narration}</p>
        </div>

        <div className="topBar">
          <div>
            <span>Colosseum capture runner</span>
            <strong>{kind === "pitch" ? "Pitch video" : "Technical video"}</strong>
          </div>
          <div className="timecode">
            {formatTime(overall)} / {formatTime(total)}
          </div>
        </div>

        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </section>

      {clip.audioPath ? (
        <audio key={clip.id} ref={audioRef} src={clip.audioPath} />
      ) : null}

      <aside className="controlDeck">
        <div className="modeSwitch">
          {(["pitch", "technical"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={kind === option ? "active" : ""}
              onClick={() => {
                setKind(option)
                setPlaying(false)
              }}
            >
              {option === "pitch" ? "Pitch" : "Technical"}
            </button>
          ))}
        </div>

        <div className="transport">
          <button type="button" onClick={() => goTo(index - 1)}>
            Previous
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => setPlaying((current) => !current)}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => goTo(index + 1)}>
            Next
          </button>
        </div>

        <div className="clipList">
          {clips.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className={itemIndex === index ? "active" : ""}
              onClick={() => goTo(itemIndex)}
            >
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <em>{formatTime(item.durationSeconds)}</em>
            </button>
          ))}
        </div>

        <div className="operatorNote">
          <span>Operator note</span>
          <p>{clip.operatorNote}</p>
          {clip.audioPath ? <code>{clip.audioPath}</code> : null}
        </div>

        <div className="voiceGenerator">
          <span>ElevenLabs generator</span>
          <label>
            Voice ID
            <input
              value={voiceId}
              onChange={(event) => setVoiceId(event.target.value)}
              placeholder="Tanda voice ID"
            />
          </label>
          <label>
            Voice PIN
            <input
              value={voicePin}
              onChange={(event) => setVoicePin(event.target.value)}
              placeholder="VOICE_PIN"
              type="password"
            />
          </label>
          <button
            type="button"
            className="primary"
            disabled={generatingVoice}
            onClick={generateVoice}
          >
            {generatingVoice ? "Generating..." : `Generate ${kind} clips`}
          </button>
          <p>{voiceStatus}</p>
        </div>
      </aside>

      <style jsx>{`
        .captureRunner {
          --ink: #172033;
          --muted: #617087;
          --paper: #ffffff;
          --line: #dce5f0;
          --gold: #d7a84a;
          --violet: #6e5ae6;
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          background: #0f1422;
          color: var(--ink);
          font-family: var(--font-body), "Alegreya Sans", system-ui, sans-serif;
        }

        .stage {
          position: relative;
          min-height: 100vh;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(15, 20, 34, 0.4), rgba(15, 20, 34, 0.95)),
            #101728;
        }

        .browserShell,
        .assetStage,
        .proofPlaceholder,
        .hybridStage {
          width: min(92vw, 1320px);
          aspect-ratio: 16 / 9;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          overflow: hidden;
          background: #f7f9fc;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
        }

        .browserChrome {
          height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          background: #eef2f7;
          border-bottom: 1px solid #d9e1ec;
        }

        .browserChrome span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #c7d1de;
        }

        .browserChrome strong {
          margin-left: 8px;
          color: #445064;
          font-size: 12px;
          font-weight: 800;
        }

        iframe {
          width: 100%;
          height: calc(100% - 34px);
          border: 0;
          background: #ffffff;
        }

        .assetStage {
          display: grid;
          place-items: center;
        }

        .assetStage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .tandaOnly {
          background: #fff3de;
        }

        .tandaOnly img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hybridStage {
          position: relative;
          background: #101728;
        }

        .hybridBrowser {
          position: absolute;
          inset: 36px 190px 36px 36px;
        }

        .hybridBrowser .browserShell {
          width: 100%;
          height: 100%;
          aspect-ratio: auto;
        }

        .tandaGuide {
          position: absolute;
          right: 36px;
          bottom: 34px;
          width: 230px;
          aspect-ratio: 9 / 14;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          background: #fff4de;
        }

        .tandaGuide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .proofPlaceholder {
          display: grid;
          place-items: center;
          padding: 64px;
          background:
            linear-gradient(135deg, rgba(110, 90, 230, 0.22), rgba(57, 171, 194, 0.18)),
            #f8fbff;
          text-align: center;
        }

        .proofPlaceholder span {
          color: var(--violet);
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .proofPlaceholder strong {
          display: block;
          margin-top: 12px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 48px;
          line-height: 1;
        }

        .proofPlaceholder p {
          max-width: 560px;
          margin: 16px auto 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.4;
        }

        .tandaCaption {
          position: absolute;
          left: 48px;
          right: 378px;
          bottom: 42px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          background: rgba(15, 20, 34, 0.86);
          padding: 18px 20px;
          color: #ffffff;
          backdrop-filter: blur(12px);
        }

        .tandaCaption span {
          display: block;
          color: #f4d58c;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .tandaCaption p {
          margin: 8px 0 0;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 700;
        }

        .topBar {
          position: absolute;
          left: 48px;
          right: 378px;
          top: 30px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #ffffff;
        }

        .topBar span {
          display: block;
          color: #aeb8cc;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .topBar strong,
        .timecode {
          display: block;
          margin-top: 4px;
          font-size: 18px;
          font-weight: 850;
        }

        .progress {
          position: absolute;
          left: 48px;
          right: 378px;
          bottom: 22px;
          height: 7px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.18);
        }

        .progress div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #d7a84a, #e4839f, #6e5ae6);
        }

        .controlDeck {
          min-height: 100vh;
          border-left: 1px solid #dce5f0;
          background: #ffffff;
          padding: 18px;
          overflow-y: auto;
        }

        .modeSwitch,
        .transport {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .transport {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 12px;
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

        .clipList {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }

        .clipList button {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          text-align: left;
        }

        .clipList span {
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
        }

        .clipList strong {
          font-size: 14px;
          line-height: 1.2;
        }

        .clipList em {
          color: var(--muted);
          font-size: 12px;
          font-style: normal;
          font-weight: 800;
        }

        .operatorNote {
          margin-top: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fffaf0;
          padding: 14px;
        }

        .operatorNote span {
          display: block;
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .operatorNote p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.4;
        }

        .operatorNote code {
          display: block;
          margin-top: 10px;
          border: 1px solid #eadcae;
          border-radius: 6px;
          background: #ffffff;
          padding: 8px;
          color: #5c4a17;
          font-size: 12px;
          white-space: normal;
          overflow-wrap: anywhere;
        }

        .voiceGenerator {
          margin-top: 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #f7f9fc;
          padding: 14px;
        }

        .voiceGenerator span,
        .voiceGenerator label {
          display: block;
        }

        .voiceGenerator span {
          color: var(--violet);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .voiceGenerator label {
          margin-top: 10px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .voiceGenerator input {
          display: block;
          width: 100%;
          margin-top: 5px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 10px;
          color: var(--ink);
          font: inherit;
          font-size: 14px;
          text-transform: none;
        }

        .voiceGenerator button {
          width: 100%;
          margin-top: 12px;
        }

        .voiceGenerator button:disabled {
          cursor: progress;
          opacity: 0.68;
        }

        .voiceGenerator p {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.35;
        }

        @media (max-width: 1040px) {
          .captureRunner {
            grid-template-columns: 1fr;
          }

          .controlDeck {
            min-height: auto;
            border-left: 0;
            border-top: 1px solid var(--line);
          }

          .topBar,
          .tandaCaption,
          .progress {
            right: 48px;
          }
        }
      `}</style>
    </main>
  )
}
