# Sathian.ai Hackathon Portfolio Security Review — 2026-07-26

## Scope

This review covers the public `sathian.ai` application and the release that adds the hackathon portfolio entries, the AgentTab essay, and the workshop-styled site agent on inner pages.

## Checks completed

- No `.env` files are tracked by Git.
- A tracked-file scan found no private keys, OpenAI-style secret keys, or PEM private-key blocks.
- The public site returns:
  - `Strict-Transport-Security: max-age=63072000`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - a restricted `Permissions-Policy`
- The unused `@crossmint/client-sdk-react-ui` dependency was removed. The preserved Crossmint server integration uses direct server-side requests, and its public mint route remains disabled.
- Standard non-breaking dependency updates were applied with `npm audit fix`; no forced or major upgrades were used.
- Production dependency audit after cleanup: 0 critical, 9 high, 30 moderate, 15 low.
- Unit tests: 253 passed.
- TypeScript check: passed.
- Production build: passed with build-time placeholder values only. No real credentials were copied into the release worktree.

## Residual risks

The audit still reports high-severity advisories in Next.js 14 and parts of the legacy Solana/Metaplex stack. The available Next.js remediation is a breaking major upgrade to Next.js 16; two Solana findings currently have no automated fix. These require a separate migration and product regression pass.

This review reduces known exposure but is not a guarantee that the site has no vulnerabilities. The next security project should upgrade Next.js, then isolate or remove public-site wallet dependencies that are no longer required.
