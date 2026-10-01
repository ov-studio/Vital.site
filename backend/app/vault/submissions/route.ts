import * as config_site            from '@/configs/site';
import * as lib_auth              from '@/lib/auth';
import * as lib_ratelimit         from '@/lib/ratelimit';
import * as lib_redis             from '@/lib/redis';
import * as lib_vault_submissions from '@/lib/vault_submissions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

function parse_pr_number(url?: string | null): number | null {
  if (!url) return null;
  const m = url.match(/\/pull\/(\d+)/);
  return m ? Number(m[1]) : null;
}

async function gh_staff(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: Record<string, unknown>; text: string }> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Vital.site/1.0',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* */ }
  return { ok: res.ok, status: res.status, data, text };
}

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!session.staff) return Response.json({ error: 'forbidden' }, { status: 403 });

  const pending = await lib_vault_submissions.list_pending();
  return Response.json({
    pending: pending.map(lib_vault_submissions.sanitize)
  });
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!session.staff) return Response.json({ error: 'forbidden' }, { status: 403 });

  // Prefer server bot token (GITHUB_VAULT_TOKEN) — OAuth Apps cannot merge
  // PRs that touch workflows without fragile "workflow" scope.
  const bot = lib_auth.vault_github_token();
  const user_gh = await lib_auth.github_token_from_auth_header(req.headers.get('authorization'));
  const gh = bot || user_gh;
  if (!gh) {
    return Response.json(
      {
        error: 'missing_token',
        message: 'Set GITHUB_VAULT_TOKEN (PAT with repo + workflow on Vital.vault) or sign in again'
      },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const id = typeof body?.id === 'string' ? body.id : '';
  const decision = body?.decision === 'approved' || body?.decision === 'rejected' ? body.decision : null;
  if (!id || !decision) {
    return Response.json({ error: 'id and decision (approved|rejected) required' }, { status: 400 });
  }

  // Load pending first so we still have pr_url
  const pending = await lib_vault_submissions.list_pending();
  const sub = pending.find((s) => s.id === id);
  if (!sub) {
    return Response.json({ error: 'Submission not found or already decided' }, { status: 400 });
  }

  const vault = config_site.info.git.vault;
  const repo = `${vault.user}/${vault.repo}`;
  const pr_number = parse_pr_number(sub.issue_url);

  if (pr_number) {
    if (decision === 'approved') {
      const merge = await gh_staff(gh, `/repos/${repo}/pulls/${pr_number}/merge`, {
        method: 'PUT',
        body: JSON.stringify({
          commit_title: `add: resource ${sub.name}`,
          merge_method: 'merge'
        })
      });
      if (!merge.ok) {
        const msg = (merge.data.message as string) || merge.text.slice(0, 200);
        // already merged is fine
        if (merge.status !== 405 && !/already merged/i.test(msg)) {
          return Response.json(
            {
              error: /workflow/i.test(msg)
              ? `OAuth cannot merge this PR. Set env GITHUB_VAULT_TOKEN to a classic PAT with "repo" + "workflow" scopes on the backend, then retry.`
              : `Could not merge PR #${pr_number}: ${msg}`
            },
            { status: 400 }
          );
        }
      }
    }
    else {
      const close = await gh_staff(gh, `/repos/${repo}/pulls/${pr_number}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: 'closed' })
      });
      if (!close.ok) {
        return Response.json(
          {
            error: `Could not close PR #${pr_number}: ${(close.data.message as string) || close.text.slice(0, 160)}`
          },
          { status: 400 }
        );
      }
    }
  }

  const result = await lib_vault_submissions.decide_submission(id, session.login, decision);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json({
    ok: true,
    submission: lib_vault_submissions.sanitize(result),
    merged: decision === 'approved' && Boolean(pr_number),
    closed: decision === 'rejected' && Boolean(pr_number)
  });
}
