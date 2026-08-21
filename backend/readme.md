## Overview

API service for Vital.sandbox — every route that needs a live server lives here. This is the **backend half** of the project: a normal Next.js deployment (no static export), split out so the docs/marketing frontend can ship as a fully static site.

Hosts the Vital.sandbox **masterlist** (a live server directory backed by Upstash Redis) along with cached GitHub-backed endpoints for build info, contributors, stats, and vault resources.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/backend
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in this directory (already in `.gitignore`):

```dotenv
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
MASTERLIST_ADMIN_SECRET=""
MASTERLIST_STRICT_IP=false
```

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes* | REST endpoint for your Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes* | REST token for the same database. |
| `MASTERLIST_ADMIN_SECRET` | Yes | Bearer secret required to call `POST /masterlist/register`. Generate a long random value (e.g. `openssl rand -hex 32`). |
| `MASTERLIST_STRICT_IP` | No | When `true` (default in production), a heartbeat is rejected if the server's IP doesn't match the IP it registered with. Set to `false` locally — localhost and tunnels rarely present a stable matching IP. |

<sub>* If Redis isn't configured, the service still starts — masterlist and rate-limiting endpoints respond as unavailable and log a warning instead of crashing.</sub>

**Getting your Upstash credentials:**

1. Create a free database at [upstash.com](https://upstash.com).
2. Open the database → **REST API** tab.
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into `.env.local`.

### 3. Run the dev server

```bash
npm run dev
```

Starts on [http://localhost:3001](http://localhost:3001). Point the frontend's `NEXT_PUBLIC_API_URL` here when developing locally (it falls back to this automatically if the env var isn't set).

### 4. Deploy

1. Deploy this folder as its own project, separate from the frontend.
2. Set the env vars above — `MASTERLIST_ADMIN_SECRET` in particular.
3. Note the deployed URL and set it as `NEXT_PUBLIC_API_URL` in the frontend's build environment.

## Structure

- **`lib`** — Redis client, in-memory cache wrapper, and rate-limit helper
- **`app/build`** — latest client/server download links, GitHub Releases-backed and cached
- **`app/stats`** — aggregated repo stars/forks/issues/commits, GitHub-backed and cached
- **`app/contributors`** — contributor list across repos, GitHub-backed and cached
- **`app/vault`** — proxies `Vital.vault`'s resource index, cached
- **`app/vault/tree`** — proxies the vault repo's git tree for per-resource zip downloads, cached
- **`app/masterlist`** — Redis-backed live server list (`GET`, plus `register`/`heartbeat` for server owners)
- **`app/og`** — OG image generation

## Contributing

Bug reports and pull requests for new or improved endpoints are welcome. Keep new routes consistent with the existing pattern: cache GitHub-backed data with `lib/api_cache`, and document any new env var here.

Rate limiting lives in `middleware.ts`, not in individual routes — add new cached GET routes to the `matcher` array there instead of calling `lib/ratelimit` from the route itself.