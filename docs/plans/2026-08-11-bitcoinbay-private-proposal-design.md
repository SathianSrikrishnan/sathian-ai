# Bitcoin Bay private proposal route

Date: 2026-08-11

Status: approved direction; production cutover remains subject to the repository release guard.

## Outcome

Publish the approved Bitcoin Bay proposal at `https://sathian.ai/bitcoinbay` behind a lightweight shared-code gate. The experience is intended for Leo, Alwyn, and Antoine, sent individually by Sathian over WhatsApp. It is private collaboration material, not high-sensitivity data and not a public marketing page.

## Product choices

- Use one four-digit shared access code. Keep the code in Vercel's server-only environment, never in browser JavaScript or Git.
- A successful entry creates a signed, HttpOnly, Secure, SameSite cookie scoped to `/bitcoinbay` for seven days.
- Render no proposal copy until the server validates that cookie.
- Mark the route `noindex, nofollow`, force dynamic rendering, and omit it from navigation and the sitemap.
- Treat the gate as light privacy, not identity-grade authentication. A shared code can be forwarded and is not appropriate for secrets.

## Published-copy boundary

Remove internal creative notes and language that could feel like an ambush:

- No “leaky funnel,” “Bitcoin pastor,” “crypto polytheist,” placeholder-photo critique, or “internal only” commentary.
- Frame the event read as an opportunity: strong conviction, technical depth, a real venue, and a chance to give attendees one concrete next action.
- Keep the first pilot explicitly collaborative. Sathian owns packaging, registration flow, distribution, facilitation, feedback, and a $50–$100 food contribution. Bitcoin Bay owns technical curriculum, hardware support, instruction, and venue.

## Cohort and hardware additions

- Use Amazon's two-pizza idea as a size principle, not as startup theatre: six learners plus up to three hosts, fewer than ten people total, with one clear outcome.
- Suggested contribution remains $10, with a no-friction free/student route.
- One simple sponsor may cover food if useful; no sponsor deck or extra program layer.
- Working hardware floor, subject to Bitcoin Bay confirmation: recent Windows/macOS/Linux laptop, 8 GB RAM, reliable power/network, and a 1 TB SSD minimum for a full-chain build with 2 TB preferred. Space-limited learners can use a pruned path. Linux-capable Chromebook/mini-PC models must be tested before being promised as supported.

## Architecture

- `src/lib/bitcoinbay-access.ts`: pure constant-time comparison and signed-token helpers.
- `src/app/bitcoinbay/actions.ts`: server action validating the code, setting the scoped cookie, and redirecting.
- `src/app/bitcoinbay/page.tsx`: server component that renders either the gate or the proposal.
- `src/app/bitcoinbay/bitcoinbay.module.css`: route-local editorial design.
- `public/images/bitcoinbay/*`: approved logo and original signal-path hero.
- Unit tests cover code matching, token tampering/expiry, missing configuration, no-index metadata, and prohibited internal phrases.

## Error handling

- Missing server configuration: show a neutral “private page temporarily unavailable” state without leaking which value is missing.
- Invalid code: redirect back with one calm error message and do not set a cookie.
- Tampered or expired cookie: render the gate again.

## Release strategy

1. Build from a clean feature worktree based on verified `origin/main` because the canonical `main` worktree currently contains unrelated, unfinished site-agent changes.
2. Run focused unit tests, the full unit suite, build, diff check, local browser QA, and a preview deployment.
3. Reconcile the canonical release branch deliberately before production. Never deploy the dirty canonical tree or silently include the eight local site-agent commits.
