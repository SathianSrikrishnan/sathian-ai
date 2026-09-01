# Sathian Search Identity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make “Sathian” the visible public brand while preserving one full-name Person entity for search disambiguation, connect every maintained identity profile, and turn Search Console exclusions into a safe cleanup ledger.

**Architecture:** Keep the existing page structure and CSS unchanged. Update only identity metadata, visible identity strings, shared profile registries, and author references; reuse the stable `https://sathian.ai/#sathian` Person `@id`. Export Search Console exclusions read-only and classify URLs before any route deletion or redirect.

**Tech Stack:** Next.js 14 metadata, React server components, JSON-LD, Vitest, Playwright release checks, Google Search Console.

---

### Task 1: Lock the first-name identity contract with failing tests

**Files:**
- Modify: `tests/unit/site-indexing.test.ts`
- Modify: `tests/unit/homepage-relaunch.test.ts`
- Modify: `tests/browser/public_surface_check.cjs`

**Steps:**
1. Change expectations so the public site name, homepage identity, About H1, and visible bylines use `Sathian`.
2. Require the Person entity to retain `name: 'Sathian Srikrishnan'`, `alternateName: ['Sathian', 'Sathian S.']`, and the stable Person `@id`.
3. Require the WebSite entity to prefer `name: 'Sathian'` and retain the full name and domain as alternatives.
4. Require Substack and GitHub in the central identity profile list.
5. Run `npm run test:unit -- tests/unit/site-indexing.test.ts tests/unit/homepage-relaunch.test.ts` and confirm the new assertions fail for the missing implementation.

### Task 2: Implement the minimal identity consolidation

**Files:**
- Modify: `src/lib/site-identity.ts`
- Modify: `src/lib/social-links.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/home/HomeClient.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/about/opengraph-image.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/article/ArticleRenderer.tsx`
- Modify: `src/app/writings/agent-allowance-lab/page.tsx`
- Modify only if needed: `src/app/writings/[slug]/page.tsx`
- Modify only if needed: `src/app/writings/inside-monkedao/page.tsx`
- Modify: `src/app/links/page.tsx`

**Steps:**
1. Make `Sathian` the visible site brand and `WebSite.name` without changing layout classes or CSS.
2. Keep `Sathian Srikrishnan` as `Person.name`; keep `Sathian` as `alternateName` and reuse the stable Person `@id` in article structured data.
3. Make visible bylines say `Sathian` and link to `/about`.
4. Add Substack and GitHub once to the shared identity-profile registry; remove any duplicate rendering from `/links`.
5. Run the focused tests and confirm they pass.

### Task 3: Export and classify Search Console exclusions

**Files:**
- Create: `docs/audits/2026-09-01-search-console-excluded-url-ledger.md`
- Create if export succeeds: `docs/audits/2026-09-01-search-console-excluded-url-data/`

**Steps:**
1. Read the authenticated Search Console Page Indexing report without changing Search settings.
2. Export or capture the URL lists for `Not found (404)` and `Crawled - currently not indexed`; continue with all other available exclusion groups.
3. Compare each observed URL with the current sitemap, route tree, redirects, canonicals, and public intent.
4. Classify each URL as `keep/improve`, `redirect`, `intentional exclusion`, `retire 404/410`, or `needs Search Console export`.
5. Do not delete routes or add redirects without a specific equivalent destination.

### Task 4: Verify styling, indexing signals, and release safety

**Files:**
- Modify only if coverage requires it: `tests/browser/public_surface_check.cjs`
- Update: `docs/audits/2026-09-01-search-console-excluded-url-ledger.md`

**Steps:**
1. Run the focused identity tests.
2. Run `npm run release:verify`.
3. Confirm `git diff --check`, inspect `git status --short`, and preserve the existing `tmp/` directory.
4. Inspect the homepage, About page, links page, and representative writing at desktop and mobile sizes; confirm title hierarchy, fonts, overflow, canonicals, and bylines.
5. Review the final diff and commit only the intended identity, test, plan, research, and audit files. Do not deploy without explicit production approval.

### Task 5: Establish the organic-growth scorecard

**Files:**
- Update: `docs/audits/2026-09-01-search-console-excluded-url-ledger.md`

**Steps:**
1. Record the existing baseline: branded `sathian` impressions/clicks, organic-social sessions, Luma sessions, top identity landing pages, and `agent_note_sent`.
2. Define weekly measures for branded search impressions/clicks, engaged organic-social sessions, independent referring domains, writing engagement, and agent notes.
3. Recommend one controlled social distribution action per week; do not add advertising or tracking pixels.
