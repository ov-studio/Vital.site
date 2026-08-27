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
| `MASTERLIST_STRICT_IP` | No | When `true` (default in production), a heartbeat is rejected if the server's IP doesn't match the IP it registered with. Set to `false` locally. |
| `GITHUB_CLIENT_ID` | Yes† | GitHub OAuth App client ID (workspace login). |
| `GITHUB_CLIENT_SECRET` | Yes† | GitHub OAuth App client secret. |
| `STAFF_GITHUB_LOGINS` | No† | Comma-separated GitHub usernames with staff powers (approve applications, direct mint). Other users can still log in and apply. |

<sub>* Without Redis, masterlist / rate-limit / auth respond as unavailable.</sub>
<sub>† Required for `/workspace` login. Sessions are opaque tokens stored in Redis — no shared admin bearer secret.</sub>

**Upstash:** create a free DB at [upstash.com](https://upstash.com) → REST API tab → copy URL + token.

**GitHub OAuth App:** [Developer settings](https://github.com/settings/developers) — callback `http://localhost:3001/auth/github/callback` (prod: `https://api.<domain>/auth/github/callback`).

### 3. Run the dev server

```bash
npm run dev
```

Starts on [http://localhost:3001](http://localhost:3001).

### 4. Deploy

Deploy this folder separately from the frontend. Set Redis + GitHub env vars. Frontend resolves the API host from the deployment hostname.

## Masterlist applications

Anyone with a GitHub account can sign in at `/workspace` and request a server token (one **pending** application per account). Staff (allowlisted logins) approve or reject in the same UI. On approve, Redis stores a one-time token for the applicant to copy; they dismiss it after saving. Staff may also **direct mint** via `POST /masterlist/register` for giveaways.

## Structure

- **`lib`** — Redis, cache, rate-limit, auth sessions, applications
- **`app/auth/github`** — OAuth start + callback
- **`app/masterlist`** — live list, heartbeat, register, applications
- **`app/build` / `stats` / `contributors` / `vault` / `og`** — cached GitHub-backed routes

## Contributing

Keep new routes consistent with existing patterns. Document new env vars here. Rate limiting lives in `middleware.ts` for cached GET routes.
