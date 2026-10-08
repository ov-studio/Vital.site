import * as config_site   from '@/configs/site';
import * as upstash_redis from '@upstash/redis';

/** True when Upstash Redis env vars are set. */
export const redis_configured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (!redis_configured) {
  console.error(
    '[Redis] Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.' +
    'Redis-backed features (ratelimit, masterlist, auth) are disabled until these are set in the deployment environment.'
  );
}

/** Shared Upstash Redis client, or null when not configured. */
export const redis = redis_configured
  ? new upstash_redis.Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
  : null;

/** TTL (seconds) for masterlist server keys. */
export const masterlist_ttl_seconds = Math.floor(config_site.info.masterlist.ttl_ms/1000);
/** TTL (seconds) for approved application records. */
export const applications_approved_ttl_seconds = Math.floor(config_site.info.applications.approved_ttl_ms / 1000);

/** Redis key for a masterlist server entry. */
export function server_key(id: string) {
  return `masterlist:server:${id}`;
}

/** Redis key for a masterlist claim token. */
export function token_key(id: string) {
  return `masterlist:token:${id}`;
}

/** Redis key for an auth session token. */
export function auth_session_key(session_token: string) {
  return `auth:session:${session_token}`;
}

/** Redis key for a pending OAuth state. */
export function auth_oauth_state_key(state: string) {
  return `auth:oauth:state:${state}`;
}

/** Redis key for a masterlist application record. */
export function application_key(appId: string) {
  return `masterlist:app:${appId}`;
}

/** Redis key for a user's application id set. */
export function user_apps_key(login: string) {
  return `masterlist:user:${login.toLowerCase()}:apps`;
}

/** Redis set key of pending application ids. */
export const applications_pending_key = 'masterlist:applications:pending';
/** Redis set key of approved application ids. */
export const applications_approved_key = 'masterlist:applications:approved';

/** Redis key for a vault submission record. */
export function vault_submission_key(id: string) {
  return `vault:submission:${id}`;
}

/** Redis key for a user's vault submission id set. */
export function vault_user_submissions_key(login: string) {
  return `vault:user:${login.toLowerCase()}:submissions`;
}


/** Redis key binding a session to a GitHub user access token. */
export function auth_github_token_key(session_token: string) {
  return `auth:github_token:${session_token}`;
}
