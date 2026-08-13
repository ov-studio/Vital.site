import * as lib_redis from '@/lib/redis';
import * as crypto    from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function safe_equal(a: string, b: string): boolean {
  const buf_a = Buffer.from(a);
  const buf_b = Buffer.from(b);
  if (buf_a.length !== buf_b.length) return false;
  return crypto.timingSafeEqual(buf_a, buf_b);
}

export async function POST(req: Request) {
  const admin_secret = process.env.MASTERLIST_ADMIN_SECRET;
  if (!admin_secret) return new Response('MASTERLIST_ADMIN_SECRET not configured', { status: 500 });

  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${admin_secret}`;
  if (!safe_equal(auth, expected)) return new Response('unauthorized', { status: 401 });
  if (!lib_redis.redis_configured) return new Response('Masterlist is temporarily unavailable', { status: 503 });

  const body = await req.json().catch(() => ({}));
  const name: string | undefined = body?.name;
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.createHash('sha256').update(token).digest('hex');

  await lib_redis.redis!.set(lib_redis.token_key(id), Date.now());
  return Response.json({
    token,
    id,
    name: name ?? null,
    note: 'Store this token in that server\'s config.yaml now — it will not be shown again.'
  });
}