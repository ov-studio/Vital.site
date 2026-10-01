## Overview

API service for Vital.sandbox — every route that needs a live server lives here. This is the **backend half** of the project: a normal Next.js deployment (no static export), split out so the docs/marketing frontend can ship as a fully static site.

Hosts the Vital.sandbox **masterlist** (a live server directory backed by Upstash Redis), **scripting benchmarks** (sourced from GitHub Release assets), and cached GitHub-backed endpoints for build info, contributors, stats, and vault resources. Also handles GitHub OAuth (workspace login) and vault resource PR automation via a GitHub App.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site/backend
npm install
```

### 2. Configure environment variables

Copy [`.env.example`](./.env.example) to `.env.local` (already in `.gitignore`) and fill in real values:

```dotenv
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
MASTERLIST_STRICT_IP=false

GITHUB_APP_CLIENT_ID=""
GITHUB_APP_CLIENT_SECRET=""
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=""
```

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | REST endpoint for your Upstash Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | REST token for the same database. |
| `MASTERLIST_STRICT_IP` | No | Set to `false` locally. Defaults to `true` in production. |
| `GITHUB_APP_CLIENT_ID` | Yes | GitHub App **Client ID** (user login OAuth). |
| `GITHUB_APP_CLIENT_SECRET` | Yes | GitHub App **client secret** (generate once in App settings). |
| `GITHUB_APP_ID` | Yes* | Numeric **App ID** — needed for vault merge / close / remove. |
| `GITHUB_APP_INSTALLATION_ID` | Yes* | Installation ID after installing the App on `Vital.vault`. |
| `GITHUB_APP_PRIVATE_KEY` | Yes* | App private key PEM (multiline). Used to mint installation tokens. |

**GitHub App setup (org):**

1. Create under [org apps](https://github.com/organizations/ov-studio/settings/apps) (e.g. `Vital.sandbox`).
2. **Redirect URLs:** `https://api.vital-sandbox.com/auth/github/callback` and `http://localhost:3001/auth/github/callback`.
3. **Permissions:** Contents, Pull requests, Workflows → Read & write.
4. **Install** on `ov-studio/Vital.vault` only.
5. Copy App ID, Client ID, client secret, Installation ID, and generate a private key.

Staff logins (for approving applications and vault PRs) are managed in [`shared/configs/staff.json`](../shared/configs/staff.json).

### 3. Run the dev server

```bash
npm run dev
```

Starts on [http://localhost:3001](http://localhost:3001).

### 4. Deploy

Deploy this folder separately from the frontend. Set the env vars above before deploying.

## Masterlist applications

Anyone with a GitHub account can sign in at `/workspace` and request a server token. Staff approve or reject applications in the same UI. On approve, a one-time token is issued for the applicant to copy.

## Vault resources

Users submit a public repo with a root `manifest.yaml` from `/vault`. The backend opens a PR on `Vital.vault` (submodule add/update). Staff review open PRs in `/workspace` → **Vault resources** (Pending / Published / Merged). Merge and remove run as the GitHub App installation, not as a personal account.

## Structure

- **`lib`** — Redis, cache, rate-limit, auth sessions, GitHub App, vault publish, applications, staff list
- **`app/auth/github`** — OAuth start + callback
- **`app/build`** — latest sandbox release info
- **`app/stats`** — repository stats
- **`app/contributors`** — contributor list
- **`app/benchmark`** — scripting benchmark results
- **`app/masterlist`** — live list, heartbeat, register, applications
- **`app/vault`** — vault list, tree, submit, submissions
- **`app/ip`** — client IP helper

## Contributing

Keep new routes consistent with existing patterns. Document new env vars here and in `.env.example`. Rate limiting lives in `middleware.ts` for cached GET routes.
