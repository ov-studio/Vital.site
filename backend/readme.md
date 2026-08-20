# Vital API service

This is the split-out half of Vital.site — every route that needs a live
server (Redis, GitHub calls) lives here. It deploys as a normal project
(no static export), so it keeps working exactly like it did before the
split; only the *docs/marketing* pages moved out to the frontend.

Search doesn't live here — it's a static index built at frontend build
time and searched client-side in the browser. See the frontend's readme.

## Deploy

1. `npm install`
2. Push this folder as its own project, separate from the frontend.
3. Set env vars:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `MASTERLIST_ADMIN_SECRET`
   - `MASTERLIST_STRICT_IP` (optional, defaults to strict/`true`)
   - `SITE_ORIGIN` — the frontend's origin, e.g. `https://vital-sandbox.com`,
     so CORS only allows that origin. Leave unset during setup and it'll
     default to `*`.
4. Note the deployed URL/domain (e.g. `api.vital-sandbox.com`). You'll put
   this into the frontend's `NEXT_PUBLIC_API_URL` env var.

## What's here

- `/api/stats`, `/api/contributors`, `/api/build` — GitHub-backed, cached
  in-memory per the TTLs in `configs/site.tsx`
- `/api/vault` — proxies `Vital.vault`'s `vault.json`
- `/api/masterlist/*` — Redis-backed server list (register/heartbeat/GET)

