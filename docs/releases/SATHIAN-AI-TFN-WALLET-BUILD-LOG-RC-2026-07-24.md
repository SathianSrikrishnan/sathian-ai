# Sathian.ai TFN wallet build-log release candidate

Date: 2026-07-24

## Scope

Add one Tooth Fairy Network entry to the existing public Building Log. The entry links to TFN's evidence-backed wallet ledger and preserves the site's existing three-part structure: What changed, What I learned, and Next.

## Public wording

- Six desktop wallets have limited Solana devnet receipts: Phantom, Solflare, Backpack, Jupiter Wallet, Trust Wallet, and MetaMask.
- Five completed owner-signed outbound synthetic cNFT transfers: Phantom, Solflare, Backpack, Jupiter Wallet, and MetaMask.
- Three completed the full wallet-signed escrow lifecycle: Solflare, Backpack, and Jupiter Wallet.
- Trust Wallet outbound transfer and escrow remain unverified.
- MetaMask escrow initialization timed out without creating on-chain state.
- No wallet is described as fully supported and no support logo is approved.

## Verification

- Homepage relaunch unit test: 10 passed.
- TFN launch-readiness check: passed.
- Production build: passed using non-secret build-only placeholders for services that instantiate clients during page collection.
- Desktop viewport: 1440 px, no horizontal overflow.
- Mobile viewport: 390 px, no horizontal overflow.
- Evidence-ledger link opens in a separate tab.

## Visual receipts

- `docs/releases/2026-07-24-tfn-wallet-build-log-desktop.png`
- `docs/releases/2026-07-24-tfn-wallet-build-log-mobile.png`

## Rollback

Revert only the July 24 entry in `src/components/home/HomeClient.tsx`. The previous Building Log entries and site structure are unchanged.
