# Sathian.ai release workflow

Last updated: 2026-08-10

## One active source

- Canonical website worktree: `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release`
- Release branch: `main`
- Production site: `https://sathian.ai`
- Do not edit or deploy from `C:\Users\sathi\Projects\sathian-ai\main`.

## Publish a Draw with Tanda episode

1. Publish the approved master to the official Tooth Fairy Network YouTube channel.
2. Verify the public watch page and copy the real YouTube video ID.
3. Add or update one record in `src/content/site-releases.ts`.
4. Set `status: 'published'` only when the watch page is public and the publication date and video ID are known.
5. Run the release-channel test. The homepage, Draw with Tanda page, structured data, and site-agent memory all update from the same registry.

## Release gate

```powershell
# Source / context:
# Sathian.ai canonical production release worktree

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
npm run test:unit
npm run build
git diff --check
```

The two commit hashes must match before release work begins. Preserve unrelated dirty or untracked files and stage only the intended release.

## Production release

Production deployment requires Sathian's explicit approval for that release.

```powershell
# Source / context:
# Tested Sathian.ai release after explicit production approval

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
git push origin main
npx vercel --prod --yes
```

After deployment, verify `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, `/hackathons`, `/robots.txt`, and `/sitemap.xml`. Update `ACTIVE-WORKTREE.md` with the production commit and deployment receipt.

## Measurement contract

GA4 and Vercel Analytics receive privacy-safe funnel events from `src/lib/site-analytics.ts`. They do not receive question text, contact details, filenames, or file contents. Use `docs/analytics/chatbar-measurement-exercise.md` for the post-release check.

The separate 08:00 Telegram analytics digest remains in the protected `codex/website-analytics-digest-20260719` worktree. Updating or deploying that Worker is a separate production release, not part of a website deploy.

## Cleanup rule

Do not delete a worktree merely because its branch is old. Remove it only after all three are true:

1. The worktree is clean.
2. Its commit is merged into `main`, or its unique work has been explicitly archived.
3. Sathian approves the exact removal list.
