# Sathian.ai cleanup, reporting, and growth audit

Date: August 28, 2026
Scope: personal-site repository state, Codex task preservation, pull requests, production agent/reporting health, GA4 interpretation, search/AIEO visibility, and a sustainable content loop.
Decision supported: what can be archived now, what must be preserved, and what to build next without starting another disconnected system.

## Bottom line

The live personal-site stack is healthy, and the valuable uncommitted site work is now preserved in local commit `b635940`. Nothing was pushed or deployed. The remaining loose ends are bounded and visible: one untracked third-party résumé PDF, three useful untracked writing/research notes to preserve, dirty artifact-only worktrees that require an explicit cleanup decision, six distinct unmerged histories, and two stale Tooth Fairy Network draft pull requests. There is no open personal-site pull request to `main`.

The reported `35 people / 42 visits` should be read as **35 GA4 active users / 42 sessions** for the report's configured complete window. GA4 filters known bots and spiders, but it cannot certify that the remaining users are humans or disclose how many bots it removed. At this sample size, a bot percentage would be false precision. Improve confidence by filtering production hostname and internal/test traffic, then report engaged sessions and meaningful actions alongside a separate request-level bot ledger.

Sathian already has a strong full-name search footprint: the live search snapshot returned `sathian.ai/about`, the homepage, LinkedIn, and older profiles for `Sathian Srikrishnan`. The first-name query `Sathian` is shared with name-definition sites and other people, so exclusive ownership is not a realistic promise. The practical objective is to make `sathian.ai` the clearest entity for **Sathian Srikrishnan**, then grow first-name association through a distinctive, consistently authored body of work.

## 1. Repository and task cleanup

### Canonical worktree

- Canonical path: `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release`
- Branch: `main`
- Preflight base: local `HEAD` and `origin/main` both equalled `27ffc745696e4b26c0723ba6937e501cd4d75d38` before this audit.
- Local preservation commit: `b635940 fix(site): correct prototype truth and indexing`
- Push/deploy state: **not pushed, not deployed**. Local `main` is intentionally one commit ahead of `origin/main`.
- Release gate on the preserved patch: PASS — 396 unit/contract tests, 60/60 agent evaluations, production build, desktop/mobile public surfaces, site-agent singleton behavior, real mobile audio playback, and patch hygiene.
- Dependency scan: no critical stop-ship result, but the known high/moderate Next.js/Solana dependency backlog remains. This is not a clean dependency bill of health.

The commit contains two coherent corrections:

1. AutoQuote is represented truthfully as a private research prototype with public evidence, not a submitted hackathon or active live insurance product.
2. The sitemap no longer duplicates `/writings/agent-allowance-lab` if Studio publishes the same slug as the built-in route.

The sitemap correction was recovered from the dirty `public-agent-portal` worktree using a fresh red-green test in the canonical tree. The focused suite passed 66/66 before the full release gate.

### Worktree disposition

| Bucket | Worktrees | Recommended action |
| --- | --- | --- |
| Canonical, active | `hackathon-portfolio-release` | Keep. Review local commit `b635940`, then explicitly approve a future push/deploy or keep it local. |
| Clean and fully merged | `_release/sathian-ai-front-door-fc01914`, `bitcoinbay-private-proposal`, `feat-lex-garden`, `hackathons-on-latest`, `site-agent-v2-local-20260811`, `tfn-wallet-build-log`, `tfn-wallet-build-log-live`, `workshop-site-system` | Low-risk worktree-removal candidates after explicit approval. Removing a worktree is destructive and was not done here. |
| Dirty but changes are artifacts or now rescued | historical `main` screenshots, `public-agent-portal` sitemap patch, `warm-workshop-live` screenshots | Preserve until Sathian approves either copying the artifacts into a receipt folder or removing the worktrees. The sitemap behavior is now preserved in `b635940`. |
| Dirty preservation sources | `tfn-v1-history`, `toothlight-v4-active`, `warm-digital-workshop` | Do not delete. They contain logs/scripts, a large divergent reskin history, or partial dependency/screenshot artifacts. Triage separately from the personal-site release. |
| Distinct unmerged histories | `aia-project-frame`, `studio-control-room`, `tfn-capsule-mvp`, `toothlight-v4-active`, `warm-digital-workshop`, `website-analytics-digest` | Keep until each is classified adopt / superseded / archive. Do not bulk-merge them into current `main`. |

There are 19 registered worktrees in total. The earlier cleanup inventory remains useful, but this audit supersedes its current-state counts.

### Branches and pull requests

Unmerged local histories remain on:

- `codex/tfn-capsule-mvp` — 95 commits outside current `main`, pushed.
- `codex/website-analytics-digest-20260719` — 5 local-only commits; its separate personal digest architecture is mostly superseded by the GA4 block now integrated into the existing Telegram delivery Worker.
- `feat/aia-project-frame` — 2 local-only commits.
- `feat/studio-control-room` — 6 local-only commits.
- `feat/warm-digital-workshop` — 1 local-only commit.
- `migration/toothlight-v4-active-20260612` and `reskin/homepage-2026-07` — large divergent TFN/site histories; preserve as source, not routine merge candidates.
- `toothfairy/v2-scroll` — one pushed commit outside current `main`.

Open GitHub pull requests:

- PR #7, draft: `[codex] rebuild Toothlight creation flow` — stale TFN work, last updated June 9, 2026, no checks.
- PR #5, draft: `Codex/tfnv2` — stale TFN work, last updated May 17, 2026, no checks.

Neither is a current personal-site PR. They should be reviewed and explicitly closed or preserved from the TFN control task, not silently deleted during personal-site cleanup.

### Codex tasks that produced repo state

These task outputs are now durably represented on disk and are safe to archive from a preservation standpoint:

- `Evaluate borrowable agent portfolio` → visual audit, capability plan, domain context, and commit `b635940`.
- `Research Network School exam` → `docs/research/2026-08-28-network-school-exam.md` (still untracked at the time of this audit; preserve in the documentation commit below).
- the Polytheistic Test distribution work → `docs/publishing/2026-08-16-polytheistic-test-social-launch-copy.md` (draft only; includes a Substack URL placeholder and authorizes no post).

`Mock up minimalist website` is historical and its released descendants are already in repository history. Other visible tasks such as DJ Klu, community events, and X-bookmark capture are separate content/research lanes and are not evidence of uncommitted public-site code.

## 2. Chatbot and reporting health

### Production evidence checked on August 28

- Latest daily `Site Agent Quality` run succeeded. Daily runs on August 18–23 and 25–27 also succeeded; August 24 was cancelled during checkout and was followed by successful runs.
- Production Vercel logs returned no error entries and no HTTP 500 entries for the inspected seven-day window.
- The deployed Cloudflare Worker is active. A live scheduled tail completed with outcome `ok`, zero exceptions, and an empty delivery batch.
- Supabase is `ACTIVE_HEALTHY`. The most recent worker RPC calls were HTTP 200; the database log showed routine checkpoints and non-error connection resets.
- The live 24-hour aggregate at inspection time was: 2 site sessions, 2 widget views, 0 completed agent turns, 0 notes/intakes, 0 Telegram backlog/dead letters, and 0 model errors.

This supports **healthy now**, not “incapable of failing.” The current tests, logs, database, and delivery worker agree that there is no observed chatbot/reporting incident.

### What the morning report already does well

The existing 08:00 private report uses one Worker and one destination. It reports:

- rolling 24-hour operational counts: sessions, widget views, agent turns, notes/intakes, reply-enabled receipts, Telegram delivery/backlog/dead letters, and model errors;
- GA4 complete windows through two days ago: 7- and 28-day active users and sessions, `agent_note_sent`, top named source/medium, and top landing page;
- fail-soft behavior: an analytics outage does not break the operational report.

### Upgrade the daily report without making it noisy

Use five blocks:

1. **Agent health, rolling 24h:** questions, successful answers, answer completion rate, model errors/error rate, p50/p95 latency, notes sent, Telegram delivered, dead letters, backlog.
2. **Reach, seven complete days:** GA4 active users, sessions, engaged sessions, engagement rate, and change versus the previous seven complete days.
3. **Traffic confidence:** production-host filter state, internal/test exclusion state, and a separate verified-bot request trend.
4. **Outcomes:** notes sent, source opens, helpful/not-helpful feedback, and session key-event rate.
5. **One action:** a deterministic recommendation or “No meaningful change; keep the experiment running.”

Add one privacy-safe client failure event with only page, coarse error class, and coarse duration. Never send prompt text, names, contact data, or filenames into GA4.

### Put growth truth in a weekly block

The Monday review should add:

- Google Search Console: 28-day clicks, impressions, CTR, average position, index deltas, and branded versus non-branded queries.
- Bing Webmaster Tools: Web and Chat clicks/impressions, indexed pages, and crawl errors.
- AI referrals: observed `chatgpt.com` and other real referral domains; no inferred source when the referrer is absent.
- Content: writings ranked by engaged sessions, organic landing sessions, returning users, and meaningful agent actions.
- Distribution: sessions and outcomes by controlled `utm_campaign` across Substack, LinkedIn/social, Luma, and direct referrals.
- Bot ledger: search crawler, AI crawler, other verified bot, and suspected automation at request level. Never label edge requests as users.

## 3. Can 35 users and 42 sessions be trusted?

Yes, as **GA4 measurements under the current property configuration**. No, as a certified headcount of 35 humans.

- GA4 automatically excludes known bots and spiders “to the extent possible,” but it does not expose the excluded count or guarantee that every remaining browser is human.
- An active user is a browser/device identity under GA4's reporting identity. A person can be split across devices, cookie resets, or browsers; blockers and denied analytics can omit real people.
- A session is a group of interactions, not a person or a verified visit from one human.
- Direct traffic is not synonymous with bot traffic.
- Engaged sessions are more useful than raw sessions, but sophisticated automation can still create them.

At 35 active users and 42 sessions, do not publish or repeat a bot percentage. First complete four controls:

1. Filter the Worker query to the production hostname `sathian.ai`, or prove that previews never receive the production measurement ID.
2. Define internal traffic and keep the GA4 filter in Testing until verified; activation permanently excludes new matching traffic.
3. Label or exclude automated production QA so smoke tests do not look like audience growth.
4. Use Vercel request observability as a separate bot ledger; do not subtract requests from GA4 sessions.

Preferred Telegram wording:

> 7 complete days: 35 GA4 active users · 42 sessions
> 24 engaged sessions (57%) · 4 meaningful agent actions
> Bot requests reported separately; users are estimates, not verified people.

The engaged-session and action figures above are an example format, not measured values from this audit.

## 4. Search and AI visibility

### Current search snapshot

On August 28, a live search for `"Sathian Srikrishnan"` surfaced the Sathian.ai About page, the Sathian.ai homepage, LinkedIn, and older third-party profiles. A search for `Sathian` also surfaced name-definition pages and other people. This means:

- full-name entity recognition is already real;
- the homepage and About page are indexed;
- the first-name query is contested and cannot be exclusively owned;
- the live homepage result still described AutoQuote as an active build, which the local release candidate corrects but production has not yet received.

### P0: make every identity signal agree

Use **Sathian Srikrishnan** as the primary public identity and `Sathian` / `Sathian S.` only as alternates.

- Align the prominent homepage identity, document title, Open Graph site name, and `WebSite.name`. `Digital Experiments` can remain an editorial label, but it should not compete with the person's name as the site's identity.
- Keep a real, indexable About/Profile page with one stable Person `@id`.
- Display and link `By Sathian Srikrishnan` on every writing; reuse the same Person identifier in Article structured data.
- Add `dateModified`, representative images, and the stable author URL where applicable.
- Make maintained profiles—LinkedIn, Substack, YouTube, X, and others—use the same full name, bio, portrait, and Sathian.ai backlink. Add them to `sameAs` only when they genuinely represent Sathian.

### P1: earn the association through a body of work

The repeatable unit is:

`first-hand essay → useful mini app/artifact → canonical Sathian.ai page → Substack/LinkedIn/social distribution → 7/28-day measurement → deepen or stop`

Publish material that only Sathian can credibly produce: experiments, receipts, mistakes, screenshots, data, product judgment, and how his view changed. Avoid thin query pages, artificial keyword repetition, or mass-produced FAQ variants.

### AIEO is strong SEO plus access

- Keep pages server-readable, indexable, canonical, internally linked, and usable without login.
- Keep Person, WebSite, ProfilePage, and Article structured relationships internally consistent.
- Verify representative pages can be fetched by `OAI-SearchBot`, `Claude-SearchBot`, and `Claude-User` if discovery is desired. Treat training crawlers as a separate policy decision.
- Measure ChatGPT referrals when `utm_source=chatgpt.com` is actually present.
- Do not add `llms.txt` for Google; Google's current guidance says it is not used.
- Do not assume crawler permission, schema validation, or an index submission guarantees ranking or an AI citation.

### Discovery systems to add

1. Verify Sathian.ai in Bing Webmaster Tools and import the Search Console property where useful.
2. Submit the existing sitemap and inspect high-value URLs.
3. Add IndexNow only at the stable publish/update/delete boundary; it is a notification, not a ranking guarantee.
4. Keep Search Console as Google discovery truth and GA4 as post-arrival behavior truth. Clicks and sessions will not match exactly.

## 5. A sustainable content operating system

### Cadence

- **Every two weeks:** one flagship essay plus a genuinely useful companion artifact when the idea benefits from interaction.
- **Alternate weeks:** one shorter build note, experiment result, or field note that can later feed a flagship piece.
- **Per flagship:** Sathian.ai owns the canonical full piece; Substack carries newsletter framing/excerpt and a tagged link; LinkedIn receives a standalone adaptation; X or another social surface receives a short derivative. Publication on every surface remains explicit approval.
- **After 7 days:** check indexing, source mix, engagement, and meaningful actions.
- **After 28 days:** deepen, update, consolidate, or stop based on query/page and outcome evidence.

### Topic lanes

Keep three recognizable lanes rather than a miscellaneous stream:

1. **Bounded agents and practical AI:** authority, receipts, privacy, capability discovery, agent mistakes, and business workflows.
2. **Technology, money, and culture:** Polytheistic Test-style essays, crypto/AI power, identity, incentives, and public systems.
3. **Building in public:** mini apps, hackathon/build notes, TFN lessons, experiments, and honest postmortems.

Each piece should answer one question, contain first-hand evidence, link to one adjacent piece or project, and offer one useful next action—try the artifact, read the proof, or ask the site agent.

### 90-day success criteria

- `Sathian Srikrishnan` consistently resolves to Sathian.ai and maintained profiles.
- Branded and non-branded impressions rise from the current Search Console baseline.
- At least one topic lane produces engaged visits or meaningful agent actions across two releases.
- Bing and AI referral/discovery data are visible rather than anecdotal.
- The morning report distinguishes audience estimates, internal/test activity, bot requests, and outcomes.
- The publishing loop produces six flagship packets or a smaller number with a documented quality/learning reason—without creating an orphaned second site or content system.

## 6. Ordered next actions

1. Review local commit `b635940`. If approved, push/deploy it in a separate explicit release task and verify the live search-facing AutoQuote copy and sitemap.
2. Preserve the three remaining writing/research notes in a documentation commit; leave the third-party résumé PDF untracked unless Sathian explicitly wants it retained in Git.
3. Upgrade the Telegram GA4 block: production hostname, internal/test treatment, engaged sessions, previous-period comparison, and accurate `GA4 active users` wording.
4. Add the weekly Search Console/Bing/content/AI/bot ledger; keep the daily report short.
5. Ship the identity-consistency release: full-name site signals, visible bylines, one stable profile entity.
6. Start the biweekly essay + artifact cadence with one topic from the three lanes and reuse the existing Substack draft workflow.
7. After the personal-site release decision, review the eight clean merged worktrees for explicit removal and route the two stale PRs to the TFN task.

## Sources and evidence

Local evidence:

- current repository and worktree/branch/PR inventory, August 28, 2026;
- `npm run release:verify` receipt from this audit;
- GitHub `Site Agent Quality` history;
- Vercel production log inspection;
- Cloudflare Worker live tail and deployment state;
- Supabase project health, API log, database log, and aggregate-report RPC;
- `docs/research/2026-08-28-sathian-search-ai-visibility-reporting.md`.

Primary web guidance:

- Google Analytics known-bot exclusion: https://support.google.com/analytics/answer/9888366
- GA4 reporting identity: https://support.google.com/analytics/answer/10976610
- GA4 sessions: https://support.google.com/analytics/answer/12798876
- Google site names: https://developers.google.com/search/docs/appearance/site-names
- Google title links: https://developers.google.com/search/docs/appearance/title-link
- Google Article markup: https://developers.google.com/search/docs/appearance/structured-data/article
- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google generative AI optimization: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Search Console and Analytics: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console
- OpenAI publisher/developer FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- Anthropic crawler policy: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Bing Webmaster Help: https://www.bing.com/webmasters/help
- IndexNow protocol: https://www.indexnow.org/documentation
- Vercel Observability: https://vercel.com/docs/observability/insights

## Caveats

- Search snapshots vary by engine, locale, device, and personalization; this audit is a point-in-time discovery check, not a rank guarantee.
- The user-provided GA4 totals were not decomposed into engagement, hostname, geography, device, or internal traffic during this audit; no human/bot share is estimated.
- No production setting, secret, account, public post, branch deletion, worktree deletion, PR closure, push, or deployment was performed.
