import * as lib_redis         from '@/lib/redis';
import * as crypto            from 'crypto';
import * as upstash_ratelimit from '@upstash/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface HeartbeatBody {
  token:        string;
  name:         string;
  ip:           string;
  port:         number;
  httpPort?:    number;
  players:      number;
  maxPlayers:   number;
  version?:     string;
  description?: string;
  discord?:     string;
  website?:     string;
}

const ratelimit = lib_redis.redis_configured
  ? new upstash_ratelimit.Ratelimit({
      redis:   lib_redis.redis!,
      prefix:  'masterlist:ratelimit',
      limiter: upstash_ratelimit.Ratelimit.slidingWindow(10, '5 m')
    })
  : null;

const HEARTBEAT_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 1 then
  redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[2])
  return 1
else
  return 0
end
`;

const OFFLINE_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 1 then
  redis.call('DEL', KEYS[2])
  return 1
else
  return 0
end
`;

function clamp_int(n: unknown, min: number, max: number): number {
  const v = typeof n === 'number' ? Math.trunc(n) : 0;
  return Math.min(max, Math.max(min, v));
}

function id_of(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(req: Request) {
  let body: HeartbeatBody;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid json' }, { status: 400 }); }

  const { token, name, ip, port, httpPort, players, maxPlayers, version, description, discord, website } = body;
  if (!lib_redis.redis_configured) return Response.json({ error: 'Masterlist is temporarily unavailable' }, { status: 503 });
  if (!token || !name || !ip || !port) return Response.json({ error: 'missing required fields (token, name, ip, port)' }, { status: 400 });

  const id = id_of(token);
  if (ratelimit) {
    const { success } = await ratelimit.limit(id);
    if (!success) return Response.json({ error: 'rate limited' }, { status: 429 });
  }

  const request_ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const strict_ip = process.env.MASTERLIST_STRICT_IP !== 'false';
  if (request_ip && request_ip !== ip) {
    if (strict_ip) {
      console.warn(`[masterlist] rejected ip mismatch for ${id}: claimed=${ip} actual=${request_ip}`);
      return Response.json({ error: 'ip mismatch' }, { status: 403 });
    }
    console.warn(`[masterlist] ip mismatch for ${id}: claimed=${ip} actual=${request_ip}`);
  }

  const payload = {
    id,
    name,
    ip,
    port,
    httpPort:    httpPort ?? null,
    players:     clamp_int(players, 0, 100_000),
    maxPlayers:  clamp_int(maxPlayers, 0, 100_000),
    version:     version ?? null,
    description: description ?? null,
    discord:     discord ?? null,
    website:     website ?? null,
    lastSeen:    Date.now()
  };

  const ok = await lib_redis.redis!.eval(
    HEARTBEAT_SCRIPT,
    [lib_redis.token_key(id), lib_redis.server_key(id)],
    [JSON.stringify(payload), String(lib_redis.masterlist_ttl_seconds)]
  );
  if (!ok) return Response.json({ error: 'unknown token — register first' }, { status: 401 });

  return Response.json({ ok: true, ttlSeconds: lib_redis.masterlist_ttl_seconds });
}

export async function DELETE(req: Request) {
  let body: { token?: string };
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid json' }, { status: 400 }); }

  const { token } = body;
  if (!token) return Response.json({ error: 'missing token' }, { status: 400 });
  if (!lib_redis.redis_configured) return Response.json({ error: 'Masterlist is temporarily unavailable' }, { status: 503 });

  const id = id_of(token);
  const ok = await lib_redis.redis!.eval(OFFLINE_SCRIPT, [lib_redis.token_key(id), lib_redis.server_key(id)], []);
  if (!ok) return Response.json({ error: 'unknown token' }, { status: 401 });

  return Response.json({ ok: true });
}