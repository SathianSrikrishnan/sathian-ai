# Sathian.ai Newsletter Governance

Date: 2026-07-23

## Current production state

- The signup form is live at `https://sathian.ai`.
- Subscriber count: 0.
- The previous form was not retaining submissions, so the historical zero does not prove nobody ever tried to subscribe.
- New signups are stored in private Supabase tables.
- A new signup creates a Studio intake receipt and a durable Telegram notification.
- A confirmation email is sent through Resend.
- Invalid submissions, simple bots, repeated requests, and duplicate addresses are handled.

## What the confirmation email says

From: `Sathian S. <hi@sathian.ai>`  
Subject: `You’re on the sathian.ai field-notes list`

> SATHIAN’S WORKSHOP
>
> # Thanks for joining.
>
> I’ll send a quiet note when a new essay or build note is worth sharing.
>
> Reply to this email any time if you want to say hello or leave the list.

The Tooth Fairy Network version uses its own sender, colours, subject, and copy.

## How it is managed today

### Subscriber registry

`newsletter_subscribers` is the source of truth. One normalized email equals one subscriber. It records:

- current status: subscribed, unsubscribed, or bounced;
- first and most recent signup source;
- consent notice version and consent time;
- first creation and most recent activity;
- whether a confirmation was sent;
- the Studio/Telegram intake receipt.

### Audit trail

`newsletter_signup_events` records each signup attempt that reaches the database, using a one-way email hash and a one-way visitor hash for abuse control.

### Operator awareness

- Telegram tells Sathian when a genuinely new subscriber arrives.
- Studio receives the related intake/contact receipt.
- Raw subscriber data remains private and is not readable from the public browser.

### Current limitation

There is not yet a dedicated subscriber-management screen in Studio. Until that is built, Supabase is the authoritative list and Studio/Telegram provide the notification trail.

## Recommended Studio management screen

Add `/studio/subscribers` with:

- total active, unsubscribed, bounced, and new-this-month counts;
- searchable subscriber list;
- source, consent date, and confirmation status;
- unsubscribe/suppress action with a required reason;
- CSV export for the operator only;
- append-only action history;
- delivery, bounce, complaint, and unsubscribe events;
- a send-preview step, but no direct bulk-send button without approval.

## Governance rules

1. Send only to `status = subscribed`.
2. Keep the consent notice version and timestamp as proof of opt-in.
3. Never import scraped or guessed addresses into the active list.
4. Every broad email requires sender identification and a working unsubscribe mechanism.
5. Process unsubscribe requests within 10 business days; the system should do it immediately.
6. Suppress bounced and complained addresses automatically.
7. Require an operator preview and approval before a campaign is sent.
8. Keep a publication and distribution receipt for every campaign.
9. Give TFN and personal-site subscribers distinct preferences.
10. Do not begin broad distribution until self-serve unsubscribe is live.

## Next implementation sequence

1. Complete one real-address signup proof.
2. Add signed, one-click unsubscribe links and an unsubscribe confirmation page.
3. Add Resend delivery, bounce, and complaint webhooks.
4. Build the Studio subscriber screen.
5. Add double opt-in as the default for new subscribers.
6. Add the approval-based article distribution workflow.
7. Add retention rules for operational signup events and campaign receipts.

## Canadian compliance reference

This is an operational checklist, not legal advice. For commercial electronic messages, current CRTC guidance identifies three core requirements: consent, sender identification/contact information, and a working unsubscribe mechanism. The sender must be able to demonstrate consent, and unsubscribe requests must be honoured within 10 business days.

- https://crtc.gc.ca/eng/com500/faq500.htm
- https://crtc.gc.ca/eng/com500/guide.htm
