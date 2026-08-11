import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

export interface ServerInfo {
  id:          string;
  name:        string;
  ip:          string;
  port:        number;
  httpPort:    number | null;
  players:     number;
  maxPlayers:  number;
  version:     string | null;
  description: string | null;
  discord:     string | null;
  website:     string | null;
  lastSeen:    number;
}

export async function GET() {
  const keys = await redis.keys('masterlist:server:*');

  if (keys.length === 0) {
    return Response.json([], { headers: cache_headers() });
  }

  const values = await redis.mget<unknown[]>(...keys);
  const servers: ServerInfo[] = values
    .filter((v): v is NonNullable<unknown> => Boolean(v))
    .map((v) => (typeof v === 'string' ? JSON.parse(v) : v) as ServerInfo)
    .sort((a, b) => b.players - a.players);

  return Response.json(servers, { headers: cache_headers() });
}

function cache_headers() {
  return {
    'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15'
  };
}