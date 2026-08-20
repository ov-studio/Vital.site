# Vital API service

This is the split-out half of Vital.site — every route that needs a live
server (Redis, GitHub calls, search index) lives here. It deploys as a
normal (non-static-export) Vercel project, so it keeps working exactly like
it did before the split; only the *docs/marketing* pages moved out.

## Deploy

1. `npm install`
2. Push this folder as its own Vercel project (separate from the static
   site). Vercel auto-detects Next.js — no extra config needed.
3. Set env vars in that Vercel project:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `MASTERLIST_ADMIN_SECRET`
   - `MASTERLIST_STRICT_IP` (optional, defaults to strict/`true`)
   - `SITE_ORIGIN` — set to your static site's origin, e.g.
     `https://vital.sandbox`, so CORS only allows that origin. Leave unset
     during setup and it'll default to `*`.
4. Note the deployed URL (e.g. `https://api-xyz.vercel.app`, or attach a
   custom domain like `api.vital.sandbox`). You'll put this into the static
   site's `NEXT_PUBLIC_API_URL` env var.

## What's here

- `/api/search` — docs search index (needs its own copy of `content/docs` +
  `source.config.ts`, kept in sync manually or via a small script/CI step
  that copies `content/docs` from the main repo on each deploy)
- `/api/stats`, `/api/contributors`, `/api/build` — GitHub-backed, cached
  in-memory per the TTLs in `configs/site.tsx`
- `/api/vault` — proxies `Vital.vault`'s `vault.json`
- `/api/masterlist/*` — Redis-backed server list (register/heartbeat/GET)

## Keeping docs content in sync

Because `/api/search` needs the same MDX content the static site builds
from, add a step to your deploy pipeline (or a simple `postinstall`/CI
script) that copies `content/docs` and `source.config.ts` from the main
`Vital.site` repo into this project before `npm run build`. They're
duplicated here only so this service can build standalone.
