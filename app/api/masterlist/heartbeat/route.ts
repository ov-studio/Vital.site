import { redis, server_key, token_key, masterlist_ttl_seconds } from '@/lib/redis';
import { createHash } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';

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

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '5 m'),
  prefix: 'masterlist:ratelimit'
});

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
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(req: Request) {
  let body: HeartbeatBody;
  try {
    body = await req.json();
  }
  catch {
    return new Response('invalid json', { status: 400 });
  }

  const { token, name, ip, port, httpPort, players, maxPlayers, version, description, discord, website } = body;

  if (!token || !name || !ip || !port) {
    return new Response('missing required fields (token, name, ip, port)', { status: 400 });
  }

  const id = id_of(token);

  const { success } = await ratelimit.limit(id);
  if (!success) {
    return new Response('rate limited', { status: 429 });
  }

  const request_ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const strict_ip = process.env.MASTERLIST_STRICT_IP !== 'false';

  if (request_ip && request_ip !== ip) {
    if (strict_ip) {
      console.warn(`[masterlist] rejected ip mismatch for ${id}: claimed=${ip} actual=${request_ip}`);
      return new Response('ip mismatch', { status: 403 });
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

  const ok = await redis.eval(
    HEARTBEAT_SCRIPT,
    [token_key(id), server_key(id)],
    [JSON.stringify(payload), String(masterlist_ttl_seconds)]
  );

  if (!ok) {
    return new Response('unknown token — register first', { status: 401 });
  }

  return Response.json({ ok: true, ttlSeconds: masterlist_ttl_seconds });
}

export async function DELETE(req: Request) {
  let body: { token?: string };
  try {
    body = await req.json();
  }
  catch {
    return new Response('invalid json', { status: 400 });
  }

  const { token } = body;
  if (!token) return new Response('missing token', { status: 400 });

  const id = id_of(token);
  const ok = await redis.eval(OFFLINE_SCRIPT, [token_key(id), server_key(id)], []);

  if (!ok) return new Response('unknown token', { status: 401 });
  return Response.json({ ok: true });
}