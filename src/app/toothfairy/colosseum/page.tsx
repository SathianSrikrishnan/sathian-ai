"use client"

import { useMemo, useState } from "react"
import {
  COLOSSEUM_FPS,
  colosseumStoryboards,
  framesForSeconds,
} from "@/remotion/colosseum/storyboards"
import {
  voiceoverChunks,
  voiceoverTotals,
} from "@/remotion/colosseum/voiceover"
import type {
  ColosseumAssetSlot,
  ColosseumScene,
  ColosseumVideoKind,
} from "@/remotion/colosseum/types"

const sourceDocs = [
  "docs/colosseum-frontier-2026/storyboard-v1.md",
  "docs/colosseum-frontier-2026/execution-path-v1.md",
  "docs/colosseum-frontier-2026/frameboard-v1.md",
  "docs/colosseum-frontier-2026/voiceover-runbook.md",
  "src/remotion/colosseum/captureRunner.ts",
  "src/remotion/colosseum/storyboards.ts",
  "src/remotion/colosseum/voiceover.ts",
]

const statusLabel: Record<ColosseumScene["approval"], string> = {
  outline: "Outline",
  "needs-assets": "Needs assets",
  "draft-ready": "Draft ready",
  approved: "Approved",
}

const slotStatusLabel: Record<ColosseumAssetSlot["status"], string> = {
  needed: "Needed",
  queued: "Queued",
  captured: "Captured",
  approved: "Approved",
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

function buildSceneRows(kind: ColosseumVideoKind) {
  let cursor = 0
  return colosseumStoryboards[kind].scenes.map((scene, index) => {
    const start = cursor
    const end = cursor + scene.durationSeconds
    cursor = end
    return { scene, index, start, end }
  })
}

function assetUrl(slot: ColosseumAssetSlot) {
  if (!slot.path) return null
  return slot.path.startsWith("/") ? slot.path : `/${slot.path}`
}

function ScenePreview({ scene }: { scene: ColosseumScene }) {
  const previewSlot = scene.slots.find((slot) => slot.path)
  const src = previewSlot ? assetUrl(previewSlot) : null

  if (!src) {
    return (
      <div className="preview previewEmpty">
        <div>
          <span className="previewType">Capture slot</span>
          <strong>{scene.captureDirection}</strong>
        </div>
      </div>
    )
  }

  return (
    <div className="preview">
      <img src={src} alt={previewSlot?.label || scene.title} />
      <div className="previewCaption">
        <span>{previewSlot?.kind}</span>
        <strong>{previewSlot?.label}</strong>
      </div>
    </div>
  )
}

function Timeline({
  kind,
  selectedId,
  onSelect,
}: {
  kind: ColosseumVideoKind
  selectedId: string
  onSelect: (id: string) => void
}) {
  const rows = useMemo(() => buildSceneRows(kind), [kind])
  const total = rows[rows.length - 1]?.end || 1

  return (
    <div className="timeline" aria-label={`${kind} timeline`}>
      {rows.map(({ scene, index, start, end }) => (
        <button
          key={scene.id}
          type="button"
          className={`timelineItem ${scene.id === selectedId ? "active" : ""}`}
          style={{ width: `${(scene.durationSeconds / total) * 100}%` }}
          onClick={() => onSelect(scene.id)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{formatTime(start)}</strong>
          <em>{formatTime(end)}</em>
        </button>
      ))}
    </div>
  )
}

function SceneList({
  kind,
  selectedId,
  onSelect,
}: {
  kind: ColosseumVideoKind
  selectedId: string
  onSelect: (id: string) => void
}) {
  const rows = useMemo(() => buildSceneRows(kind), [kind])

  return (
    <div className="sceneList">
      {rows.map(({ scene, index, start, end }) => (
        <button
          key={scene.id}
          type="button"
          className={`sceneCard ${scene.id === selectedId ? "active" : ""}`}
          onClick={() => onSelect(scene.id)}
        >
          <span className={`status status-${scene.approval}`}>
            {statusLabel[scene.approval]}
          </span>
          <span className="sceneKicker">
            {String(index + 1).padStart(2, "0")} / {formatTime(start)}-
            {formatTime(end)}
          </span>
          <strong>{scene.title}</strong>
          <em>{scene.objective}</em>
        </button>
      ))}
    </div>
  )
}

function AssetTable({ slots }: { slots: ColosseumAssetSlot[] }) {
  return (
    <div className="assetTable">
      {slots.map((slot) => (
        <div key={slot.id} className="assetRow">
          <div>
            <strong>{slot.label}</strong>
            <span>{slot.kind}</span>
          </div>
          <span className={`slotStatus slot-${slot.status}`}>
            {slotStatusLabel[slot.status]}
          </span>
          <p>{slot.notes}</p>
          {slot.path ? <code>{slot.path}</code> : null}
        </div>
      ))}
    </div>
  )
}

function VoiceoverPanel({ kind }: { kind: ColosseumVideoKind }) {
  const chunks = voiceoverChunks[kind]

  return (
    <section className="voicePanel">
      <div className="panelHeader">
        <div>
          <span className="sectionLabel">Recording pack</span>
          <h3>{kind === "pitch" ? "Tanda pitch chunks" : "Technical narration chunks"}</h3>
        </div>
        <div className="miniMetric">
          <span>Target VO</span>
          <strong>{formatTime(voiceoverTotals(kind))}</strong>
        </div>
      </div>

      <div className="voiceGrid">
        {chunks.map((chunk, index) => (
          <article key={chunk.id} className="voiceCard">
            <div className="voiceTop">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{formatTime(chunk.targetSeconds)}</strong>
            </div>
            <h4>{chunk.filename}</h4>
            <p className="voiceDirection">{chunk.direction}</p>
            <p className="voiceText">{chunk.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function ColosseumProductionPage() {
  const [kind, setKind] = useState<ColosseumVideoKind>("pitch")
  const rows = useMemo(() => buildSceneRows(kind), [kind])
  const [selectedByKind, setSelectedByKind] = useState<
    Record<ColosseumVideoKind, string>
  >({
    pitch: colosseumStoryboards.pitch.scenes[0].id,
    technical: colosseumStoryboards.technical.scenes[0].id,
  })
  const selectedId = selectedByKind[kind]
  const selectedRow = rows.find((row) => row.scene.id === selectedId) || rows[0]
  const selected = selectedRow.scene
  const storyboard = colosseumStoryboards[kind]
  const totalSeconds = rows[rows.length - 1]?.end || 0
  const capturedSlots = storyboard.scenes.flatMap((scene) =>
    scene.slots.filter((slot) => slot.status === "captured" || slot.path),
  ).length
  const totalSlots = storyboard.scenes.reduce(
    (count, scene) => count + scene.slots.length,
    0,
  )

  const selectScene = (id: string) => {
    setSelectedByKind((current) => ({ ...current, [kind]: id }))
  }

  return (
    <main className="colosseumHub">
      <section className="controlBand">
        <div className="bandInner heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Colosseum production packet</p>
            <h1>{storyboard.title}</h1>
            <p className="lede">
              Tanda-led pitch and implementation-led technical walkthrough,
              organized scene by scene for fast review.
            </p>
            <div className="heroActions">
              <div className="segmented" aria-label="Video board">
                {(["pitch", "technical"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={kind === option ? "active" : ""}
                    onClick={() => setKind(option)}
                  >
                    {option === "pitch" ? "Pitch" : "Technical"}
                  </button>
                ))}
              </div>
              <a className="runnerLink theaterLink" href="/toothfairy/colosseum/theater">
                Watch rough cut
              </a>
              <a className="runnerLink" href="/toothfairy/colosseum/run">
                Open capture runner
              </a>
            </div>
          </div>

          <div className="metricGrid" aria-label="Board status">
            <div className="metric">
              <span>Runtime</span>
              <strong>{formatTime(totalSeconds)}</strong>
            </div>
            <div className="metric">
              <span>Scenes</span>
              <strong>{storyboard.scenes.length}</strong>
            </div>
            <div className="metric">
              <span>Assets</span>
              <strong>
                {capturedSlots}/{totalSlots}
              </strong>
            </div>
            <div className="metric moonpay">
              <span>MoonPay</span>
              <strong>KYB pending</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="boardBand">
        <div className="bandInner">
          <Timeline
            kind={kind}
            selectedId={selected.id}
            onSelect={selectScene}
          />

          <div className="workspace">
            <aside className="leftRail">
              <SceneList
                kind={kind}
                selectedId={selected.id}
                onSelect={selectScene}
              />
            </aside>

            <section className="sceneDetail">
              <div className="sceneHeader">
                <div>
                  <span className="sceneKicker">
                    {formatTime(selectedRow.start)}-{formatTime(selectedRow.end)} /{" "}
                    {selected.speaker}
                  </span>
                  <h2>{selected.title}</h2>
                </div>
                <span className={`status status-${selected.approval}`}>
                  {statusLabel[selected.approval]}
                </span>
              </div>

              <ScenePreview scene={selected} />

              <div className="copyGrid">
                <article>
                  <span className="sectionLabel">Narration</span>
                  <p className="quote">{selected.narration}</p>
                </article>
                <article>
                  <span className="sectionLabel">Visual plan</span>
                  <p>{selected.visualPlan}</p>
                </article>
                <article>
                  <span className="sectionLabel">Capture direction</span>
                  <p>{selected.captureDirection}</p>
                </article>
                <article>
                  <span className="sectionLabel">Production notes</span>
                  <ul>
                    {selected.productionNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <AssetTable slots={selected.slots} />

              <VoiceoverPanel kind={kind} />
            </section>

            <aside className="rightRail">
              <section className="railBlock">
                <span className="sectionLabel">Current edit spine</span>
                <ol>
                  {kind === "pitch" ? (
                    <>
                      <li>Tanda establishes the ritual.</li>
                      <li>Distributed family wedge.</li>
                      <li>Product proof before technical proof.</li>
                      <li>Solana keeps value and memory alive.</li>
                      <li>Sticky Solana accounts closer.</li>
                    </>
                  ) : (
                    <>
                      <li>Stack and user flow.</li>
                      <li>Anchor account model.</li>
                      <li>cNFT and storage proof.</li>
                      <li>Actions, Blinks, KYB-pending on-ramp.</li>
                      <li>Why Solana closer.</li>
                    </>
                  )}
                </ol>
              </section>

              <section className="railBlock">
                <span className="sectionLabel">Editable sources</span>
                <div className="sourceList">
                  {sourceDocs.map((doc) => (
                    <code key={doc}>{doc}</code>
                  ))}
                </div>
              </section>

              <section className="railBlock">
                <span className="sectionLabel">Next unlock</span>
                <p>
                  Record or generate the voice chunks, then capture the core app
                  flow, gift link, Phantom/cNFT proof, and explorer proof.
                  MoonPay remains labeled KYB-pending until approval and test
                  footage exist.
                </p>
              </section>

              <section className="railBlock">
                <span className="sectionLabel">Audio folders</span>
                <div className="sourceList">
                  <code>public/colosseum-frontier-2026/audio/raw/</code>
                  <code>public/colosseum-frontier-2026/audio/processed/</code>
                  <code>public/colosseum-frontier-2026/audio/elevenlabs/</code>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>

      <style jsx>{`
        .colosseumHub {
          --ink: #172033;
          --muted: #5c687c;
          --line: #dbe3ee;
          --paper: #ffffff;
          --wash: #f6f8fb;
          --gold: #d7a84a;
          --rose: #d96b88;
          --cyan: #39abc2;
          --violet: #6e5ae6;
          --green: #2ea66d;
          min-height: 100vh;
          background: var(--wash);
          color: var(--ink);
          font-family: var(--font-body), "Alegreya Sans", system-ui, sans-serif;
        }

        .bandInner {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
        }

        .controlBand {
          border-bottom: 1px solid var(--line);
          background: #fffaf0;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
          gap: 32px;
          padding: 42px 0 34px;
          align-items: end;
        }

        .eyebrow,
        .sectionLabel,
        .sceneKicker {
          display: block;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        p {
          margin: 0;
        }

        h1 {
          margin-top: 8px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 52px;
          line-height: 1;
          font-weight: 700;
        }

        h2 {
          margin-top: 8px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 36px;
          line-height: 1.05;
          font-weight: 700;
        }

        .lede {
          max-width: 650px;
          margin-top: 14px;
          color: var(--muted);
          font-size: 19px;
          line-height: 1.45;
        }

        .segmented {
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 8px;
          overflow: hidden;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }

        .runnerLink {
          display: inline-flex;
          align-items: center;
          min-height: 43px;
          border: 1px solid var(--ink);
          border-radius: 8px;
          background: var(--ink);
          color: #ffffff;
          padding: 0 16px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 850;
        }

        .theaterLink {
          border-color: #d7a84a;
          background: #d7a84a;
          color: var(--ink);
        }

        .segmented button {
          min-width: 126px;
          border: 0;
          border-right: 1px solid var(--line);
          padding: 11px 18px;
          background: transparent;
          color: var(--ink);
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .segmented button:last-child {
          border-right: 0;
        }

        .segmented button.active {
          background: var(--ink);
          color: #ffffff;
        }

        .metricGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .metric {
          min-height: 90px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 18px;
        }

        .metric span {
          display: block;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .metric strong {
          display: block;
          margin-top: 9px;
          font-size: 28px;
          line-height: 1;
        }

        .metric.moonpay {
          border-color: #efd48e;
          background: #fff8e6;
        }

        .boardBand {
          padding: 24px 0 56px;
        }

        .timeline {
          display: flex;
          min-height: 68px;
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
          background: var(--paper);
        }

        .timelineItem {
          min-width: 88px;
          border: 0;
          border-right: 1px solid var(--line);
          padding: 10px 9px;
          background: transparent;
          color: var(--ink);
          text-align: left;
          cursor: pointer;
        }

        .timelineItem:last-child {
          border-right: 0;
        }

        .timelineItem.active {
          background: #e9ecff;
        }

        .timelineItem span,
        .timelineItem em,
        .timelineItem strong {
          display: block;
          font-style: normal;
        }

        .timelineItem span {
          color: var(--violet);
          font-size: 12px;
          font-weight: 900;
        }

        .timelineItem strong {
          margin-top: 8px;
          font-size: 17px;
        }

        .timelineItem em {
          margin-top: 2px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
        }

        .workspace {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 290px;
          gap: 18px;
          margin-top: 18px;
          align-items: start;
        }

        .sceneList {
          display: grid;
          gap: 10px;
        }

        .sceneCard {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 14px;
          text-align: left;
          color: var(--ink);
          cursor: pointer;
        }

        .sceneCard.active {
          border-color: var(--violet);
          box-shadow: inset 4px 0 0 var(--violet);
        }

        .sceneCard strong {
          display: block;
          margin-top: 8px;
          font-size: 17px;
          line-height: 1.2;
        }

        .sceneCard em {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: 13px;
          font-style: normal;
          line-height: 1.35;
        }

        .sceneDetail,
        .railBlock {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
        }

        .sceneDetail {
          padding: 22px;
        }

        .sceneHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
        }

        .status,
        .slotStatus {
          display: inline-flex;
          align-items: center;
          width: max-content;
          min-height: 26px;
          border-radius: 6px;
          padding: 5px 8px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .status-outline,
        .slot-needed {
          background: var(--violet);
        }

        .status-needs-assets,
        .slot-queued {
          background: var(--rose);
        }

        .status-draft-ready,
        .slot-captured {
          background: var(--cyan);
        }

        .status-approved,
        .slot-approved {
          background: var(--green);
        }

        .preview {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          margin-top: 20px;
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
          background: #101728;
        }

        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .previewEmpty {
          display: grid;
          place-items: center;
          padding: 28px;
          color: #ffffff;
        }

        .previewEmpty strong {
          display: block;
          max-width: 560px;
          margin-top: 10px;
          font-size: 26px;
          line-height: 1.1;
        }

        .previewType {
          color: #aeb8cc;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .previewCaption {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.92);
          padding: 10px 12px;
          color: var(--ink);
        }

        .previewCaption span {
          color: var(--muted);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .previewCaption strong {
          font-size: 14px;
        }

        .copyGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .copyGrid article {
          border-top: 1px solid var(--line);
          padding-top: 14px;
        }

        .copyGrid p,
        .copyGrid li,
        .railBlock p,
        .railBlock li {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.45;
        }

        .quote {
          color: var(--ink) !important;
          font-size: 19px !important;
          font-weight: 700;
          line-height: 1.35 !important;
        }

        ul,
        ol {
          margin: 10px 0 0;
          padding-left: 20px;
        }

        .assetTable {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .voicePanel {
          margin-top: 22px;
          border-top: 1px solid var(--line);
          padding-top: 20px;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
        }

        h3,
        h4 {
          margin: 0;
        }

        h3 {
          margin-top: 6px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 28px;
          line-height: 1.1;
        }

        .miniMetric {
          min-width: 110px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 10px 12px;
          text-align: right;
          background: #f7f9fc;
        }

        .miniMetric span {
          display: block;
          color: var(--muted);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .miniMetric strong {
          display: block;
          margin-top: 5px;
          font-size: 20px;
        }

        .voiceGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .voiceCard {
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 14px;
          background: #fffdf7;
        }

        .voiceTop {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
        }

        .voiceCard h4 {
          margin-top: 8px;
          font-size: 15px;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }

        .voiceDirection {
          margin-top: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.35;
        }

        .voiceText {
          margin-top: 10px;
          color: var(--ink);
          font-size: 15px;
          line-height: 1.42;
        }

        .assetRow {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 13px;
        }

        .assetRow strong,
        .assetRow span,
        .assetRow p,
        .assetRow code {
          display: block;
        }

        .assetRow strong {
          font-size: 15px;
        }

        .assetRow div span {
          margin-top: 4px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .assetRow p,
        .assetRow code {
          grid-column: 1 / -1;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.35;
        }

        .assetRow code,
        .sourceList code {
          border: 1px solid #e5eaf2;
          border-radius: 6px;
          background: #f7f9fc;
          padding: 7px;
          color: #394456;
          white-space: normal;
          overflow-wrap: anywhere;
        }

        .rightRail {
          display: grid;
          gap: 12px;
        }

        .railBlock {
          padding: 16px;
        }

        .sourceList {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }

        @media (max-width: 1100px) {
          .heroGrid,
          .workspace {
            grid-template-columns: 1fr;
          }

          .leftRail {
            order: 2;
          }

          .sceneDetail {
            order: 1;
          }

          .rightRail {
            order: 3;
          }
        }

        @media (max-width: 680px) {
          .bandInner {
            width: min(100% - 24px, 1240px);
          }

          .heroGrid {
            padding: 28px 0;
          }

          h1 {
            font-size: 36px;
          }

          h2 {
            font-size: 28px;
          }

          .metricGrid,
          .copyGrid,
          .voiceGrid {
            grid-template-columns: 1fr;
          }

          .timeline {
            overflow-x: auto;
          }

          .timelineItem {
            min-width: 110px;
          }

          .sceneHeader,
          .previewCaption {
            display: grid;
          }
        }
      `}</style>
    </main>
  )
}
