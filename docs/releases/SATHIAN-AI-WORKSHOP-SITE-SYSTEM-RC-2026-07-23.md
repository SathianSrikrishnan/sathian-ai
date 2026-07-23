# Workshop Site System Production Release

Date: 2026-07-23  
Branch: `feat/workshop-site-system`  
Base: `eae33c1`

## Included

- Warm Digital Workshop system on Home, About, Automation, Writing, Links, and article pages.
- Restored animated workshop idea machine.
- Personal Instagram, YouTube, and X links in desktop/mobile navigation.
- Dedicated TFN Instagram, YouTube, and X links under the TFN project and in the TFN footer.
- Dedicated private subscriber schema.
- Honest subscriber API failure behavior.
- Resend confirmation email.
- Durable Studio receipt and Telegram delivery.
- Accidental public database mutation hardening.
- Security architecture and article publishing workflow.

## Verification

- Existing Vitest suite: 35 files / 236 tests passed before subscriber tests were added.
- Subscriber route: 4 tests passed.
- TypeScript: passed.
- Launch readiness: passed.
- Next production build: passed with the existing build-time IPC warning.
- Database migrations: executed inside a transaction and rolled back successfully.
- Desktop browser: Home, About, Writing, Links, and article page reviewed.
- Mobile browser: Home, navigation, About, Automation, Writing, Links, and article page reviewed.
- Horizontal overflow: none at 390 px.

## Production cutover

Completed on 2026-07-23:

1. Commit `470fe45` pushed from `feat/workshop-site-system`.
2. Supabase migrations `newsletter_subscribers` and `public_grant_hardening` applied.
3. Commit deployed to Vercel as `dpl_XtphYjAiTdE39W79dcp5dUQfLXY2`.
4. Production aliased to `https://sathian.ai`.
5. Home, About, Automation, Writings, and Links verified in production.
6. Animated workshop visual and all personal/TFN social links verified.
7. Invalid-email, honeypot, and rollback-safe subscriber tests passed.
8. Supabase security advisors rerun; the accidental anonymous mutation paths are gone.

Still requiring Sathian's real test address:

1. Submit one controlled signup from the home page.
2. Verify its subscriber and event rows, confirmation email, Studio receipt, and Telegram delivery.
3. Repeat from TFN and verify source attribution and duplicate behavior.
