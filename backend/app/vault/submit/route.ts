import * as lib_auth              from '@/lib/auth';
import * as lib_ratelimit         from '@/lib/ratelimit';
import * as lib_vault_submissions from '@/lib/vault_submissions';
import * as lib_vault_publish     from '@/lib/vault_publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

async function repo_has_manifest(token: string, full_name: string): Promise<boolean> {
  for (const file of ['manifest.yaml', 'manifest.yml']) {
    const res = await fetch(
      `https://api.github.com/repos/${full_name}/contents/${file}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Vital.site/1.0'
        }
      }
    );
    if (res.ok) return true;
  }
  return false;
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;

  if (!lib_auth.auth_configured()) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }

  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const gh = await lib_auth.github_token_from_auth_header(req.headers.get('authorization'));
  if (!gh) {
    return Response.json(
      { error: 'reauth_required', message: 'Sign in again to grant repository access' },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const repo_full = typeof body?.repo === 'string' ? body.repo.trim() : '';

  if (!/^[\w.-]+\/[\w.-]+$/.test(repo_full)) {
    return Response.json({ error: 'Invalid repository' }, { status: 400 });
  }

  const repo_res = await fetch(`https://api.github.com/repos/${repo_full}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${gh}`,
      'User-Agent': 'Vital.site/1.0'
    }
  });
  if (!repo_res.ok) {
    return Response.json({ error: 'Repository not found or not accessible' }, { status: 400 });
  }
  const repo = (await repo_res.json()) as {
    full_name: string;
    html_url: string;
    private: boolean;
    name: string;
    owner?: { login?: string };
  };
  if (repo.private) {
    return Response.json({ error: 'Only public repositories can be submitted' }, { status: 400 });
  }
  if (repo.owner?.login?.toLowerCase() !== session.login) {
    return Response.json({ error: 'You must own the repository' }, { status: 403 });
  }

  if (!(await repo_has_manifest(gh, repo.full_name))) {
    return Response.json(
      { error: 'Repository needs a manifest.yaml (or manifest.yml) at the root — metadata is read from it by the vault build' },
      { status: 400 }
    );
  }

  const display_name = repo.name;

  const published = await lib_vault_publish.publish_resource_pr({
    token: gh,
    login: session.login,
    resource_repo_full: repo.full_name,
    resource_repo_url: repo.html_url,
    display_name
  });

  if (!published.ok) {
    return Response.json({ error: published.error }, { status: 400 });
  }

  const result = await lib_vault_submissions.create_submission({
    login: session.login,
    repo_full: repo.full_name,
    repo_url: repo.html_url,
    name: display_name,
    tagline: '',
    description: '',
    tags: [],
    issue_url: published.pr_url
  });

  return Response.json({
    ok: true,
    id: 'error' in result ? undefined : result.id,
    pr_url: published.pr_url,
    path: published.path,
    updated: published.updated
  });
}
