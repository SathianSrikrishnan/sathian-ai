# Legacy route inventory

Date: 2026-08-10

This is a conservative search and navigation cleanup. No application route or user data was deleted.

## Keep indexed

- `/`
- `/hackathons`
- `/writings`
- `/writings/*`
- `/projects/tooth-fairy-network/draw-with-tanda`
- `/projects/clinicalguard`

## Keep available, omit from the sitemap

- `/agents` — machine-readable public context and dated build receipts
- `/links` — complete personal and TFN social-link inventory
- `/studio/*` — private publishing control room; crawler-blocked
- `/unsubscribe` — transactional utility

## Redirect

- `/about` → `/`
- `/automation` → `/#agent`
- `/btc-atlas` → `https://btc.sathian.ai`

## Keep functional, remove from the personal search surface

- `/animation/*`
- `/voice/*` — retired; redirects to the public site agent at `/#agent`.
- `/tooth/*`
- `/toothfairy/*`

These paths are prototypes, historical product surfaces, or routes still used by the separate Tooth Fairy Network host. They are disallowed only in the personal-domain robots policy. Tooth Fairy Network's own crawler map remains intact.

## Next cleanup gate

After 30 days of GA4/Search Console evidence, delete or permanently redirect only routes with no active inbound links, no meaningful traffic, and no current product dependency.
