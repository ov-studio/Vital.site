## Overview

API service for Vital.sandbox — every route that needs a live server (Redis, GitHub calls) lives here. This is the **backend half** of the project: a normal Next.js deployment (no static export), split out so the docs/marketing frontend can ship as a fully static site. It hosts the Vital.sandbox **masterlist**, a live server directory backed by Upstash Redis, along with cached GitHub-backed endpoints for build info, contributors, stats, and vault resources.

Search doesn't live here — it's a static index built at frontend build time and searched client-side in the browser. See the frontend's readme.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/backend
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in this directory — it's already covered by `.gitignore`, so it will never be committed:

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
| `MASTERLIST_ADMIN_SECRET` | Yes | Bearer secret required to call `POST /masterlist/register`. Generate a long random value (e.g. `openssl rand -hex 32`) and don't reuse it elsewhere. |
| `MASTERLIST_STRICT_IP` | No | When `true` (default), a heartbeat is rejected if the reporting server's IP doesn't match the IP it claims. Set to `false` for local development, since localhost/tunnels rarely present a stable, matching IP. Leave it `true` (or unset) in production. |

<sub>* If Redis isn't configured, the service still builds and runs — masterlist and rate-limiting endpoints just respond as unavailable and log a warning, instead of the app crashing.</sub>

**Getting your Upstash credentials:**

1. Create a free database at [upstash.com](https://upstash.com).
2. Open the database, then go to the **REST API** tab.
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` values into `.env.local`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or whatever port you run it on) — this is the URL you'll point the frontend's `NEXT_PUBLIC_API_URL` at locally.

### 4. Deploy

1. Push this folder as its own project, separate from the frontend.
2. Set the env vars above, in particular `MASTERLIST_ADMIN_SECRET`.
3. Note the deployed URL/domain (e.g. `api.vital-sandbox.com`). Put this into the frontend's `NEXT_PUBLIC_API_URL` env var and rebuild the frontend — it's inlined at build time, so redeploy the frontend after changing it.

## Structure

| Path | Description |
|---|---|
| `configs` | Site-wide configuration files (shared `git`/API/ratelimit settings) |
| `lib` | Redis client, in-memory cache wrapper, and rate-limit helper |
| `app/build` | GitHub Releases-backed — latest client/server download links, cached |
| `app/stats` | GitHub-backed — aggregated repo stars/forks/issues/commits, cached |
| `app/contributors` | GitHub-backed — contributor list across repos, cached |
| `app/vault` | Proxies `Vital.vault`'s `vault.json` resource index, cached |
| `app/vault/tree` | Proxies the vault repo's git tree (used for per-resource zip downloads), cached |
| `app/masterlist` | Redis-backed live server list (`GET`, plus `register`/`heartbeat` for server owners) |

## Contributing

Bug reports and pull requests for new or improved endpoints are welcome. Keep new routes consistent with the existing pattern: cache GitHub-backed data with `lib/api_cache`, and document any new env var here.

**Rate limiting lives in `middleware.ts`, not in individual routes.** Cached routes send a `public, s-maxage=...` Cache-Control header, which Vercel's CDN honors — repeat requests within that window are served straight from the edge and never reach the route handler at all, so a `lib/ratelimit.check()` call inside the handler silently stops firing once a response is cached. `middleware.ts` runs ahead of the CDN cache lookup and enforces the limit regardless of cache state. If you add a new cached GET route, add its path to the `matcher` array in `middleware.ts` instead of calling `lib/ratelimit` from the route itself.
