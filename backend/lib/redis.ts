import * as config_site   from '@/configs/site';
import * as upstash_redis from '@upstash/redis';

export const redis_configured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (!redis_configured) {
  console.error(
    '[Redis] Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.' +
    'Redis-backed features (ratelimit, masterlist, staff auth) are disabled until these are set in the deployment environment.'
  );
}

export const redis = redis_configured
  ? new upstash_redis.Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
  : null;

export const masterlist_ttl_seconds = Math.floor(config_site.info.masterlist.ttl_ms/1000);

export function server_key(id: string) {
  return `masterlist:server:${id}`;
}

export function token_key(id: string) {
  return `masterlist:token:${id}`;
}

export function staff_session_key(session_token: string) {
  return `staff:session:${session_token}`;
}

export function staff_oauth_state_key(state: string) {
  return `staff:oauth:state:${state}`;
}
