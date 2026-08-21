## Overview

Official documentation and resource hub for Vital.sandbox — covering API references, scripting guides, and everything needed to build with confidence.

Built on Next.js and powered by Fumadocs. All content is authored in MDX. This is the **frontend half** of the project: a fully static export (`output: 'export'`) with no server-side rendering and no API routes of its own beyond a build-time search index. Everything that needs a live server — masterlist, GitHub-backed stats, vault data — is served by the sibling [`backend`](../backend) project and fetched client-side.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/frontend
npm install
```

### 2. Configure environment variables

No environment variables are required to deploy to Vercel. The API base URL is resolved automatically by `shared/lib/api_url.ts`:

- On Vercel, it reads `VERCEL_PROJECT_PRODUCTION_URL` (falling back to `VERCEL_URL`) — set automatically on every deployment — and requests `https://api.<that host>`.
- In the browser, it derives the same from `window.location.hostname`.
- Locally, with no Vercel env present, it falls back to `http://localhost:3001`.

If you need to point at something other than `api.<host>`, override it with a `.env.local` file (already in `.gitignore`):

```dotenv
NEXT_PUBLIC_API_URL=""
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Manual override for the API base URL. Only needed if the automatic `api.<host>` detection isn't correct for your setup. Inlined into the bundle at **build time** when set. |

Note: the backend's CORS is locked to `https://vital-sandbox.com`, so preview deployments on `*.vercel.app` will be CORS-blocked unless the backend's allowed origin is widened.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For masterlist, stats, and vault data to load locally, the backend needs to be running too (defaults to `http://localhost:3001`).

### 4. Build for production

```bash
npm run build
```

Outputs a fully static site to `out/`, ready to deploy to any static host.

## Structure

- **`app/(home)`** — landing page
- **`app/docs`** — documentation layout and MDX pages
- **`app/vault`** — vault browser UI
- **`app/roadmap`** — roadmap page
- **`app/tos`** — terms of service page
- **`app/api/search`** — static search index, built at compile time and queried client-side
- **`app/og`** — OG image generation for docs pages
- **`components`** — shared UI components
- **`configs`** — page-level configuration (footer, home, roadmap, tos, vault)
- **`content/docs`** — MDX source files for all documentation
- **`lib`** — shared utilities (`source.ts`, `cn.ts`, `layout.shared.tsx`)

## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes, open an issue first.

All content lives under `content/docs` as MDX files, following the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.