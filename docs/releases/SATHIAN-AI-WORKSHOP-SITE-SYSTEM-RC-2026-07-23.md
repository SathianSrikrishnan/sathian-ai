# Workshop Site System Release Candidate

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

Production is intentionally unchanged. Cutover requires:

1. Commit and push this branch.
2. Apply the two Supabase migrations.
3. Deploy the exact commit to Vercel.
4. Run one controlled subscriber test through both sources.
5. Verify Telegram, Resend, Studio receipt, social links, articles, chatbot, and mobile.
6. Re-run Supabase security advisors.
