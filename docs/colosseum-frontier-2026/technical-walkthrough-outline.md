# Technical Walkthrough Outline

Target length: 2:15 to 2:50
Format: screen recording plus architecture overlays.
Narration recommendation: Sathian or neutral technical voice. Tanda can appear as an intro/outro bumper.

## Thesis

Tooth Fairy Network uses Solana for what a normal database cannot do: low-cost permanent milestone assets, shareable on-chain family deposits, portable actions, and escrowed savings that the product operator does not custody.

## Timing

### 0:00 to 0:15 - What Was Built

Show:
- Product home/app.
- One sentence architecture map.

Say:
- "This is a Next.js consumer app backed by an Anchor escrow program, Metaplex compressed NFTs, Arweave/Irys storage, and Solana wallet flows."

### 0:15 to 0:45 - User Flow

Show:
- Parent starts a keepsake.
- Child photo/drawing.
- Keepsake preview.
- Mint or proof page.
- Gift link.

Say:
- "The emotional flow happens before the wallet prompt. Parents invest in the moment first, then choose to make it permanent."

### 0:45 to 1:30 - On-Chain Architecture

Show:
- Program ID.
- PDA diagram.
- Contract instruction list.

Cover:
- `initialize_child` creates a child profile PDA.
- `create_milestone` creates the tooth milestone.
- `deposit` lets family members add SOL.
- `claim_deposit`, `early_withdraw`, and `refund_deposit` handle release paths.
- Treasury PDA receives the configured fees.
- Funds are held in deposit PDAs, not in a custodial app database.

### 1:30 to 2:00 - cNFT and Permanent Storage

Show:
- Metaplex/Bubblegum proof if available.
- Merkle tree capacity.
- Arweave/Irys metadata.
- Phantom display.

Cover:
- Compressed NFTs make the keepsake model economically practical.
- Arweave/Irys stores the image and metadata permanently.
- The web app can change, but the keepsake proof remains.

### 2:00 to 2:25 - Distribution and On-Ramp

Show:
- Gift link.
- Blink.
- Phantom mobile.
- MoonPay as KYB-pending unless approval and a clean test are recorded.
- Solana Mobile proof only if packaging is ready enough to show accurately.

Cover:
- Shareable links let grandparents deposit without creating a full TFN account first.
- Blinks make the deposit action portable.
- MoonPay is the non-crypto-family on-ramp path after KYB approval; before then it is a pending integration point.
- Solana Mobile is a strong consumer-distribution proof point if ready.

### 2:25 to 2:45 - Technical Decisions

Show:
- Short code/architecture overlay.
- Rate limiting/security note.

Cover:
- Why Solana: low fees, speed, compressed NFTs, wallet ecosystem, composability.
- Why escrow: families need clear custody and time-lock behavior.
- Why story-first UX: it converts non-crypto parents by making the wallet step feel earned.
- Why mobile: family moments happen on phones, and Solana needs warm mobile-native consumer apps.

## Proof Checklist

- Mainnet program ID: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`
- Contract upgrade authority known and retained for pre-audit iteration.
- Merkle tree/cNFT capacity visible.
- At least one cNFT visible in Phantom or explorer.
- At least one escrow/gift flow shown end to end.
- One clear mention of what is live versus what is next.

## Avoid

- Do not repeat the cultural market story in detail.
- Do not over-index on code scrolling.
- Do not claim full MoonPay production availability unless the recorded flow proves it.
- Do not say funds are "safe forever"; say the contract enforces the demonstrated custody and lock logic.
