# Supabase migration reconciliation receipt

- Date: 2026-08-13 (America/Toronto)
- Project: Sathian.ai production Supabase project
- Scope: reconcile the repository migration ledger, then apply the Site Agent context and evaluation-gap migrations

## Finding

The linked database contained six historical July migration files that were missing from the repository. Five repository migrations represented the same executed SQL under earlier timestamps, so a normal push correctly refused to continue.

## Evidence and reconciliation

The remote migration history was fetched into an isolated temporary audit project. Direct diffs established that each timestamp pair below was semantically identical; the only differences were comments or a redundant trailing semicolon.

| Repository version | Executed remote version |
| --- | --- |
| `20260723160000` | `20260723193441` |
| `20260723170000` | `20260723193502` |
| `20260723213000` | `20260723212958` |
| `20260723220121` | `20260723220231` |
| `20260723220314` | `20260723220408` |

The six remote source files, including `20260718154710_studio_control_room_truth.sql`, were restored to the repository. The five equivalent earlier versions were marked applied in migration history without replaying their SQL.

## Production migrations applied

- `20260811090000_refresh_site_agent_tfn_first.sql`
- `20260813213000_agent_evaluation_gaps.sql`

## Verification

- The linked local and remote migration lists now match through `20260813213000`.
- `agent_knowledge_gaps` is readable through the server role and initially contains zero rows.
- `tooth-fairy-network` is approved public memory.
- `sathian-ai-practice`, `btc-cultural-atlas`, and `lex-rooftop-garden` are retired public memory.
- No old schema migration was replayed and no public or private row was deleted.
