import { redis, token_key } from '@/lib/redis';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function safe_equal(a: string, b: string): boolean {
  const buf_a = Buffer.from(a);
  const buf_b = Buffer.from(b);
  if (buf_a.length !== buf_b.length) return false;
  return timingSafeEqual(buf_a, buf_b);
}

export async function POST(req: Request) {
  const admin_secret = process.env.MASTERLIST_ADMIN_SECRET;
  if (!admin_secret) {
    return new Response('MASTERLIST_ADMIN_SECRET not configured', { status: 500 });
  }

  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${admin_secret}`;
  if (!safe_equal(auth, expected)) {
    return new Response('unauthorized', { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name: string | undefined = body?.name;

  // A single high-entropy bearer token is both the credential AND (via a
  // one-way hash) the source of the public id -- no separate id/secret
  // pair to keep in sync. Knowing the token is the only way to produce its
  // id, so checking "does this id exist" already proves possession of the
  // token; nothing else needs to be stored or compared.
  const token = randomBytes(32).toString('hex');
  const id = createHash('sha256').update(token).digest('hex');

  await redis.set(token_key(id), Date.now()); // persistent, no TTL -- just an existence marker
  return Response.json({
    token,
    id,
    name: name ?? null,
    note: 'Store this token in that server\'s config.yaml now — it will not be shown again.'
  });
}