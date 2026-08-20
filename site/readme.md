## Overview

Official documentation and resource hub for Vital.sandbox — covering API references, scripting guides, and everything needed to build with confidence.

Vital.site is built on Next.js and powered by Fumadocs, providing a fast, searchable, and version-aware documentation experience. All content is authored in MDX, keeping docs close to the codebase and easy to contribute to. It also hosts the Vital.sandbox **masterlist**, a live server directory backed by Upstash Redis.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ov-studio/Vital.site.git
cd Vital.site
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root — it's already covered by `.gitignore`, so it will never be committed:

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
| `MASTERLIST_ADMIN_SECRET` | Yes | Bearer secret required to call `POST /api/masterlist/register`. Generate a long random value (e.g. `openssl rand -hex 32`) and don't reuse it elsewhere. |
| `MASTERLIST_STRICT_IP` | No | When `true` (default), a heartbeat is rejected if the reporting server's IP doesn't match the IP it claims. Set to `false` for local development, since localhost/tunnels rarely present a stable, matching IP. Leave it `true` (or unset) in production. |

<sub>* If Redis isn't configured, the site still builds and runs — masterlist and rate-limiting endpoints just respond as unavailable and log a warning, instead of the app crashing.</sub>

**Getting your Upstash credentials:**

1. Create a free database at [upstash.com](https://upstash.com).
2. Open the database, then go to the **REST API** tab.
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` values into `.env.local`.

### 3. Run the dev server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally. Changes to MDX files and components hot-reload automatically.

## Structure

| Path | Description |
|---|---|
| `configs` | Site-wide configuration files |
| `lib` | Content source adapter, Redis client, and shared utilities |
| `components` | Shared UI components |
| `app/(home)` | Landing page and top-level routes |
| `app/api` | API routes — masterlist, search, stats, contributors, build, vault |
| `app/docs` | Documentation layout and MDX pages |
| `content/docs` | MDX source files for all documentation |


## Contributing

Documentation improvements, corrections, and new guides are welcome. If you find an error, a missing API, or an outdated example, opening a pull request is the fastest way to get it fixed. For larger structural changes or new documentation sections, open an issue first to align on scope and approach before investing time in a draft.

All content lives under `content/docs` as MDX files and follows the existing frontmatter and heading conventions. Keep examples minimal, accurate, and tied to real engine behavior.