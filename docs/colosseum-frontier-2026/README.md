# Colosseum Frontier 2026 Presentation Workspace

Created: 2026-05-06
Project: Tooth Fairy Network
Hackathon: Solana Frontier Hackathon by Colosseum
Submission deadline: Monday, May 11, 2026 at 11:59pm PT. In Toronto, that is Tuesday, May 12 at 2:59am ET. Internal cutoff should be Monday, May 11 by 7:00pm ET.

## Working Goal

Prepare the two Colosseum submission videos without letting the production swallow the product:

1. Pitch video, max 3 minutes. Tanda delivers this as CEO of the Network, with Sathian framed as the founder-builder and dad behind the product.
2. Technical walkthrough, target 2 to 3 minutes. This must explain how it works, not re-pitch the brand.

## Core Strategy

The pitch should feel like a magical founder pitch, not a cartoon ad. Tanda can be the front-of-house CEO, but the video still needs to satisfy Colosseum's startup criteria: team background, problem, who the product is for, validation, Solana-specific advantage, vision, and viable business model.

The technical video should be calmer and more direct. Recommendation: use Sathian or a neutral narration voice for the main technical walkthrough, with Tanda only as a short bumper or small overlay. Judges need confidence that a real builder understands the architecture.

The character lock is now Tanda: the young, polished brunette Tanda from the existing app renders and pose packs. Do not use the older watercolor/silver-haired story-bible Tanda for this presentation unless Sathian explicitly asks for that alternate mythology style.

## Workspace Map

- `requirements-research.md` - current Colosseum requirements and judging notes.
- `production-plan.md` - five-day board from May 6 to May 11.
- `storyboard-v1.md` - full production storyboard for the pitch and technical videos.
- `execution-path-v1.md` - lane-based execution path, blockers, and Sathian unlock steps.
- `business-positioning.md` - market, distribution, and Solana ecosystem value.
- `tanda-character-bible.md` - living creative canon for Tanda Faye, her father, and the Network.
- `business-model-gap-scan.md` - missing/underused pitch and business model angles.
- `next-approval-packet.md` - next production steps and what needs Sathian approval.
- `execution-control-plan.md` - steps, approvals, roadblocks, permissions, and timeline.
- `operating-model.md` - autonomy and approval rules for moving quickly.
- `storyboard-architecture.md` - how the storyboard/backend system works.
- `frameboard-v1.md` - time-coded scene board for quick approvals.
- `approval-board.md` - human scene-by-scene approval status.
- `capture-manifest.md` - concrete screen, proof, avatar, and diagram capture list.
- `moonpay-live-proof-runbook.md` - MoonPay KYB-pending/on-ramp notes and later proof steps.
- `voiceover-runbook.md` - exact voice recording and ElevenLabs workflow.
- `deployment-runbook.md` - Vercel preview deployment steps and production guardrails.
- `prompt-queue.md` - image/video prompt queue for assets that can run in parallel.
- `pitch-video-outline.md` - pitch story spine, shot list, and timing.
- `product-demo-runbook.md` - practical capture sequence for the product walkthrough.
- `technical-walkthrough-outline.md` - technical video structure and proof checklist.
- `tanda-visual-lock.md` - canonical Tanda look and reference assets.
- `tanda-avatar-production.md` - talking-avatar plan, prompts, and performance notes.
- `asset-inventory.md` - usable local visuals, renders, pages, and proof assets.
- `render-log.md` - render status and handoff notes.
- `scripts/pitch-script-v0.md` - first line-level draft for the 3-minute pitch.
- `scripts/technical-script-v0.md` - first line-level draft for the technical walkthrough.
- `scripts/pitch-script-v1.md` - current pitch script aligned to Storyboard V1.
- `scripts/technical-script-v1.md` - current technical script aligned to Storyboard V1.
- `scripts/founder-soundbites.md` - small recording asks for Sathian.

## New Production Infrastructure

The repo now has Remotion storyboard compositions:

- `Colosseum-Pitch-Storyboard`
- `Colosseum-Technical-Storyboard`

The scene data lives in `src/remotion/colosseum/storyboards.ts`. Media assets for the final edit should be placed under `public/colosseum-frontier-2026/`.

The running app also has a production review hub:

- `/toothfairy/colosseum` - scene board, asset status, narration, visual plan, and editable source pointers.
- `/toothfairy/colosseum/theater` - watchable rough-cut theater that plays Tanda/audio/product frames as a loose video shell.
- `/toothfairy/colosseum/run` - autonomous capture runner that plays the pitch or technical walkthrough through a browser-frame timeline.
- `/api/toothfairy/colosseum/voiceover` - local ElevenLabs chunk generator for the runner, gated by `VOICE_PIN`.

Current packet assets:

- `public/colosseum-frontier-2026/avatar/candidates/tanda-faye-ceo-still-v2.png` - current Tanda Faye still candidate.
- `public/colosseum-frontier-2026/diagrams/diagram-family-network-v1.png` - distributed family graph preview/render asset. SVG master is beside it.
- `public/colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png` - Solana stack diagram preview/render asset. SVG master is beside it.
- `public/colosseum-frontier-2026/diagrams/diagram-pda-model-v1.png` - Anchor/PDA model diagram preview/render asset. SVG master is beside it.
- `public/colosseum-frontier-2026/diagrams/diagram-why-solana-v1.png` - Why Solana decision overlay preview/render asset. SVG master is beside it.

## Open Questions

- Confirm the exact logged-in Colosseum submission form fields in `arena.colosseum.org`; public pages and rules do not expose every form field.
- Decide whether the pitch avatar is a full talking head or a hybrid Tanda narrator with app screen share. The hybrid route is faster and safer.
- Confirm whether MoonPay KYB approval lands in time. If it does and the flow tests cleanly, include a short on-ramp proof shot. If not, use Phantom plus Blinks as the live flow and mention MoonPay as KYB-pending only.
