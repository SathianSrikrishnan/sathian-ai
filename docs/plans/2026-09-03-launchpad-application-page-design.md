# Launchpad application page — design note

Date: 2026-09-03
Surface: `https://sathian.ai/launchpad`

## Contract

- **Audience:** Stan Launchpad reviewers, arriving from one application-form link.
- **Primary job:** watch Sathian's founder video and understand the current Tooth Fairy Network test without reading a pitch deck.
- **Primary action:** press play.
- **Visual direction:** the existing sathian.ai paper-and-ink editorial system, with one dark video frame and restrained rust accents.
- **Boundary:** no homepage/nav/sitemap listing; page-level `noindex, nofollow`; no password gate or reviewer friction.

## Approaches considered

1. **Video-first cover letter — selected.** The unedited vertical video is the dominant object. A short founder line and three compact sections clarify the product, market signal, and Launchpad objective.
2. **Direct MP4 link.** Fastest and most literal, but it cannot reconcile the video's “digital wallet” shorthand with the parent-led phone/physical/digital product now being tested.
3. **Mini pitch deck.** Could carry TAM and competitive context, but would contradict the raw application and turn a three-minute review into homework.

## Page anatomy

1. Quiet `sathian.ai` wordmark and `Stan Launchpad / September 2026` label.
2. `Tooth Fairy Network` title and one-sentence founder origin.
3. Native video player using the hash-preserved 2:27 take, poster image, and optional caption track.
4. Three editorial blocks:
   - the current test: toll-free call → private memory → optional physical keepsake and guardian-owned wallet;
   - the market shorthand: 20 primary teeth, families worldwide, parent-led by design;
   - the two-week objective: parent conversations, a clear offer, and paying-family evidence.
5. One unobtrusive link to Tooth Fairy Network.

## Copy policy

- Keep visible prose below roughly 170 words outside the video.
- Use `20 primary teeth` as the only numeric market shorthand.
- Do not publish the unsupported `150 traditions` figure.
- Do not name Binance or Coinbase; crypto infrastructure stays behind the family experience.
- Describe the physical keepsake and phone flow as the current test, not proven demand or a fully deployed service.

## Responsive and accessibility behavior

- Wide: centered editorial column with a portrait player sized for the source aspect ratio.
- Narrow: full-width player with no horizontal overflow and 44px minimum interactive targets.
- Native controls, `playsInline`, captions track, visible focus, readable contrast, and reduced-motion-safe CSS.
- The site agent is hidden on this one route so the reviewer has one task.

## Proof required

- Targeted contract test fails before implementation and passes afterward.
- Source video and published asset SHA-256 match.
- Local production build passes.
- `/launchpad` inspected at desktop and mobile; video loads, controls work, poster appears, captions are discoverable, no overflow or console error occurs.
- Full `npm run release:verify` passes before any production release.
