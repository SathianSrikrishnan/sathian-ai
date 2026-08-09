# Quote Coverage Ledger Hackathons release

Date: 2026-08-09

## Scope

- Feature Quote Coverage Ledger as the active Hackathons project.
- Move AgentTab into the earlier-submissions record without removing its proof links.
- Link the featured card to the sanitized public Quote Coverage Ledger dashboard.
- Preserve the approved dark editorial site system and the remaining project order.

## Public claims

- 15 insurer families / 16 shopping routes mapped.
- 44 profile fields inventoried / 43 currently available.
- 16 public routes tested / zero live premiums returned.
- Zero personal records exposed by the public dashboard.

## Privacy boundary

The public dashboard contains no licence number, VIN, policy number, full address, phone, email, private file path, raw insurance document, account session, or private questionnaire values. Local browser control and the private runner are not deployed.

## Verification

- Canonical website worktree was on `main` and matched `origin/main` before editing.
- TDD: the Hackathons portfolio test failed before implementation and passed afterward.
- Site unit tests: 40 files / 255 tests passed.
- Next.js production build passed.
- Launch-readiness check passed.
- Desktop and mobile release screenshots inspected.
- Sanitized dashboard: 24 files / 70 tests passed; lint, typecheck, build and production audit passed.
- Public dashboard output privacy scan returned zero selected sensitive matches.

## Dashboard deployment

- Production alias: https://ontario-all-quote-agent.vercel.app
- Deployment: `dpl_AbUVCmTG2T5NFV3paG8adSDUYcPK`
- Verified HTTP 200 with truthful `16 routes / 0 premiums` copy and no synthetic-price ledger.

## Website deployment

- Production page: https://sathian.ai/hackathons
- Source commit: `ccc6c60883042602d0b8c5ac398be0be695402e3`
- Deployment: `dpl_9meAWkfXhxMZhwmKXqpBXRCbe9u8`
- Production verification: HTTP 200; Quote Coverage Ledger appears before AgentTab; the featured button links to the dashboard production alias.
- Joint website/dashboard production privacy scan returned zero selected sensitive matches.

## Evidence

- `docs/releases/2026-08-09-quote-ledger-hackathons-desktop.png`
- `docs/releases/2026-08-09-quote-ledger-hackathons-mobile.png`
