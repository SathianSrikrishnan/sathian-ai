# Dot the Snail personal-site release receipt

Prepared: 2026-08-15 08:18 EDT  
Scope: replace the latest Draw With Tanda feature from Nori the narwhal to Dot the snail without changing the approved site design.

## Public source

- YouTube title: `Draw Dot the Snail with Tanda | Easy Drawing for Kids`
- Video ID: `0ToPyZuATRQ`
- Public URL: `https://youtu.be/0ToPyZuATRQ`
- Channel: `Tooth-Fairy-Network`
- Audience: `Made for kids`
- YouTube checks: copyright clear; Community Guidelines clear
- Cover SHA-256: `62C00F9828BDEBE9850CB0D0F6E0C0788D4E005B7CE28EF6A2EBED28B1C56983`

## Site changes

- Added Dot as published Draw With Tanda episode 3.
- The shared `LATEST_RELEASE` registry now resolves to Dot, updating the homepage embed and public site-agent memory from one record.
- Preserved Finn and Nori in the release ledger without calling either the latest release.
- Added an explicit `activitySlug` to each episode; Dot links to `https://toothfairy.network/draw/snail`.
- Added the approved Tanda/Dot cover at `public/projects/tooth-fairy-network/dot-snail-cover.jpg`.
- Updated the latest-release evaluation fixtures from Nori to Dot.

## Verification

- Canonical worktree preflight: local `HEAD` matched `origin/main` at `6dd8208cc85fccba76e4bfb1139b702cb6b1569f`.
- Unit tests: `380/380` passed across `54` files.
- Production build: passed; 145 static pages generated.
- Offline site-agent evaluation: `60/60`, recommendation `PASS`, zero knowledge gaps.
- Desktop page: Dot visible as episode 3; correct YouTube ID and snail activity link.
- Mobile page: `scrollWidth = clientWidth = 382`; no horizontal overflow.
- Desktop proof: `draw-with-tanda-desktop.png`.
- Mobile proof: `draw-with-tanda-mobile.png`.
- `git diff --check`: passed.

## Production

- Release commit: pending
- Vercel deployment ID: pending
- Deployment URL: pending
- `https://sathian.ai` verification: pending
