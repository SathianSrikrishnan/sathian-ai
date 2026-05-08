# Colosseum Storyboard V1

Purpose: source-of-truth creative board for the two Colosseum submission videos.

MoonPay status: keep it in the story as the fiat on-ramp path, but frame it as KYB-pending unless approval lands and a clean test is recorded before edit lock.

## Pitch Video

Target: 2:40-2:55. Host: Tanda Faye as CEO of Tooth Fairy Network. Tone: magical founder pitch, emotionally warm, still credible to judges.

### p01 - Tanda Opens The Arena

Time: 0:00-0:14

Narration:

> I am Tanda, CEO of the Tooth Fairy Network. For centuries, a lost tooth has brought families together around a tiny milestone.

Visual:

- Tanda Faye talking-avatar shot, waist-up.
- Use `tanda-faye-ceo-still-v2.png` as the current still source.
- Soft animated background, tooth charm visible.

Edit note:

- This is the face-lock moment. If Tanda feels wrong, fix this before everything else.

### p02 - Distributed Families

Time: 0:14-0:32

Narration:

> But families are more spread out than ever. Grandparents, co-parents, relatives, and friends are not always in the same room when the milestone happens.

Visual:

- `diagram-family-network-v1.png`.
- Quick cut to gift/share page if available.
- Labels: parent, co-parent, grandparent, family creator, local keeper.

Edit note:

- This is the actual problem wedge. Keep it emotionally true, not gloomy.

### p03 - The Product Ritual

Time: 0:32-1:00

Narration:

> Tooth Fairy Network gives that family one place to show up. A parent opens the app, captures the smile or drawing, and turns the moment into a permanent digital keepsake.

Visual:

- `/toothfairy` landing hero.
- Click into `/toothfairy/app`.
- Show child/test profile, drawing/photo, keepsake preview.

Edit note:

- Product first, wallet second. The judge should understand why a parent would care before we say “on-chain.”

### p04 - Family Gift Link

Time: 1:00-1:20

Narration:

> Then the family can add a gift through a shareable link: parents, grandparents, co-parents, aunts, uncles, anyone who wants to be part of the story.

Visual:

- Gift page.
- Deposit CTA.
- Share affordance.
- Optional Blink proof if stable.

Edit note:

- This is the viral/customer loop. Show “one link” clearly.

### p05 - Solana Under The Magic

Time: 1:20-1:44

Narration:

> The magic leads. Solana keeps the value, proof, and action alive underneath: compressed NFTs, permanent storage, escrow, Blinks, and mobile wallet flows.

Visual:

- `diagram-solana-stack-v1.png`.
- Fast proof cuts: Phantom/cNFT, explorer, program ID.

Edit note:

- This satisfies the Solana-specific pitch requirement without turning into the technical walkthrough.

### p06 - Already Live

Time: 1:44-2:02

Narration:

> This is already live on mainnet. The program is deployed. The Merkle tree is live. Keepsakes display in Phantom. Gift links and Solana-native deposits are part of the flow.

Visual:

- Program explorer page.
- Merkle tree/cNFT proof.
- Phantom proof.
- App URL.

Edit note:

- Use proof labels, not long scrolling.

### p07 - Founder, GTM, And On-Ramps

Time: 2:02-2:26

Narration:

> Sathian built this as a father first, then as a founder. Go-to-market is parents, family creators, cultural tooth-story videos, Solana Mobile, MoonPay access after KYB, and the Solana community itself.

Visual:

- Tanda host shot.
- Optional 8-12 second Sathian soundbite.
- Social/content montage placeholder.
- MoonPay shown as a labeled roadmap/on-ramp item: “KYB pending.”
- Solana Mobile proof only if accurate.

Edit note:

- If the founder soundbite is not recorded, Tanda carries this cleanly.

### p08 - Sticky Solana Accounts

Time: 2:26-2:40

Narration:

> Tooth Fairy Network turns family milestones into sticky Solana accounts. The tooth fairy just got an upgrade.

Visual:

- Tanda returns.
- App URL.
- Short montage: child milestone, family graph, Phantom proof.

Edit note:

- End on the tagline. No extra feature list after it.

## Technical Walkthrough

Target: 2:30-2:50. Speaker: Sathian or neutral narrator. Tone: implementation-led, calm, clear, proof-forward.

### t01 - Stack Overview

Time: 0:00-0:18

Narration:

> Tooth Fairy Network is a Next.js consumer app backed by Solana mainnet infrastructure: Anchor escrow, compressed NFTs, Arweave/Irys storage, wallet flows, and shareable gift actions.

Visual:

- `diagram-solana-stack-v1.png`.
- Quick app landing shot.

Edit note:

- Start with what exists. Do not re-pitch the market here.

### t02 - User Flow

Time: 0:18-0:46

Narration:

> The user flow starts with the emotional moment: create a tooth memory, add a drawing or photo, preview the keepsake, then move into wallet connection, minting, and family gift sharing.

Visual:

- Slower `/toothfairy/app` walkthrough.
- Captions for each step.

Edit note:

- Use the same raw capture as pitch, but slower and with labels.

### t03 - Anchor Program

Time: 0:46-1:20

Narration:

> The core is an Anchor escrow program. Child profile, milestone, deposit, and treasury PDAs model the family savings state on chain. Deposits are not just database balances; they are enforced by Solana account state and program logic.

Visual:

- `diagram-pda-model-v1.png`.
- Code/IDL crop.
- Program ID: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`.

Edit note:

- Explain the design choice, not every line of code.

### t04 - cNFT And Storage

Time: 1:20-1:46

Narration:

> Metaplex compressed NFTs make the keepsake cost practical for a consumer milestone product. Arweave/Irys stores the image and metadata so the memory can outlive the current web session.

Visual:

- Phantom cNFT proof.
- Metadata URL proof.
- Merkle tree proof if available.

Edit note:

- Be precise about permanence. Avoid broader claims than Arweave/Irys support.

### t05 - Actions, On-Ramp, Mobile

Time: 1:46-2:13

Narration:

> Gift pages and Blinks make the deposit action portable. The MoonPay path is prepared for non-crypto parents and can move from roadmap to live proof after KYB approval and a clean test. Solana Mobile can become the mobile-native proof point if packaging is ready.

Visual:

- Gift page.
- Blink/Solana Action proof if stable.
- MoonPay overlay: “KYB pending fiat on-ramp.”
- Solana Mobile only if accurate.

Edit note:

- Visually separate live proof from pending/on-ramp roadmap.

### t06 - Why Solana

Time: 2:13-2:35

Narration:

> Solana is the right substrate because the experience needs to feel instant, inexpensive, mobile-native, and composable. The result is a working product where a childhood ritual creates a permanent keepsake and a real family escrow account on Solana.

Visual:

- `diagram-why-solana-v1.png`.
- Final proof montage.

Edit note:

- End with working product and technical rationale, not a roadmap.

## Fallback Rules

- If Tanda avatar lip-sync distorts the face, use Tanda still/loop plus voiceover.
- If MoonPay KYB is not approved by edit lock, keep it as a labeled near-term fiat on-ramp path.
- If Solana Mobile is not ready, remove the proof shot and keep the line general.
- If Blink proof is unstable, show gift link and wallet deposit proof instead.
- If founder soundbite is not recorded, Tanda can deliver p07.
