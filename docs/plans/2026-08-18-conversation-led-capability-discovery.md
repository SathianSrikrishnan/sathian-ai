# Conversation-Led Capability Discovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the existing site agent and project registry into a small, truthful path from “I have a problem” to relevant proof and a qualified note to Sathian.

**Architecture:** Keep one canonical project registry and one site agent. Add a thin capability layer that groups reviewed proof projects by customer problem, states each boundary and current availability, and routes interested visitors into the existing receipt-backed note flow. Keep `/agents` as the machine-facing source and build record; do not create another chatbot, database, or standalone marketplace.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest, the existing site-agent answer pipeline, Vercel Analytics + GA4, and the existing release verification gate.

---

**Current status (2026-08-18):** The AutoQuote truth correction in Tasks 1–3 is implemented locally and covered by the v3 site-agent evaluation contract. The capability-layer build in Tasks 4–7 is intentionally not yet implemented or deployed.

## The idea in plain English

Today, the site mostly asks a visitor to understand Sathian's projects. The proposed change lets the visitor start with their own problem instead:

1. The visitor asks, “What could an agent take off my plate?”
2. The site agent offers three honest workflow patterns.
3. The visitor chooses one and sees a short explanation, a relevant proof project, and a clear limit.
4. If the pattern fits, the visitor can leave a note describing the real workflow they want help with.

This is not an agent store. It is a guided portfolio that can turn evidence into a useful customer conversation.

## What it takes

### First: correct the public record (roughly half a day)

- Keep AutoQuote Automator on the homepage as a **private research prototype with public evidence**.
- Remove the false Brave AI Hackathon and “current featured build” claims from the hackathon record.
- Say what is genuinely public: the market map, workflow design, privacy boundary, and redacted route observations.
- Say what is not available: live premiums, public personal data, insurer-form submission, purchase, or binding action.
- Teach the site agent the same approved wording through the existing project registry.

### Then: add the smallest useful capability layer (roughly one to two days)

- Add three reviewed capability-pattern records beside the existing project registry.
- Give each pattern a customer problem, useful outcome, proof-project IDs, boundary, availability, and note prompt.
- Add one high-intent suggestion to the existing site agent: **“What could an agent take off my plate?”**
- Return deterministic, reviewed answers for the capability menu and pattern selection.
- Reuse the existing proof links and note composer; do not build a second navigation surface or contact backend.

### Finally: measure whether it deserves to grow (roughly half a day)

- Track privacy-safe events for opening capability discovery, selecting a pattern, opening proof, starting a note, and sending a note.
- Review the first roughly 50 relevant visits.
- Expand only if visitors select patterns, inspect proof, and leave qualified notes. If they only click out of curiosity, keep the small version and stop.

## Initial capability patterns

| Visitor problem | Capability pattern | Existing proof | Honest boundary |
| --- | --- | --- | --- |
| “People keep asking the same questions about my work.” | Public knowledge guide | Sathian.ai site agent | Uses reviewed public context; it does not access private systems or act as Sathian. |
| “I need to turn scattered sources into a decision I can inspect.” | Evidence-backed research and intake | AutoQuote public research ledger; ClinicalGuard | AutoQuote is a personalized private prototype, not a quoting service. ClinicalGuard is a prior synthetic-data hackathon build, not a clinical system. |
| “A repeated workflow needs automation, controls, and receipts.” | Bounded workflow automation | AgentTab; AutoQuote workflow design | These projects prove approval, policy, and evidence patterns; they are not an off-the-shelf customer automation. |

Tooth Fairy Network remains the primary live product and broader product-building proof. It should not be forced into every capability answer.

## Benefit

- **For a prospective customer:** they can recognize their own problem before learning project names or agent terminology.
- **For Sathian:** the portfolio becomes a lightweight discovery interview that produces better inbound notes, not just page views.
- **For credibility:** every capability claim points to visible evidence and an explicit boundary.
- **For engineering:** the site keeps one registry, one agent, one note flow, one analytics helper, and one release gate.
- **For future work:** an improved AgentTab can later replace or strengthen its proof entry without requiring a new section or sales funnel.

## How Sathian can leverage it

1. Use the three patterns as the vocabulary in calls, posts, case studies, and project descriptions.
2. Watch which problem visitors choose; that is a better product signal than which project card gets the most clicks.
3. Use qualified notes to identify repeated demand. A repeated problem can become a walkthrough, a sanitized framework, a paid pilot, and only then a reusable product.
4. Keep private code private by default. Offer a private architecture walkthrough first; create a sanitized starter framework only after real repeated demand.
5. Plug future AgentTab improvements into the bounded-automation pattern as stronger proof rather than launching another disconnected site concept.

## What not to build yet

- No public marketplace or downloadable skill library.
- No second chatbot or separate “agent” backend.
- No customer accounts, saved workspaces, or self-serve deployment.
- No raw AutoQuote code download.
- No large visual catalogue until the conversational path produces qualified interest.
- No repurposing of `/agents`; it remains the machine-readable source map and public build record.

## Success and stop rules

The experiment earns another release when relevant visitors complete this chain:

`capability prompt → pattern selected → proof opened → qualified note started or sent`

After roughly 50 relevant visitors:

- **Continue:** repeated selection of one or more patterns plus proof opens and qualified notes.
- **Refine:** pattern selection occurs but proof or note intent is weak; improve the wording or proof match.
- **Stop:** interactions are mostly casual curiosity and produce no qualified note intent.

## Implementation tasks

### Task 1: Lock the AutoQuote truth contract in tests

**Files:**
- Modify: `tests/unit/site-agent-knowledge.test.ts`
- Modify: `tests/unit/hackathon-portfolio.test.ts`
- Modify: `tests/fixtures/site-agent-evals.json`
- Modify: `tests/fixtures/site-agent-phase-1-evals.json`
- Modify: `tests/browser/chatbot_focus_check.cjs`

**Step 1: Write the failing registry assertions**

Assert that AutoQuote has the `prototype` lifecycle, uses “private research prototype / public evidence” language, states that it was not submitted to a hackathon, and excludes live quoting, submission, purchase, and binding claims.

**Step 2: Write the failing hackathon assertion**

Assert that `/hackathons` contains only actual submissions and does not contain AutoQuote, the Brave AI Hackathon label, or the current-featured-build section.

**Step 3: Update evaluation expectations**

Require “private research prototype,” “not a quoting service,” and the public/private boundary; forbid “active public build,” “submitted to Brave,” and equivalent claims.

**Step 4: Run the focused tests and confirm RED**

Run: `npx vitest run tests/unit/site-agent-knowledge.test.ts tests/unit/hackathon-portfolio.test.ts tests/unit/site-agent-evaluation.test.ts`

Expected: failures because the source still labels AutoQuote as an active hackathon build.

### Task 2: Correct AutoQuote once in the canonical registry

**Files:**
- Modify: `src/content/site-projects.ts`
- Modify: `src/lib/agent/answer.ts`
- Test: `tests/unit/site-agent-knowledge.test.ts`
- Test: `tests/unit/agent-answer.test.ts`

**Step 1: Add the prototype lifecycle**

Extend `PublicProjectStatus` with `prototype`. Keep prototype projects out of `ACTIVE_SITE_PROJECTS` and `ARCHIVE_SITE_PROJECTS`; a prototype may remain intentionally featured.

**Step 2: Replace AutoQuote's approved public copy**

Use:

- Label: `PRIVATE RESEARCH PROTOTYPE / PUBLIC EVIDENCE`
- Description: `A personal Ontario auto-insurance research prototype. The public page shows the market map, workflow design, and redacted route observations; personal profile data and live form execution remain local.`
- CTA: `View the public research ledger`
- Boundary: not a quoting service; no live premiums, public personal data, insurer-form submission, purchase, or binding action.

**Step 3: Make lifecycle answers understand prototypes**

When asked whether AutoQuote is active, answer that it is a private research prototype with public evidence, not a current active build or archived submission.

**Step 4: Run focused tests and confirm GREEN**

Run: `npx vitest run tests/unit/site-agent-knowledge.test.ts tests/unit/agent-answer.test.ts`

Expected: all pass.

### Task 3: Restore the hackathon page as a truthful submission record

**Files:**
- Modify: `src/app/hackathons/page.tsx`
- Test: `tests/unit/hackathon-portfolio.test.ts`

**Step 1: Remove the AutoQuote feature section and unused link**

Keep AgentTab, Tooth Fairy Network, and ClinicalGuard in chronological order as documented submissions.

**Step 2: Rename the section**

Use `Hackathon submissions` with a short line explaining that these are documented builds completed under event constraints.

**Step 3: Run the page contract test**

Run: `npx vitest run tests/unit/hackathon-portfolio.test.ts`

Expected: pass.

### Task 4: Define a typed capability registry

**Files:**
- Create: `src/content/site-capabilities.ts`
- Create: `tests/unit/site-capabilities.test.ts`

**Step 1: Write a failing schema and relationship test**

Require each capability pattern to provide `id`, `name`, `customerProblem`, `outcome`, `proofProjectIds`, `boundary`, `availability`, and `notePrompt`. Require every proof ID to resolve through `SITE_PROJECTS`.

**Step 2: Run the new test and confirm RED**

Run: `npx vitest run tests/unit/site-capabilities.test.ts`

Expected: fail because the module does not exist.

**Step 3: Add the three reviewed records**

Create public knowledge guide, evidence-backed research and intake, and bounded workflow automation records using the table above.

**Step 4: Run the test and confirm GREEN**

Run: `npx vitest run tests/unit/site-capabilities.test.ts`

Expected: pass.

### Task 5: Teach the existing site agent the discovery path

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/public-profile.ts`
- Modify: `src/lib/agent/answer.ts`
- Modify: `tests/unit/agent-suggestions.test.ts`
- Modify: `tests/unit/agent-answer.test.ts`
- Modify: `tests/unit/site-agent-knowledge.test.ts`

**Step 1: Write failing suggestion and answer tests**

Replace the generic current-work suggestion with `What could an agent take off my plate?`. Assert that it returns the three capability patterns. Add deterministic selection tests for each pattern with proof, boundary, availability, and the existing note action.

**Step 2: Run focused tests and confirm RED**

Run: `npx vitest run tests/unit/agent-suggestions.test.ts tests/unit/agent-answer.test.ts tests/unit/site-agent-knowledge.test.ts`

Expected: failures for the missing suggestion and capability answers.

**Step 3: Add reviewed public memory cards**

Map `SITE_CAPABILITIES` into public memory with stable tags and proof sources. Do not use database-authored or visitor-authored claims.

**Step 4: Add deterministic routing**

Recognize the discovery prompt and each capability name. Return concise reviewed copy and one next action. Preserve normal follow-up context.

**Step 5: Reuse the note composer**

The pattern answer should invite a visitor to leave a note containing their real workflow and desired outcome. It must not store anything until the visitor deliberately sends the note.

**Step 6: Run focused tests and confirm GREEN**

Run the command from Step 2.

Expected: all pass.

### Task 6: Add privacy-safe conversion measurement

**Files:**
- Modify: `src/components/ChatWidget.tsx`
- Modify: `tests/unit/release-channel.test.ts`
- Modify: `tests/fixtures/site-agent-evals.json`

**Step 1: Write failing event-contract tests**

Require these events with fixed IDs only: `capability_discovery_opened`, `capability_pattern_selected`, `capability_proof_opened`, `capability_note_started`, and the existing note-sent event. Never send chat text, note text, email, or filenames.

**Step 2: Run the focused test and confirm RED**

Run: `npx vitest run tests/unit/release-channel.test.ts`

Expected: missing capability events.

**Step 3: Instrument existing interactions**

Reuse `trackSiteEvent`. Pass `capability_id`, `proof_project_id`, and page placement only.

**Step 4: Run the focused test and confirm GREEN**

Run the command from Step 2.

Expected: pass.

### Task 7: Verify the whole public story

**Files:**
- Modify as required: `tests/browser/public_surface_check.cjs`
- Modify as required: `tests/browser/chatbot_focus_check.cjs`
- Create: `docs/analytics/capability-discovery/README.md`

**Step 1: Add browser checks**

Verify that AutoQuote remains visible on the homepage with prototype language, is absent from `/hackathons`, and the capability prompt works at desktop and mobile widths without creating a second agent instance.

**Step 2: Run the full release gate**

Run: `npm run release:verify`

Expected: unit tests, 60-case offline evaluation, critical dependency audit, production build, desktop/mobile public surfaces, sound verification, and patch hygiene all pass.

**Step 3: Inspect the patch**

Run: `git status --short`

Run: `git diff --check`

Expected: only intended capability/truth-correction files plus previously existing unrelated untracked work.

**Step 4: Record the experiment**

Document event meanings, the roughly 50-relevant-visitor review threshold, and the continue/refine/stop decision rule. Do not record visitor text or contact details in analytics.

## Recommended execution boundary

Ship the AutoQuote truth correction first. Then implement Tasks 4–7 as one small capability-discovery release. Do not mix the separate AgentTab product improvement into this release; when that work becomes truthful public proof, update its existing registry record and capability relationship.
