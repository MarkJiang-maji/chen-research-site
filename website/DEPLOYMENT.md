# Cloud deployment and data preservation

## Services

- Public frontend repository: https://github.com/MarkJiang-maji/chen-research-site
- Production hostname: `research.tarwick.com`
- Worker: `chen-research-site`
- Worker preview: https://chen-research-site.chiang142536.workers.dev
- Existing data service: `chen-price-volume-research.poetic-wren-7342.chatgpt.site`

The frontend Worker serves the HTML built from this repository. It forwards `/api/*`, `/workspace`, `/legacy`, and `/_data/*` to the existing data service. Passwords, sessions, uploaded files, snapshots and editable research documents remain in that service. Do not delete or replace it when deploying this repository.

## Current delivery status

The official GitHub App installation is restricted to this public repository. Cloudflare Workers Builds is connected to `main` using the approved `chen-research-site cloud builds` deployment token. The token is stored by Cloudflare; no token value is committed here or copied into GitHub.

Push-triggered cloud deployment and the production hostname were verified on 2026-10-20. The existing research CNAME target is preserved and its proxy is enabled; `research.tarwick.com/*` routes to this Worker. The original data backend remains unchanged. The configured production route uses tarwick.com's explicit zone ID to avoid a zone-name lookup during deployment.

## Git deployment settings

Use Cloudflare Workers Builds with repository `MarkJiang-maji/chen-research-site`, production branch `main`, root directory `/`, build command `npm run build`, and deploy command `npx wrangler deploy`. Cloudflare installs the pinned npm dependencies from `package-lock.json`. The `prebuild` script runs the tests and frontend/Worker JavaScript syntax checks before compiling. Build or test failures stop deployment. Preview branch builds are disabled; production follows `main`.

A GitHub Actions workflow independently runs the merge tests and build. `/release.json` reports the commit actually served by the frontend. A successful GitHub check alone does not prove that Cloudflare deployed the commit; compare this endpoint with the repository's main HEAD.

## Content editing

Edit `website/data/content.json` and `website/data/reports.json` in GitHub or a cloud editor, then commit to `main`. Edit JavaScript and CSS in `website/src/` to change the interface. No local computer is required for production builds.

The website's online editor continues to save to the existing backend. It does not automatically commit to GitHub. The browser performs a three-way merge using the original `*-base.json` files and saved `_githubBase` metadata. Independent repository edits appear while cloud edits are retained. A same-field conflict keeps the cloud edit. New report IDs from either source are retained. Do not reset the base files or reuse report IDs for unrelated reports.

Repository changes become persistent backend edits only if an authenticated editor saves them. Before a conflicting content change, review the online editor and reconcile the desired text deliberately.

## Rollback

Roll back frontend code through a Git revert on `main` or a Cloudflare Worker deployment rollback. This does not roll back research documents stored in the backend.

To return traffic entirely to the original Sites frontend, remove only the `research.tarwick.com/*` Worker route and restore the previous DNS proxy state if required. The prior DNS proxy state was DNS-only. Keep the existing hostname's CNAME target and original Sites custom-domain binding. Do not delete research data or change unrelated `tarwick.com` records.

## Verification

Before and after a routing change, compare the file inventory, snapshot, presentation, content and reports with the preserved baseline. Verify existing-password login, authenticated session and logout, and a partial audio read. Verify `/release.json` against the GitHub commit after a push-triggered build. The local audit folder is intentionally excluded from the public repository.

The deployment token was explicitly approved and is retained only by Cloudflare. Manage its lifecycle in Cloudflare; never commit its value to this repository. The original Sites project still hosts the data API, uploaded files and history, so keep it active.
