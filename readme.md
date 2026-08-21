## Overview

Vital.site is the documentation and resource hub for Vital.sandbox — an open-source, high-performance sandbox built on Godot and powered by C++17 and Lua. It covers API references, scripting guides, the community vault, and the live server masterlist.

This repo is split into two independently deployed projects — see **[`frontend/readme.md`](./frontend/readme.md)** and **[`backend/readme.md`](./backend/readme.md)** for details on each.

## Getting Started

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site
python dev.py
```

`dev.py` installs dependencies automatically on first run, then starts backend (`:3001`) and frontend (`:3000`) together. `Ctrl+C` stops both.

For env var setup and deployment details, see each project's readme:

- **[`frontend/readme.md`](./frontend/readme.md)** — docs site setup, `NEXT_PUBLIC_API_URL`, static export
- **[`backend/readme.md`](./backend/readme.md)** — API service setup, Redis/Upstash config, masterlist admin secret

## Structure

- **`frontend/`** — static docs + marketing site (Next.js, output: export)
- **`backend/`** — API service (masterlist, stats, contributors, vault, build)
- **`shared/`** — CSS, config, and utilities synced into both projects at build time
- **`dev.py`** — development launcher

## Deployment

The two projects deploy independently:

1. Deploy `backend` first — it needs `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `MASTERLIST_ADMIN_SECRET`.
2. Note the backend's deployed URL.
3. Deploy `frontend` as a static project. On Vercel, `NEXT_PUBLIC_API_URL` is resolved automatically from the deployment hostname — no manual config needed for production. Set it explicitly only if deploying elsewhere.

Full details, including all env vars, are in each project's readme.

## Contributing

Pull requests are welcome. For larger structural changes, open an issue first. See each project's readme for specifics on content conventions and route patterns.