## Overview

Official documentation and resource hub for Vital.sandbox — covering API references, scripting guides, and everything needed to build with confidence.

Vital.site is built on Next.js and powered by Fumadocs, providing a fast, searchable, and version-aware documentation experience. All content is authored in MDX, keeping docs close to the codebase and easy to contribute to. This is the **frontend half** of the project: a fully static export (`output: 'export'`) with no server-side rendering and no API routes of its own beyond a build-time search index. Everything that needs a live server — masterlist, GitHub-backed stats, vault data — is served by the sibling [`Vital.site-api`](../backend) project and fetched client-side.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/frontend
npm install
```

### 2. Configure environment variables

No environment variables are required to deploy this to Vercel. The API's base URL is resolved automatically by `lib/api_url.ts` at both build time and in the browser:

- On Vercel, it reads the `VERCEL_PROJECT_PRODUCTION_URL` (falling back to `VERCEL_URL`) system environment variable — set automatically by Vercel on every deployment, on every plan including Hobby, no dashboard configuration needed — and requests `https://api.<that host>`. So a production deploy on `vital-sandbox.com` automatically points at `https://api.vital-sandbox.com`.
- In the browser, it derives the same thing from `window.location.hostname`, so it self-corrects even if the build-time value is ever stale.
- Locally (`npm run dev`), with no Vercel env present, it falls back to `http://localhost:3001`.

If you ever need to point at something other than `api.<host>` — a separate staging API, for instance — you can still override it with a `.env.local` file (already covered by `.gitignore`):

```dotenv
NEXT_PUBLIC_API_URL=""
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Manual override for the API base URL (e.g. `https://api.vital-sandbox.com`). Only needed if the automatic `api.<current host>` detection isn't correct for your setup. Inlined into the JS bundle at **build time** when set. |

Redis credentials, the masterlist admin secret, and CORS config all live on the API service now — see its readme, not this one. Note the API's CORS is locked to a single allowed origin (`https://vital-sandbox.com`), so this auto-detection is most useful for the real production domain; preview/`*.vercel.app` deployments will still be CORS-blocked unless the API's allowed origin is widened.

### 3. Run the dev server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally. Changes to MDX files and components hot-reload automatically. For masterlist/stats/vault data to load locally, the API service needs to be running too (defaults to `http://localhost:3001`).

### 4. Build for production

```bash
npm run build
```

Outputs a fully static site to `out/`, ready to deploy to any static host. No environment variables need to be set for this step — see above.

## Structure

| Path | Description |
|---|---|
| `configs` | Site-wide configuration files |
| `lib` | Content source adapter and shared utilities (`get_api_url` — resolves both the API base URL and the site's own URL, used for reaching the backend and by `layout.tsx`/`robots.ts`/`sitemap.ts`) |
| `components` | Shared UI components |
| `app/(home)` | Landing page and top-level routes |
| `app/api/search` | Static search index, built at compile time and queried client-side — the only route here that isn't proxied to the backend |
| `app/docs` | Documentation layout and MDX pages |
| `content/docs` | MDX source files for all documentation |

## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes or new documentation sections, open an issue first to align on scope and approach before investing time in a draft.

All content lives under `content/docs` as MDX files and follows the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.
