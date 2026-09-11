## Overview

Assets and configuration shared between `frontend` and `backend`. Nothing here runs directly — `sync.js` copies everything into both sibling projects at dev/build time, and both `.gitignore` files are updated automatically.

Always edit files here, never inside `frontend/` or `backend/` directly.

## Synced files

- **`app/global.css`** — global stylesheet, synced into both projects
- **`app/theme.css`** — CSS custom properties (design tokens), synced into both projects
- **`app/site.tsx`** — shared site-level configuration
- **`configs/staff.json`** — GitHub logins with staff access (approve/reject masterlist applications). Changes take effect within ~10 seconds without a redeploy.
- **`lib/api_url.ts`** — resolves the backend API URL from the deployment hostname

## CDN publishing

`sync.js` also publishes `app/theme.css` and `app/global.css` to `frontend/public/cdn/`, and mirrors `frontend/ui/` into `frontend/public/cdn/ui/` with a generated `manifest.json`. These CDN paths are what `Vital.kit` and `Vital.vault` load at runtime.
