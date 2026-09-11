## Overview

Assets and configuration that are shared between `frontend` and `backend`. Nothing here runs directly — `sync.js` copies everything into both sibling projects at dev/build time, and both `.gitignore` files are updated automatically to reflect what was synced.

You should never edit the copies inside `frontend/` or `backend/` directly; edit here and let the sync propagate.

## Synced files

- **`app/global.css`** — global stylesheet, synced into both projects and also published to `frontend/public/cdn/global.css`
- **`app/theme.css`** — CSS custom properties (design tokens), synced into both projects and also published to `frontend/public/cdn/theme.css`
- **`app/site.tsx`** — shared site-level configuration consumed by both projects
- **`configs/staff.json`** — JSON array of lowercase GitHub logins that have staff access (approve/reject masterlist applications, direct mint). Editing this file in the deployed backend takes effect within ~10 seconds without a redeploy.
- **`lib/api_url.ts`** — utility for resolving the backend API URL from the deployment hostname

## CDN publishing

In addition to syncing into `frontend/` and `backend/`, `sync.js` copies `app/theme.css` and `app/global.css` into `frontend/public/cdn/`, and mirrors `frontend/ui/` into `frontend/public/cdn/ui/`. A `manifest.json` listing every published component and file is generated at `frontend/public/cdn/ui/manifest.json`. These CDN paths are what `Vital.kit` and `Vital.vault` load at runtime.

## Running the sync manually

`sync.js` is run automatically by the `predev` and `prebuild` hooks in both `frontend/package.json` and `backend/package.json`. To run it by hand:

```bash
node shared/sync.js
```

Run this from the repo root. It is also run once automatically by `dev.py` before starting the dev servers.
