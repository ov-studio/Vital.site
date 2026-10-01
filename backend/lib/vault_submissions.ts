import * as crypto      from 'crypto';
import * as config_site from '@/configs/site';
import * as lib_redis   from '@/lib/redis';

export type VaultSubmissionStatus = 'pending' | 'approved' | 'rejected';

export type VaultSubmission = {
  id:          string;
  login:       string;
  repo_full:   string;
  repo_url:    string;
  name:        string;
  tagline:     string;
  description: string;
  tags:        string[];
  status:      VaultSubmissionStatus;
  createdAt:   number;
  issue_url?:  string;
  decidedAt?:  number;
  decidedBy?:  string;
};

const PENDING_TTL = Math.floor(14 * 24 * 60 * 60);

function parse(raw: unknown): VaultSubmission | null {
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as VaultSubmission;
    if (typeof data?.id !== 'string' || typeof data?.login !== 'string') return null;
    return data;
  }
  catch { return null; }
}

export async function create_submission(input: {
  login: string;
  repo_full: string;
  repo_url: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  issue_url?: string;
}): Promise<VaultSubmission | { error: string }> {
  if (!lib_redis.redis) return { error: 'Unavailable' };

  const name = input.name.trim().slice(0, 80);
  if (name.length < 2) return { error: 'Name is required' };
  if (!/^[\w.-]+\/[\w.-]+$/.test(input.repo_full)) return { error: 'Invalid repository' };

  const id = crypto.randomBytes(12).toString('hex');
  const sub: VaultSubmission = {
    id,
    login:       input.login.toLowerCase(),
    repo_full:   input.repo_full,
    repo_url:    input.repo_url,
    name,
    tagline:     input.tagline.trim().slice(0, 160),
    description: input.description.trim().slice(0, 4000),
    tags:        input.tags.slice(0, 6),
    status:      'pending',
    createdAt:   Date.now(),
    issue_url:   input.issue_url
  };

  await lib_redis.redis.set(
    lib_redis.vault_submission_key(id),
    JSON.stringify(sub),
    { ex: PENDING_TTL }
  );
  await lib_redis.redis.sadd(lib_redis.vault_submissions_pending_key, id);
  await lib_redis.redis.sadd(lib_redis.vault_user_submissions_key(sub.login), id);
  return sub;
}

export async function list_user_pending(login: string): Promise<VaultSubmission[]> {
  if (!lib_redis.redis) return [];
  const ids = await lib_redis.redis.smembers(lib_redis.vault_user_submissions_key(login));
  if (!ids.length) return [];
  const keys = ids.map((id) => lib_redis.vault_submission_key(String(id)));
  const values = await lib_redis.redis.mget(...keys);
  const out: VaultSubmission[] = [];
  values.forEach((v) => {
    const s = parse(v);
    if (s && s.status === 'pending') out.push(s);
  });
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

export async function open_vault_issue(sub: {
  login: string;
  repo_full: string;
  repo_url: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
}): Promise<string | undefined> {
  const token = process.env.GITHUB_TOKEN || process.env.VAULT_GITHUB_TOKEN;
  if (!token) return undefined;

  const { user, repo } = config_site.info.git.vault;
  const lines = [
    '## Vault resource submission',
    '',
    `**Submitter:** @${sub.login}`,
    `**Repository:** [${sub.repo_full}](${sub.repo_url})`,
    `**Name:** ${sub.name}`,
    `**Tagline:** ${sub.tagline || '—'}`,
    `**Tags:** ${sub.tags.length ? sub.tags.map((t) => '`' + t + '`').join(', ') : '—'}`,
    '',
    '### Description',
    sub.description || '_No description provided._',
    '',
    '---',
    '_Submitted via Vital.site vault form_',
  ];

  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Vital.site/1.0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `[Vault] ${sub.name} — ${sub.repo_full}`,
        body: lines.join('\n')
      })
    });
    if (!res.ok) {
      console.error('[vault/submit] issue create failed', res.status, await res.text());
      return undefined;
    }
    const data = (await res.json()) as { html_url?: string };
    return data.html_url;
  }
  catch (err) {
    console.error('[vault/submit] issue create error', err);
    return undefined;
  }
}


export async function list_pending(): Promise<VaultSubmission[]> {
  if (!lib_redis.redis) return [];
  const ids = await lib_redis.redis.smembers(lib_redis.vault_submissions_pending_key);
  if (!ids.length) return [];
  const keys = ids.map((id) => lib_redis.vault_submission_key(String(id)));
  const values = await lib_redis.redis.mget(...keys);
  const out: VaultSubmission[] = [];
  const stale: string[] = [];
  values.forEach((v, i) => {
    const s = parse(v);
    if (!s || s.status !== 'pending') {
      stale.push(String(ids[i]));
      return;
    }
    out.push(s);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.vault_submissions_pending_key, ...stale);
  out.sort((a, b) => a.createdAt - b.createdAt);
  return out;
}

export async function decide_submission(
  id: string,
  staff_login: string,
  decision: 'approved' | 'rejected'
): Promise<VaultSubmission | { error: string }> {
  if (!lib_redis.redis) return { error: 'Unavailable' };
  const raw = await lib_redis.redis.get(lib_redis.vault_submission_key(id));
  const sub = parse(raw);
  if (!sub) return { error: 'Submission not found' };
  if (sub.status !== 'pending') return { error: 'Already decided' };

  sub.status = decision;
  sub.decidedAt = Date.now();
  sub.decidedBy = staff_login.toLowerCase();

  await lib_redis.redis.set(
    lib_redis.vault_submission_key(id),
    JSON.stringify(sub),
    { ex: PENDING_TTL }
  );
  await lib_redis.redis.srem(lib_redis.vault_submissions_pending_key, id);
  return sub;
}

export function sanitize(sub: VaultSubmission) {
  return {
    id: sub.id,
    login: sub.login,
    repo_full: sub.repo_full,
    repo_url: sub.repo_url,
    name: sub.name,
    status: sub.status,
    createdAt: sub.createdAt,
    pr_url: sub.issue_url ?? null,
    decidedAt: sub.decidedAt,
    decidedBy: sub.decidedBy
  };
}
