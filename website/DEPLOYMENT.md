# Cloud deployment and data preservation

## Services

- Public frontend repository: https://github.com/MarkJiang-maji/chen-research-site
- Production hostname: `research.tarwick.com`
- Worker: `chen-research-site`
- Worker preview: https://chen-research-site.chiang142536.workers.dev
- Existing data service: `chen-price-volume-research.poetic-wren-7342.chatgpt.site`

The frontend Worker serves the HTML built from this repository. It forwards `/api/*`, `/workspace`, `/legacy`, and `/_data/*` to the existing data service. Passwords, sessions, uploaded files, snapshots and editable research documents remain in that service. Do not delete or replace it when deploying this repository.

## Current delivery status

The production hostname still uses the original Sites project. The preview Worker is deployed. The official GitHub App installation has been approved and completed, scoped only to this public repository. The native Workers Builds connection is paused before creating its deployment token: the dashboard default additionally grants account-wide storage and other resource permissions, so separate confirmation is pending. Production DNS and active Worker routes have not been changed; wrangler.jsonc contains the prepared production route. Until that is complete, Git pushes run checks but do not publish production.

## Git deployment settings

Use Cloudflare Workers Builds with repository `MarkJiang-maji/chen-research-site`, production branch `main`, root directory `/`, build command `npm run build`, and deploy command `npx wrangler deploy`. Cloudflare installs the pinned npm dependencies from `package-lock.json`.

A GitHub Actions workflow independently runs the merge tests and build. `/release.json` reports the commit actually served by the frontend. A successful GitHub check alone does not prove that Cloudflare deployed the commit; compare this endpoint with the repository's main HEAD.

## Content editing

Edit `website/data/content.json` and `website/data/reports.json` in GitHub or a cloud editor, then commit to `main`. Edit JavaScript and CSS in `website/src/` to change the interface. No local computer is required for production builds.

The website's online editor continues to save to the existing backend. It does not automatically commit to GitHub. The browser performs a three-way merge using the original `*-base.json` files and saved `_githubBase` metadata. Independent repository edits appear while cloud edits are retained. A same-field conflict keeps the cloud edit. New report IDs from either source are retained. Do not reset the base files or reuse report IDs for unrelated reports.

Repository changes become persistent backend edits only if an authenticated editor saves them. Before a conflicting content change, review the online editor and reconcile the desired text deliberately.

## Rollback

Roll back frontend code through a Git revert on `main` or a Cloudflare Worker deployment rollback. This does not roll back research documents stored in the backend.

To return traffic entirely to the original Sites frontend, remove only the `research.tarwick.com/*` Worker route and restore the previous DNS proxy state if required. Keep the existing hostname's CNAME target and original Sites custom-domain binding. Do not delete research data or change unrelated `tarwick.com` records.

## Verification

Before and after a routing change, compare the file inventory, snapshot, presentation, content and reports with the preserved baseline. Verify existing-password login, authenticated session and logout, and a partial audio read. Verify `/release.json` against the GitHub commit after a push-triggered build. The local audit folder is intentionally excluded from the public repository.
