# Site Agent quality automation receipt

Date: 2026-08-14  
Owner: Sathian  
Implementation commit: `c383049c5afb7e2a42b01b5ac605be6682f912c6`  
Workflow: [Site Agent Quality](https://github.com/SathianSrikrishnan/sathian-ai/actions/workflows/site-agent-quality.yml)

## Outcome

The chatbot now has one repeatable release gate and one bounded production monitor:

- Every push to `main` runs all unit tests, the 60-case offline evaluation, a production build, a frozen protected-preview deployment, a 10-case live canary, and the desktop/mobile browser verifier.
- Internal pull requests run the same protected-preview gate after the source checks pass.
- Every day at `13:17 UTC` (`09:17 America/Toronto` while daylight saving time is active), production runs the 60-case source gate and exactly three live smoke questions.
- A manual dispatch can run the same three questions or the full 10-case live canary.
- Receipts and browser screenshots are retained as GitHub Actions artifacts for 30 days.

## Security boundary

No secret value is stored in Git, logs, artifacts, or this receipt.

- `SITE_AGENT_TESTER_SECRET` creates short-lived, named test tokens accepted by the application rate-limit layer.
- `VERCEL_AUTOMATION_BYPASS_SECRET` lets the tester reach protected Vercel preview deployments without disabling preview protection.
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are encrypted GitHub Actions secrets used only to build and deploy the frozen preview.
- The automation-bypass credential is sent in the official `x-vercel-protection-bypass` request header.
- Live evaluation cases use question intent only. The production smoke cannot submit a note and stops after the first HTTP 429.
- The browser verifier intercepts its synthetic chat requests and proves note compose/cancel without storing or sending a note.

Vercel reference: [Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

## Proof

Authoritative release run: [GitHub Actions run 31817984661](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/31817984661)

- Unit tests: pass.
- Production build: pass.
- Offline evaluation: `60/60` pass; `48/48` useful-answer checks; `41/41` source checks; `21/21` trust checks; zero knowledge gaps.
- Protected-preview live canary: `10/10` pass; `9/9` useful-answer checks; `8/8` source checks; `2/2` trust checks; `1,154 ms` p95; zero knowledge gaps.
- Browser proof: pass on desktop and 390-pixel mobile; conversation memory, one action per answer, no homepage scroll jump, reset, note compose/cancel, and no horizontal overflow passed.

Authoritative production-monitor proof: [GitHub Actions run 31818575385](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/31818575385)

- Offline source gate: `60/60` pass with zero knowledge gaps.
- Production smoke: `3/3` pass; `3/3` useful-answer checks; `3/3` source checks; `759 ms` p95; zero knowledge gaps.
- Target: `https://sathian.ai`.
- Questions covered current projects/web apps, latest writing, and latest Draw with Tanda release.

## Failure behavior and kill switch

The workflow fails closed on a failed quality gate, failed build, failed protected-preview case, browser assertion, production case, or rate limit. Push-run concurrency cancels superseded runs so rapid content updates do not create duplicate canaries.

To stop the recurring monitor without changing the application, disable the `Site Agent Quality` workflow in GitHub Actions or remove its `schedule` block. Revoking the Vercel automation-bypass credential stops protected-preview access. Neither action changes the public chatbot.

## Content-release contract

- New or changed public web app: update `src/content/site-projects.ts`; this drives project pages and public agent memory.
- New Draw with Tanda episode: update `src/content/site-releases.ts`; this drives the channel page, latest-release surface, and public agent memory.
- New article: Studio/database publication updates the writing page, but the current newest-writing agent card in `src/lib/public-profile.ts` must also be reviewed and updated in the same release.
- Pushes validate and deploy a protected preview. Production deployment remains an explicit approval step.

The next engineering milestone is a content-publication unifier that creates or updates reviewed public agent memory from a published article, project record, or video release and then runs the same gate. Until that exists, the checklist above is mandatory.

## Known operational cleanup

The current branch contains about `1.1 GiB` of tracked files, including roughly `876 MiB` under `public/story-assets`. This can slow a cold GitHub checkout. Moving already-hosted production media out of the Git tree is a separate preservation-first cleanup and requires an exact reviewed removal/migration plan; no assets were deleted in this work.
