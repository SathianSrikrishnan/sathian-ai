# Product Demo Recording Runbook

Purpose: make recording simple. Sathian should only need to do a few clean passes while the final edit handles pacing.

## Capture Format

- Record desktop in 16:9.
- Keep browser zoom at 100% unless a page needs 90% to show context.
- Use a clean browser profile if possible.
- Record one full pass silently; narration can be added later.
- Do not depend on a live wallet transaction during the final recording unless it has been tested immediately before.

## Product Demo Arc

## Known Route Map

- `/toothfairy` - public landing page and first pitch proof.
- `/toothfairy/app` - parent-facing ritual flow; use this for the core product recording.
- `/toothfairy/app/draw` - drawing canvas path.
- `/toothfairy/app/draw/preview` - keepsake preview path after a drawing is stored locally.
- `/toothfairy/app/gift/[milestone]` - family gift page; needs a real or staged milestone id.
- `/toothfairy/keepsake/[id]` - keepsake proof page after mint.
- `/toothfairy/admin/escrow-viewer` - internal proof page; use only if safe to show.
- `/toothfairy/architecture` - public architecture explainer, useful for technical b-roll.
- `/api/toothfairy/onramp` - MoonPay/on-ramp route; mention as KYB-pending unless approval and a clean test land.

### Shot 1 - Start With The Ritual

Capture:
- `toothfairy.network` or local `/toothfairy`.
- Hero/Tanda moment.
- One clean scroll or click into the app.

Point:
- "The product starts with a family ritual, not a wallet prompt."

### Shot 2 - Create The Keepsake

Capture:
- Start keepsake flow.
- Photo/drawing choice.
- Keepsake preview.

Point:
- "The emotional buy-in happens first."

### Shot 3 - Make It Permanent

Capture:
- Wallet connection or logged-in state.
- Mint/keepsake confirmation if available.
- Keepsake page.

Point:
- "The keepsake becomes a permanent digital memory."

### Shot 4 - Family Gift Link

Capture:
- Share/gift page.
- Family member view.
- Deposit CTA.

Point:
- "A parent can invite grandparents, co-parents, relatives, and friends to show up from anywhere."

### Shot 5 - Solana Action / Blink

Capture:
- Blink or Solana Action response.
- Deposit transaction path.

Point:
- "The ritual becomes a portable Solana action."

### Shot 6 - Wallet / Explorer Proof

Capture:
- cNFT in Phantom or explorer.
- Program address.
- Transaction proof.

Point:
- "This is not a mockup. It is live Solana infrastructure."

### Shot 7 - Optional On-Ramp

Only include as live proof if MoonPay KYB approval and a clean test are stable. Otherwise use a labeled KYB-pending overlay.

Capture:
- On-ramp entry.
- Amount selection.
- Return path into the TFN flow.

Point:
- "Non-crypto parents can still enter the network."

### Shot 8 - Optional Solana Mobile

Only include if the mobile/Solana Mobile Store path is ready enough to show accurately.

Capture:
- Mobile web app or store packaging proof.
- Phantom mobile deep link.

Point:
- "TFN is a warm consumer use case for Solana Mobile."

## Recording Checklist

- Use one child/test profile name consistently.
- Use a test amount that is small and visually legible.
- Hide private keys, API keys, and admin-only secrets.
- Keep tabs limited to app, wallet/explorer, and maybe repo/proof.
- Do not record failed transactions for the final take; keep those only as debugging artifacts.
