# Toothlight V4 Business Model And Cost Notes

Date: 2026-05-21
Status: working draft

## Business Model Hypothesis

Free Toothlight creation drives parent trust and family sharing. Smile Fund contributions create revenue through a transparent platform fee.

Primary revenue:

- platform fee on Smile Fund contributions.

Secondary future revenue options:

- premium printed keepsakes;
- premium voice archive;
- premium family time-capsule bundles;
- regulated future Smile Fund Plus product if custody/yield/staking is legally cleared.

## Current Fee Reality

The current deployed escrow program and frontend references use a 2% platform fee and a 10% early withdrawal penalty.

If V4 wants a 1% platform fee, that is a contract and business-model decision. It should not be changed in copy alone.

Options:

1. Keep 2% for MVP.
2. Redeploy a new program with 1%.
3. Upgrade to a configurable fee model.
4. Keep current contract for testing and migrate before public provider launch.

## Toothlight Cost Buckets

Each saved Toothlight can create costs in these categories:

- AI image/filter generation if used;
- deterministic image processing;
- permanent image/metadata upload through Irys/Arweave;
- cNFT mint transaction;
- escrow child profile/milestone transaction if missing;
- Supabase database/storage;
- email delivery;
- analytics events;
- voice transcription if used;
- voice storage if used.

## What Is Free

The product can allow free creation before save, but paid infrastructure should begin only after parent save/account creation.

This protects costs from abandoned sessions.

## What Is On-Chain

The on-chain layer should carry:

- cNFT mint/provenance record;
- metadata URI;
- child profile;
- milestone;
- Smile Fund deposits and lock dates.

The off-chain layer should carry:

- private future letters;
- voice notes;
- edit history;
- family note moderation;
- analytics;
- education drip state.

## Payment Provider Fee Model

Provider fees vary by payment method, geography, asset, order type, and network conditions. V4 should not hard-code "3%" or "4%" in product copy.

Requirement:

Every checkout must show the total amount, provider fee, platform fee, network fee if applicable, and saved amount before the user pays.

## Grandparent Revenue Path

The strongest conversion path may be grandparents and extended family.

Default framing:

> Add a gift and a note for later.

This avoids leading with crypto and makes the fee feel attached to a meaningful gift action.

## AUM Expansion

Assets under management is a strategic goal, but V4 launch should not depend on managed yield, staking, or investment activity.

Future AUM layer requires a separate legal/product/technical workstream:

- custody model;
- staking/yield legal review;
- tax reporting;
- risk disclosures;
- provider approvals;
- contract upgrade path;
- support and refund policy.

## Cost Review Needed

Before implementation, build a live cost model with:

- average upload size;
- Irys/Arweave cost per image and metadata JSON;
- cNFT mint transaction cost;
- Solana transaction count per saved Toothlight;
- AI generation cost per attempt;
- transcription cost per minute;
- email cost per recipient;
- expected conversion from Toothlight to invite to deposit.
