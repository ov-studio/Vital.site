import * as lib_masterlist    from '@/lib/masterlist';
import * as lib_redis         from '@/lib/redis';
import * as upstash_ratelimit from '@upstash/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const ratelimit = lib_redis.redis_configured
  ? new upstash_ratelimit.Ratelimit({
      redis:   lib_redis.redis!,
      prefix:  'masterlist:ratelimit',
      limiter: upstash_ratelimit.Ratelimit.slidingWindow(10, '5 m')
    })
  : null;

// Lua: true when the stored entry at `key` belongs to a different ip:port than the caller claims.
const HELD_ELSEWHERE_LUA = `
  local function held_elsewhere(key, ip, port)
    local current = redis.call('GET', key)
    if not current then return false end
    local ok, held = pcall(cjson.decode, current)
    return ok and type(held) == 'table' and (tostring(held.ip) ~= ip or tostring(held.port) ~= port)
  end
`;

const HEARTBEAT_SCRIPT = `${HELD_ELSEWHERE_LUA}
  if redis.call('EXISTS', KEYS[1]) == 0 then
    return 0
  end
  if held_elsewhere(KEYS[2], ARGV[4], ARGV[5]) then
    return 2
  end
  redis.call('EXPIRE', KEYS[1], ARGV[3])
  redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[2])
  return 1
`;

const OFFLINE_SCRIPT = `${HELD_ELSEWHERE_LUA}
  if redis.call('EXISTS', KEYS[1]) == 0 then
    return 0
  end
  if ARGV[1] ~= '' and held_elsewhere(KEYS[2], ARGV[1], ARGV[2]) then
    return 2
  end
  redis.call('DEL', KEYS[2])
  return 1
`;

async function is_rate_limited(id: string): Promise<boolean> {
  return ratelimit ? !(await ratelimit.limit(id)).success : false;
}

export async function POST(req: Request) {
  let body: lib_masterlist.HeartbeatBody;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid json' }, { status: 400 }); }

  const { token, name, ip, port } = body;
  if (!lib_redis.redis_configured) return lib_masterlist.unavailable();
  if (!token || !name || !ip || !port) return Response.json({ error: 'missing required fields (token, name, ip, port)' }, { status: 400 });

  const id = lib_masterlist.hash_token(token);
  if (await is_rate_limited(id)) return Response.json({ error: 'rate limited' }, { status: 429 });

  const request_ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const strict_ip = process.env.MASTERLIST_STRICT_IP !== 'false';
  if (request_ip && request_ip !== ip) {
    if (strict_ip) {
      console.warn(`[masterlist] rejected ip mismatch for ${id}: claimed=${ip} actual=${request_ip}`);
      return Response.json({ error: 'ip mismatch' }, { status: 403 });
    }
    console.warn(`[masterlist] ip mismatch for ${id}: claimed=${ip} actual=${request_ip}`);
  }

  const { server, ignored_tags } = lib_masterlist.build_server(id, body);
  const ok = await lib_redis.redis!.eval(
    HEARTBEAT_SCRIPT,
    [lib_redis.token_key(id), lib_redis.server_key(id)],
    [JSON.stringify(server), String(lib_redis.masterlist_ttl_seconds), String(lib_redis.applications_approved_ttl_seconds), String(ip), String(port)]
  );
  if (ok === 2) {
    console.warn(`[masterlist] rejected duplicate token use for ${id}: claimed=${ip}:${port}`);
    return Response.json({ error: 'masterlist token already in use' }, { status: 409 });
  }
  if (!ok) return Response.json({ error: 'unknown token — register first' }, { status: 401 });

  return Response.json({ ok: true, ttlSeconds: lib_redis.masterlist_ttl_seconds, ignoredTags: ignored_tags });
}

export async function DELETE(req: Request) {
  let body: { token?: string; ip?: string; port?: number };
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid json' }, { status: 400 }); }

  const { token, ip, port } = body;
  if (!token) return Response.json({ error: 'missing token' }, { status: 400 });
  if (!lib_redis.redis_configured) return lib_masterlist.unavailable();

  const id = lib_masterlist.hash_token(token);
  if (await is_rate_limited(id)) return Response.json({ error: 'rate limited' }, { status: 429 });

  const claimed = typeof ip === 'string' && ip && port ? [ip, String(port)] : ['', ''];
  const ok = await lib_redis.redis!.eval(OFFLINE_SCRIPT, [lib_redis.token_key(id), lib_redis.server_key(id)], claimed);
  if (ok === 2) return Response.json({ error: 'masterlist token already in use' }, { status: 409 });
  if (!ok) return Response.json({ error: 'unknown token' }, { status: 401 });

  return Response.json({ ok: true });
}
