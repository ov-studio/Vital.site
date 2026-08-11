import { redis, server_key, token_key, masterlist_ttl_seconds } from '@/lib/redis';
import { createHash, timingSafeEqual } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';

export const runtime = 'nodejs';

interface HeartbeatBody {
  id:           string;
  secret:       string;
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

// A server heartbeats roughly every 5 minutes (see configs/site.tsx) — this
// allows a generous burst on top of that (retries, restarts) without
// letting a compromised secret spam the endpoint.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '5 m'),
  prefix: 'masterlist:ratelimit'
});

function safe_equal(a: string, b: string): boolean {
  const buf_a = Buffer.from(a, 'hex');
  const buf_b = Buffer.from(b, 'hex');
  if (buf_a.length !== buf_b.length) return false;
  return timingSafeEqual(buf_a, buf_b);
}

function clamp_int(n: unknown, min: number, max: number): number {
  const v = typeof n === 'number' ? Math.trunc(n) : 0;
  return Math.min(max, Math.max(min, v));
}

export async function POST(req: Request) {
  let body: HeartbeatBody;
  try {
    body = await req.json();
  }
  catch {
    return new Response('invalid json', { status: 400 });
  }

  const { id, secret, name, ip, port, httpPort, players, maxPlayers, version, description, discord, website } = body;

  if (!id || !secret || !name || !ip || !port) {
    return new Response('missing required fields (id, secret, name, ip, port)', { status: 400 });
  }

  const { success } = await ratelimit.limit(id);
  if (!success) {
    return new Response('rate limited', { status: 429 });
  }

  const stored_hash = await redis.get<string>(token_key(id));
  if (!stored_hash) {
    return new Response('unknown server id — register first', { status: 401 });
  }

  const given_hash = createHash('sha256').update(secret).digest('hex');
  if (!safe_equal(given_hash, stored_hash)) {
    return new Response('bad secret', { status: 401 });
  }

  // Lock heartbeats to the IP that's actually sending them, so a leaked
  // secret can't be used from a different machine to hijack a listing.
  // Set MASTERLIST_STRICT_IP=false in env if servers sit behind rotating
  // egress IPs and this causes false rejections.
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

  await redis.set(server_key(id), JSON.stringify(payload), { ex: masterlist_ttl_seconds });
  return Response.json({ ok: true, ttlSeconds: masterlist_ttl_seconds });
}

// Graceful shutdown — the server calls this on clean exit so its entry
// disappears immediately instead of lingering until the TTL expires.
export async function DELETE(req: Request) {
  let body: { id?: string; secret?: string };
  try {
    body = await req.json();
  }
  catch {
    return new Response('invalid json', { status: 400 });
  }

  const { id, secret } = body;
  if (!id || !secret) return new Response('missing id/secret', { status: 400 });

  const stored_hash = await redis.get<string>(token_key(id));
  if (!stored_hash) return new Response('unknown server id', { status: 401 });

  const given_hash = createHash('sha256').update(secret).digest('hex');
  if (!safe_equal(given_hash, stored_hash)) return new Response('bad secret', { status: 401 });

  await redis.del(server_key(id));
  return Response.json({ ok: true });
}