# Personal-site closeout audit

Date: 2026-08-16

Status: local release candidate verified; not pushed or deployed

## What changed

- `/writings` now exposes the existing page title as the visible editorial H1 `Writing.`. The defect was a hidden `sr-only` H1, not a missing typography system.
- The existing `Site Agent Quality` workflow now adds a critical production-dependency stop-ship check, cross-page title/metadata/security/mobile checks, and the existing sound verifier with actual mobile decode/playback.
- `npm run release:verify` is the single local pre-release command. The project `AGENTS.md` now requires it before commit or deployment. No parallel release workflow, sound layer, analytics stack, or chat implementation was added.

## Verification receipt

- Unit and contract tests: 384/384 passed.
- Site-agent offline evaluation: 60/60 passed; zero knowledge gaps.
- Production build: passed; 145 pages generated.
- Public-surface browser matrix: `/`, `/writings`, and `/hackathons` passed at 1440×1000 and 390×844.
- Browser contract: one visible main H1, editorial display stack, title, description, canonical, configured security headers, and no horizontal overflow.
- Site-agent browser proof: exactly one agent root, chat panel, audio element, and replay control; desktop/mobile wake and note-receipt flows passed; actual mobile wake/replay/signature audio decoded and advanced.
- Dependency threshold: zero critical production vulnerabilities. The known 23 high, 28 moderate, and 15 low production dependency findings remain in the isolated compatibility/security backlog; no breaking `npm audit fix --force` was attempted.
- Patch hygiene: passed.

## Measurement truth on 2026-08-16

### Installed and working

- Vercel Web Analytics is mounted once through `WebsiteAnalytics`.
- GA4 is mounted once through the same component, uses `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and receives privacy-safe route and site-agent events from the shared analytics wrapper.
- The GA4 property recorded 17 active users, 14 new users, 321 events, and zero key events in the last seven days. Session acquisition included Direct 33, Referral 13, Organic Search 2, and Organic Social 1. Source/medium included `luma / referral`, `google / organic`, and `m.facebook.com / referral`.
- The existing private UTM builder is the correct source-tagging tool. Do not create a second builder. Use consistent `utm_source`, `utm_medium`, and `utm_campaign` on controlled Instagram/profile/campaign links. GA's official acquisition reference is https://support.google.com/analytics/answer/15612152.

### Search baseline

- Search Console has no manual actions and no security issues.
- Complete 28-day window (2026-07-18 through 2026-08-14): 1 click, 90 impressions, 1.1% CTR, average position 18.
- Available three-month window: 6 clicks, 186 impressions, 3.2% CTR, average position 17.8.
- Indexing on the 2026-08-09 report: 67 indexed, 168 not indexed. The largest cleanup groups are 48 not-found URLs and 88 crawled-currently-not-indexed URLs.
- GA4 is not linked to the Search Console domain property. Linking it is a reporting/account configuration task, not another site tag. Search Console's position definition is documented at https://support.google.com/webmasters/answer/7576553.

### Not installed

- There is no Meta Pixel or Conversions API in source or Vercel configuration.
- Decision: defer Meta until there is a real paid campaign, a Meta dataset/pixel ID, and an explicit consent/privacy decision. GA4 plus tagged links is sufficient for the current personal-site learning phase. Meta's official setup overview is https://www.facebook.com/help/messenger-app/952192354843755.

### Reporting gap

- The existing personal-site GA section is already implemented in the separate protected analytics-digest worktree, but personal delivery is paused pending a separate personal Telegram destination and a read-only service-account key/deploy approval.
- Homeland and TFN reporting remain intentionally isolated. Do not merge destinations or properties.

## Remaining website loops, in order

1. **Release this verified candidate:** requires explicit production deployment approval. After deployment, rerun the public surface, site-agent sound, route/asset, and Vercel error checks and update `ACTIVE-WORKTREE.md`.
2. **Finish measurement semantics:** link GA4 to Search Console, mark one real site-agent outcome as a GA4 key event, exclude internal/test traffic, and use one tagged Instagram link. These are account/reporting changes, not new analytics architecture.
3. **Choose the personal report destination:** then finish the already-built isolated 08:00 personal Telegram digest in its separate worktree and observe one private canary.
4. **Clean the search index deliberately:** export and classify the 48 legacy 404s and the 88 crawled-currently-not-indexed URLs before adding redirects or removals.
5. **Resume the existing P1/P2 security lane:** child-photo privacy/read-path decision, isolated Next/dependency compatibility upgrade, report-only CSP, and Supabase blast-radius separation; then the lower-risk account/function/secret/quota/header work.
6. **Product/content follow-ons:** unify article publication with site-agent memory and perform the preservation-first migration of the roughly 1.1 GiB tracked asset tree. These are not blockers for the title release.

## Chat-archive boundary

This sound/title task can be archived after the candidate is deployed and the post-deploy receipt is recorded. Keep the analytics/reporting and security-upgrade work as explicit durable tasks rather than relying on old chats for state.
