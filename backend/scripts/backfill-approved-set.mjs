import * as upstash_redis from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error('Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN in the environment.');
  process.exit(1);
}

const redis = new upstash_redis.Redis({ url, token });

const APPROVED_SET = 'masterlist:applications:approved';

const keys = await redis.keys('masterlist:application:*');
console.log(`Found ${keys.length} application key(s).`);
if (keys.length === 0) {
  console.log('Nothing to backfill.');
  process.exit(0);
}

const values = await redis.mget(...keys);
const approved_logins = [];
keys.forEach((key, i) => {
  const raw = values[i];
  if (!raw) return;
  let app;
  try { app = typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch { return; }
  if (app?.status === 'approved' && app?.id && typeof app?.login === 'string') {
    approved_logins.push(app.login.toLowerCase());
  }
});

console.log(`${approved_logins.length} approved application(s) to index: ${approved_logins.join(', ') || '(none)'}`);

if (approved_logins.length > 0) {
  await redis.sadd(APPROVED_SET, ...approved_logins);
  console.log(`Added to ${APPROVED_SET}.`);
}

console.log('Done.');
