# Staff server-token mint UI

Drop these files into the Vital.site repo root (merge/overwrite). Paths are relative to the repo root.

## What this adds

- **Frontend** `/staff` — GitHub login + form to mint a masterlist token (replaces curl for staff).
- **Backend** GitHub OAuth (`/auth/github`, `/auth/github/callback`) + staff JWT.
- **Register** still accepts `Authorization: Bearer <MASTERLIST_ADMIN_SECRET>` for scripts; also accepts a short-lived staff JWT from the UI.

## Setup

1. Create a GitHub OAuth App: https://github.com/settings/developers  
   - **Authorization callback URL**  
     - Local: `http://localhost:3001/auth/github/callback`  
     - Prod: `https://api.<your-domain>/auth/github/callback`
2. In `backend/.env.local` (see updated `.env.example`):

```dotenv
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
STAFF_GITHUB_LOGINS=yourgithub,otherstaff
# MASTERLIST_ADMIN_SECRET already required — also used to sign staff JWTs unless STAFF_JWT_SECRET is set
```

3. Restart backend. Open `http://localhost:3000/staff`.

## Flow

1. Staff opens `/staff` → **Sign in with GitHub**.
2. Backend exchanges code, checks login against `STAFF_GITHUB_LOGINS`, issues 8h HMAC staff token.
3. Redirects to `/staff#staff_token=...` (hash, not query). Token stored in `sessionStorage`.
4. Staff enters optional server name → **Mint token** → shows `id` + `token` once (same Redis registration as before).

## Security notes

- Only allowlisted GitHub usernames can mint.
- Client secret never leaves the backend.
- OAuth `state` stored in Redis (10 min) when Redis is configured.
- Staff JWT is not the masterlist server token; it only authorizes `POST /masterlist/register`.
- Curl / automation path unchanged.

## Files in this zip

```
backend/.env.example                          (updated)
backend/lib/staff_auth.ts                     (new)
backend/app/auth/github/route.ts              (new)
backend/app/auth/github/callback/route.ts     (new)
backend/app/masterlist/register/route.ts      (updated)
frontend/app/staff/page.tsx                   (new)
frontend/components/staff/index.tsx           (new)
frontend/components/staff/index.css           (new)
```
