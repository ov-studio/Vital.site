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
MASTERLIST_STRICT_IP=false
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
STAFF_GITHUB_LOGINS=""
```

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes* | REST endpoint for your Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes* | REST token for the same database. |
| `MASTERLIST_STRICT_IP` | No | When `true` (default in production), a heartbeat is rejected if the server's IP doesn't match the IP it registered with. Set to `false` locally — localhost and tunnels rarely present a stable matching IP. |
| `GITHUB_CLIENT_ID` | Yes† | GitHub OAuth App client ID (staff mint UI). |
| `GITHUB_CLIENT_SECRET` | Yes† | GitHub OAuth App client secret. |
| `STAFF_GITHUB_LOGINS` | Yes† | Comma-separated GitHub usernames allowed to mint masterlist tokens via `/staff`. |

<sub>* If Redis isn't configured, the service still starts — masterlist, rate-limiting, and staff auth respond as unavailable and log a warning instead of crashing.</sub>

**Getting your Upstash credentials:**
1. Create a free database at [upstash.com](https://upstash.com).
2. Open the database → **REST API** tab.
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into `.env.local`.

**GitHub OAuth App (staff mint):**
1. Create an OAuth App at [GitHub Developer settings](https://github.com/settings/developers).
2. Homepage: frontend URL (e.g. `http://localhost:3000`).
3. Authorization callback URL: `http://localhost:3001/auth/github/callback` (prod: `https://api.<domain>/auth/github/callback`).
4. Put Client ID / secret and allowlisted logins in `.env.local`.

### 3. Run the dev server

```bash
npm run dev
```

Starts on [http://localhost:3001](http://localhost:3001) — the frontend picks this up automatically when running locally.

### 4. Deploy

1. Deploy this folder as its own project, separate from the frontend.
2. Set the env vars above.
3. The frontend resolves the backend URL automatically from the deployment hostname.

## Structure

- **`lib`** — Redis client, in-memory cache wrapper, rate-limit and staff OAuth/session helpers
- **`app/auth/github`** — staff GitHub OAuth start + callback
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
