# Site Agent Freshness Registry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make one reviewed project registry the source of truth for the homepage and site agent, then release the verified chatbot and voice cleanup to production.

**Architecture:** Extend `src/content/site-projects.ts` into the canonical public project contract. Every record owns its public status, approved claims, aliases, destination, imagery, and review date; the homepage and public-memory cards derive from those records. Direct project-name routing resolves through the same aliases, while non-project profile, writing, release, and note cards remain in their existing reviewed registries.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest, Playwright, Vercel.

---

### Task 1: Lock the registry contract with failing tests

**Files:**
- Modify: `tests/unit/site-agent-knowledge.test.ts`
- Modify: `tests/unit/homepage-relaunch.test.ts`
- Modify: `tests/unit/agent-answer.test.ts`

**Step 1:** Assert that the registry contains the seven public portfolio projects with `status`, `aliases`, `approvedClaims`, `reviewedAt`, and public destinations.

**Step 2:** Assert that every project memory card uses the registry review date and includes searchable aliases/status.

**Step 3:** Assert that Coverage Ledger, TFN/Toothlight, Clinical Guard, AgentTab, BTC Cultural Atlas, and Lex Rooftop Garden resolve to the correct record and one registry-owned action.

**Step 4:** Assert that the homepage derives featured and archive project content from the same registry rather than local duplicate records.

**Step 5:** Run the focused tests and confirm they fail because the freshness fields and shared records do not yet exist.

### Task 2: Implement the canonical reviewed registry

**Files:**
- Modify: `src/content/site-projects.ts`
- Modify: `src/lib/public-profile.ts`

**Step 1:** Add typed lifecycle status, aliases, approved claims, topics, and reviewed date fields.

**Step 2:** Add reviewed records for Tooth Fairy Network, AutoQuote Automator, Solana Ecosystem Observatory, ClinicalGuard, AgentTab, BTC Cultural Atlas, and Lex Rooftop Garden using only currently published claims and URLs.

**Step 3:** Export ordered featured/archive collections and an alias resolver that prefers longer, explicit aliases.

**Step 4:** Generate public-memory cards for every record. Derive the answer body from approved claims, aliases/status from registry metadata, absolute source URLs, and `validFrom` from `reviewedAt`.

**Step 5:** Generate the current-work answer from `primary` and `active` registry statuses so archived work cannot be described as current.

**Step 6:** Run the focused knowledge tests and confirm they pass.

### Task 3: Wire navigation and deterministic answers to the registry

**Files:**
- Modify: `src/components/home/HomeClient.tsx`
- Modify: `src/lib/agent/answer.ts`
- Test: `tests/unit/homepage-relaunch.test.ts`
- Test: `tests/unit/agent-answer.test.ts`

**Step 1:** Import the featured and archive collections into the homepage without changing the approved visual layout.

**Step 2:** Replace per-project regular expressions with registry alias resolution and use the project-owned CTA.

**Step 3:** Preserve specialist routing for writing, current work, note help, capabilities, latest releases, and TFN/Solana comparison.

**Step 4:** Run the focused homepage and answer tests; then run the complete unit suite.

### Task 4: Verify and release the exact candidate

**Files:**
- Modify: `tests/browser/chatbot_focus_check.cjs`
- Create: `docs/analytics/site-agent-evals/2026-08-13-freshness-production-receipt.md`
- Modify: `C:\Users\sathi\Projects\sathian-ai\ACTIVE-WORKTREE.md`

**Step 1:** Extend the real browser check with one alias/current-status assertion and confirm the homepage does not move when it answers.

**Step 2:** Run `npm run test:unit`, `npm run build`, `git diff --check`, and the protected local browser check.

**Step 3:** Commit the complete candidate on canonical `main`, push `origin/main`, and deploy the exact commit with `npx vercel --prod --yes`.

**Step 4:** Verify production `/`, `/voice/about`, `/writings`, `/hackathons`, `/robots.txt`, `/sitemap.xml`, and bounded chatbot questions from the real browser. Stop on the first failed boundary.

**Step 5:** Record the commit, deployment URL/ID, exact checks, known warnings, and release recommendation in the production receipt and active-worktree record; commit and push the receipt-only update.
