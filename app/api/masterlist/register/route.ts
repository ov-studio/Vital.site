import { randomUUID, randomBytes, createHash, timingSafeEqual } from 'crypto';
import { redis, token_key } from '@/lib/redis';

export const runtime = 'nodejs';

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

  const id = randomUUID();
  const secret = randomBytes(24).toString('hex');
  const hash = createHash('sha256').update(secret).digest('hex');

  await redis.set(token_key(id), hash);
  return Response.json({
    id,
    secret,
    name: name ?? null,
    note: 'Store id + secret in that server\'s config.yaml now — the secret will not be shown again.'
  });
}
