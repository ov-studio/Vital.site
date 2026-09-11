## Overview

API service for Vital.sandbox — every route that needs a live server lives here. This is the **backend half** of the project: a normal Next.js deployment (no static export), split out so the docs/marketing frontend can ship as a fully static site.

Hosts the Vital.sandbox **masterlist** (a live server directory backed by Upstash Redis), **scripting benchmarks** (sourced from GitHub Release assets), and cached GitHub-backed endpoints for build info, contributors, stats, and vault resources. Also handles GitHub OAuth and the workspace application flow.

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
```

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | REST endpoint for your Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | REST token for the same database. |
| `MASTERLIST_STRICT_IP` | No | Set to `false` locally. Defaults to `true` in production. |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth App client ID. |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth App client secret. |

Staff logins (for approving applications) are managed in [`shared/configs/staff.json`](../shared/configs/staff.json).

### 3. Run the dev server

```bash
npm run dev
```

Starts on [http://localhost:3001](http://localhost:3001).

### 4. Deploy

Deploy this folder separately from the frontend. Set Redis + GitHub env vars. Frontend resolves the API host from the deployment hostname.

## Masterlist applications

Anyone with a GitHub account can sign in at `/workspace` and request a server token (one **pending** application per account). Staff (allowlisted logins in `shared/configs/staff.json`) approve or reject in the same UI. On approve, Redis stores a one-time token for the applicant to copy; they dismiss it after saving. 

## Structure

- **`lib`** — Redis, cache, rate-limit, auth sessions, applications, staff list
- **`app/auth/github`** — OAuth start + callback
- **`app/masterlist`** — live list, heartbeat, register, applications (CRUD + token minting)
- **`app/benchmark`** — scripting benchmark results sourced from GitHub Release assets
- **`app/build`** — latest sandbox release info (tag, download URLs, asset sizes)
- **`app/stats`** — GitHub-backed repository stats
- **`app/contributors`** — contributor list from GitHub
- **`app/vault`** — vault resource list from GitHub
- **`app/og`** — OG image generation

## Contributing

Keep new routes consistent with existing patterns. Document new env vars here. Rate limiting lives in `middleware.ts` for cached GET routes.
