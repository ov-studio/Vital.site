import * as config_masterlist from '@/configs/masterlist';
import * as lib_api_cache     from '@/lib/api_cache';
import * as lib_masterlist    from '@/lib/masterlist';
import * as lib_redis         from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const headers = {
  'Cache-Control': lib_api_cache.cache_control(
    Math.floor(config_masterlist.info.cache_s_maxage_ms / 1000),
    config_masterlist.info.cache_swr_multiplier
  )
};

export async function GET() {
  if (!lib_redis.redis_configured) return lib_masterlist.unavailable();

  const keys   = await lib_redis.redis!.keys('masterlist:server:*');
  const values = keys.length ? await lib_redis.redis!.mget<unknown[]>(...keys) : [];
  const servers = values
    .map(lib_masterlist.parse_server)
    .filter((s): s is lib_masterlist.ServerInfo => s !== null)
    .sort((a, b) => b.players - a.players);

  return Response.json(servers, { headers });
}
