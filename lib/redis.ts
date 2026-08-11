import * as config_site from '@/configs/site';
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export const masterlist_ttl_seconds = Math.floor(config_site.info.masterlist.ttl_ms/1000);

export function server_key(id: string) {
  return `masterlist:server:${id}`;
}

export function token_key(id: string) {
  return `masterlist:token:${id}`;
}
