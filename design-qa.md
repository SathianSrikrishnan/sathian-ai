# Design QA — release channel and project pass

## Source truth

- Approved direction: `C:\Users\sathi\.codex\generated_images\019feb23-c010-7df1-941d-745d8be7e642\exec-e10b1b3a-1124-4fda-9b3f-76408a7754bd.png`
- Canonical Tooth Fairy Network source: `C:\Users\sathi\Projects\tooth-fairy-network`
- Approved Draw with Tanda source: `C:\Users\sathi\Projects\character-studio\productions\tfn-short-content-factory-v1\activities`
- Implementation evidence: `C:\Users\sathi\.codex\visualizations\2026\08\10\019feb23-c010-7df1-941d-745d8be7e642\release-channel-pass`
- Verified preview: `https://sathian-bsl0ns8ug-sathiansrikrishnans-projects.vercel.app`

## Test conditions

- Desktop browser viewport: 1264 × 710 CSS pixels.
- Mobile browser viewport: 390 × 844 CSS pixels.
- States checked: homepage arrival, embedded Nori latest release, Draw with Tanda channel with embedded Finn and Nori episodes, ClinicalGuard story page, writing, hackathons, and mobile layouts.
- Route checks: `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, and `/hackathons` all returned HTTP 200 on the deployed preview.
- Responsive DOM checks found no horizontal document overflow at 390 px.

## Full-view comparison

- `01-home-desktop.png` preserves the approved warm editorial direction while replacing the mockup's generic lead with the approved site headline and the existing live chatbot format.
- `02-draw-with-tanda-desktop.png` applies the same typography, rules, paper color, and dark navigation to the new TFN channel page.
- `03-clinicalguard-desktop.png` gives the project its own evidence-led page instead of leaving it as a text-only archive row.
- `05-home-mobile.png`, `06-draw-mobile.png`, and `07-clinicalguard-mobile.png` confirm the three primary surfaces remain legible without horizontal overflow.

## Focused evidence

- `04-draw-video-viewport.png` confirms the privacy-enhanced YouTube embed loads the real Finn thumbnail at the intended 16:9 ratio.
- `08-deployed-agent-answer.png` confirms the hosted chatbot renders the deterministic latest-release answer, canonical source, and next action.
- `09-deployed-latest-release-destination.png` confirms that action stays on the active preview and lands on the Finn episode anchor.

## Findings and fixes

1. **P1 — local preview loaded HTML but missed JavaScript chunks.** The development cache contained an incomplete webpack chunk set. The cache was isolated, regenerated, and the browser then rendered the full chatbot instead of a blank block.
2. **P1 — preview chatbot action escaped to production.** Canonical sources remain absolute for attribution, while same-site next actions now use safe relative paths. The deployed action was clicked and remained on the preview host.
3. **P2 — local preview port was blocked by the origin allowlist.** Non-production loopback URLs are now accepted on any explicit port; production origins remain restricted.
4. **P2 — ClinicalGuard's mobile title clipped at 390 px.** The mobile type scale was tightened and the final right edge measured inside the viewport.
5. **P2 — the Draw with Tanda release heading crowded its status copy on mobile.** The heading group now stacks below 760 px.

## Content integrity

- Finn remains public with YouTube ID `ZoY1ZEzJymY`.
- Nori was verified public on the official Tooth Fairy Network channel and uses YouTube ID `D0I_6me_WcU` on both the homepage and channel page.
- The TFN glow mark, approved Nori artwork, and official LinkedIn, Facebook, Instagram, X, and YouTube links are preserved from one shared source.
- ClinicalGuard copy preserves the human-review boundary and describes the source-backed five-stage evidence pipeline.

## Verification

- Unit tests: 41 files, 278 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Production build: `npm run build` exited 0 and generated both new routes.
- Hosted API: the latest-release request returned route `answer`, the Finn source, and a relative next action.
- Hosted browser: the action landed at `/projects/tooth-fairy-network/draw-with-tanda#finn-the-shark` on the same preview deployment.

## Remaining findings

- No P0, P1, or P2 visual or release-workflow defects remain in the reviewed surfaces.
- Existing repository build warnings remain: stale Browserslist data, pure-JS bigint fallback, peer-dependency notices, and a non-fatal Next.js revalidation trace during static generation.

final result: passed
