# Tech Talk with Sath

Date: November 8, 2026. Owner requested corrected banner and website implementation, current X links, a central sharing spot, and preservation of speed/indexing behavior.

## Source and scope

Isolated branch `codex/tech-talk-sath-20261108` from `3f19cf8a2389289907e546f6e7d2cb655a123e0e`, verified against origin/main and live production deployment `dpl_Ckf3BmLFQ5ENwURMtWvHXGf38piv`. The designated canonical worktree is behind and materially dirty; its work was preserved without reset, overlay or cleanup.

- New static shared calendar section on Home and About. About includes personal social profiles.
- Existing `/links` retained as the central share page, with dedicated social metadata. New Follow navigation and footer link make it discoverable.
- Shared X destination is `https://x.com/Sathian`; calendar links are `https://lu.ma/sath`.
- Person sameAs continues to identify the Luma profile, while reflecting the new X account.
- QR placement: TECH left, TALK top, WITH right, SATH bottom. Both the QR and button are clickable.
- Existing homepage/About H1s, titles, canonicals, hero assets, robots, sitemap, caching, redirects and security configuration preserved. No new route, runtime dependency, remote embed or client JavaScript added.

## Verification

`npm run release:verify` PASS: 552 unit tests, 60/60 offline agent cases, critical dependency threshold (zero critical; existing 58 low/moderate/high findings remain), production build, public surfaces at 1440/1024/1920/390, canonical tags, visible H1s, security headers, overflow, existing playback and mobile audio checks, and diff hygiene.

New browser assertions verify current calendar destinations, lazy loaded QR, current X links and `/links` social image. Rendered desktop and mobile QR screenshots independently decode to `https://lu.ma/sath`.

QR SVG: 14,490 bytes, 1,204 bytes gzip. Share PNG: 54,590 bytes, 1200×628. Build critical CSS check: Home 12,654 bytes gzip, Village 12,711, two blocking stylesheets each; existing budgets pass. Generated stylesheet dependency manifest updated; actual generated CSS unchanged.

Local dependencies reused from cache-oct29 (Next 15.5.28). Build output is on D: because C: was nearly full; node module resolution was linked for that output. No project configuration change for this local arrangement.

Evidence and corrected phone/print kit: `C:/Users/sathi/Projects/_ops/artifacts/tech-talk-with-sath/`. `release-verify.log` and `site-checks/` hold local verification. No actual print order, message, account deletion or calendar change performed.

## Release

Local verification complete. Hosted workflow and publication receipt pending; see the durable operating receipt for final status.

Luma personal calendar cannot be deleted separately: https://help.luma.com/p/managing-events-with-calendars . Keep it as the account default and share the team calendar URL.
