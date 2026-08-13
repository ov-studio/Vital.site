import * as config_site   from '@/configs/site';
import * as upstash_redis from '@upstash/redis';

const upstash_url   = process.env.UPSTASH_REDIS_REST_URL   ?? process.env.KV_REST_API_URL;
const upstash_token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis_configured = Boolean(upstash_url && upstash_token);

if (!redis_configured) {
  console.error(
    '[Redis] Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN ' +
    '(or KV_REST_API_URL / KV_REST_API_TOKEN). Redis-backed features (ratelimit, masterlist) ' +
    'are disabled until these are set in the deployment environment.'
  );
}

export const redis = redis_configured
  ? new upstash_redis.Redis({ url: upstash_url!, token: upstash_token! })
  : null;

export const masterlist_ttl_seconds = Math.floor(config_site.info.masterlist.ttl_ms/1000);

export function server_key(id: string) {
  return `masterlist:server:${id}`;
}

export function token_key(id: string) {
  return `masterlist:token:${id}`;
}