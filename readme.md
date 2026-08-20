## Overview

Vital.site is the documentation and resource hub for Vital.sandbox — an open-source, high-performance sandbox built on Godot and powered by C++17 and Lua. It covers API references, scripting guides, the community vault, and the live server masterlist.

This repo is split into two independently deployed projects:

| Project | What it is | Deploys as |
|---|---|---|
| [`frontend`](./frontend) | Docs, marketing pages, vault UI — Next.js with Fumadocs, built as a fully static export | Static host (no server) |
| [`backend`](./backend) | Everything that needs a live server — Redis-backed masterlist, cached GitHub-backed endpoints | Normal Next.js server deployment |

The frontend has no API routes of its own beyond a build-time static search index; every other data need (masterlist, stats, contributors, vault, build info) is fetched client-side from the backend over `NEXT_PUBLIC_API_URL`.

## Getting Started

Each half has its own install, env vars, and dev server — see their individual readmes:

- **[`frontend/readme.md`](./frontend/readme.md)** — docs site setup, `NEXT_PUBLIC_API_URL`, static export/build
- **[`backend/readme.md`](./backend/readme.md)** — API service setup, Redis/Upstash config, CORS (`SITE_ORIGIN`), masterlist admin secret

To run the full site locally, start the backend first (defaults to `http://localhost:3001`), then the frontend (defaults to `http://localhost:3000`) — the frontend falls back to `http://localhost:3001` for `NEXT_PUBLIC_API_URL` if it isn't set, so a local backend is picked up automatically.

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site

cd backend && npm install && npm run dev
# in a second terminal
cd frontend && npm install && npm run dev
```

## Structure

```
Vital.site/
├── frontend/   # static docs + marketing site (Next.js, output: export)
└── backend/    # API service (masterlist, stats, contributors, vault, build)
```

See each project's own readme for a full breakdown of its internal structure.

## Deployment

The two projects deploy independently and don't share a build step:

1. Deploy `backend` first, as its own project — it needs `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `MASTERLIST_ADMIN_SECRET`, and `SITE_ORIGIN` (set to the frontend's eventual domain).
2. Note the backend's deployed URL.
3. Deploy `frontend` as its own static project, with `NEXT_PUBLIC_API_URL` set to that backend URL at **build time**.

Full details, including all env vars, are in each project's readme.

## Contributing

Documentation improvements, corrections, new guides, and API contributions are all welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes, open an issue first to align on scope before investing time in a draft.

Frontend content lives under `frontend/content/docs` as MDX. Backend routes follow the existing caching/rate-limit patterns in `backend/lib`. See each project's readme for specifics.

## License

GNU General Public License v3.0 — see [`frontend/license`](./frontend/license).
