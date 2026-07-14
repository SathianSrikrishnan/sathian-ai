# Public Agent Operations Runbook

## Scope

This runbook covers the public site agent, visitor intake, quarantined attachments, Telegram delivery, retention review, and the private Studio control room.

The current release candidate is local only. The retention schedule is disabled and remains behind explicit approval. No migration, secret, external destination, or production deployment is activated by this work.

## Operating boundaries

- The public agent answers only from reviewed public-memory cards.
- Deterministic policy runs before model, intake, or tool access.
- Visitor messages and files are private operational records. They never become public-memory context automatically.
- File contents are not summarized, embedded, sent to a model, or forwarded to Telegram.
- Studio pages and Studio APIs require an allowlisted account at AAL2.
- The Telegram worker receives a short preview and cleared metadata only. It never receives raw attachment bytes.

## Studio signals

Studio exposes three content-free signals under **Agent operations**:

1. **Model errors (24h):** count of `agent_answer_model_failed` audit events in the previous 24 hours.
2. **Delivery backlog:** count of Telegram outbox rows in `pending`, `processing`, or retryable `failed` state.
3. **Blocked uploads:** count of attachment rows in `rejected` state.

Operational model logs contain only `event` and `error_code`. Telegram batch logs contain only `event`, batch count, and status counts. Message content is never written to operational logs.

## Retention dry run

The read-only report is available to an authenticated Studio operator at:

`GET /api/studio/retention`

The route repeats the AAL2 check. It selects only:

- anonymous sessions whose `retention_until` is at or before the report cutoff;
- quarantined objects whose `retention_until` is at or before the report cutoff.

The report includes `cutoff`, `selected`, `deleted`, `failures`, and `auditEventWritten`. In dry-run mode, `deleted` must be empty and `auditEventWritten` must be false.

Local contract evidence recorded on 2026-07-14:

- two expired fixture targets selected;
- zero records deleted;
- zero audit writes attempted;
- a failed object remained eligible on the next run with its original retention timestamp;
- the related session was held until object cleanup could succeed.

## Approval gate for cleanup

Do not add or enable a schedule until Sathian has reviewed a real AAL2 dry-run report and explicitly approved cleanup activation.

Before requesting that approval, confirm:

- the report contains only generated identifiers, object paths, timestamps, target types, and counts;
- no visitor message, email, original filename, file bytes, or model prompt appears;
- every object selected for deletion belongs to the private quarantine bucket;
- an object failure holds its parent session for retry;
- no failure updates or extends `retention_until`;
- successful cleanup writes `agent_retention_cleanup_completed` with counts only;
- rollback and service-owner contact details are ready.

The current Studio retention route has no execution method. The destructive repository adapter and schedule are intentionally not wired.

## Failure and retry behavior

- Object deletion runs before session deletion.
- If object deletion fails, report `retention_object_delete_failed` and leave the record eligible for retry.
- Hold the parent session with `retention_object_cleanup_incomplete` until all selected objects are cleared.
- If session deletion fails, report `retention_session_delete_failed` and retry without changing retention.
- If the audit write fails, report `retention_audit_write_failed`. Treat the run as incomplete and investigate before another activation attempt.
- Never include provider errors, storage errors, object paths, visitor text, or filenames in logs.

## Incident checks

### Model errors rise

1. Confirm the count and its 24-hour window in Studio.
2. Check only the structured `agent_answer_model_failed` events and their fixed error codes.
3. Confirm visitors still receive the safe fallback and valid intake receipts remain independent.
4. Disable the answer-model adapter if private-boundary behavior is uncertain. Keep intake off as well if its persistence boundary is uncertain.

### Delivery backlog grows

1. Check pending, processing, and failed counts.
2. Confirm stale processing leases can be reclaimed and attempt limits remain enforced.
3. Confirm dead-letter events are visible and do not loop.
4. Do not print Telegram tokens, message previews, visitor text, or destination identifiers while debugging.

### Blocked uploads rise

1. Review rejection reason codes, declared type, detected type, and byte size only.
2. Do not open pending or rejected objects.
3. Confirm pending objects are never summarized, embedded, rendered, or forwarded.
4. If byte checks are uncertain, disable file intake and preserve text intake only.

## Verification

```powershell
# Source / context:
# Public Agent Portal retention, observability, and privacy verification

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\public-agent-portal"

# Commands:
npm run test:unit -- tests/unit/retention.test.ts tests/unit/agent-observability.test.ts tests/unit/agent-policy.test.ts tests/unit/agent-message-route.test.ts
npx playwright test tests/public-agent-red-team.spec.ts --config=playwright.agent.config.ts
npx playwright test tests/studio-control-room.spec.ts --config=playwright.studio.config.ts
```

The agent browser configuration starts the production server and therefore requires a fresh production build first. Load the approved local environment in memory for that build. Do not copy or print its values.

## Rollback

No live rollback is required for this local slice.

For a later approved activation:

1. Disable the cleanup schedule first.
2. Leave the dry-run route available for diagnosis.
3. Stop file intake if quarantine integrity is uncertain.
4. Keep the safe model fallback active only if its deterministic boundary remains verified.
5. Revert the activating release through the normal deployment rollback path.
6. Preserve content-minimized audit events. Do not export visitor records into incident chat or logs.
