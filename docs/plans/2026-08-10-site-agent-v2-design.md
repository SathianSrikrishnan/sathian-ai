# Site Agent v2 product design

Date: 2026-08-10
Decision owner: Sathian Srikrishnan
Decision: optimize for both discovery and qualified connection by detecting visitor intent.

## Product promise

Sathian's site agent is the front door to Digital Experiments. It helps a visitor understand Sathian's public work, find the most relevant project or writing, continue a coherent conversation, or deliberately leave a note. It never pretends to be Sathian, silently accesses private context, or performs an external action without confirmation.

The target is not a general-purpose assistant. It is a source-grounded public concierge with a small set of high-trust actions.

## Visitor jobs

The agent detects and serves five intents:

1. **Discover**: understand who Sathian is and what he is building.
2. **Explore**: compare projects, follow a topic, or find relevant writing.
3. **Follow up**: ask a pronoun-heavy or abbreviated question that depends on the current conversation.
4. **Connect**: compose and deliberately send Sathian a qualified note, optionally with reply details.
5. **Recover**: clarify ambiguity, disclose a knowledge gap, or route the visitor to a human-safe next step.

Discovery and connection are both valid outcomes. The agent chooses the next action from the visitor's demonstrated intent rather than forcing every conversation into lead capture.

## Product boundaries

- Public pages, verified project registries, approved public-memory cards, and published writing are eligible context.
- Local second-brain files, family information, client information, credentials, unpublished plans, and private conversation history are never eligible by default.
- Anonymous conversation state is session-scoped and short-lived. It must not become cross-visitor memory.
- The model may propose an action, but the application owns action authorization, validation, confirmation, execution, and receipts.
- Unknown or weakly supported answers must become a clarification or an honest knowledge-gap response.

## Architecture

```text
Visitor message
    -> explicit UI mode (question or note)
    -> safety and intent policy
    -> short-lived conversation context
    -> hybrid retrieval over approved public sources
    -> reranked evidence bundle
    -> structured model response
    -> claim-linked sources and one recommended action
    -> analytics + evaluation trace without raw private content
```

### Canonical content

Public project facts live in typed registries under `src/content`. The homepage, project pages, metadata, and public agent all import those records. Published writing continues to come from the reviewed article source. Supabase `public_memory_cards` remains the approval layer for additional facts, with status, visibility, source, and validity dates.

No crawler or repository sync may automatically make content public. A source must already be public or explicitly approved before ingestion.

### Retrieval

Phase 1 adds complete registry-backed cards and durable aliases. Phase 3 replaces substring-only matching with hybrid retrieval:

- lexical/full-text score;
- embedding similarity;
- metadata filters for status, visibility, project, source type, and validity;
- reranking of the top candidates;
- minimum evidence threshold;
- clarification when two plausible subjects remain.

The answer generator receives only the top evidence bundle, not the full public memory.

### Conversation state

Phase 2 introduces an anonymous session identifier and a bounded rolling context of the last six turns, expiring after 30 to 60 minutes. Contact details and note contents remain in the separate intake path. Conversation state may contain visitor questions and public answers but is not durable personal memory.

### Structured response

The server returns a validated object with:

- `intent`;
- `answer`;
- `citations` tied to approved source IDs;
- `confidence`;
- optional `clarifyingQuestion`;
- optional `nextAction`;
- optional `handoff`;
- public-safe capability and receipt fields.

The browser renders only validated links. It never invents a URL from model text.

## Confirmed actions

The first controlled action is note intake:

1. Visitor chooses “leave a note.”
2. The interface enters note mode without sending anything.
3. Visitor writes the actual note and optionally adds reply details.
4. Visitor explicitly sends it.
5. The server stores it through the existing intake policy.
6. The interface returns the real receipt.

Later actions may recommend or open a public destination, subscribe a consenting visitor, or request scheduling. Every state-changing action requires explicit confirmation and a receipt.

## Quality and evaluation system

Builder and tester are separate roles.

- The **builder agent** changes code, content registries, tests, and documentation.
- The **tester agent** receives a frozen commit or URL, performs read-only evaluation, and must not fix what it finds.
- The **release agent** checks the tester receipt, verifies the canonical worktree, and deploys only after Sathian's explicit approval.

The canonical evaluation set grows from the current ten questions to at least fifty cases across project coverage, multi-turn follow-ups, unknowns, privacy attacks, note flow, mobile behavior, citations, and rate limiting. Every case records expected intent, required facts, required or forbidden sources, allowed actions, and severity.

Release thresholds:

- 100% on privacy and action-confirmation cases;
- at least 95% correct source selection;
- at least 90% useful-answer score;
- no invented facts or URLs;
- successful receipt for the confirmed note path;
- no critical accessibility or mobile failures;
- p95 answer latency under four seconds, excluding controlled provider degradation.

Tester receipts live under `docs/analytics/site-agent-evals/` and include commit, target, dataset version, counts, failures, evidence, analytics observations, and a release recommendation.

## Sathian's responsibilities

Sathian should not manage implementation details. He is asked to do only four things:

1. Confirm a public fact only when no authoritative public source exists.
2. Review the tester receipt, especially critical failures and knowledge gaps.
3. Perform a three-minute acceptance check using one discovery question, one follow-up, and one unsent note draft.
4. Explicitly approve or decline the production release.

Everything else is delegated to the builder, tester, and release workflow.

## Phases

### Phase 1: trust and coverage

- Correct note-mode behavior.
- Registry-backed AutoQuote, Solana, ClinicalGuard, writing, and current-work knowledge.
- Useful retry information and a protected tester path.
- Feedback events and GA4 conversion definitions.
- Reusable tester contract and receipt format.

### Phase 2: session context

- Short-lived anonymous conversation state.
- Follow-up resolution and clarifying questions.
- Session reset and privacy disclosure.
- Multi-turn evaluation cases.

### Phase 3: hybrid retrieval and citations

- Embeddings plus full-text search and metadata filters.
- Reranking and confidence thresholds.
- Structured, claim-linked citations.
- Automated public-source freshness checks.

### Phase 4: evaluation flywheel

- Fifty-plus versioned evaluation cases.
- Builder-independent test execution.
- Pre-release quality gate and trend report.
- Unanswered-question and content-gap queue in Studio.

### Phase 5: controlled actions

- Intent-specific recommendations.
- Confirmed subscription or scheduling handoff where approved.
- Tool authorization, idempotency, receipts, and rollback behavior.
- Outcome reporting for discovery and connection.

## Success measures

- Discovery conversion: a useful answer followed by a relevant source or project open.
- Connection conversion: a deliberately composed note with a valid receipt.
- Conversation success: visitor confirms usefulness or stops without an error/escalation.
- Knowledge health: decreasing unknown and wrong-source rates over time.
- Trust: zero unconfirmed actions, private-context leaks, invented URLs, or false delivery claims.

