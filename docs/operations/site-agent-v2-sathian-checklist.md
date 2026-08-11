# Site Agent v2: Sathian's three-minute acceptance check

Use this only after the builder and independent tester have both produced green receipts for the same frozen commit. It is the final human product check, not a substitute for automated or independent testing.

## Before starting

- Open the candidate URL named in the tester receipt.
- Confirm the receipt recommendation has no critical or high findings.
- Do not enter private information or a real contact address.

## Minute 1: discovery

Ask:

> What is Sathian building now, and which project should I open if I am interested in trustworthy AI agents?

Pass when the answer is concise, names the relevant current public work, explains why the recommendation fits, and links only to a real public source.

## Minute 2: follow-up

Without refreshing, ask:

> How is that different from the Solana project?

For Phase 1, record whether the agent asks for clarification or guesses. For Phase 2 and later, pass only when it correctly understands what “that” refers to or asks a useful clarifying question.

## Minute 3: unsent note

Click **I want to leave Sathian a note**.

Pass when the composer clearly changes to note mode, no message is sent, no receipt appears, and **Cancel** returns to question mode. Do not submit the draft during this check.

## Decision

Reply to the release agent with one of these exact outcomes:

- `ACCEPT <commit>` — the candidate feels clear, truthful, and useful.
- `HOLD <commit>: <one-sentence reason>` — something material needs correction.

Only `ACCEPT` authorizes the release agent to request or perform the separately approved production deployment.
