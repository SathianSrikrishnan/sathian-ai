# Site Agent v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a source-grounded, context-aware site concierge that detects discovery or connection intent, produces independent tester receipts, and adds controlled actions only behind confirmation gates.

**Architecture:** Keep the existing public/private boundary and Supabase intake path. Move shared public project facts into typed registries, separate UI actions from question prompts, then add short-lived session state, hybrid retrieval, structured citations, automated evaluation, and narrowly scoped confirmed tools in successive release gates.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest, OpenAI API, Supabase/Postgres, GA4, Vercel.

---

## Release discipline

Work only in `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release`. Before each phase, fetch `origin/main` and confirm local `HEAD` matches it. Use TDD for every behavior change. A tester agent audits the frozen candidate and writes a receipt. Production deployment remains a separate explicit approval gate.

### Task 1: Establish the durable operating contract

**Files:**
- Create: `docs/plans/2026-08-10-site-agent-v2-design.md`
- Create: `docs/plans/2026-08-10-site-agent-v2-implementation.md`
- Create: `docs/operations/site-agent-v2-tester-contract.md`

**Step 1:** Record product decision C, public/private boundaries, phases, roles, release thresholds, and Sathian's four required interventions.

**Step 2:** Confirm all three documents name the canonical worktree and receipt directory.

**Step 3:** Run `git diff --check` and inspect the documentation diff.

**Step 4:** Commit the approved design and operating contract separately from behavior changes.

### Task 2: Make suggestions typed and keep note selection non-submitting

**Files:**
- Create: `src/lib/agent/suggestions.ts`
- Modify: `src/lib/constants.ts`
- Modify: `src/components/ChatWidget.tsx`
- Test: `tests/unit/agent-suggestions.test.ts`
- Test: `tests/unit/chat-surface.test.ts`

**Step 1: Write the failing test**

Test that `latest-release` resolves to a question submission and `leave-note` resolves to `compose_note` with no submitted message.

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/agent-suggestions.test.ts`
Expected: FAIL because the typed suggestion resolver does not exist.

**Step 3: Write minimal implementation**

Create typed suggestion records with stable IDs, labels, action kind, and optional question text. Use the resolver in the widget. Selecting `leave-note` changes composer state and focuses the input; it does not call the network send path.

**Step 4: Run tests to verify they pass**

Run: `npm run test:unit -- tests/unit/agent-suggestions.test.ts tests/unit/chat-surface.test.ts`
Expected: PASS.

**Step 5:** Commit `fix: require note composition before site-agent intake`.

### Task 3: Add an explicit note intent to the intake route

**Files:**
- Modify: `src/lib/agent/message-handler.ts`
- Modify: `src/components/ChatWidget.tsx`
- Test: `tests/unit/agent-message-handler.test.ts`

**Step 1: Write the failing test**

Submit `{ intent: 'note', message: 'Great project' }` and assert the handler persists an intake record without calling the answer model. Assert invalid intent values are rejected.

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/agent-message-handler.test.ts`
Expected: FAIL because explicit intent is ignored.

**Step 3: Write minimal implementation**

Validate `intent` as `question | note`. A valid explicit note sets the approved policy route to intake and appends an explicit-note reason code. The application still requires consent, idempotency, and a real visitor-written message.

**Step 4:** Make the note composer send `intent: 'note'`, then return it to question mode only after a successful receipt.

**Step 5: Run tests to verify they pass**

Run: `npm run test:unit -- tests/unit/agent-message-handler.test.ts tests/unit/chat-surface.test.ts`
Expected: PASS.

**Step 6:** Commit `feat: add confirmed note intent to site agent`.

### Task 4: Create canonical public project records

**Files:**
- Create: `src/content/site-projects.ts`
- Modify: `src/components/home/HomeClient.tsx`
- Modify: `src/lib/public-profile.ts`
- Test: `tests/unit/site-agent-knowledge.test.ts`
- Test: `tests/unit/homepage-relaunch.test.ts`

**Step 1: Write the failing tests**

Assert AutoQuote Automator, Solana Ecosystem Observatory, ClinicalGuard, writing, and the current project portfolio each produce a public-memory card with aliases, public source, and current status. Assert the homepage imports the same AutoQuote and Solana records.

**Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- tests/unit/site-agent-knowledge.test.ts tests/unit/homepage-relaunch.test.ts`
Expected: FAIL because those shared registry records do not exist.

**Step 3: Write minimal implementation**

Move the existing public AutoQuote and Solana presentation facts into typed project records. Reuse ClinicalGuard's existing release record. Add writing and current-work summary cards from published site destinations. Include common public aliases in tags.

**Step 4:** Import the records in both homepage and public-profile memory without changing visible layout.

**Step 5: Run tests to verify they pass**

Run: `npm run test:unit -- tests/unit/site-agent-knowledge.test.ts tests/unit/homepage-relaunch.test.ts tests/unit/agent-answer.test.ts`
Expected: PASS.

**Step 6:** Commit `feat: unify public project knowledge for the site agent`.

### Task 5: Improve throttling receipts and protect tester traffic

**Files:**
- Modify: `src/lib/agent/rate-limits.ts`
- Modify: `src/lib/agent/message-handler.ts`
- Modify: `src/app/api/agent/message/route.ts`
- Test: `tests/unit/agent-message-handler.test.ts`
- Test: `tests/unit/agent-rate-limits.test.ts`

**Step 1:** Write a failing test requiring a 429 response with a `Retry-After` header and public-safe retry metadata.

**Step 2:** Write a failing test for a signed, environment-configured tester claim that is validated server-side and cannot be enabled by a browser-only flag.

**Step 3:** Run both tests and confirm expected failures.

**Step 4:** Implement the minimal structured rate-limit result and HMAC-protected tester allowance. Do not disable global provider quotas or action limits.

**Step 5:** Run the focused tests, then the complete unit suite.

**Step 6:** Commit `feat: add observable site-agent throttling for trusted tests`.

### Task 6: Add visitor usefulness feedback

**Files:**
- Modify: `src/components/ChatWidget.tsx`
- Modify: `src/lib/site-analytics.ts`
- Test: `tests/unit/release-channel.test.ts`
- Test: `tests/unit/chat-surface.test.ts`

**Step 1:** Write failing tests for helpful/not-helpful controls on bot answers and privacy-safe reason codes.

**Step 2:** Confirm failures, implement one feedback action per answer, and emit no raw question or answer text.

**Step 3:** Run focused and full unit tests.

**Step 4:** Commit `feat: measure site-agent answer usefulness`.

### Task 7: Produce the independent Phase 1 receipt

**Files:**
- Read: `docs/operations/site-agent-v2-tester-contract.md`
- Create: `docs/analytics/site-agent-evals/<timestamp>-phase-1-receipt.md`

**Step 1:** Freeze the candidate commit and give it to a tester agent with read-only boundaries.

**Step 2:** Tester runs the fixed evaluation cases plus exploratory note, mobile, accessibility, source, and throttling checks.

**Step 3:** Parent verifies every claimed command, result count, and file path.

**Step 4:** Fix critical failures through new red-green cycles; do not let the tester edit the implementation.

**Step 5:** Record pass/fail recommendation and unresolved gaps.

### Task 8: Add Phase 2 short-lived conversation state

**Files:**
- Create: `src/lib/agent/conversation.ts`
- Modify: `src/lib/agent/types.ts`
- Modify: `src/lib/agent/prompt.ts`
- Modify: `src/app/api/agent/message/route.ts`
- Modify: `src/components/ChatWidget.tsx`
- Test: `tests/unit/agent-conversation.test.ts`
- Test: `tests/unit/agent-answer.test.ts`

Use TDD to add an anonymous session ID, bounded six-turn history, 30-to-60-minute expiry, reset control, pronoun-follow-up resolution, and clarification output. Keep note content outside conversational memory. Produce a separate Phase 2 tester receipt before release.

### Task 9: Add Phase 3 hybrid retrieval and structured citations

**Files:**
- Create: `src/lib/agent/retrieval.ts`
- Create: `src/lib/agent/response-schema.ts`
- Add: Supabase migration for approved-card search fields and vector index
- Modify: `src/lib/agent/answer.ts`
- Modify: `src/lib/agent/public-memory.ts`
- Test: `tests/unit/agent-retrieval.test.ts`
- Test: `tests/unit/agent-citations.test.ts`

Use TDD to combine lexical score, embedding similarity, metadata filters, reranking, and minimum confidence. Require citations to map to retrieved card IDs and validated public URLs. Ask a clarification instead of guessing when retrieval is ambiguous. Produce a Phase 3 tester receipt.

### Task 10: Add Phase 4 continuous evaluation

**Files:**
- Create: `tests/fixtures/site-agent-evals.json`
- Create: `scripts/run-site-agent-eval.mjs`
- Create: `src/lib/agent/evaluation.ts`
- Modify: `package.json`
- Create: `docs/analytics/site-agent-evals/README.md`

Grow the dataset to at least fifty versioned cases with expected intent, facts, sources, actions, and severity. Add local and candidate-URL modes, Markdown and JSON receipts, CI thresholds, and Studio knowledge-gap intake. Never include real visitor content in a committed fixture.

### Task 11: Add Phase 5 controlled actions

**Files:**
- Create: `src/lib/agent/actions.ts`
- Modify: `src/lib/agent/types.ts`
- Modify: `src/lib/agent/message-handler.ts`
- Modify: `src/components/ChatWidget.tsx`
- Test: `tests/unit/agent-actions.test.ts`

Introduce one action at a time. Each action requires a strict schema, server authorization, confirmation UI, idempotency, result receipt, failure state, and rollback or safe retry behavior. Start with public navigation and existing note intake. Subscription or scheduling requires separate scope and explicit production approval.

### Task 12: Release each phase

For each phase:

1. Run `npm run test:unit`.
2. Run `npm run build`.
3. Run `git diff --check` and confirm a clean candidate commit.
4. Obtain an independent tester receipt with no critical failures.
5. Ask Sathian to perform the three-minute acceptance check.
6. Ask Sathian for explicit production approval.
7. Push, deploy, verify public routes and analytics, then update `ACTIVE-WORKTREE.md`.

