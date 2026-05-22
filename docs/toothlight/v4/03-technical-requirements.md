# Toothlight V4 Technical Requirements

Date: 2026-05-21
Status: working draft

## Architecture Decision

Use the current Next.js app and existing Solana/Supabase plumbing through clean adapters. Build V4 as an isolated `/toothlight` product surface before replacing the live `/toothfairy` surface.

## What Is Actually Preserved

Current implementation pattern:

- cNFT metadata stores public-safe Toothlight image/metadata on permanent storage through Irys/Arweave;
- the cNFT points to that metadata URI;
- the escrow milestone stores the metadata URI on-chain;
- child profile and media metadata are stored in Supabase;
- the child story/Tell is currently stored off-chain in `tfn_tooth_stories`;
- Smile Fund deposits are on-chain escrow deposit accounts.

V4 product wording should avoid implying that every private part of the time capsule is fully on-chain.

Recommended wording:

> The Toothlight has an on-chain record. Private letters and voice notes stay in the parent-controlled account.

## Current Tables To Preserve

Existing tables:

- `tfn_children`;
- `tfn_tooth_stories`.

V4 should add tables instead of forcing private features into the existing public keepsake path.

## Proposed V4 Tables

### `tfn_toothlights`

Purpose:
One row per saved Toothlight.

Fields:

- `id`;
- `user_id`;
- `child_id`;
- `child_profile_pda`;
- `milestone_pda`;
- `metadata_uri`;
- `image_uri`;
- `toothlight_name`;
- `tooth_nickname`;
- `caption`;
- `glow_filter`;
- `unlock_date`;
- `letter_status`;
- `share_status`;
- `created_at`;
- `updated_at`.

### `tfn_future_letters`

Purpose:
Private parent/family letter content.

Fields:

- `id`;
- `toothlight_id`;
- `author_user_id`;
- `author_role`;
- `body_text`;
- `voice_url`;
- `ai_assisted`;
- `unlock_date`;
- `status`;
- `created_at`;
- `updated_at`;

### `tfn_family_contributions`

Purpose:
Grandparent/family notes, gift intent, and on-chain deposit links.

Fields:

- `id`;
- `toothlight_id`;
- `contributor_name`;
- `contributor_email`;
- `note_text`;
- `gift_intent_status`;
- `payment_provider`;
- `provider_session_id`;
- `deposit_pda`;
- `transaction_signature`;
- `amount_display`;
- `fee_display`;
- `created_at`;
- `updated_at`.

### `tfn_product_events`

Purpose:
Metrics and reporting.

Fields:

- `id`;
- `user_id`;
- `toothlight_id`;
- `event_name`;
- `event_source`;
- `metadata_json`;
- `created_at`.

## Privacy Requirements

- Private letters and voice notes are not public.
- Shared Toothlight pages can show that a locked letter exists.
- The child can revisit the Toothlight before unlock without seeing private letter content.
- Parent can preview/edit/delete/export private letters before unlock.
- Family notes require parent moderation or safe defaults before child reveal.

Encryption decision:

Account-level privacy is acceptable for the first planning draft, but V4 should review application-level encryption before storing voice notes or highly personal letters.

## Minting Requirements

Minting happens only after parent save/account creation.

Reason:

- prevents mint/storage costs on abandoned sessions;
- anchors the Toothlight to a parent-controlled account;
- keeps sign-in framed as saving, not onboarding.

## Smile Fund Requirements

- One child Smile Fund can have many Toothlights attached.
- A deposit can be associated with a Toothlight and a child Smile Fund.
- The current contract fee is 2% in deployed code and IDL.
- Any move to 1% requires a contract/revenue-model decision.
- Card gifts remain disabled until provider, webhook, fee disclosure, receipt, refund, and support paths are ready.

## Voice Requirements

V4 should test controlled voice prompts before a full voice agent.

Required capabilities:

- record short audio;
- transcribe;
- draft caption or letter;
- parent approves text before saving;
- original voice note optional.

## Reporting Requirements

Minimum V4 reporting:

- saved Toothlights;
- save abandonment;
- future letters started/completed;
- family invites sent;
- family page opens;
- notes submitted;
- gift intents started;
- gift deposits completed;
- education email opt-ins.
