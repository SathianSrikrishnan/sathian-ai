# Colosseum Preview Deployment Runbook

Purpose: get the Colosseum production shell onto a Vercel preview URL so it can be reviewed, recorded, and iterated without promoting the live production site.

## Current Deployable Routes

- `/toothfairy/colosseum` - storyboard hub and approval board.
- `/toothfairy/colosseum/theater` - watchable rough-cut shell with Tanda, scratch voice, captions, browser frames, and scene controls.
- `/toothfairy/colosseum/run` - capture runner for scene-by-scene browser walkthroughs.

## Verified Locally

- TypeScript check passed with `tsc --noEmit`.
- Production build passed with `next build`.
- Browser Use can open and click the theater route while the local dev server is running.

## Preview Deploy

Run this from a normal PowerShell terminal, not the Codex sandbox:

```powershell
cd "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai"
npx vercel@latest deploy --yes
```

If Vercel asks for login:

```powershell
npx vercel@latest login
npx vercel@latest deploy --yes
```

If the Vercel CLI is already installed globally:

```powershell
vercel deploy --yes
```

## After The Preview URL Exists

Open these paths on the preview URL:

- `/toothfairy/colosseum/theater`
- `/toothfairy/colosseum`
- `/toothfairy/colosseum/run`

Use `/toothfairy/colosseum/theater` first. It is the fastest surface for judging story flow: Tanda opening, product thesis, first app page, Solana proof placeholders, and close.

## Production Guardrail

Do not run `vercel --prod` for this packet until the preview has been reviewed. MoonPay remains KYB-pending in the video unless approval and a clean test both land before final edit.
