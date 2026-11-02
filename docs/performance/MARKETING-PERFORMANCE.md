# Marketing performance and release contract

Keep the approved images, videos and useful content. Do not replace the offer with placeholders, hide content from the audit, disable analytics/consent protections, or alter financial flows to obtain a score.

## Deterministic build gates

`npm run marketing:verify` checks every original approved asset hash/path, the new delivery versions and critical-image byte budgets. Originals are immutable: a changed image needs a new versioned path and an intentional manifest update. Existing raw hero hashes and image packaging remain checked by the public browser gate. New publication records additionally require owner review; drafts do not enter public routes/sitemaps.

Sathian's protected-preview workflow checks the initial-viewport primary CTA at 1440, 390 and 320 pixels, raw poster/backdrop/printed-example responses, no chat bundle before intent, no film fetch before play, canonical preservation and chat open/close. The regular public/Village checks retain missing-image, keyboard, form-mock and media checks. This protects the experience rather than a brittle exact score.

Network's `node tests/marketing-gallery-check.cjs` checks stable first paint (no timer rotation), one initial hero image, manual/keyboard access to all preserved frames and the direct gift CTA. The legacy parent-start route and actual checkout implementation remain unchanged. Money retains its offer, images and form handoff.

## Comparable measurements

Use the existing Lighthouse 13.5.0 CLI and isolated headless Chrome. `scripts/measure-marketing.mjs` never downloads tools or opens the user's browser profile. Set `LIGHTHOUSE_CLI` and `CHROME_PATH`, then pass each intended public URL with `--url`, `--runs 3` and a new `--out` directory. Optional `--desktop` selects the desktop preset. Runs are sequential; do not run builds or other browser tests at the same time.

Keep all raw reports, warnings and run ranges. Report the median (target 95+ mobile), LCP/TBT/CLS, HTTP status and final URL. A challenge/error/redirect-to-another-page is not a valid measurement. Mark load-cutoff warnings and >=10-point ranges as provisional/noisy, and record shared-workstation conditions. Do not silently discard a low run or rerun only until a high score appears. Windows temporary-profile cleanup errors must be distinguished from an audit runtime error; preserve the log rather than bypassing permissions.

The score is a diagnostic, not the only CI gate and not a promise of Google ranking or conversion. Validate desktop/mobile pixels and genuine CTA/form behavior separately. Keep the most recent verified production deployment until required checks pass. Verify public assets and sources after deployment, not only READY status. No real orders or payments during synthetic verification.
