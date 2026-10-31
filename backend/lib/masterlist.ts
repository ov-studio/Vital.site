import * as config_masterlist from '@/configs/masterlist';
import * as lib_redis         from '@/lib/redis';
import * as crypto            from 'crypto';

/** Max length of a server / application name. */
export const MAX_NAME_LENGTH = 64;
/** Upper bound accepted for player counts sent by servers. */
const MAX_PLAYERS = 100_000;

/** A listed server as stored in Redis and returned by GET /masterlist. */
export interface ServerInfo {
  id:          string;
  name:        string;
  ip:          string;
  port:        number;
  http_port:   number | null;
  players:     number;
  max_players: number;
  version:     string | null;
  description: string | null;
  discord:     string | null;
  website:     string | null;
  logo:        string | null;
  banner:      string | null;
  tags:        string[];
  last_seen:   number;
}

/** ServerInfo fields a server may omit (or null) in its heartbeat. */
type HeartbeatOptional = 'http_port' | 'version' | 'description' | 'discord' | 'website' | 'logo' | 'banner';

/** POST /masterlist/heartbeat body, derived from ServerInfo (`max_peers` is the wire name of `max_players`). */
export type HeartbeatBody =
  & Pick<ServerInfo, 'name' | 'ip' | 'port' | 'players'>
  & Partial<Pick<ServerInfo, HeartbeatOptional>>
  & { token: string; max_peers?: number; tags?: unknown };

/** 503 returned whenever Redis is not configured. */
export function unavailable(): Response {
  return Response.json({ error: 'Masterlist is temporarily unavailable' }, { status: 503 });
}

/** Stable server id derived from its secret token. */
export function hash_token(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Mint a masterlist token and register it in Redis. The raw token is only ever returned here. */
export async function issue_token(): Promise<{ token: string; id: string }> {
  const token = crypto.randomBytes(32).toString('hex');
  const id    = hash_token(token);
  await lib_redis.redis!.set(lib_redis.token_key(id), Date.now(), { ex: lib_redis.applications_approved_ttl_seconds });
  return { token, id };
}

function clamp_int(n: unknown, min: number, max: number): number {
  const v = typeof n === 'number' ? Math.trunc(n) : 0;
  return Math.min(max, Math.max(min, v));
}

function clean_image(raw: unknown): string | null {
  const url = typeof raw === 'string' ? raw.trim() : '';
  return /^https:\/\//i.test(url) ? url : null;
}

function clean_tags(raw: unknown): { tags: string[]; ignored: string[] } {
  const tags: string[] = [];
  const ignored: string[] = [];
  if (!Array.isArray(raw)) return { tags, ignored };
  const { tags: allowed, max_tags } = config_masterlist.info;
  for (const item of raw) {
    const tag = String(item);
    if (allowed.includes(tag) && !tags.includes(tag) && tags.length < max_tags) tags.push(tag);
    else if (!tags.includes(tag)) ignored.push(tag.slice(0, 32));
  }
  return { tags, ignored: ignored.slice(0, max_tags * 2) };
}

/** Turn a validated heartbeat body into the ServerInfo record to store. */
export function build_server(id: string, body: HeartbeatBody): { server: ServerInfo; ignored_tags: string[] } {
  const { tags, ignored } = clean_tags(body.tags);
  const server: ServerInfo = {
    id,
    name:        body.name,
    ip:          body.ip,
    port:        body.port,
    http_port:   body.http_port ?? null,
    players:     clamp_int(body.players, 0, MAX_PLAYERS),
    max_players: clamp_int(body.max_peers, 0, MAX_PLAYERS),
    version:     body.version ?? null,
    description: body.description ?? null,
    discord:     body.discord ?? null,
    website:     body.website ?? null,
    logo:        clean_image(body.logo),
    banner:      clean_image(body.banner),
    tags,
    last_seen:   Date.now()
  };
  return { server, ignored_tags: ignored };
}

/** Parse a stored server entry; null when it is missing or malformed. */
export function parse_server(raw: unknown): ServerInfo | null {
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as ServerInfo;
    if (typeof data?.id !== 'string') return null;
    return { ...data, logo: data.logo ?? null, banner: data.banner ?? null, tags: Array.isArray(data.tags) ? data.tags : [] };
  }
  catch { return null; }
}
