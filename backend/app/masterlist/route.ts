import * as config_masterlist from '@/configs/masterlist';
import * as lib_redis         from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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

export async function GET() {
  if (!lib_redis.redis_configured) return Response.json({ error: 'Masterlist is temporarily unavailable' }, { status: 503 });

  const keys = await lib_redis.redis!.keys('masterlist:server:*');
  if (keys.length === 0) return Response.json([], { headers: cache_headers() });

  const values = await lib_redis.redis!.mget<unknown[]>(...keys);
  const servers: ServerInfo[] = values
    .filter((v): v is NonNullable<unknown> => Boolean(v))
    .map((v) => (typeof v === 'string' ? JSON.parse(v) : v) as ServerInfo)
    .map((s) => ({ ...s, logo: s.logo ?? null, banner: s.banner ?? null, tags: Array.isArray(s.tags) ? s.tags : [] }))
    .sort((a, b) => b.players - a.players);

  return Response.json(servers, { headers: cache_headers() });
}

function cache_headers() {
  const s_maxage_s = Math.floor(config_masterlist.info.cache_s_maxage_ms / 1000);
  const swr_s = s_maxage_s * config_masterlist.info.cache_swr_multiplier;
  return { 'Cache-Control': `public, s-maxage=${s_maxage_s}, stale-while-revalidate=${swr_s}` };
}