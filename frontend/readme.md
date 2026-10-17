## Overview

Official documentation and resource hub for Vital.sandbox — covering API references, scripting guides, and everything needed to build with confidence.

Built on Next.js and powered by Fumadocs. All content is authored in MDX. This is the **frontend half** of the project: a fully static export (`output: 'export'`) with no server-side rendering and no API routes of its own beyond a build-time search index. Everything that needs a live server — masterlist, GitHub-backed stats, vault data, news posts, benchmark results — is served by the sibling [`backend`](../backend) project and fetched client-side.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/frontend
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For masterlist, stats, vault, news, and benchmark data to load locally, the backend needs to be running too.

Shared links (`/vault/:id`, `/news/:slug`) are rewritten to the backend's share routes so link previews work. In production this is done by `vercel.json`; in dev, `next.config.ts` does the same.

### 3. Build for production

```bash
npm run build
```

Outputs a fully static site to `out/`, ready to deploy to any static host.

## Structure

Listed in the same order as the roadmap:

- **`app/(home)`** — landing page
- **`app/workspace`** — masterlist application portal (GitHub OAuth, staff approval UI — not indexed by search engines)
- **`app/benchmarks`** — scripting benchmark viewer (Lua vs GDScript, fetched from backend at runtime)
- **`app/vault`** — vault browser UI; shared resource links (`/vault/:id`) resolve through the backend
- **`app/news`** — news feed, posts are fetched live from the backend; shared post links (`/news/:slug`) resolve through the backend
- **`app/studio`** — brand asset exporter (OG images, logos, banners)
- **`app/docs`** — documentation layout and MDX pages
- **`app/api/search`** — static search index, built at compile time and queried client-side
- **`app/roadmap`** — roadmap page with auto-calculated completion scores
- **`app/tos`** — terms of service page
- **`app/og`** — brand link-preview (OG) images for every page and docs page
- **`components`** — shared UI components
- **`ui`** — generic UI primitives, mirrored to `public/cdn/ui/` for reuse by `Vital.kit` / `Vital.vault`
- **`configs`** — page-level configuration (pages, footer, home, roadmap, tos) plus shared configs synced from `shared/`
- **`content/docs`** — MDX source files for all documentation
- **`lib`** — shared utilities

## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes, open an issue first.

All content lives under `content/docs` as MDX files, following the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.
