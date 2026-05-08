# Technical Walkthrough Script V1

Target: 2:30 to 2:50.
Speaker: Sathian or neutral narrator.
MoonPay status: prepared KYB-pending on-ramp path, not live proof unless approved and tested before final edit.

## Draft

Tooth Fairy Network is a Next.js consumer app backed by Solana mainnet infrastructure: Anchor escrow, compressed NFTs, Arweave/Irys storage, wallet flows, and shareable gift actions.

The user flow starts with the emotional moment. A parent creates a tooth memory, adds a drawing or photo, previews the keepsake, then moves into wallet connection, minting, and family gift sharing.

On chain, the core is an Anchor escrow program deployed at `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`.

The program models three main account types. A child profile PDA stores the guardian, child wallet, milestone count, totals, and deposit count. A milestone PDA represents a specific tooth and stores the metadata URI and deposit totals. Each deposit PDA holds SOL for a family contribution, including depositor, amount, lock time, claim status, and creation time.

The key instructions are `initialize_child`, `create_milestone`, `deposit`, `claim_deposit`, `early_withdraw`, `refund_deposit`, `transfer_guardianship`, and `update_child_wallet`. A treasury PDA collects the configured platform fees.

The important design choice is that the family savings primitive is not a database balance. Deposits are enforced by Solana account state and program logic.

For the keepsake, the app uses Metaplex compressed NFTs with a live Merkle tree, and stores image and metadata through Arweave/Irys. That keeps cost low enough for a consumer milestone product while preserving durable proof.

For distribution, each milestone can produce a shareable gift page, and the deposit path can be exposed through Solana Actions and Blinks. That lets a grandparent, co-parent, or relative enter from a link instead of learning a crypto app first.

The stack also includes Phantom mobile deep links, server-side API routes for minting and metadata, rate limiting, and a fallback path for non-wallet users.

The MoonPay on-ramp path is prepared for non-crypto parents and can move from roadmap to live proof after KYB approval and a clean test. If Solana Mobile packaging is ready, it becomes the consumer-mobile proof point.

We chose Solana because this experience needs to feel instant, inexpensive, mobile-native, and composable. Compressed NFTs, low fees, mobile wallet support, and portable actions make this possible in a way a normal web app cannot.

The result is a working product where a childhood ritual creates a permanent keepsake and a real family escrow account on Solana.
