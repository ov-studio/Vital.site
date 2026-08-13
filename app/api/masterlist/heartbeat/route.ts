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

// A server heartbeats roughly every 5 minutes (see configs/site.tsx) — this
// allows a generous burst on top of that (retries, restarts) without
// letting a compromised token spam the endpoint.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '5 m'),
  prefix: 'masterlist:ratelimit'
});

function clamp_int(n: unknown, min: number, max: number): number {
  const v = typeof n === 'number' ? Math.trunc(n) : 0;
  return Math.min(max, Math.max(min, v));
}

// The public id is a one-way hash of the token, so it's never sent by the
// client -- deriving it here IS the authenticity check. No secret needs to
// be transmitted, stored, or compared: if id_of(token) has a registered
// entry in Redis, the caller has proven they hold the original token.
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

  const registered = await redis.get(token_key(id));
  if (!registered) {
    return new Response('unknown token — register first', { status: 401 });
  }

  // Lock heartbeats to the IP that's actually sending them, so a leaked
  // token can't be used from a different machine to hijack a listing.
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
  const registered = await redis.get(token_key(id));
  if (!registered) return new Response('unknown token', { status: 401 });

  await redis.del(server_key(id));
  return Response.json({ ok: true });
}