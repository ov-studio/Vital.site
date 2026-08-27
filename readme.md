## Overview

The official documentation and resource hub for Vital.sandbox.

Vital.site covers the full API reference, scripting guides, the community vault, and the live server masterlist — everything needed to build with the sandbox from day one.

## Getting Started

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site
python dev.py
```

`dev.py` installs dependencies automatically on first run, then starts backend (`:3001`) and frontend (`:3000`) together. `Ctrl+C` stops both.

For env var setup and deployment details, see each project's readme:

- **[`frontend/readme.md`](./frontend/readme.md)** — docs site setup, static export
- **[`backend/readme.md`](./backend/readme.md)** — API service, Redis, GitHub OAuth

## Structure

- **`frontend/`** — static docs + marketing site (Next.js, output: export)
- **`backend/`** — API service (masterlist, stats, contributors, vault, build, auth)
- **`shared/`** — CSS, config, and utilities synced into both projects at build time
- **`dev.py`** — development launcher

## Deployment

1. Deploy `backend` first — `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, optional `STAFF_GITHUB_LOGINS`.
2. Deploy `frontend` as a static project. Backend URL is resolved from the deployment hostname.

## Contributing

Pull requests are welcome. For larger structural changes, open an issue first.
