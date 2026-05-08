# MoonPay KYB-Pending Runbook

Purpose: keep MoonPay in the Colosseum story as the fiat on-ramp path without overstating that it is live before KYB approval.

## Current Implementation

- `/api/toothfairy/onramp` can create a signed MoonPay buy URL once keys are configured.
- The app opens the MoonPay widget from the card gift button when the feature flag is enabled.
- KYB is not approved yet, so the video should treat MoonPay as a pending fiat on-ramp path.
- The final on-chain milestone deposit still happens through the wallet gift path or Blink path until webhook-backed card gifts are production-ready.

## Required Env Values

After KYB approval, add these to local `.env.local` and to the deployment environment:

```bash
NEXT_PUBLIC_TFN_FIAT_ONRAMP_ENABLED=true
MOONPAY_API_KEY=...
MOONPAY_SECRET_KEY=...
```

Optional:

```bash
MOONPAY_ENVIRONMENT=sandbox
MOONPAY_BUY_BASE_URL=https://buy-sandbox.moonpay.com
MOONPAY_REDIRECT_URL=https://your-domain.example/toothfairy/app
```

For live production proof after KYB, omit `MOONPAY_ENVIRONMENT=sandbox` and `MOONPAY_BUY_BASE_URL` unless MoonPay instructs otherwise.

## Unlock Steps For Sathian

1. Wait for KYB approval.
2. Get the MoonPay publishable API key and secret key from the MoonPay dashboard.
3. Add the env values above locally.
4. Restart the local app after changing env values.
5. Open `/toothfairy/app`, create or use a test milestone, and connect a wallet.
6. Click `Add a card gift`.
7. Confirm the MoonPay widget opens with SOL, USD amount, and the connected wallet prefilled.
8. Record `proof-moonpay-v1.mp4` only through the widget opening/amount confirmation screen. Do not record private card details.
9. After SOL arrives, use the wallet gift path or Blink path for the actual milestone deposit proof.

## Acceptance Criteria

- MoonPay opens from the TFN flow.
- SOL is selected.
- USD amount is prefilled and locked.
- Destination wallet is prefilled.
- No API keys, cards, private wallet details, or personal identity screens appear in final footage.
- If a real transaction is shown, it is tiny and deliberate.

## Final Video Claim

Safe claim before KYB approval:

> MoonPay is the planned fiat on-ramp path for non-crypto parents, pending KYB approval.

Safe claim after widget proof:

> MoonPay gives non-crypto parents a fiat entry point into the Solana gift flow.

Avoid claiming full automated card-to-escrow settlement until webhook-backed receipts and refunds are production-ready.
