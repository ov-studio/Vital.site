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

Create a `.env.local` file in this directory — it's already covered by `.gitignore`, so it will never be committed:

```dotenv
NEXT_PUBLIC_API_URL=""
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the deployed API service (e.g. `https://api.vital-sandbox.com`). Used for every client-side fetch — masterlist, stats, contributors, vault, build info. This is inlined into the JS bundle at **build time**, so it must be set before `npm run build` runs, not just present on the host at runtime. Falls back to `http://localhost:3001` for local development against a locally-running API. |

Redis credentials, the masterlist admin secret, and CORS config all live on the API service now — see its readme, not this one.

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

Outputs a fully static site to `out/`, ready to deploy to any static host. `NEXT_PUBLIC_API_URL` must be set in the build environment for this step — see above.

## Structure

| Path | Description |
|---|---|
| `configs` | Site-wide configuration files |
| `lib` | Content source adapter and shared utilities (`api_url` for reaching the backend) |
| `components` | Shared UI components |
| `app/(home)` | Landing page and top-level routes |
| `app/api/search` | Static search index, built at compile time and queried client-side — the only route here that isn't proxied to the backend |
| `app/docs` | Documentation layout and MDX pages |
| `content/docs` | MDX source files for all documentation |

## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes or new documentation sections, open an issue first to align on scope and approach before investing time in a draft.

All content lives under `content/docs` as MDX files and follows the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.
